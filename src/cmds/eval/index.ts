import yargs from 'yargs';
import builders from '../../builders';
import { YargsArgs } from '../../types/yargs';
import { snapEval } from './evalWorker';

module.exports.command = ['eval', 'e'];
module.exports.desc = 'Attempt to evaluate Snap bundle in SES';
module.exports.builder = (yarg: yargs.Argv) => {
  yarg
    .option('bundle', builders.bundle);
};
module.exports.handler = (argv: YargsArgs) => snapEval(argv);
