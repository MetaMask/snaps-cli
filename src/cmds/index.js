const initialize = require('./initialize');
const build = require('./build');
const evaluate = require('./evaluate');
const manifest = require('./manifest');
const serve = require('./serve');
const watch = require('./watch');

module.exports = [initialize, build, evaluate, manifest, serve, watch];
