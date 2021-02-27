import yargs from 'yargs';
import builders from '../../builders';
import { YargsArgs } from '../../types/yargs';
import { init } from './init';

module.exports.command = ['init', 'i'];
module.exports.desc = 'Initialize Snap package';
module.exports.builder = (yarg: yargs.Argv) => {
  yarg
    .option('src', builders.src)
    .option('dist', builders.dist)
    .option('outfileName', builders.outfileName)
    .option('port', builders.port);
};
module.exports.handler = (argv: YargsArgs) => init(argv);
