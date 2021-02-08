const { trimPathString, logError, logWarning, assignGlobals } = require('../../dist/src/utils/misc');

describe('misc', () => {

  global.snaps = {
    verboseErrors: false,
    suppressWarnings: false,
    isWatching: false,
  };

  // this is the yargs object created with cli command: mm-snap init
  const defaultArgv = {
    _: ['init'],
    verboseErrors: false,
    v: false,
    verbose: false,
    'verbose-errors': false,
    suppressWarnings: false,
    w: false,
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

  // this is the yargs object created with cli command: mm-snap watch -v -w
  const exampleArgv = {
    _: ['watch'],
    v: true,
    verboseErrors: true,
    verbose: true,
    'verbose-errors': true,
    w: true,
    suppressWarnings: true,
    'suppress-warnings': true,
    src: 'index.js',
    s: 'index.js',
    dist: 'dist',
    d: 'dist',
    outfileName: 'bundle.js',
    n: 'bundle.js',
    'outfile-name': 'bundle.js',
    sourceMaps: false,
    'source-maps': false,
    environment: 'worker',
    env: 'worker',
    stripComments: false,
    strip: false,
    'strip-comments': false,
    '$0': '/usr/local/bin/mm-snap',
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

  describe('assignGlobals', () => {
    it('sets global variables correctly', () => {
      assignGlobals(exampleArgv);
      // expect(global.snaps.isWatching).toStrictEqual(true);
      expect(global.snaps.verboseErrors).toStrictEqual(true);
      expect(global.snaps.suppressWarnings).toStrictEqual(true);
    });

    it('doesnt set global variables incorrectly', () => {
      assignGlobals(defaultArgv);
      // expect(global.snaps.isWatching).toStrictEqual(false);
      expect(global.snaps.verboseErrors).toStrictEqual(false);
      expect(global.snaps.suppressWarnings).toStrictEqual(false);
    });
  });

  // describe('sanitizeInputs', () => {
  // });

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

});
