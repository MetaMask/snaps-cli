const { trimPathString, logError, logWarning, getOutfilePath, validateOutfileName, isFile } = require('../dist/src/utils');

const setVerboseErrors = (bool) => {
  global.snaps.verboseErrors = bool;
};

const setSuppressWarnings = (bool) => {
  global.snaps.suppressWarnings = bool;
};

describe('utils', () => {

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

  describe('getOutfilePath', () => {
    it('gets the complete out file path', () => {
      expect(getOutfilePath('./src', 'outDir')).toStrictEqual('src/outDir');
      expect(getOutfilePath('../src', '///outDir////')).toStrictEqual('../src/outDir/');
      expect(getOutfilePath('../src', '/lol//outDir////')).toStrictEqual('../src/lol/outDir/');
      // expect(getOutfilePath('.../src', '///outDir////...')).toStrictEqual('../src/outDir/');
      // expect(getOutfilePath('.nht./src', '/hnt//outDir////')).toStrictEqual('.nht./src/hnt/outDir/');
      expect(getOutfilePath('src', 'outDir')).toStrictEqual('src/outDir');
      expect(getOutfilePath('src/', './outDir/')).toStrictEqual('src/outDir/');
      expect(getOutfilePath('src/', '')).toStrictEqual('src/bundle.js');
      expect(getOutfilePath('', '')).toStrictEqual('bundle.js');
    });
  });

  describe('validateOutfileName', () => {
    it('ensures outfile name is just a js file name', () => {
      expect(() => {
        validateOutfileName('file.ts');
      }).toThrow('Invalid outfile name: file.ts');

      expect(() => {
        validateOutfileName('/');
      }).toThrow('Invalid outfile name: /');

      expect(() => {
        validateOutfileName('');
      }).toThrow('Invalid outfile name: ');

      // expect(() => {
      //   validateOutfileName('./src/file');
      // }).toThrow('Invalid outfile name: ./src/file');

      // expect(() => {
      //   validateOutfileName('.js');
      // }).toThrow('Invalid outfile name: .js');

      expect(validateOutfileName('file.js')).toStrictEqual(true);
      expect(validateOutfileName('two.file.js')).toStrictEqual(true);

    });
  });

  describe('isFile', () => {

    it('checks whether the given path string resolves to an existing file', async () => {
      expect.assertions(1);
      const data = await isFile('path/to/some.js');
      expect(data).toStrictEqual(true);
    });
  });

});
