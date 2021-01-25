const { snapEval } = require('../commands');
const { builders } = require('../builders');

module.exports.command = ['eval', 'e'];
module.exports.desc = 'Attempt to evaluate Snap bundle in SES';
module.exports.builder = (yarg) => {
  yarg
    .option('bundle', builders.bundle)
    .option('environment', builders.environment);
};
module.exports.handler = (argv) => snapEval(argv);
