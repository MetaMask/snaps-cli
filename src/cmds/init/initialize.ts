import { promises as fs, existsSync } from 'fs';
import initPackageJson from 'init-package-json';
import { CONFIG_PATHS, logError, closePrompt } from '../../utils';
import { YargsArgs } from '../../types/yargs';
import { NodePackageManifest } from '../../types/package';
import template from './initTemplate.json';
import { validateEmptyDir, buildWeb3Wallet } from './initutils';

const CONFIG_PATH = CONFIG_PATHS[0];

interface InitOutput {
  port: number;
  dist: string;
  outfileName: string;
  sourceMaps: boolean;
  stripComments: boolean;
  src: string;
}

export async function initHandler(argv: YargsArgs): Promise<InitOutput> {
  console.log(argv);
  console.log(`Init: Begin building 'package.json'\n`);

  const pkg = await asyncPackageInit();

  await validateEmptyDir();

  console.log(`\nInit: Set 'package.json' web3Wallet properties\n`);

  const hel = await buildWeb3Wallet(argv);
  console.log('thnta', hel);
  const [web3Wallet, _newArgs] = hel;
  console.log('werb', web3Wallet);
  console.log('hnta', _newArgs);

  // const [web3Wallet, _newArgs] = await buildWeb3Wallet(argv);
  const newArgs = _newArgs as YargsArgs;
  pkg.web3Wallet = web3Wallet;

  try {
    await fs.writeFile('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
  } catch (err) {
    logError(`Init Error: Fatal: Failed to write package.json`, err);
    process.exit(1);
  }

  console.log(`\nInit: 'package.json' web3Wallet properties set successfully!`);

  // write main js entry file
  const { main } = pkg;
  if (main !== undefined) {
    newArgs.src = main;
    try {
      await fs.writeFile(main, template.js);
      console.log(`Init: Wrote main entry file '${main}'`);
    } catch (err) {
      logError(`Init Error: Fatal: Failed to write main .js file '${main}'`, err);
      process.exit(1);
    }
  }

  // write index.html
  try {
    await fs.writeFile('index.html', template.html.toString()
      .replace(/_PORT_/gu, newArgs.port.toString() || argv.port.toString()));
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
  return { ...argv, ...newArgs } as InitOutput;
}

async function asyncPackageInit(): Promise<NodePackageManifest> {

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
