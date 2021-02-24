const pathUtils = require('path');
const WorkerThread = require('worker_threads');
const EventEmitter = require('events');
const { snapEval } = require('../../../dist/src/cmds/eval/eval');
const fsUtils = require('../../../dist/src/utils/validate-fs');

class MockWorker extends EventEmitter {
  postMessage() {
    return undefined;
  }
}

jest.mock('worker_threads');

describe('eval', () => {
  describe('snapEval', () => {
    let mockWorker;

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
      jest.spyOn(console, 'log').mockImplementation(() => undefined);
      jest.spyOn(process, 'exit').mockImplementation(() => undefined);
      jest.spyOn(fsUtils, 'validateFilePath')
        .mockImplementation(async () => true);
      jest.spyOn(pathUtils, 'join');

      mockWorker = new MockWorker();
      mockWorker.postMessage = () => undefined;
      jest.spyOn(mockWorker, 'on');
      jest.spyOn(mockWorker, 'postMessage').mockImplementation(() => undefined);
      WorkerThread.Worker.mockImplementation(() => {
        return mockWorker;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      mockWorker = undefined;
      delete global.snaps;
    });

    // cant make successful eval due to postMessage
    it('snapEval successfully executes and logs to console', async () => {

      global.snaps = {
        verboseErrors: false,
      };

      // const evalPromise = snapEval(mockArgv);
      snapEval(mockArgv);
      const finishPromise = new Promise((resolve) => {
        mockWorker.on('exit', () => resolve());
      });
      console.log(mockWorker.listeners('exit'));

      mockWorker.emit('exit', 0);
      // await Promise.all([evalPromise, finishPromise])
      await finishPromise;
      // await snapEval(mockArgv);

      expect(WorkerThread.Worker).toHaveBeenCalledTimes(1);
      expect(WorkerThread.Worker).toHaveBeenCalledWith(expect.stringContaining('evalWorker.js'));
      expect(mockWorker.on).toHaveBeenCalledTimes(2);
      expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledWith('Eval Success: evaluated \'dist/bundle.js\' in SES!');
    });

    // unable to catch error
    // it('snapEval successfully throws worker and snap eval error', async () => {

    //   global.snaps = {
    //     verboseErrors: false,
    //   };

    //   jest.spyOn(console, 'error').mockImplementation();
    //   jest.spyOn(process, 'exit').mockImplementation(() => undefined);
    //   const pathMock = jest.spyOn(pathUtils, 'join').mockImplementation();
    //   const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

    //   await snapEval(mockArgv);
    //   const finishPromise = new Promise((resolve, _) => {
    //     mockWorker.on('exit', () => {
    //       // how to catch this error inside internal function
    //       // expect(this).toThrow('Worker exited abnormally! Code: undefined');
    //       resolve();
    //     });
    //   });
    //   mockWorker.emit('exit');
    //   await finishPromise;

    //   expect(validateFilePathMock).toHaveBeenCalledTimes(1);
    //   expect(pathMock).toHaveBeenCalledTimes(1);
    //   expect(global.console.error).toHaveBeenCalledWith('Snap evaluation error: (intermediate value).on(...).postMessage is not a function');
    //   expect(process.exit).toHaveBeenCalledWith(1);
    // });
  });
});
