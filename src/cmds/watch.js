const { watch } = require('../commands');
const { builders } = require('../builders.js');

module.exports.command = ['watch', 'w'];
module.exports.desc = 'Build Snap on change';
module.exports.builder = (yarg) => {
  yarg
    .option('src', builders.src)
    .option('dist', builders.dist)
    .option('outfileName', builders.outfileName)
    .option('sourceMaps', builders.sourceMaps)
    .option('environment', builders.environment)
    .option('stripComments', builders.stripComments);
};
module.exports.handler = (argv) => watch(argv);
