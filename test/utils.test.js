const { trimPathString, logError, logWarning, getOutfilePath, validateOutfileName } = require('../dist/src/utils');

const setVerboseErrors = (bool) => {
  global.snaps.verboseErrors = bool;
};

const setSuppressWarnings = (bool) => {
  global.snaps.suppressWarnings = bool;
};

describe('utils', () => {

  describe('trimPathString', () => {
    it('trims a given path string', () => {
      expect(trimPathString('./hello')).toStrictEqual('hello');
      expect(trimPathString('hello')).toStrictEqual('hello');
      expect(trimPathString('hello/')).toStrictEqual('hello');
      expect(trimPathString('')).toStrictEqual('');
      expect(trimPathString('hello////')).toStrictEqual('hello');
      expect(trimPathString('../hello')).toStrictEqual('hello');
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
      expect(getOutfilePath('src', 'outDir')).toStrictEqual('src/outDir');
      expect(getOutfilePath('src/', './outDir/')).toStrictEqual('src/outDir/');
      expect(getOutfilePath('src/', '')).toStrictEqual('src/bundle.js');
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

      // expect(validateOutfileName('file.js')).toStrictEqual(true)
      // expect(validateOutfileName('./src/file')).toStrictEqual(true)

    });
  });
});
