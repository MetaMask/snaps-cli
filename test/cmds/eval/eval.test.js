const pathUtils = require('path');
const WorkerThread = require('worker_threads');
const EventEmitter = require('events');
const { snapEval } = require('../../../dist/src/cmds/eval/eval');
const fsUtils = require('../../../dist/src/utils/validate-fs');

describe('eval', () => {
  describe('snapEval', () => {

    let watcherEmitter;

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

    beforeEach(() => {
      jest.spyOn(WorkerThread, 'Worker').mockImplementation(() => {
        watcherEmitter = new EventEmitter();
        jest.spyOn(watcherEmitter, 'on');
        return watcherEmitter;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      watcherEmitter = undefined;
    });

    // cant make successful eval due to postMessage
    // it('snapEval successfully executes and logs to console', async () => {

    //   global.snaps = {
    //     verboseErrors: false,
    //   };

    //   jest.spyOn(console, 'log').mockImplementation();
    //   jest.spyOn(process, 'exit').mockImplementation(() => undefined);
    //   const pathMock = jest.spyOn(pathUtils, 'join').mockImplementation();
    //   const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

    //   await snapEval(mockArgv);
    //   const finishPromise = new Promise((resolve, _) => {
    //     watcherEmitter.on('exit', () => {
    //       resolve();
    //     });
    //   });
    //   watcherEmitter.emit('exit');
    //   await finishPromise;

    //   expect(validateFilePathMock).toHaveBeenCalledTimes(1);
    //   expect(pathMock).toHaveBeenCalledTimes(1);
    //   expect(process.exit).toHaveBeenCalledWith(1);
    //   expect(global.console.log).toHaveBeenCalledWith('Eval Success: evaluated \'dist/bundle.js\' in SES!');
    // });

    it('snapEval successfully throws worker and snap eval error', async () => {

      global.snaps = {
        verboseErrors: false,
      };

      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(process, 'exit').mockImplementation(() => undefined);
      const pathMock = jest.spyOn(pathUtils, 'join').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

      await snapEval(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('exit', () => {
          // how to catch this error inside internal function
          // expect(this).toThrow('Worker exited abnormally! Code: undefined');
          resolve();
        });
      });
      watcherEmitter.emit('exit');
      await finishPromise;

      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(pathMock).toHaveBeenCalledTimes(1);
      expect(global.console.error).toHaveBeenCalledWith('Snap evaluation error: (intermediate value).on(...).postMessage is not a function');
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
