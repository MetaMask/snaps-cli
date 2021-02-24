import { build } from '../build/build';
import { YargsArgs } from '../../types/yargs';
import { initHandler } from './initialize';

export async function init(argv: YargsArgs): Promise<void> {
  const newArgs = await initHandler(argv);

  console.log();

  await build({
    ...newArgs,
    manifest: false,
    eval: true,
  });

  console.log('\nPlugin project successfully initiated!');
}
