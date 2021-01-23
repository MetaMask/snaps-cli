const { build } = require('../../src/commands');
const { builders } = require('../builders.js');

module.exports.command = ['build', 'b'];
module.exports.desc = 'Build Snap from source';
module.exports.builder = (yarg) => {
  yarg
    .option('src', builders.src)
    .option('dist', builders.dist)
    .option('outfileName', builders.outfileName)
    .option('sourceMaps', builders.sourceMaps)
    .option('stripComments', builders.stripComments)
    .option('port', builders.port)
    .option('eval', builders.eval)
    .option('manifest', builders.manifest)
    .option('populate', builders.populate)
    .option('environment', builders.environment)
    .implies('populate', 'manifest');
};
module.exports.handler = (argv) => build(argv);

