
'use strict';

const gulp = require('gulp'),
      plugins = require('gulp-load-plugins')({
        rename: {
          'gulp-server-livereload': 'server',
        },
      }),
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
})

gulp.task('dev:sass-app', () => {
  gulp.src([
      path.join(config.source.folder, config.source.sass),
    ])
    //.pipe(plugins.concat('app.css'))
    .pipe(plugins.sass({ importer: compass }).on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
})

gulp.task('dev:copy-systemjs-config', () => {
  gulp.src(config.source.systemjsConfig)
    .pipe(gulp.dest(config.targets.buildFolder))
    ;
});

gulp.task('dev:start-libs-server', () => {
  plugins.developServer.listen({
    path: 'srv/libs.js',
    env: {
      PORT: 3001,
      NODE_ENV: 'development',
    },
  }, (err) => { if (err) console.log(err); });
})

gulp.task('dev:start-live-server', () => {
  function start() {
    if (!fs.existsSync(config.targets.buildFolder)) {
      setTimeout(start, 500);
    }
    else {
      gulp.src('./build')
        .pipe(plugins.webserver({
          port: 3000,
          livereload: true,
          open: true,
          proxies: [{
            source: '/libs',
            target: 'http://localhost:3001/',
          }],
        }))
        ;
    }
  }
  start();
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
    done
  );
})

gulp.task('dev:watch', () => {
  plugins.runSequence(
    'dev:default',
    'dev:start-libs-server',
    'dev:start-live-server',
    () => {
      plugins.watch(`${config.source.folder}/**/*`, { base: config.source.folder }, function(file) {
          plugins.runSequence(
            'dev:copy-html',
            'dev:copy-systemjs-config',
            'dev:sass-app',
            'dev:js-app'
          );
        })
        .pipe(gulp.dest(config.targets.buildFolder))
      ;
    }
  );
});


