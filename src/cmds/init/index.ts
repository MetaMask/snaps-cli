import builders from '../../builders';
import { build } from '../build';
import { initHandler } from './initialize';

/* Custom Type Imports */
import { Argument } from '../../types/yargs';

module.exports.command = ['init', 'i'];
module.exports.desc = 'Initialize Snap package';
module.exports.builder = (yarg: any) => {
  yarg
    .option('src', builders.src)
    .option('dist', builders.dist)
    .option('outfileName', builders.outfileName)
    .option('port', builders.port);
};
module.exports.handler = (argv: Argument) => init(argv);

async function init(argv: Argument) {
  const newArgs = await initHandler(argv);

  console.log();

  await build({
    ...newArgs,
    manifest: false,
    eval: true,
  });

  console.log('\nPlugin project successfully initiated!');
}
