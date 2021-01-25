const { serve } = require('../commands');
const { builders } = require('../builders.js');

module.exports.command = ['serve', 's'];
module.exports.desc = 'Locally serve Snap file(s) for testing';
module.exports.builder = (yarg) => {
  yarg
    .option('root', builders.root)
    .option('port', builders.port);
};
module.exports.handler = (argv) => serve(argv);
