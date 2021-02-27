const miscUtils = require('../../dist/src/utils/misc');
const { logServerListening, logRequest, logServerError } = require('../../dist/src/cmds/serve/serveutils');

describe('serve utility functions', () => {
  describe('logServerListening', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const portInput = 8000;

    it('logs to console', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      logServerListening(portInput);
      expect(global.console.log).toHaveBeenCalledWith(`Server listening on: http://localhost:${portInput}`);
    });

  });

  describe('logRequest', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const requestInput = {
      url: 'http://localhost:8000',
    };

    it('logs to console', async () => {
      jest.spyOn(console, 'log').mockImplementation();
      logRequest(requestInput);
      expect(global.console.log).toHaveBeenCalledWith(`Handling incoming request for: ${requestInput.url}`);
    });

  });

  describe('logServerError', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    const port = 8000;

    it('logs already in use error to console', async () => {
      const mockError = new Error('error message');
      mockError.code = 'EADDRINUSE';
      jest.spyOn(miscUtils, 'logError').mockImplementation();
      jest.spyOn(process, 'exit').mockImplementation(() => undefined);
      logServerError(mockError, port);
      expect(miscUtils.logError).toHaveBeenCalledWith(`Server error: Port ${port} already in use.`);
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('logs server error to console', async () => {
      const mockBadError = new Error('error message');
      mockBadError.code = 'fake';
      jest.spyOn(miscUtils, 'logError').mockImplementation();
      jest.spyOn(process, 'exit').mockImplementation(() => undefined);
      logServerError(mockBadError, port);
      expect(miscUtils.logError).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

});
