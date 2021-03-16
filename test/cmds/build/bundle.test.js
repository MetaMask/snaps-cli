const mockBrowserify = require('browserify');
const { bundle } = require('../../../dist/src/cmds/build/bundle');
const bundleUtils = require('../../../dist/src/cmds/build/bundleUtils');
const miscUtils = require('../../../dist/src/utils/misc');

jest.mock('browserify');

describe('bundle', () => {
  describe('bundle', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    global.snaps = {
      verboseErrors: false,
      isWatching: false,
    };

    it('processes yargs properties correctly', async () => {
      const mockArgv = {
        sourceMaps: true,
      };
      mockBrowserify.mockImplementation((_, __) => ({
        bundle: () => Promise.resolve(true),
      }));
      const createStreamMock = jest.spyOn(bundleUtils, 'createBundleStream').mockImplementation();
      jest.spyOn(miscUtils, 'writeError').mockImplementation();
      await bundle('src', 'dest', mockArgv);
      expect(createStreamMock).toHaveBeenCalled();
    });
  });
});
