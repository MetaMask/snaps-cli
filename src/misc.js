const { promises: fs } = require('fs');
const { CONFIG_PATHS, logWarning } = require('./utils');
const { builders } = require('./builders.js');

module.exports = {
  assignGlobals,
  sanitizeInputs,
  applyConfig,
};

global.snaps = {
  verboseErrors: false,
  suppressWarnings: false,
  isWatching: false,
};

function assignGlobals(argv) {
  if (['w', 'watch'].includes(argv._[0])) {
    snaps.isWatching = true;
  }
  if (Object.prototype.hasOwnProperty.call(argv, 'verboseErrors')) {
    snaps.verboseErrors = Boolean(argv.verboseErrors);
  }
  if (Object.prototype.hasOwnProperty.call(argv, 'suppressWarnings')) {
    snaps.suppressWarnings = Boolean(argv.suppressWarnings);
  }
}

/**
   * Sanitizes inputs. Currently:
   * - normalizes paths
   */
function sanitizeInputs(argv) {
  Object.keys(argv).forEach((key) => {
    if (typeof argv[key] === 'string') {
      if (argv[key] === './') {
        argv[key] = '.';
      } else if (argv[key].startsWith('./')) {
        argv[key] = argv[key].substring(2);
      }
    }
  });
}

/**
   * Attempts to read the config file and apply the config to
   * globals.
   */
async function applyConfig() {

  // first, attempt to read and apply config from package.json
  let pkg = {};
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
        let dist;
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
  let cfg = {};
  for (const configPath of CONFIG_PATHS) {
    try {
      cfg = JSON.parse(await fs.readFile(configPath));
      break;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        logWarning(`Warning: '${configPath}' exists but could not be parsed.`);
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
    let k = key;
    // backwards compatibility
    if (k === 'verbose') {
      k = 'verboseErrors';
    } else if (k === 'debug') {
      k = 'sourceMaps';
    }

    builders[k].default = cfg[k];
  });
}
