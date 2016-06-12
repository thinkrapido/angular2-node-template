
'use strict';

const FS = require('fs'),
      JSON5 = require('json5'),
      _ = require('lodash')
      ;

// Modeled off of (v0.6.18 link; check latest too):
// https://github.com/joyent/node/blob/v0.6.18/lib/module.js#L468-L472
require.extensions['.json5'] = function (module, filename) {
    var content = FS.readFileSync(filename, 'utf8');
    module.exports = JSON5.parse(content);
};

const loadConfig = (() => {

  function recursive(key, value, out) {
    if (_.isObject(value)) {
      _.forEach(value, (item, part) => {
        recursive(`${key}.${part}`, item, out);
      })
    }
    else if (_.isString(value)) {
      out.result[`${key}`.replace(/^\./, '')] = value;
    }
  }

  function buildReplacements(config) {
    let out = { result: {} };

    recursive('', config, out);

    return out.result;
  }

  function replace(content, replacements) {
    _.forEach(buildReplacements(replacements), (item, key) => {
      let regex = new RegExp(`\\\$\\{${key}\\}`, 'gm')
      content = content.replace(regex, item);
    });
    return content;
  }

  return (filename, replacements) => {
    var content = JSON.stringify(require(filename));
    content = replace(content, replacements);
    return JSON.parse(content);
  };

})();

module.exports = {
  loadConfig
}
