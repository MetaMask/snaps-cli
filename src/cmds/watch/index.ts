import yargs from 'yargs';
import builders from '../../builders';
import { YargsArgs } from '../../types/yargs';
import { watch } from './watch';

module.exports.command = ['watch', 'w'];
module.exports.desc = 'Build Snap on change';
module.exports.builder = (yarg: yargs.Argv) => {
  yarg
    .option('src', builders.src)
    .option('dist', builders.dist)
    .option('outfileName', builders.outfileName)
    .option('sourceMaps', builders.sourceMaps)
    .option('stripComments', builders.stripComments);
};
module.exports.handler = (argv: YargsArgs) => watch(argv);