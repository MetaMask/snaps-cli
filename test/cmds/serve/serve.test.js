/* eslint-disable jest/prefer-strict-equal */
const EventEmitter = require('events');
const http = require('http');
const serve = require('../../../dist/src/cmds/serve');
const serveUtils = require('../../../dist/src/cmds/serve/serveutils');
const fsUtils = require('../../../dist/src/utils/validate-fs');

const mockArgv = {
  _: ['serve'],
  verboseErrors: false,
  v: false,
  'verbose-errors': false,
  suppressWarnings: false,
  sw: false,
  'suppress-warnings': false,
  root: '.',
  r: '.',
  port: 8081,
  p: 8081,
  '$0': '/usr/local/bin/mm-snap',
};

describe('serve', () => {
  describe('Starts a local, static HTTP server on the given port with the given root directory.', () => {

    let watcherEmitter;

    beforeEach(() => {
      const logServerListeningMock = jest.spyOn(serveUtils, 'logServerListening').mockImplementation();
      jest.spyOn(http, 'createServer').mockImplementation(() => {
        watcherEmitter = new EventEmitter();
        watcherEmitter.listen = () => logServerListeningMock();
        jest.spyOn(watcherEmitter, 'on');
        jest.spyOn(watcherEmitter, 'listen');
        return watcherEmitter;
      });
      jest.spyOn(fsUtils, 'validateDirPath').mockImplementation(() => true);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('server handles "close" event correctly', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(process, 'exit').mockImplementation(() => undefined);

      await serve.handler(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('close', () => {
          expect(global.console.log.mock.calls[0]).toEqual(['\nStarting server...']);
          expect(global.console.log.mock.calls[1]).toEqual(['Server closed']);
          resolve();
        });
      });
      watcherEmitter.emit('close');
      await finishPromise;

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('server handles "error" event correctly', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      const logServerErrorMock = jest.spyOn(serveUtils, 'logServerError').mockImplementation();

      await serve.handler(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('error', () => {
          expect(global.console.log).toHaveBeenCalledWith('\nStarting server...');
          expect(logServerErrorMock).toHaveBeenCalled();
          resolve();
        });
      });
      watcherEmitter.emit('error');
      await finishPromise;
    });

    it('server handles "request" event correctly', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      const logRequestMock = jest.spyOn(serveUtils, 'logRequest').mockImplementation();

      await serve.handler(mockArgv);
      const finishPromise = new Promise((resolve, _) => {
        watcherEmitter.on('request', () => {
          expect(global.console.log).toHaveBeenCalledWith('\nStarting server...');
          expect(logRequestMock).toHaveBeenCalled();
          resolve();
        });
      });
      watcherEmitter.emit('request');
      await finishPromise;
    });
  });
});
