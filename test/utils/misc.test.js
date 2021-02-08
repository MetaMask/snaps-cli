const { trimPathString, logError, logWarning } = require('../../dist/src/utils');

describe('misc', () => {

  global.snaps = {
    verboseErrors: false,
    suppressWarnings: false,
    isWatching: false,
  };

  const setVerboseErrors = (bool) => {
    global.snaps.verboseErrors = bool;
  };

  const setSuppressWarnings = (bool) => {
    global.snaps.suppressWarnings = bool;
  };

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  afterEach(() => {
    delete global.snaps.verboseErrors;
    delete global.snaps.suppressWarnings;
    jest.restoreAllMocks();
  });

  afterAll(() => {
    delete global.snaps;
  });

  describe('trimPathString', () => {
    it('trims a given path string', () => {
      expect(trimPathString('./hello')).toStrictEqual('hello');
      expect(trimPathString('hello')).toStrictEqual('hello');
      expect(trimPathString('hello/')).toStrictEqual('hello');
      expect(trimPathString('')).toStrictEqual('');
      expect(trimPathString('hello////')).toStrictEqual('hello');
      expect(trimPathString('../hello')).toStrictEqual('hello');
      expect(trimPathString('//////hello')).toStrictEqual('hello');
    });
  });

  describe('logError', () => {
    it('logs an error message to console', () => {
      setVerboseErrors(true);
      jest.spyOn(console, 'error').mockImplementation();
      logError('custom error message', 'verbose error message');
      expect(global.console.error).toHaveBeenCalledWith('custom error message');
      expect(global.console.error).toHaveBeenCalledWith('verbose error message');

      setVerboseErrors(false);
      jest.spyOn(console, 'error').mockImplementation();
      logError('error message');
      expect(global.console.error).toHaveBeenCalledWith('error message');
    });
  });

  describe('logWarning', () => {
    it('logs a warning message to console', () => {
      setSuppressWarnings(false);
      setVerboseErrors(true);

      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();

      logWarning('custom warning message', 'verbose warning message');
      expect(global.console.warn).toHaveBeenCalledWith('custom warning message');
      expect(global.console.error).toHaveBeenCalledWith('verbose warning message');
    });
  });

});
