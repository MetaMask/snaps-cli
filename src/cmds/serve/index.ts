import yargs from 'yargs';
import builders from '../../builders';
import { YargsArgs } from '../../types/yargs';
import { serve } from './serve';

module.exports.command = ['serve', 's'];
module.exports.desc = 'Locally serve Snap file(s) for testing';
module.exports.builder = (yarg: yargs.Argv) => {
  yarg
    .option('root', builders.root)
    .option('port', builders.port);
};
module.exports.handler = (argv: YargsArgs) => serve(argv);

