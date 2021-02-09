const { promises: fs } = require('fs');
const builders = require('../../dist/src/builders');
const { applyConfig } = require('../../dist/src/utils/snap-config');

describe('snap-config', () => {

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

  //   const parsedJSON = {
  //     name: 'bls-signer',
  //     version: '1.0.0',
  //     description: '',
  //     main: 'index.js',
  //     scripts: { test: 'echo "Error: no test specified" && exit 1' },
  //     author: '',
  //     license: 'ISC',
  //     dependencies: { 'eth-json-rpc-errors': '^1.1.0', 'noble-bls12-381': '^0.2.3' },
  //     repository: { type: 'git', url: 'git+https://github.com/MetaMask/snaps-cli.git' },
  //     web3Wallet: {
  //       bundle: {
  //         local: 'dist/bundle.js',
  //         url: 'http://localhost:8084/dist/bundle.js',
  //       },
  //       initialPermissions: { confirm: {} },
  //     },
  //   };

  describe('applyConfig', () => {

    jest.requireActual(builders);
    it('sets global variables correctly', () => {
      const mockReadFile = jest.mock();
      mockReadFile.spyOn(fs, 'readFile').mockReturnValue(packageJSON);
      const buildersSpy = jest.spyOn(builders, 'src');
      applyConfig();
      expect(buildersSpy).toBe({
        alias: 's',
        describe: 'Source file',
        type: 'string',
        required: true,
        default: 'testing.js',
      });
    });
  });

});
