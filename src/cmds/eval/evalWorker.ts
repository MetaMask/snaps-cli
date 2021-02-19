import { parentPort, Worker } from 'worker_threads';
import { readFileSync } from 'fs';
import pathUtils from 'path';
import crypto from 'crypto';
import { logError, validateFilePath } from '../../utils';
import { YargsArgs } from '../../types/yargs';

// eslint-disable-next-line import/no-unassigned-import, @typescript-eslint/no-require-imports
require('ses/lockdown');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let lockdown: any, Compartment: any;

lockdown({
  mathTaming: 'unsafe',
  errorTaming: 'unsafe',
});

if (parentPort !== null) {
  parentPort.on('message', (message: { pluginFilePath: string }) => {
    const { pluginFilePath } = message;

    const compartment = new Compartment(getMockApi());
    // Wrap the IIFE in an arrow function, because mocking the wallet is iffy
    compartment.evaluate(
      // '() => ' + readFileSync(pluginFilePath, 'utf8')
      readFileSync(pluginFilePath, 'utf8'),
    );
    setTimeout(() => process.exit(0), 1000); // Hacky McHack
  });
}

function getMockApi() {
  return {
    console,
    wallet: {
      registerRpcMessageHandler: () => true,
    },
    BigInt,
    setTimeout,
    crypto,
    SubtleCrypto: () => undefined,
    fetch: () => true,
    XMLHttpRequest: () => true,
    WebSocket: () => true,
    Buffer,
    Date,

    window: {
      crypto,
      SubtleCrypto: () => undefined,
      fetch: () => true,
      XMLHttpRequest: () => true,
      WebSocket: () => true,
    },
  };
}

export async function snapEval(argv: YargsArgs): Promise<boolean> {
  console.log(argv);
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
    new Worker(getEvalWorkerPath())
      .on('exit', (exitCode: number) => {
        if (exitCode === 0) {
          resolve(null);
        } else {
          throw new Error(`Worker exited abnormally! Code: ${exitCode}`);
        }
      })
      .postMessage({
        pluginFilePath: bundlePath,
      });
  });
}

/**
 * @returns {string} The path to the eval worker file.
 */
function getEvalWorkerPath(): string {
  return pathUtils.join(__dirname, 'evalWorker.js');
}
