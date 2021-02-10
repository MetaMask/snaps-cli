const { promises: fs } = require('fs');
const { default: builders } = require('../../dist/src/builders');
const { applyConfig } = require('../../dist/src/utils/snap-config');

const originalBuilders = Object.keys(builders).reduce((snapshot, key) => {
  snapshot[key] = builders[key];
  return builders[key];
}, {});

const getDefaultWeb3Wallet = () => {
  return {
    'bundle': {
      'local': 'dist/foo.js',
      'url': 'http://localhost:8084/dist/bundle.js',
    },
    'initialPermissions': {
      'confirm': {},
    },
  };
};

const getPackageJson = async (
  main = 'index.js',
  web3Wallet = getDefaultWeb3Wallet(),
) => {
  return {
    main,
    web3Wallet,
  };
};

describe('snap-config', () => {

  beforeAll(() => {
    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
  });

  afterEach(() => {
    Object.keys(originalBuilders).forEach((key) => {
      builders[key] = originalBuilders[key];
    });
  });

  describe('applyConfig', () => {
    it('sets global variables correctly', async () => {
      const expected = 'testing.js';

      const fsMock = jest.spyOn(fs, 'readFile')
        .mockImplementationOnce(async () => getPackageJson(expected))
        .mockImplementationOnce(async () => {
          return {};
        });

      await applyConfig();
      expect(builders.src.default).toStrictEqual(expected);

      fsMock.mockRestore();
    });
  });
});
