const { trimPathString, logError, logWarning, getOutfilePath, validateOutfileName } = require('../dist/src/utils')

const setVerboseErrors = (bool) => {
  global.snaps.verboseErrors = bool
};

const setSuppressWarnings = (bool) => {
  global.snaps.suppressWarnings = bool
};

describe('SnapsCLI utility functions', () => {

    it('Trims a given path string', () => {
      expect(trimPathString('./hello')).toEqual('hello')
      expect(trimPathString('hello')).toEqual('hello')
      expect(trimPathString('hello/')).toEqual('hello')
    })

    it('Logs an error message to console', () => {

      setVerboseErrors(true)
      console.error = jest.fn()
      logError('custom error message', 'verbose error message')
      expect(global.console.error).toHaveBeenCalledWith('custom error message')
      expect(global.console.error).toHaveBeenCalledWith('verbose error message')

      setVerboseErrors(false)
      console.error = jest.fn()
      logError('error message')
      expect(global.console.error).toHaveBeenCalledWith('error message')

    })

    it('Logs a warning message to console', () => {

      setSuppressWarnings(false)
      setVerboseErrors(true)
      console.warn = jest.fn()
      console.error = jest.fn()
      logWarning('custom warning message', 'verbose warning message')
      expect(global.console.warn).toHaveBeenCalledWith('custom warning message')
      expect(global.console.error).toHaveBeenCalledWith('verbose warning message')

    })

    it('Gets the complete out file path', () => {

      expect(getOutfilePath('./src', 'outDir')).toEqual('src/outDir')
      expect(getOutfilePath('src', 'outDir')).toEqual('src/outDir')
      expect(getOutfilePath('src/', './outDir/')).toEqual('src/outDir/')
      expect(getOutfilePath('src/', '')).toEqual('src/bundle.js')
    })

    it('Ensures outfile name is just a js file name', () => {

      expect(() => {
        validateOutfileName('file.ts')
      }).toThrow('Invalid outfile name: file.ts')

      expect(() => {
        validateOutfileName('/')
      }).toThrow('Invalid outfile name: /')

      expect(() => {
        validateOutfileName('')
      }).toThrow('Invalid outfile name: ')

      // expect(validateOutfileName('file.js')).toEqual(true)
      // expect(validateOutfileName('./src/file')).toEqual(true)

    })
})
