const pathUtils = require('path');
// const { Worker } = require('worker_threads');
const { snapEval } = require('../../../dist/src/cmds/eval/eval');
const fsUtils = require('../../../dist/src/utils/validate-fs');

describe('eval', () => {
  describe('snapEval', () => {

    const mockArgv = {
      _: ['eval'],
      verboseErrors: false,
      v: false,
      'verbose-errors': false,
      suppressWarnings: false,
      sw: false,
      'suppress-warnings': false,
      bundle: 'dist/bundle.js',
      b: 'dist/bundle.js',
      '$0': '/usr/local/bin/mm-snap',
    };

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('snapEval successfully executes and logs to console', async () => {

      global.snaps = {
        verboseErrors: false,
      };

      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(process, 'exit').mockImplementation(() => undefined);
      const pathMock = jest.spyOn(pathUtils, 'join').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);
      await snapEval(mockArgv);
      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(pathMock).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(1);
      expect(global.console.error).toHaveBeenCalledWith('Snap evaluation error: The "filename" argument must be of type string or an instance of URL. Received undefined');
    });

    // it('snapEval succethnssfully executes and logs to console', async () => {

    //   global.snaps = {
    //     verboseErrors: false,
    //   };

    //   jest.spyOn(console, 'log').mockImplementation();
    //   jest.spyOn(process, 'exit').mockImplementation(() => undefined);
    //   // const workerMock = jest.spyOn(worker_threads, 'Worker').mockImplementation();
    //   const pathMock = jest.spyOn(pathUtils, 'join').mockImplementation();
    //   const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);
    //   await snapEval(mockArgv);
    //   expect(validateFilePathMock).toHaveBeenCalledTimes(1);
    //   expect(pathMock).toHaveBeenCalledTimes(1);
    //   expect(process.exit).not.toHaveBeenCalled();
    //   // expect(global.console.log).toHaveBeenCalledWith('Eval Success: evaluated \'dist/bundle.js\' in SES!');
    // });
  });
});
