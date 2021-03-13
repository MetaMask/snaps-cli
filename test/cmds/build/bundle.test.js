// const browserify = require('browserify');
const { bundle } = require('../../../dist/src/cmds/build/bundle');
const bundleUtils = require('../../../dist/src/cmds/build/bundleUtils');
const miscUtils = require('../../../dist/src/utils/misc');

jest.mock('browserify', (_, __) => ({
  bundle: () => Promise.resolve(true),
}));
// jest.mock('browserify');
// const mockBrowserify = require('browserify');
// jest.createMockFromModule('browserify');
// jest.spyOn(brows, 'bundle').mockImplementation();

// jest.mock('init-package-json');
// const initPackageJson = require('init-package-json');

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
      //   mockBrowserify.mockImplementation((_, __) => ({
      //     bundle: () => Promise.resolve(true),
      //   }));
      //   jest
      //     .spyOn(browserify, () => ({
      //       bundle: () => Promise.resolve(true),
      //     }));
      //   const instance = browserify();
      //   await instance.bundle();
    //   jest.mock('browserify', (_, __) => ({
    //     __esModule: false,
    //     default: jest.fn(),
    //     bundle: (callback) => callback(Promise.resolve(true)),
    //   }));
      const createStreamMock = jest.spyOn(bundleUtils, 'createBundleStream').mockImplementation();
      jest.spyOn(miscUtils, 'writeError').mockImplementation();
      await bundle('src', 'dest', mockArgv);
      expect(createStreamMock).toHaveBeenCalled();
    });
  });
});
