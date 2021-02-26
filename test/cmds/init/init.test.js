const { init } = require('../../../dist/src/cmds/init/init');
const initializeModule = require('../../../dist/src/cmds/init/initialize');
const buildModule = require('../../../dist/src/cmds/build/build');

describe('init', () => {
  describe('init', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

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
      outfileName: 'bundle.js',
      n: 'bundle.js',
      'outfile-name': 'bundle.js',
      port: 8081,
      p: 8081,
      '$0': '/usr/local/bin/mm-snap',
    };

    it('console logs if successful', async () => {
      const newMockArgs = {
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
        outfileName: 'bundle.js',
        n: 'bundle.js',
        'outfile-name': 'bundle.js',
        port: 8081,
        p: 8081,
        '$0': '/usr/local/bin/mm-snap',
      };
      const initHandlerMock = jest.spyOn(initializeModule, 'initHandler').mockImplementation(() => newMockArgs);
      const buildMock = jest.spyOn(buildModule, 'build').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();

      await init(mockArgv);
      expect(initHandlerMock).toHaveBeenCalledWith(mockArgv);
      expect(buildMock).toHaveBeenCalledWith({ ...newMockArgs, manifest: false, eval: true });
      expect(global.console.log).toHaveBeenCalledWith(`\nPlugin project successfully initiated!`);
    });
  });
});
