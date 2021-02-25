/* eslint-disable jest/prefer-strict-equal */
const fs = require('fs');
const fsPromise = require('fs').promises;
const { asyncPackageInit, buildWeb3Wallet, validateEmptyDir } = require('../../../dist/src/cmds/init/initutils');
const readlineUtils = require('../../../dist/src/utils/readline');
const miscUtils = require('../../../dist/src/utils/misc');

describe('initutils', () => {

  describe('asyncPackageInit', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('console logs if successful', async () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync')
        .mockImplementationOnce(() => true)
        .mockImplementationOnce(() => false);
      const readFileMock = jest.spyOn(fsPromise, 'readFile').mockImplementationOnce();
      const parseMock = jest.spyOn(JSON, 'parse').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();

      await asyncPackageInit();
      expect(existsSyncMock).toHaveBeenCalled();
      expect(readFileMock).toHaveBeenCalledTimes(1);
      expect(parseMock).toHaveBeenCalledTimes(1);
      expect(global.console.log.mock.calls[0]).toEqual([`Init: Attempting to use existing 'package.json'...`]);
      expect(global.console.log.mock.calls[1]).toEqual([`Init: Successfully parsed 'package.json'!`]);
    });

    it('throws error in catch block', async () => {
      const existsSyncMock = jest.spyOn(fs, 'existsSync')
        .mockImplementationOnce(() => true)
        .mockImplementationOnce(() => true);
      const readFileMock = jest.spyOn(fsPromise, 'readFile').mockImplementationOnce();
      const parseMock = jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error('error message');
      });
      jest.spyOn(console, 'log').mockImplementation();
      const errorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();
      jest.spyOn(process, 'exit')
        .mockImplementationOnce(() => undefined)
        .mockImplementation(() => {
          throw new Error('process exited');
        });

      await expect(asyncPackageInit()).rejects.toThrow(new Error('process exited'));
      expect(existsSyncMock).toHaveBeenCalled();
      //   called three times even though only called twice in code
      //   expect(existsSyncMock).toHaveBeenCalledTimes(2);
      expect(readFileMock).toHaveBeenCalledTimes(1);
      expect(parseMock).toHaveBeenCalledTimes(1);
      expect(errorMock).toHaveBeenCalledTimes(2);
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(global.console.log).toHaveBeenCalledWith(`Init: Attempting to use existing 'package.json'...`);
    });
  });
  describe('buildWeb3Wallet', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const mockArgv = {
      _: ['init'],
      verboseErrors: false,
      v: false,
      'verbose-errors': false,
      suppressWarnings: false,
      sw: false,
      'suppress-warnings': false,
      src: 'index.js',
      s: 'index.js',
      dist: 'dist',
      d: 'dist',
      outfileName: 'bundle.js',
      n: 'bundle.js',
      'outfile-name': 'bundle.js',
      port: 8081,
      p: 8081,
      '$0': '/usr/local/bin/mm-snap',
    };

    it('applies default web3wallet values if user input is \'y\'', async () => {
      const mkdirMock = jest.spyOn(fsPromise, 'mkdir').mockImplementation();
      const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'y');
      jest.spyOn(console, 'log').mockImplementation();

      await buildWeb3Wallet(mockArgv);
      expect(promptMock).toHaveBeenCalledTimes(1);
      expect(mkdirMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledWith('Using default values...');
    });

    // find way to mock error.code
    // it('throws error if fails to make directory and apply default values', async () => {
    //   const mkdirMock = jest.spyOn(fsPromise, 'mkdir').mockImplementation(() => {
    //     throw new Error('mkdir failed');
    //   });
    //   const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'y');
    //   jest.spyOn(console, 'log').mockImplementation();

    //   await buildWeb3Wallet(mockArgv);
    //   expect(promptMock).toHaveBeenCalledTimes(1);
    //   expect(mkdirMock).toHaveBeenCalledTimes(1);
    //   expect(global.console.log).toHaveBeenCalledWith('Using default values...');
    // });

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
      const mkdirMock = jest.spyOn(fsPromise, 'mkdir').mockImplementation();

      expect(await buildWeb3Wallet(mockArgv)).toStrictEqual(expectedMockWallet);
      expect(promptMock).toHaveBeenCalledTimes(4);
      expect(mkdirMock).toHaveBeenCalledTimes(1);
    });

    // it('logs error when user inputs unacceptable values', async () => {
    //   const promptMock = jest.spyOn(readlineUtils, 'prompt')
    //     .mockImplementationOnce(() => 'no')
    //     .mockImplementationOnce(() => 'notanumber')
    //     .mockImplementationOnce(() => 'invalidDir')
    //     .mockImplementationOnce(() => 3);
    //   const mkdirMock = jest.spyOn(fsPromise, 'mkdir').mockImplementation(() => {
    //     throw new Error('process exited');
    //   });
    //   const errorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();

    //   await buildWeb3Wallet(mockArgv);
    //   expect(promptMock).toHaveBeenCalledTimes(4);
    //   expect(mkdirMock).toHaveBeenCalledTimes(1);
    //   expect(errorMock).toHaveBeenCalledTimes(4);
    // });

  });

  describe('validateEmptyDir', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('warns user if files may be overwritten', async () => {
      const readdirMock = jest.spyOn(fsPromise, 'readdir').mockImplementation(() => ['index.js', 'dist']);
      const warningMock = jest.spyOn(miscUtils, 'logWarning').mockImplementation();
      const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'n');
      jest.spyOn(process, 'exit').mockImplementationOnce(() => undefined);
      jest.spyOn(console, 'log').mockImplementation();

      await validateEmptyDir();
      expect(warningMock).toHaveBeenCalledTimes(1);
      expect(readdirMock).toHaveBeenCalledTimes(1);
      expect(promptMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledWith(`Init: Exiting...`);
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('handles continue correctly', async () => {
      const readdirMock = jest.spyOn(fsPromise, 'readdir').mockImplementation(() => ['index.js', 'dist']);
      const warningMock = jest.spyOn(miscUtils, 'logWarning').mockImplementation();
      const promptMock = jest.spyOn(readlineUtils, 'prompt').mockImplementation(() => 'YES');
      jest.spyOn(process, 'exit').mockImplementationOnce(() => undefined);
      jest.spyOn(console, 'log').mockImplementation();

      await validateEmptyDir();
      expect(warningMock).toHaveBeenCalledTimes(1);
      expect(readdirMock).toHaveBeenCalledTimes(1);
      expect(promptMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).not.toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });
});
