const { promises: fs } = require('fs');
const initUtils = require('../../dist/src/cmds/init/initutils');
const readlineUtils = require('../../dist/src/utils/readline');
const miscUtils = require('../../dist/src/utils/misc');
const { initHandler } = require('../../dist/src/cmds/init/initialize');
const template = require('../../dist/src/cmds/init/initTemplate.json');
const { CONFIG_PATHS } = require('../../dist/src/utils/misc');

describe('initialize', () => {
  describe('initHandler', () => {

    beforeEach(() => {
      const mockWallet = [
        {
          bundle: {},
          initialPermissions: {},
        },
        { dist: 'dist', outfileName: 'bundle.js', port: 8081 },
      ];
      jest.spyOn(initUtils, 'buildWeb3Wallet').mockImplementation(() => mockWallet);
      jest.spyOn(initUtils, 'validateEmptyDir').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(readlineUtils, 'closePrompt').mockImplementation();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const mockPackage = {
      main: 'index.js',
    };
    const mockPackageAndWallet = {
      main: 'index.js',
      web3Wallet: {
        bundle: {},
        initialPermissions: {},
      },
    };
    const mockArgv = { foo: 'bar' };
    const expectedReturnValue = {
      foo: 'bar',
      src: 'index.js',
      dist: 'dist',
      outfileName: 'bundle.js',
      port: 8081,
    };
    const newArgs = { dist: 'dist', outfileName: 'bundle.js', port: 8081, src: 'index.js' };
    const CONFIG_PATH = CONFIG_PATHS[0];

    it('function successfully executes under normal conditions', async () => {
      const fsWriteMock = jest.spyOn(fs, 'writeFile').mockImplementation(() => true);
      jest.spyOn(initUtils, 'asyncPackageInit').mockImplementation(() => mockPackage);
      const closePromptMock = jest.spyOn(readlineUtils, 'closePrompt')
        .mockImplementation();
      expect(await initHandler(mockArgv)).toStrictEqual(expectedReturnValue);
      expect(global.console.log).toHaveBeenCalledTimes(6);
      expect(fsWriteMock)
        .toHaveBeenNthCalledWith(1, 'package.json', `${JSON.stringify(mockPackageAndWallet, null, 2)}\n`);
      expect(fsWriteMock)
        .toHaveBeenNthCalledWith(2, mockPackage.main, template.js);
      expect(fsWriteMock).toHaveBeenNthCalledWith(3, 'index.html', template.html.toString()
        .replace(/_PORT_/gu, newArgs.port.toString() || mockArgv.port.toString()));
      expect(fsWriteMock).toHaveBeenNthCalledWith(4, CONFIG_PATH, JSON.stringify(newArgs, null, 2));
      expect(closePromptMock).toHaveBeenCalledTimes(1);
    });

    it('function logs error when writefile is unsuccessful', async () => {
      global.snaps = {
        verboseErrors: false,
      };
      const errorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();
      const fsWriteMock = jest.spyOn(fs, 'writeFile').mockImplementation(() => {
        throw new Error('error message');
      });
      jest.spyOn(process, 'exit').mockImplementation(() => undefined);
      jest.spyOn(initUtils, 'asyncPackageInit').mockImplementation(() => mockPackage);
      expect(await initHandler(mockArgv)).toStrictEqual(expectedReturnValue);
      expect(errorMock).toHaveBeenCalledTimes(4);
      expect(fsWriteMock).toHaveBeenCalledTimes(4);
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(process.exit).toHaveBeenCalledTimes(3);
    });

    it('function does not write to main if undefined', async () => {
      const mockUndefinedMain = { foo: 'bar' };
      const expectedReturn = {
        foo: 'bar',
        dist: 'dist',
        outfileName: 'bundle.js',
        port: 8081,
      };
      jest.spyOn(fs, 'writeFile').mockImplementation(() => true);
      jest.spyOn(initUtils, 'asyncPackageInit').mockImplementation(() => mockUndefinedMain);
      jest.spyOn(readlineUtils, 'closePrompt').mockImplementation();
      expect(await initHandler(mockArgv)).toStrictEqual(expectedReturn);
    });
  });
});
