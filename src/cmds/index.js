const initialize = require('./initialize.js');
const build = require('./build.js');
const evaluate = require('./evaluate.js');
const manifest = require('./manifest.js');
const serve = require('./serve.js');
const watch = require('./watch.js');

module.exports = [initialize, build, evaluate, manifest, serve, watch];
