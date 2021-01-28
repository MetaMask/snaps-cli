const { promises: fs } = require('fs');
const pathUtils = require('path');
const readline = require('readline');
const builders = require('./builders');

import yargs from "yargs";
import { JSONPackage } from "./types/package"; 
import { Argument } from "./types/yargs";

export const permRequestKeys = [
  '@context',
  'id',
  'parentCapability',
  'invoker',
  'date',
  'caveats',
  'proof',
];

export const CONFIG_PATHS = [
  'snap.config.json',
];

/**
 * Trims leading and trailing periods "." and forward slashes "/" from the
 * given path string.
 *
 * @param {string} pathString - The path string to trim.
 * @returns {string} The trimmed path string.
 */
export function trimPathString(pathString: string) {
  return pathString.replace(/^[./]+|[./]+$/gu, '');
}

/**
 * Logs an error message to console. Logs original error if it exists and
 * the verboseErrors global is true.
 *
 * @param {string} msg - The error message
 * @param {Error} err - The original error
 */
export function logError(msg: string, err?: Error) {
  console.error(msg);
    if (err && global.snaps.verboseErrors) {
      console.error(err);
    }
}

/**
 * Logs a warning message to console.
 *
 * @param {string} msg - The warning message
 */
export function logWarning(msg: string, error?: Error) {
  if (msg && !global.snaps.suppressWarnings) {
    console.warn(msg);
    if (error && global.snaps.verboseErrors) {
      console.error(error);
    }
  }
}

/**
 * Gets the complete out file path from the source file path and output
 * directory path.
 *
 * @param {string} srcFilePath - The source file path
 * @param {string} outDir - The out file directory
 * @returns {string} - The complete out file path
 */
export function getOutfilePath(outDir: string, outFileName: string): string {
  return pathUtils.join(outDir, outFileName || 'bundle.js');
}

/**
 * Ensures that the outfile name is just a js file name.
 * Throws on validation failure
 *
 * @param {string} str - The file name to validate
 * @returns {boolean} - True if validation succeeded
 */
export function validateOutfileName(str: string): boolean {
  if (!str.endsWith('.js') || str.indexOf('/') !== -1) {
    throw new Error(`Invalid outfile name: ${str}`);
  }
  return true;
}

/**
 * Validates a file path.
 * Throws on validation failure
 *
 * @param {string} filePath - The file path to validate
 * @returns {Promise<boolean>} - True if validation succeeded
 */
export async function validateFilePath(filePath: string): Promise<boolean> {

  const exists = await isFile(filePath);

  if (!exists) {
    throw new Error(`Invalid params: '${filePath}' is not a file or does not exist.`);
  }

  return true;
}

/**
 * Validates a directory path.
 * Throws on validation failure
 *
 * @param {string} dirPath - The directory path to validate
 * @param {boolean} createDir - Whether to create the directory if it doesn't exist
 * @returns {Promise<boolean>} - True if validation succeeded
 */
export async function validateDirPath(dirName: string, createDir: boolean): Promise<boolean> {

  const exists = await isDirectory(dirName, createDir);

  if (!exists) {
    throw new Error(`Invalid params: '${dirName}' is not a directory or could not be created.`);
  }

  return true;
}

/**
 * Checks whether the given path string resolves to an existing directory, and
 * optionally creates the directory if it doesn't exist.
 *
 * @param {string} pathString - The path string to check
 * @param {boolean} createDir - Whether to create the directory if it doesn't exist
 * @returns {Promise<boolean>} - Whether the given path is an existing directory
 */
export async function isDirectory(pathString: string, createDir: boolean): Promise<boolean> {
  try {
    const stats = await fs.stat(pathString);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      if (!createDir) {
        return false;
      }
      try {
        await fs.mkdir(pathString);
        return true;
      } catch (mkdirError) {
        logError(`Directory '${pathString}' could not be created.`, mkdirError);
        process.exit(1);
      }
    }
    return false;
  }
}

/**
 * Checks whether the given path string resolves to an existing file.
 *
 * @param {string} pathString - The path string to check
 * @returns {boolean} - Whether the given path is an existing file
 */
export async function isFile(pathString: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pathString);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

/* Readline Utils */

let rl: any;

function openPrompt() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function prompt(question: string, def?: string, shouldClose?: boolean): Promise<string> {
  if (!rl) {
    openPrompt();
  }
  return new Promise((resolve, _reject) => {
    let queryString = `${question} `;
    if (def) {
      queryString += `(${def}) `;
    }
    rl.question(queryString, (answer: string) => {
      if (!answer || !answer.trim()) {
        if (def !== undefined) {
          resolve(def);
        }
      }
      resolve(answer.trim());
      if (shouldClose) {
        rl.close();
      }
    });
  });
}

export function closePrompt() {
  if (rl) {
    rl.close();
  }
}

export function assignGlobals(argv: Argument) {
  if (['w', 'watch'].includes(argv._[0] as string)) {
    global.snaps.isWatching = true;
  }
  if (Object.prototype.hasOwnProperty.call(argv, 'verboseErrors')) {
    global.snaps.verboseErrors = Boolean(argv.verboseErrors);
  }
  if (Object.prototype.hasOwnProperty.call(argv, 'suppressWarnings')) {
    global.snaps.suppressWarnings = Boolean(argv.suppressWarnings);
  }
}

/**
 * Sanitizes inputs. Currently:
 * - normalizes paths
 */
export function sanitizeInputs(argv: Argument) {
  Object.keys(argv).forEach((key) => {
    if (typeof argv[key] === 'string') {
      if (argv[key] === './') {
        argv[key] = '.';
      } else if ((argv[key] as string).startsWith('./')) {
        argv[key] = (argv[key] as string).substring(2);
      }
    }
  });
}

/**
 * Attempts to read the config file and apply the config to
 * globals.
 */
export async function applyConfig() {
  
  // first, attempt to read and apply config from package.json

  let pkg: JSONPackage;

  try {
    pkg = JSON.parse(await fs.readFile('package.json'));

    if (pkg.main) {
      builders.src.default = pkg.main;
    }

    if (pkg.web3Wallet) {
      const { bundle } = pkg.web3Wallet;
      if (bundle && bundle.local) {
        const { local: bundlePath } = bundle;
        builders.bundle.default = bundlePath;
        let dist: string;
        if (bundlePath.indexOf('/') === -1) {
          dist = '.';
        } else {
          dist = bundlePath.substr(0, bundlePath.indexOf('/') + 1);
        }
        builders.dist.default = dist;
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      logWarning(`Warning: Could not parse package.json`, err);
    }
  }

  // second, attempt to read and apply config from config file,
  // which will always be preferred if it exists
  let cfg: JSONPackage = {};
  for (const configPath of CONFIG_PATHS) {
    try {
      cfg = JSON.parse(await fs.readFile(configPath));
      break;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        logWarning(`Warning: '${configPath}' exists but could not be parsed.`, err);
      }
    }
  }

  if (
    typeof cfg !== 'object' ||
      Object.keys(cfg).length === 0
  ) {
    return;
  }

  Object.keys(cfg).forEach((key) => {
    builders[key].default = cfg[key];
  });
}
