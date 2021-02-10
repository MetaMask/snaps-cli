const { promises: fs } = require('fs');
const builders = require('../../dist/src/builders');
const { applyConfig } = require('../../dist/src/utils/snap-config');

const originalBuilders = Object.keys(builders).reduce((snapshot, key) => {
  snapshot[key] = builders[key];
  return builders[key];
}, {});

describe('snap-config', () => {

  afterEach(() => {
    Object.keys(originalBuilders).forEach((key) => {
      builders[key] = originalBuilders[key];
    });
    // console.log(builders);
  });

  //   const snapConfig = {
  //     'port': 8084,
  //   };

  const packageJSON = {
    'name': 'bls-signer',
    'version': '1.0.0',
    'description': '',
    'main': 'testing.js',
    'scripts': {
      'test': 'echo "Error: no test specified" && exit 1',
    },
    'author': '',
    'license': 'ISC',
    'dependencies': {
      'eth-json-rpc-errors': '^1.1.0',
      'noble-bls12-381': '^0.2.3',
    },
    'repository': {
      'type': 'git',
      'url': 'git+https://github.com/MetaMask/snaps-cli.git',
    },
    'web3Wallet': {
      'bundle': {
        'local': 'dist/bundle.js',
        'url': 'http://localhost:8084/dist/bundle.js',
      },
      'initialPermissions': {
        'confirm': {},
      },
    },
  };

  const changedBuilders = {
    default: {
      src: {
        alias: 's',
        describe: 'Source file',
        type: 'string',
        required: true,
        default: 'index.js',
      },
      dist: {
        alias: 'd',
        describe: 'Output directory',
        type: 'string',
        required: true,
        default: 'dist',
      },
      bundle: {
        alias: ['plugin', 'p', 'b'],
        describe: 'Snap bundle file',
        type: 'string',
        required: true,
        default: 'dist/bundle.js',
      },
      root: {
        alias: 'r',
        describe: 'Server root directory',
        type: 'string',
        required: true,
        default: '.',
      },
      port: {
        alias: 'p',
        describe: 'Local server port for testing',
        type: 'number',
        required: true,
        default: 8081,
      },
      sourceMaps: {
        describe: 'Whether builds include sourcemaps',
        type: 'boolean',
        required: false,
        default: false,
      },
      stripComments: {
        alias: 'strip',
        describe: 'Whether to remove code comments from the build output',
        type: 'boolean',
        required: false,
        default: false,
      },
      outfileName: {
        alias: 'n',
        describe: 'Output file name',
        type: 'string',
        required: false,
        default: 'bundle.js',
      },
      manifest: {
        alias: 'm',
        describe: 'Validate project package.json as a Snap manifest',
        type: 'boolean',
        required: false,
        default: true,
      },
      populate: {
        describe: 'Update Snap manifest properties of package.json',
        type: 'boolean',
        required: false,
        default: true,
      },
      eval: {
        alias: 'e',
        describe: 'Attempt to evaluate Snap bundle in SES',
        type: 'boolean',
        required: false,
        default: true,
      },
      verboseErrors: {
        alias: ['v', 'verbose'],
        type: 'boolean',
        describe: 'Display original errors',
        required: false,
        default: false,
      },
      suppressWarnings: {
        alias: 'w',
        type: 'boolean',
        describe: 'Suppress warnings',
        required: false,
        default: false,
      },
      environment: {
        alias: 'env',
        describe: 'The execution environment of the plugin.',
        type: 'string',
        required: false,
        default: 'worker',
        choices: ['worker'],
      },
    },
  };

  describe('applyConfig', () => {
    it('sets global variables correctly', () => {
      const mockReadFile = jest.mock();
      mockReadFile.spyOn(fs, 'readFile').mockReturnValue(packageJSON);
      applyConfig();
      // eslint-disable-next-line jest/prefer-strict-equal
      expect(builders).toEqual(changedBuilders);
    });
  });

});
