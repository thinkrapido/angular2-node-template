
'use strict';

const PORT = process.env.PORT || 3000,
      NODE_ENV = process.env.NODE_ENV || 'dev'
      ;

const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      fs = require('fs'),
      path = require('path'),
      utils = require('./utils'),
      del = require('del'),
      mbf = require('main-bower-files'),
      compass = require('compass-importer'),

      config = utils.loadConfig('./config', {
        project: {
          root: process.cwd(),
        },
      })
      ;

gulp.task('dev:clean', function(done) {
  del([
      config.targets.buildFolder
    ])
    .then(() => { done(); })
    ;
});

gulp.task('dev:copy-html', () => {
  gulp.src(config.source.html)
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:js-vendor', () => {
  gulp.src(mbf([
      '**/*',
      '!**/*.scss', '!**/*.css',
    ]))
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:js-app', () => {
  gulp.src(path.join(config.source.folder, '**/*.ts'))
    .pipe(plugins.typescript({
      target: 'ES5',
      module: 'system',
      moduleResolution: 'node',
      experimentalDecorators: true,
      noImplicitAny: true,
    }))
    .pipe(gulp.dest(config.targets.buildFolder))
//    .pipe(gulp.dest(`${config.targets.buildFolder}/app`))
    ;
});

gulp.task('dev:systemjs', () => {
  gulp.src('node_modules/systemjs/dist/system.src.js')
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:sass-vendor', () => {
  gulp.src([
      path.join(process.cwd(), 'bower_components/foundation-sites/dist/foundation.css'),
      '!' + path.join(process.cwd(), 'bower_components/foundation-sites/dist/*.min.css'),
    ])
    .pipe(plugins.concat('vendor.css'))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:sass-app', () => {
  gulp.src([
      path.join(config.source.folder, config.source.sass),
    ])
    //.pipe(plugins.concat('app.css'))
    .pipe(plugins.sass({ importer: compass }).on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:de-localization', () => {
  gulp.src(path.join(config.source.folder, '**/*.de-de.json'))
    .pipe(plugins.mergeJson('de.json'))
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:en-localization', () => {
  gulp.src(path.join(config.source.folder, '**/*.en-us.json'))
    .pipe(plugins.mergeJson('en.json'))
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:copy-systemjs-config', () => {
  gulp.src(config.source.systemjsConfig)
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:start-live-server', () => {
  function start() {
    if (!fs.existsSync(config.targets.buildFolder)) {
      setTimeout(start, 500);
    }
    else {
      gulp.src('./build')
        .pipe(plugins.webserver({
          port: PORT,
          livereload: true,
          open: true,
          proxies: [{
            source: '/libs',
            target: `http://localhost:${PORT + 1}/`,
          },{
            source: '/api',
            target: `http://localhost:${PORT + 2}/`,
          },],
          middleware: (req, res, next) => {
            const patterns = [
              /livereload/,
              /\.html$/,
              /\.json$/,
              /\.js$/,
              /\.css$/,
              /\.ico$/,
              /^\/libs/,
            ];
            const test = (url) => {
              let out = false;
              for (let pattern of patterns) {
                out = out || pattern.test(url);
                if (out) break;
              }
              return out;
            }
            if (test(req.originalUrl)) {
              return next();
            }
            res.end(fs.readFileSync(path.join(config.targets.buildFolder, '/index.html')));
          }
        }))
        ;
    }
  }
  start();
});

gulp.task('dev:start-libs-server', () => {
  plugins.developServer.listen({
    path: 'srv/libs.js',
    env: {
      PORT: PORT + 1,
      NODE_ENV: 'development',
    },
  }, (err) => { if (err) console.log(err); });
});

gulp.task('dev:start-api-server', () => {
  plugins.nodemon({
    script: 'srv/api.js',
    ext: 'js',
    env: {
      PORT: PORT + 2,
      NODE_ENV: 'development',
    },
  }).on('restart', () => {
    console.log('restarted');
    fs.writeFile(`${config.targets.buildFolder}/_`, Math.random());
  });
});

gulp.task('dev:default', function(done) {
  plugins.runSequence(
    'dev:clean',
    'dev:copy-html',
    'dev:copy-systemjs-config',
    'dev:sass-vendor',
    'dev:sass-app',
    'dev:js-vendor',
    'dev:js-app',
    'dev:de-localization',
    'dev:en-localization',
    done
  );
});

gulp.task('dev:watch', () => {
  plugins.runSequence(
    'dev:default',
    'dev:start-api-server',
    'dev:start-libs-server',
    'dev:start-live-server',
    () => {
      plugins.watch(`${config.source.folder}/**/*`, { base: config.source.folder }, function(file) {
          plugins.runSequence(
            'dev:copy-html',
            'dev:copy-systemjs-config',
            'dev:sass-app',
            'dev:js-app',
            'dev:de-localization',
            'dev:en-localization'
          );
        })
        .pipe(gulp.dest(config.targets.buildFolder))
      ;
    }
  );
});


