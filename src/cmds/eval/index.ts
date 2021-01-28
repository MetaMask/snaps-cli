const { WorkerThread } = require('worker_threads');
const pathUtils = require('path');
const builders = require('../../builders');
const { logError, validateFilePath } = require('../../utils');

import yargs from "yargs";
import { Argument } from "../../types/yargs";

module.exports.command = ['eval', 'e'];
module.exports.desc = 'Attempt to evaluate Snap bundle in SES';
module.exports.builder = (yarg: yargs.Argv) => {
  yarg
    .option('bundle', builders.bundle)
    .option('environment', builders.environment);
};
module.exports.handler = (argv: Argument) => snapEval(argv);

async function snapEval(argv: Argument) {
  const { bundle: bundlePath } = argv;
  await validateFilePath(bundlePath);
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

function workerEval(bundlePath: string) {
  return new Promise((resolve, _reject) => {
    new WorkerThread(getEvalWorkerPath())
      .on('exit', (exitCode: number) => {
        if (exitCode === 0) {
          resolve();
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
function getEvalWorkerPath() {
  return pathUtils.join(__dirname, 'evalWorker.js');
}
