const { getOutfilePath, validateOutfileName } = require('../../dist/src/utils');

describe('validate', () => {
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

});
