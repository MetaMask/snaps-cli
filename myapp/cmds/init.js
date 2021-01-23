const { init } = require('../../src/commands');

module.exports.command = ['init', 'i'];
module.exports.desc = 'Initialize Snap package';
module.exports.builder = {
  src: {
    alias: 's',
    describe: 'Source file',
    type: 'string',
    required: true,
    default: 'index.js',
  },
  dist: {
    alias: 'd',
    describe: 'Output directory',
    type: 'string',
    required: true,
    default: 'dist',
  },
  outfileName: {
    alias: 'n',
    describe: 'Output file name',
    type: 'string',
    default: 'bundle.js',
  },
  port: {
    alias: 'p',
    describe: 'Local server port for testing',
    type: 'number',
    required: true,
    default: 8081,
  },
};
module.exports.handler = (argv) => init(argv);
