/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
/* eslint-disable jest/prefer-strict-equal */
const fs = require('fs');
const { asyncPackageInit, buildWeb3Wallet, validateEmptyDir } = require('../../dist/src/cmds/init/initutils');
const readlineUtils = require('../../dist/src/utils/readline');
const miscUtils = require('../../dist/src/utils/misc');

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    mkdir: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
  },
}));

jest.mock('init-package-json');
const initPackageJson = require('init-package-json');

describe('initutils', () => {

  describe('asyncPackageInit', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('console logs if successful', async () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const readFileMock = jest.spyOn(fs.promises, 'readFile').mockImplementationOnce();
      const parseMock = jest.spyOn(JSON, 'parse').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();
      await asyncPackageInit();
      expect(existsSyncMock).toHaveBeenCalledTimes(1);
      expect(readFileMock).toHaveBeenCalledTimes(1);
      expect(parseMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledTimes(2);
    });

    it('throws error in catch block', async () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const readFileMock = jest.spyOn(fs.promises, 'readFile').mockImplementationOnce();
      const parseMock = jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error('error message');
      });
      jest.spyOn(console, 'log').mockImplementation();
      const errorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();
      jest.spyOn(process, 'exit')
        .mockImplementation(() => {
          throw new Error('process exited');
        });

      await expect(asyncPackageInit()).rejects.toThrow(new Error('process exited'));
      expect(existsSyncMock).toHaveBeenCalled();
      expect(readFileMock).toHaveBeenCalledTimes(1);
      expect(parseMock).toHaveBeenCalledTimes(1);
      expect(errorMock).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(global.console.log).toHaveBeenCalledTimes(1);
    });

    it('yarn lock logic works throws error if initpackagejson is rejected', async () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync')
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => false);
      initPackageJson.mockImplementation((_, __, ___, cb) => cb(new Error('initpackage error'), true));
      await expect(asyncPackageInit()).rejects.toThrow('initpackage error');
      expect(existsSyncMock).toHaveBeenCalledTimes(2);
    });

    it('yarn lock logic works', async () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync')
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => false);
      initPackageJson.mockImplementation((_, __, ___, cb) => cb(false, true));
      await asyncPackageInit();
      expect(existsSyncMock).toHaveBeenCalledTimes(2);
    });

    it('logs error when yarn lock is found', async () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync')
        .mockImplementationOnce(() => false)
        .mockImplementationOnce(() => true);
      const errorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();
      const processExitMock = jest.spyOn(process, 'exit').mockImplementationOnce(() => {
        throw new Error('process exited');
      });
      await expect(asyncPackageInit()).rejects.toThrow(new Error('process exited'));
      expect(existsSyncMock).toHaveBeenCalledTimes(2);
      expect(errorMock).toHaveBeenCalledTimes(1);
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe('buildWeb3Wallet', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const mockArgv = {
      dist: 'dist',
      outfileName: 'bundle.js',
      port: 8081,
    };

    it('applies default web3wallet values if user input is \'y\'', async () => {
      const mkdirMock = fs.promises.mkdir.mockImplementation();
      const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'y');
      jest.spyOn(console, 'log').mockImplementation();

      await buildWeb3Wallet(mockArgv);
      expect(promptMock).toHaveBeenCalledTimes(1);
      expect(mkdirMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledTimes(1);
    });

    it('throws error if fails to make directory and apply default values', async () => {
      fs.promises.mkdir.mockImplementation(() => {
        const err = new Error('file already exists');
        err.code = 'notEEXIST';
        throw err;
      });
      const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'y');
      jest.spyOn(console, 'log').mockImplementation();
      const errorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();
      jest.spyOn(process, 'exit').mockImplementationOnce(() => {
        throw new Error('error message');
      });

      await expect(buildWeb3Wallet(mockArgv)).rejects.toThrow(new Error('error message'));
      expect(promptMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledTimes(1);
      expect(errorMock).toHaveBeenCalledTimes(2);
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('prompts user for values', async () => {
      const expectedMockWallet = [
        {
          bundle: {
            local: `outputDir/${mockArgv.outfileName}`,
            url: `http://localhost:8000/outputDir/${mockArgv.outfileName}`,
          },
          initialPermissions: {
            'confirm': {},
            'customPrompt': {},
            'wallet_manageIdentities': {},
          },
        },
        { dist: 'outputDir', outfileName: 'bundle.js', port: 8000 },
      ];
      const promptMock = jest.spyOn(readlineUtils, 'prompt')
        .mockImplementationOnce(() => 'no')
        .mockImplementationOnce(() => 8000)
        .mockImplementationOnce(() => 'outputDir')
        .mockImplementationOnce(() => 'confirm customPrompt wallet_manageIdentities');
      const mkdirMock = jest.spyOn(fs.promises, 'mkdir').mockImplementation();

      expect(await buildWeb3Wallet(mockArgv)).toStrictEqual(expectedMockWallet);
      expect(promptMock).toHaveBeenCalledTimes(4);
      expect(mkdirMock).toHaveBeenCalledTimes(1);
    });

    it('logs error when user inputs unacceptable values', async () => {
      const promptMock = jest.spyOn(readlineUtils, 'prompt')
        .mockImplementationOnce(() => 'no')
        .mockImplementationOnce(() => 'notanumber')
        .mockImplementationOnce(() => 8000)
        .mockImplementationOnce(() => 'invalidDir')
        .mockImplementationOnce(() => 'validDir')
        .mockImplementationOnce(() => 3)
        .mockImplementationOnce(() => 'confirm customPrompt wallet_manageIdentities');
      const mkdirMock = jest.spyOn(fs.promises, 'mkdir')
        .mockImplementationOnce(() => {
          throw new Error('process exited');
        })
        .mockImplementationOnce(() => Promise.resolve());
      const errorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();

      await buildWeb3Wallet(mockArgv);
      expect(promptMock).toHaveBeenCalledTimes(7);
      expect(mkdirMock).toHaveBeenCalledTimes(2);
      expect(errorMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('validateEmptyDir', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('warns user if files may be overwritten', async () => {
      const readdirMock = jest.spyOn(fs.promises, 'readdir').mockImplementation(() => ['index.js', 'dist']);
      const warningMock = jest.spyOn(miscUtils, 'logWarning').mockImplementation();
      const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'n');
      jest.spyOn(process, 'exit').mockImplementationOnce(() => undefined);
      jest.spyOn(console, 'log').mockImplementation();

      await validateEmptyDir();
      expect(warningMock).toHaveBeenCalledTimes(1);
      expect(readdirMock).toHaveBeenCalledTimes(1);
      expect(promptMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('handles continue correctly', async () => {
      const readdirMock = jest.spyOn(fs.promises, 'readdir').mockImplementation(() => ['index.js', 'dist']);
      const warningMock = jest.spyOn(miscUtils, 'logWarning').mockImplementation();
      const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'YES');
      jest.spyOn(process, 'exit').mockImplementationOnce(() => undefined);
      jest.spyOn(console, 'log').mockImplementation();

      await validateEmptyDir();
      expect(warningMock).toHaveBeenCalledTimes(1);
      expect(readdirMock).toHaveBeenCalledTimes(1);
      expect(promptMock).toHaveBeenCalledTimes(1);
    });
  });

});
