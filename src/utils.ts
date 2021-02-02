import { promises as fs } from 'fs';
import pathUtils from 'path';
import readline from 'readline';
import yargs from 'yargs';
import builders from './builders';

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

global.snaps = {
  verboseErrors: false,
  suppressWarnings: false,
  isWatching: false,
};

export function trimPathString(pathString: string): string {
  return pathString.replace(/^[./]+|[./]+$/gu, '');
}

export function logError(msg: string, err?: Error): void {
  console.error(msg);
  if (err && global.snaps.verboseErrors) {
    console.error(err);
  }
}

export function logWarning(msg: string, error?: Error): void {
  if (msg && !global.snaps.suppressWarnings) {
    console.warn(msg);
    if (error && global.snaps.verboseErrors) {
      console.error(error);
    }
  }
}

export function getOutfilePath(outDir: string, outFileName: string): string {
  return pathUtils.join(outDir, outFileName || 'bundle.js');
}

export function validateOutfileName(filename: string): boolean {
  if (!filename.endsWith('.js') || filename.indexOf('/') !== -1) {
    throw new Error(`Invalid outfile name: ${filename}`);
  }
  return true;
}

export async function validateFilePath(filePath: string): Promise<boolean> {
  const exists = await isFile(filePath);
  if (!exists) {
    throw new Error(`Invalid params: '${filePath}' is not a file or does not exist.`);
  }
  return true;
}

export async function validateDirPath(dirName: string, createDir: boolean): Promise<boolean> {
  const exists = await isDirectory(dirName, createDir);
  if (!exists) {
    throw new Error(`Invalid params: '${dirName}' is not a directory or could not be created.`);
  }
  return true;
}

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

export async function isFile(pathString: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pathString);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

/* Readline Utils */

let rl: readline.Interface;

function openPrompt(): void {
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

export function closePrompt(): void {
  if (rl) {
    rl.close();
  }
}

export function assignGlobals(argv: yargs.Arguments<{
  verboseErrors: boolean;
} & {
  suppressWarnings: boolean;
}>): void {
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

export function sanitizeInputs(argv: yargs.Arguments<{
  verboseErrors: boolean;
} & {
  suppressWarnings: boolean;
}>): void {
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

export async function applyConfig(): Promise<void> {

  let pkg: any;

  // first, attempt to read and apply config from package.json
  try {

    pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));

    if (pkg.main) {
      builders.src.default = pkg.main;
    }

    if (pkg.web3Wallet) {
      const { bundle } = pkg.web3Wallet;
      if (bundle?.local) {
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
  let cfg: any = {};
  for (const configPath of CONFIG_PATHS) {
    try {
      cfg = JSON.parse(await fs.readFile(configPath, 'utf8'));
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
