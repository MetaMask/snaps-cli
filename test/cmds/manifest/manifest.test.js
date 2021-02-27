/* eslint-disable jest/prefer-strict-equal */
const fs = require('fs');
const utils = require('../../../dist/src/utils/fs');
const { manifest } = require('../../../dist/src/cmds/manifest/manifest');

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
    readFile: jest.fn(),
  },
}));

const mockArgv = {
  _: ['manifest'],
  verboseErrors: false,
  v: false,
  'verbose-errors': false,
  suppressWarnings: false,
  sw: false,
  'suppress-warnings': false,
  dist: 'dist',
  d: 'dist',
  port: 8081,
  p: 8081,
  populate: false,
  '$0': '/usr/local/bin/mm-snap',
};

const getDefaultWeb3Wallet = () => {
  return {
    bundle: {
      local: 'dist/bundle.js',
      url: 'http://localhost:8081/dist/bundle.js',
    },
    initialPermissions: { alert: {} },
  };
};

const getPackageJson = async (
  web3Wallet = getDefaultWeb3Wallet(),
  name = 'foo',
  version = 1,
  description = 'bar',
  main = 'index.js',
  repository = 'git',
) => {
  return {
    name,
    version,
    description,
    main,
    web3Wallet,
    repository,
  };
};

global.snaps = {
  verboseErrors: false,
  suppressWarnings: false,
  isWatching: false,
};

