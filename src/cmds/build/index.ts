import yargs from 'yargs';
import builders from '../../builders';
import { YargsArgs } from '../../types/yargs';
import { build } from './build';

module.exports.command = ['build', 'b'];
module.exports.desc = 'Build Snap from source';
module.exports.builder = (yarg: yargs.Argv) => {
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
    .implies('populate', 'manifest');
};
module.exports.handler = (argv: YargsArgs) => build(argv);

