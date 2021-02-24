/* eslint-disable jest/prefer-strict-equal */
const { promises: fs } = require('fs');
const initUtils = require('../../../dist/src/cmds/init/initutils');
const readlineUtils = require('../../../dist/src/utils/readline');
const { CONFIG_PATHS } = require('../../../dist/src/utils/misc');
const { initHandler } = require('../../../dist/src/cmds/init/initialize');
const template = require('../../../dist/src/cmds/init/initTemplate.json');

describe('initialize', () => {
  describe('initHandler', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    //  should i be checking specific arguments or just number of times writefile is called?
    it('function successfully executes under normal conditions', async () => {
      const mockPackage = {
        name: 'foo',
        version: '1.0.0',
        description: '',
        main: 'index.js',
        scripts: { test: 'echo "Error: no test specified" && exit 1' },
        author: '',
        license: 'ISC',
      };
      const mockPackageAndWallet = {
        name: 'foo',
        version: '1.0.0',
        description: '',
        main: 'index.js',
        scripts: { test: 'echo "Error: no test specified" && exit 1' },
        author: '',
        license: 'ISC',
        web3Wallet: {
          bundle: {
            local: 'dist/bundle.js',
            url: 'http://localhost:8081/dist/bundle.js',
          },
          initialPermissions: { alert: {} },
        },
      };
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
      const mockWallet = [
        {
          bundle: {
            local: 'dist/bundle.js',
            url: 'http://localhost:8081/dist/bundle.js',
          },
          initialPermissions: { alert: {} },
        },
        { dist: 'dist', outfileName: 'bundle.js', port: 8081 },
      ];
      const newArgs = { dist: 'dist', outfileName: 'bundle.js', port: 8081, src: 'index.js' };
      const CONFIG_PATH = CONFIG_PATHS[0];
      jest.spyOn(console, 'log').mockImplementation();
      const fsWriteMock = jest.spyOn(fs, 'writeFile').mockImplementationOnce(() => true);
      const asyncPackageInitMock = jest.spyOn(initUtils, 'asyncPackageInit').mockImplementation(() => mockPackage);
      const validateEmptyDirMock = jest.spyOn(initUtils, 'validateEmptyDir').mockImplementation();
      const buildWeb3WalletMock = jest.spyOn(initUtils, 'buildWeb3Wallet').mockImplementation(() => mockWallet);
      const closePromptMock = jest.spyOn(readlineUtils, 'closePrompt').mockImplementation(() => mockPackage);
      await initHandler(mockArgv);
      expect(global.console.log.mock.calls[0]).toEqual([`Init: Begin building 'package.json'\n`]);
      expect(global.console.log.mock.calls[1]).toEqual([`\nInit: Set 'package.json' web3Wallet properties\n`]);
      expect(global.console.log.mock.calls[2]).toEqual([`\nInit: 'package.json' web3Wallet properties set successfully!`]);
      expect(global.console.log.mock.calls[3]).toEqual([`Init: Wrote main entry file '${mockPackage.main}'`]);
      expect(global.console.log.mock.calls[4]).toEqual([`Init: Wrote 'index.html' file`]);
      expect(global.console.log.mock.calls[5]).toEqual([`Init: Wrote '${CONFIG_PATH}' config file`]);
      expect(asyncPackageInitMock).toHaveBeenCalledTimes(1);
      expect(validateEmptyDirMock).toHaveBeenCalledTimes(1);
      expect(closePromptMock).toHaveBeenCalledTimes(1);
      expect(fsWriteMock).toHaveBeenNthCalledWith(1, 'package.json', `${JSON.stringify(mockPackageAndWallet, null, 2)}\n`);
      expect(fsWriteMock).toHaveBeenNthCalledWith(2, mockPackage.main, template.js);
      expect(fsWriteMock).toHaveBeenNthCalledWith(3, 'index.html', template.html.toString()
        .replace(/_PORT_/gu, newArgs.port.toString() || mockArgv.port.toString()));
      expect(fsWriteMock).toHaveBeenNthCalledWith(4, CONFIG_PATH, JSON.stringify(newArgs, null, 2));
      expect(buildWeb3WalletMock).toHaveBeenCalledWith(mockArgv);
    });
  });
});
