import builders from '../../builders';
import { logError } from '../../utils';

/* Custom Type Imports */
import { Argument } from '../../types/yargs';
import { manifest } from './manifest';

module.exports.command = ['manifest', 'm'];
module.exports.desc = 'Validate project package.json as a Snap manifest';
module.exports.builder = (yarg: any) => {
  yarg
    .option('dist', builders.dist)
    .option('port', builders.port)
    .option('populate', builders.populate);
};

module.exports.handler = async (argv: Argument) => {
  try {
    await manifest(argv);
  } catch (err) {
    logError(err.message, err);
    process.exit(1);
  }
};
