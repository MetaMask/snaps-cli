const { build } = require('../../../dist/src/cmds/build/build');
const evalModule = require('../../../dist/src/cmds/eval/eval');
const manifestModule = require('../../../dist/src/cmds/manifest/manifest');
const buildBundle = require('../../../dist/src/cmds/build/bundle');
const fsUtils = require('../../../dist/src/utils/validate-fs');

describe('build', () => {
  describe('build', () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    global.snaps = {
      verboseErrors: false,
    };

    it('processes yargs properties correctly', async () => {
      const mockArgv = {
        _: ['build'],
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
        port: 8081,
        p: 8081,
        eval: true,
        e: true,
        manifest: true,
        m: true,
        populate: true,
        '$0': '/usr/local/bin/mm-snap',
      };
      const outfilePath = `${mockArgv.dist}/${mockArgv.outfileName}`;
      const validateOutfileNameMock = jest.spyOn(fsUtils, 'validateOutfileName').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation();
      const validateDirPathMock = jest.spyOn(fsUtils, 'validateDirPath').mockImplementation();
      const bundleMock = jest.spyOn(buildBundle, 'bundle').mockImplementation(() => true);
      const evalMock = jest.spyOn(evalModule, 'snapEval').mockImplementation();
      const manifestMock = jest.spyOn(manifestModule, 'manifest').mockImplementation();

      await build(mockArgv);
      expect(bundleMock).toHaveBeenCalledWith(mockArgv.src, outfilePath, mockArgv);
      expect(evalMock).toHaveBeenCalledWith({ ...mockArgv, bundle: outfilePath });
      expect(manifestMock).toHaveBeenCalledWith(mockArgv);
      expect(validateOutfileNameMock).toHaveBeenCalledTimes(1);
      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(validateDirPathMock).toHaveBeenCalledTimes(1);
    });

    it('does not call validateOutfileName, snapEval, or manifest without argv parameters', async () => {
      const mockArgv = {
        _: ['init'],
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
        // outfileName: 'bundle.js',
        n: 'bundle.js',
        'outfile-name': 'bundle.js',
        port: 8081,
        p: 8081,
        '$0': '/usr/local/bin/mm-snap',
        // manifest: false,
        // eval: true,
      };
      const outfilePath = `${mockArgv.dist}/bundle.js`;
      const validateOutfileNameMock = jest.spyOn(fsUtils, 'validateOutfileName').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation();
      const validateDirPathMock = jest.spyOn(fsUtils, 'validateDirPath').mockImplementation();
      const bundleMock = jest.spyOn(buildBundle, 'bundle').mockImplementation(() => true);
      const evalMock = jest.spyOn(evalModule, 'snapEval').mockImplementation();
      const manifestMock = jest.spyOn(manifestModule, 'manifest').mockImplementation();
      await build(mockArgv);
      expect(bundleMock).toHaveBeenCalledWith(mockArgv.src, outfilePath, mockArgv);
      expect(evalMock).not.toHaveBeenCalled();
      expect(manifestMock).not.toHaveBeenCalled();
      expect(validateOutfileNameMock).not.toHaveBeenCalled();
      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(validateDirPathMock).toHaveBeenCalledTimes(1);
    });

    it('does not call eval if bundle fails', async () => {
      const mockArgv = {
        _: ['build'],
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
        port: 8081,
        p: 8081,
        eval: true,
        e: true,
        manifest: true,
        m: true,
        populate: true,
        '$0': '/usr/local/bin/mm-snap',
      };
      const outfilePath = `${mockArgv.dist}/${mockArgv.outfileName}`;
      const validateOutfileNameMock = jest.spyOn(fsUtils, 'validateOutfileName').mockImplementation();
      const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation();
      const validateDirPathMock = jest.spyOn(fsUtils, 'validateDirPath').mockImplementation();
      const evalMock = jest.spyOn(evalModule, 'snapEval').mockImplementation();
      const manifestMock = jest.spyOn(manifestModule, 'manifest').mockImplementation();

      //   main check happens here:
      const bundleMock = jest.spyOn(buildBundle, 'bundle').mockImplementation();
      await build(mockArgv);
      expect(evalMock).not.toHaveBeenCalled();

      expect(bundleMock).toHaveBeenCalledWith(mockArgv.src, outfilePath, mockArgv);
      expect(manifestMock).toHaveBeenCalledWith(mockArgv);
      expect(validateOutfileNameMock).toHaveBeenCalledTimes(1);
      expect(validateFilePathMock).toHaveBeenCalledTimes(1);
      expect(validateDirPathMock).toHaveBeenCalledTimes(1);
    });
  });
});
