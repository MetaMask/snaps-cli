// /* eslint-disable import/order */
// const { bundle } = require('../../../dist/src/cmds/build/bundle');
// const bundleUtils = require('../../../dist/src/cmds/build/bundleUtils');
// const miscUtils = require('../../../dist/src/utils/misc');
// const browserify = require('browserify');

// const mockBrowserify = jest.createMockFromModule('browserify');
// // eslint-disable-next-line jest/prefer-spy-on
// mockBrowserify.bundle = jest.fn(() => resolve(true));

// describe('bundle', () => {
//   describe('bundle', () => {

//     afterEach(() => {
//       jest.clearAllMocks();
//       jest.restoreAllMocks();
//     });

//     global.snaps = {
//       verboseErrors: false,
//     };

//     it('processes yargs properties correctly', async () => {
//       const mockArgv = {
//         sourceMaps: true,
//       };
//       jest.spyOn(bundleUtils, 'closeBundleStream').mockImplementation();
//       jest.spyOn(miscUtils, 'writeError').mockImplementation();
//       const bundlePromise = bundle('src', 'dest', mockArgv);
//       await bundlePromise;
//       expect(mockBrowserify.bundle).toHaveBeenCalled();
//     });
//   });
// });

// // const mockCreateBundleStream = jest.spyOn(bundleUtils, 'createBundleStream').mockImplementation();
// //       const mockWriteError = jest.spyOn(miscUtils, 'writeError').mockImplementation();
