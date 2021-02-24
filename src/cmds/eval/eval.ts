import { Worker } from 'worker_threads';
import pathUtils from 'path';
import { logError, validateFilePath } from '../../utils';
import { YargsArgs } from '../../types/yargs';

export async function snapEval(argv: YargsArgs): Promise<boolean> {
  const { bundle: bundlePath } = argv;
  await validateFilePath(bundlePath as string);
  try {
    // TODO: When supporting multiple environments, evaluate them here.
    await workerEval(bundlePath as string);
    console.log(`Eval Success: evaluated '${bundlePath}' in SES!`);
    return true;
  } catch (err) {
    logError(`Snap evaluation error: ${err.message}`, err);
    process.exit(1);
  }
}

function workerEval(bundlePath: string): Promise<null> {
  return new Promise((resolve, _reject) => {
    console.log('WORKER EVAL 1');
    const w = new Worker(getEvalWorkerPath());
    // console.log('WORKER', w)
    w.on('exit', (exitCode: number) => {
      console.log('WORKER EVAL 3');
      if (exitCode === 0) {
        console.log('WORKER EVAL 4');
        resolve(null);
      } else {
        console.log('WORKER EVAL 5');
        throw new Error(`Worker exited abnormally! Code: ${exitCode}`);
      }
    })
      .postMessage({
        pluginFilePath: bundlePath,
      });
    console.log('WORKER EVAL 2');
  });
}

/**
   * @returns {string} The path to the eval worker file.
   */
function getEvalWorkerPath(): string {
  return pathUtils.join(__dirname, 'evalWorker.js');
}
