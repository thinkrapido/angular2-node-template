
'use strict';

const path = require('path'),

      express = require('express'),
      app = express(),
      router = express.Router(),

      utils = require('../gulp/utils'),
      config = utils.loadConfig('../gulp/config')
      ;



for(let lib_dir of config.source.vendor.libs) {
  var staticPath = path.join(process.cwd(), 'node_modules', lib_dir);
  router.use(express.static(staticPath));
}

app.use(router);

app.listen(process.env.PORT, function() {
  console.log('listening');
});