import { promises as fs, existsSync } from 'fs';
import pathUtils from 'path';
import initPackageJson from 'init-package-json';
import {
  CONFIG_PATHS, logError, logWarning, prompt, closePrompt, trimPathString,
} from '../../utils';
import { Argument } from '../../types/yargs';
import template from './initTemplate.json';

const CONFIG_PATH = CONFIG_PATHS[0];

export async function initHandler(argv: Argument) {

  console.log(`Init: Begin building 'package.json'\n`);

  const pkg = await asyncPackageInit();

  await validateEmptyDir();

  console.log(`\nInit: Set 'package.json' web3Wallet properties\n`);

  const [_web3Wallet, newArgs] = await buildWeb3Wallet(argv);
  pkg.web3Wallet = _web3Wallet;

  try {
    await fs.writeFile('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
  } catch (err) {
    logError(`Init Error: Fatal: Failed to write package.json`, err);
    process.exit(1);
  }

  console.log(`\nInit: 'package.json' web3Wallet properties set successfully!`);

  // write main js entry file
  const { main } = pkg;
  (newArgs as any).src = main;
  try {
    await fs.writeFile(main, template.js);
    console.log(`Init: Wrote main entry file '${main}'`);
  } catch (err) {
    logError(`Init Error: Fatal: Failed to write main .js file '${main}'`, err);
    process.exit(1);
  }

  // write index.html
  try {
    await fs.writeFile('index.html', template.html.toString()
      .replace(/_PORT_/gu, newArgs.port as unknown as string || argv.port as unknown as string)); // port is a number but we want `replace` to treat it as a string
    console.log(`Init: Wrote 'index.html' file`);
  } catch (err) {
    logError(`Init Error: Fatal: Failed to write index.html file`, err);
    process.exit(1);
  }

  // write config file
  try {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(newArgs, null, 2));
    console.log(`Init: Wrote '${CONFIG_PATH}' config file`);
  } catch (err) {
    logError(`Init Error: Failed to write '${CONFIG_PATH}' file`, err);
  }

  closePrompt();
  return { ...argv, ...newArgs };
}

async function asyncPackageInit() {

  // use existing package.json if found
  const hasPackage = existsSync('package.json');

  if (hasPackage) {

    console.log(`Init: Attempting to use existing 'package.json'...`);

    try {

      const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      console.log(`Init: Successfully parsed 'package.json'!`);
      return pkg;
    } catch (error) {

      logError(
        `Init Error: Could not parse 'package.json'. Please verify that the file is correctly formatted and try again.`,
        error,
      );
      process.exit(1);
    }
  }

  // exit if yarn.lock is found, or we'll be in trouble
  const usesYarn = existsSync('yarn.lock');

  if (usesYarn) {
    logError(`Init Error: Found a 'yarn.lock' file but no 'package.json'. Please run 'yarn init' and try again.`);
    process.exit(1);
  }

  // run 'npm init'
  return new Promise((resolve, reject) => {
    initPackageJson(process.cwd(), '', {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function buildWeb3Wallet(argv: Argument) {

  const { outfileName } = argv;
  const defaultPerms = { alert: {} };
  let { port, dist } = argv;
  let finalPermissions: Record<string, unknown>;

  try {
    const c = await prompt(`Use all default Snap manifest values?`, 'yes', false);
    if (c && ['y', 'yes'].includes(c.toLowerCase())) {
      console.log('Using default values...');
      try {
        await fs.mkdir(dist);
      } catch (e) {
        if (e.code !== 'EEXIST') {
          logError(`Error: Could not write default 'dist' '${dist}'. Maybe check your local ${CONFIG_PATH} file?`);
        }
      }
      return endWeb3Wallet();
    }
  } catch (e) {
    logError(`Init Error: Fatal`, e);
    process.exit(1);
  }

  // at this point, prompt the user for all values
  let noValidPort = true;
  while (noValidPort) {
    // eslint-disable-next-line require-atomic-updates
    const inputPort = (await prompt(`local server port:`, port as unknown as string));
    let err, tempPort;
    try {
      const parsedPort = Number.parseInt(inputPort, 10);
      if (parsedPort && parsedPort > 0) {
        tempPort = parsedPort;
        noValidPort = false;
        break;
      }
    } catch (e) {
      err = e;
    }
    logError(`Invalid port '${port}, please retry.`, err);
    if (tempPort !== undefined) {
      port = tempPort;
    }
  }

  let invalidDist = true;
  while (invalidDist) {
    // eslint-disable-next-line require-atomic-updates
    dist = await prompt(`output directory:`, dist);
    try {
      dist = trimPathString(dist);
      await fs.mkdir(dist);
      invalidDist = false;
      break;
    } catch (e) {
      if (e.code === 'EEXIST') {
        break;
      } else {
        logError(`Could not make directory '${dist}', please retry.`, e);
      }
    }
  }

  let invalidPermissions = true;
  while (invalidPermissions) {
    let initialPermissions = (await prompt(`initialPermissions: [perm1 perm2 ...] ([alert])`));
    let err;
    try {
      if (!initialPermissions) {
        initialPermissions = defaultPerms as unknown as string;
        break;
      }
      const splitPermissions = initialPermissions.split(' ')
        .reduce((acc, p) => {
          console.log(p);
          if (typeof p === 'string' && p.match(/^[\w\d_]+$/u)) {
            (acc as any)[p] = {};
          } else {
            logWarning(`Invalid permissions: ${p}`);
          }
          return acc;
        }, {});

      finalPermissions = splitPermissions as any;
      invalidPermissions = false;
      break;
    } catch (e) {
      err = e;
    }
    logError(`Invalid initial permissions '${initialPermissions}', please retry.`, err);
  }

  return endWeb3Wallet();

  function endWeb3Wallet() {
    return [
      {
        bundle: {
          local: pathUtils.join(dist, outfileName as string),
          // url: `http://localhost:${port}/${dist}/${outfileName}`
          url: (new URL(`/${dist}/${outfileName}`, `http://localhost:${port}`)).toString(),
        },
        finalPermissions,
      },
      { port, dist, outfileName },
    ];
  }
}

async function validateEmptyDir() {
  const existing = (await fs.readdir(process.cwd())).filter((item) => [
    'index.js', 'index.html', CONFIG_PATH, 'dist',
  ].includes(item.toString()));

  if (existing.length > 0) {
    logWarning(
      `\nInit Warning: Existing files/directories may be overwritten:\n${
        existing.reduce((acc, curr) => {
          return `${acc}\t${curr}\n`;
        }, '')}`,
    );
    const c = await prompt(`Continue?`, 'yes');
    const userAware = c && ['y', 'yes'].includes(c.toLowerCase());
    if (!userAware) {
      console.log(`Init: Exiting...`);
      process.exit(1);
    }
  }
}
