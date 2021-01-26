const { builders } = require('../../builders');
const { logError } = require('../../utils');
const manifestHandler = require('./bundle');

module.exports.command = ['manifest', 'm'];
module.exports.desc = 'Validate project package.json as a Snap manifest';
module.exports.builder = (yarg) => {
  yarg
    .option('dist', builders.dist)
    .option('port', builders.port)
    .option('populate', builders.populate);
};
module.exports.handler = (argv) => manifest(argv);

function manifest(argv) {
  manifestHandler(argv)
    .catch((err) => {
      logError(err.message, err);
      process.exit(1);
    });
}
