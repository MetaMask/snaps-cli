const { manifest } = require('../../src/commands');
const { builders } = require('../builders.js');

module.exports.command = ['manifest', 'm'];
module.exports.desc = 'Validate project package.json as a Snap manifest';
module.exports.builder = (yarg) => {
  yarg
    .option('dist', builders.dist)
    .option('port', builders.port)
    .option('populate', builders.populate);
};
module.exports.handler = (argv) => manifest(argv);
