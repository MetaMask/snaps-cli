/* eslint-disable jest/prefer-strict-equal */
const EventEmitter = require('events');
const chokidar = require('chokidar');
const { watch } = require('../../../dist/src/cmds/watch/watch');
const build = require('../../../dist/src/cmds/build/bundle');
const fsUtils = require('../../../dist/src/utils/validate-fs');
const miscUtils = require('../../../dist/src/utils/misc');

describe('watch', () => {
  describe('Watch a directory and its subdirectories for changes, and build when files are added or changed.', () => {

    let watcherEmitter;

    const mockArgv = {
      _: ['watch'],
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
      sourceMaps: false,
      'source-maps': false,
      stripComments: false,
      strip: false,
      'strip-comments': false,
      '$0': '/usr/local/bin/mm-snap',
    };

    const root = (
      mockArgv.src.indexOf('/') === -1 ? '.' : mockArgv.src.substring(0, mockArgv.src.lastIndexOf('/') + 1)
    );

    beforeEach(() => {
      jest.spyOn(chokidar, 'watch').mockImplementation(() => {
        watcherEmitter = new EventEmitter();
        watcherEmitter.add = () => undefined;
        jest.spyOn(watcherEmitter, 'on');
        jest.spyOn(watcherEmitter, 'add');
        return watcherEmitter;
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
      watcherEmitter = undefined;
    });

    it('successfully processes arguments from yargs', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      const validateDirPathMock = jest.spyOn(fsUtils, 'validateDirPath').mockImplementation(() => true);
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);
      const validateOutfileNameMock = jest.spyOn(fsUtils, 'validateOutfileName').mockImplementation(() => true);
      const getOutfilePathMock = jest.spyOn(fsUtils, 'getOutfilePath').mockImplementation(() => 'dist/bundle.js');
      await watch(mockArgv);
      expect(validateDirPathMock).toHaveBeenCalledTimes(1);
      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(validateOutfileNameMock).toHaveBeenCalledTimes(1);
      expect(getOutfilePathMock).toHaveBeenCalledTimes(1);
    });

    it('watcher handles "changed" event correctly', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      const bundleMock = jest.spyOn(build, 'bundle').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

      await watch(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('change', () => {
          expect(bundleMock).toHaveBeenCalledWith(mockArgv.src, `${mockArgv.dist}/${mockArgv.outfileName}`, mockArgv);
          resolve();
        });
      });
      watcherEmitter.emit('change');
      await finishPromise;

      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(global.console.log.mock.calls[0]).toEqual([`Watching '${root}' for changes...`]);
      expect(global.console.log.mock.calls[1]).toEqual([`File changed: undefined`]);
    });

    it('watcher handles "ready" event correctly', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      const bundleMock = jest.spyOn(build, 'bundle').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

      await watch(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('ready', () => {
          expect(bundleMock).toHaveBeenCalledWith(mockArgv.src, `${mockArgv.dist}/${mockArgv.outfileName}`, mockArgv);
          resolve();
        });
      });
      watcherEmitter.emit('ready');
      await finishPromise;

      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledWith(`Watching '${root}' for changes...`);
    });

    it('watcher handles "add" event correctly', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      const bundleMock = jest.spyOn(build, 'bundle').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

      await watch(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('add', () => {
          expect(bundleMock).toHaveBeenCalledWith(mockArgv.src, `${mockArgv.dist}/${mockArgv.outfileName}`, mockArgv);
          resolve();
        });
      });
      watcherEmitter.emit('add');
      await finishPromise;

      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(global.console.log.mock.calls[0]).toEqual([`Watching '${root}' for changes...`]);
      expect(global.console.log.mock.calls[1]).toEqual([`File added: undefined`]);
    });

    it('watcher handles "unlink" event correctly', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      const bundleMock = jest.spyOn(build, 'bundle').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

      await watch(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('unlink', () => {
          expect(bundleMock).not.toHaveBeenCalledWith();
          resolve();
        });
      });
      watcherEmitter.emit('unlink');
      await finishPromise;

      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(global.console.log.mock.calls[0]).toEqual([`Watching '${root}' for changes...`]);
      expect(global.console.log.mock.calls[1]).toEqual([`File removed: undefined`]);
    });

    // for error event, what would cause this?
    it('watcher handles "error" event correctly', async () => {
      const mockError = new Error('error message');
      mockError.message = 'this is a message';
      jest.spyOn(console, 'log').mockImplementation();
      const logErrorMock = jest.spyOn(miscUtils, 'logError').mockImplementation();
      const bundleMock = jest.spyOn(build, 'bundle').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);

      await watch(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('error', () => {
          expect(bundleMock).not.toHaveBeenCalled();
          expect(logErrorMock).toHaveBeenCalled();
          resolve();
        });
      });
      watcherEmitter.emit('error', mockError);
      await finishPromise;

      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledWith(`Watching '${root}' for changes...`);
    });

  });
});