describe('manifest', () => {
  describe('manifest function validates a snap package.json file', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('throws an error if there is no dist property', async () => {
      const noDistArgv = {
        _: ['manifest'],
        verboseErrors: false,
        v: false,
        'verbose-errors': false,
        suppressWarnings: false,
        sw: false,
        'suppress-warnings': false,
        port: 8081,
        p: 8081,
        populate: true,
        '$0': '/usr/local/bin/mm-snap',
      };
      await expect(manifest(noDistArgv)).rejects.toThrow('Invalid params: must provide \'dist\'');
    });

    it('throws error if fs.readfile fails', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation(() => {
        const err = new Error('file already exists');
        err.code = 'ENOENT';
        throw err;
      });
      const fsMock = jest.spyOn(fs.promises, 'readFile').mockImplementation();
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest error: Could not find package.json. Please ensure that you are running the command in the project root directory.');
      expect(fsMock).toHaveBeenCalledTimes(1);
    });

    it('throws error if parse fails', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error('error');
      });
      const fsMock = jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson());
      await expect(manifest(mockArgv)).rejects.toThrow('Could not parse package.json');
      expect(fsMock).toHaveBeenCalledTimes(1);
    });

    it('throws error if parsed json is invalid', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation(() => false);
      const fsMock = jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson());
      await expect(manifest(mockArgv)).rejects.toThrow('Invalid parsed package.json: false');
      expect(fsMock).toHaveBeenCalledTimes(1);
    });

    it('checks presence of required and recommended keys', async () => {
      const badJSON = {};
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => badJSON);
      await manifest(mockArgv);
      expect(global.console.warn.mock.calls[0]).toEqual(['Manifest Warning: Missing required package.json properties:\n\tname\n\tversion\n\tdescription\n\tmain\n\tweb3Wallet\n']);
      expect(global.console.warn.mock.calls[1]).toEqual(['Manifest Warning: Missing recommended package.json properties:\n\trepository\n']);
      expect(global.console.log).toHaveBeenCalledWith('Manifest Warning: Validation of \'undefined\' package.json completed with warnings. See above.');
    });

    it('checks web3Wallet bundle has valid local and url properties', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(utils, 'isFile').mockImplementation(() => false);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson({
          bundle: {
            local: 'dist/bundle.js',
            url: {},
          },
          initialPermissions: { alert: {} },
        }));
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
      expect(global.console.error.mock.calls[0]).toEqual(['Manifest Error: \'bundle.local\' does not resolve to a file.']);
      expect(global.console.error.mock.calls[1]).toEqual(['Manifest Error: \'bundle.url\' does not resolve to a URL.']);
    });

    it('checks web3Wallet bundle local property exists', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(utils, 'isFile').mockImplementation(() => true);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson({
          bundle: {
            url: 'http://localhost:8081/dist/bundle.js',
          },
          initialPermissions: { alert: {} },
        }));
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
      expect(global.console.error).toHaveBeenCalledWith('Manifest Error: Missing required \'web3Wallet\' property \'bundle.local\'.');
    });

    it('checks web3Wallet bundle url property exists', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(utils, 'isFile').mockImplementation(() => true);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson({
          bundle: {
            local: 'dist/bundle.js',
          },
          initialPermissions: { alert: {} },
        }));
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
      expect(global.console.error).toHaveBeenCalledWith('Manifest Error: Missing required \'bundle.url\' property.');
    });

    it('checks web3Wallet initial permissions property: throws error if not object', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(utils, 'isFile').mockImplementation(() => true);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson({
          bundle: {
            local: 'dist/bundle.js',
            url: 'http://localhost:8081/dist/bundle.js',
          },
          initialPermissions: 'foo',
        }));
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
      expect(global.console.error).toHaveBeenCalledWith('Manifest Error: \'web3Wallet\' property \'initialPermissions\' must be an object if present.');
    });

    it('checks web3Wallet initial permissions property: throws error if array', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(utils, 'isFile').mockImplementation(() => true);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson({
          bundle: {
            local: 'dist/bundle.js',
            url: 'http://localhost:8081/dist/bundle.js',
          },
          initialPermissions: ['alert', 'read'],
        }));
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
      expect(global.console.error).toHaveBeenCalledWith('Manifest Error: \'web3Wallet\' property \'initialPermissions\' must be an object if present.');
    });

    it('checks web3Wallet initial permissions property: throws error if permission objects are not objects', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(utils, 'isFile').mockImplementation(() => true);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson({
          bundle: {
            local: 'dist/bundle.js',
            url: 'http://localhost:8081/dist/bundle.js',
          },
          initialPermissions: { alert: 'foo', read: ['foo', 'bar'] },
        }));
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
      expect(global.console.error.mock.calls[0]).toEqual(['Manifest Error: initial permission \'alert\' must be an object']);
      expect(global.console.error.mock.calls[1]).toEqual(['Manifest Error: initial permission \'read\' must be an object']);
    });

    it('checks web3Wallet initial permissions property: handles valid and throws error if object\'s permission keys are invalid', async () => {
      jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      jest.spyOn(utils, 'isFile').mockImplementation(() => true);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(fs.promises, 'readFile')
        .mockImplementationOnce(async () => await getPackageJson({
          bundle: {
            local: 'dist/bundle.js',
            url: 'http://localhost:8081/dist/bundle.js',
          },
          initialPermissions: { approve: { invoker: 'foo', date: 4546 }, bad: { dangerous: 'scary' }, parent: { parentCapability: 'mother' } },
        }));
      await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
      expect(global.console.error.mock.calls[0]).toEqual(['Manifest Error: initial permission \'bad\' has unrecognized key \'dangerous\'']);
      expect(global.console.error.mock.calls[1]).toEqual(['Manifest Error: initial permission \'parent\' has mismatched \'parentCapability\' field \'mother\'']);
    });

    describe('checks if log error and warning aligns to global settings', () => {

      afterEach(() => {
        global.snaps.verboseErrors = false;
        global.snaps.suppressWarnings = false;
      });

      it('checks logManifestError prints according to global settings', async () => {
        global.snaps.verboseErrors = true;
        jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
        jest.spyOn(utils, 'isFile').mockImplementation(() => true);
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(fs.promises, 'readFile')
          .mockImplementationOnce(async () => await getPackageJson({
            bundle: {
              local: 'dist/bundle.js',
              url: 'http://localhost:8081/dist/bundle.js',
            },
            initialPermissions: { alert: 'foo', read: ['foo', 'bar'] },
          }));
        await expect(manifest(mockArgv)).rejects.toThrow('Manifest Error: package.json validation failed, please see above errors.');
        expect(global.console.error.mock.calls[0]).toEqual(['Manifest Error: initial permission \'alert\' must be an object']);
        expect(global.console.error.mock.calls[1]).toEqual(['Manifest Error: initial permission \'read\' must be an object']);
      });

      it('checks logManifestWarning prints according to global settings', async () => {
        global.snaps.suppressWarnings = true;
        const badJSON = {};
        jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
        jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(fs.promises, 'readFile')
          .mockImplementationOnce(async () => badJSON);
        await manifest(mockArgv);
        expect(global.console.warn).not.toHaveBeenCalled();
      });

    });

    describe('attempt to set missing/erroneous properties if commanded', () => {

      beforeEach(() => {
        jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      const populateArgv = {
        _: ['manifest'],
        verboseErrors: false,
        v: false,
        'verbose-errors': false,
        suppressWarnings: false,
        sw: false,
        'suppress-warnings': false,
        dist: 'dist',
        d: 'dist',
        port: 8081,
        p: 8081,
        populate: true,
        '$0': '/usr/local/bin/mm-snap',
      };

      it('attempts to set missing web3wallet and throws if write fails', async () => {
        const mockJSON = {
          name: 'bob',
          version: 1.1,
          description: 'describe my snap',
          repository: 'git repository',
          main: 'index.js',
        };
        jest.spyOn(utils, 'isFile').mockImplementation(() => true);
        jest.spyOn(fs.promises, 'readFile')
          .mockImplementationOnce(async () => mockJSON);
        jest.spyOn(fs.promises, 'writeFile')
          .mockImplementationOnce(() => {
            throw new Error('error');
          });
        await expect(manifest(populateArgv)).rejects.toThrow('Could not write package.json');
      });

      it('successfully sets missing web3wallet', async () => {
        const mockJSON = {
          name: 'bob',
          version: 1.1,
          description: 'describe my snap',
          repository: 'git repository',
          main: 'index.js',
        };
        const doneJSON = {
          name: 'bob',
          version: 1.1,
          description: 'describe my snap',
          repository: 'git repository',
          main: 'index.js',
          web3Wallet: {
            bundle: {
              local: 'dist/bundle.js',
              url: 'http://localhost:8081/dist/bundle.js',
            },
            initialPermissions: {},
          },
        };
        jest.spyOn(utils, 'isFile').mockImplementation(() => true);
        jest.spyOn(fs.promises, 'readFile')
          .mockImplementationOnce(async () => mockJSON);
        jest.spyOn(fs.promises, 'writeFile')
          .mockImplementationOnce(() => doneJSON);
        jest.spyOn(console, 'log').mockImplementation();
        await manifest(populateArgv);
        expect(global.console.log.mock.calls[0]).toEqual(['Manifest: Updated \'bob\' package.json!']);
        expect(global.console.log.mock.calls[1]).toEqual(['Manifest Success: Validated \'bob\' package.json!']);
      });
    });
  });
});
