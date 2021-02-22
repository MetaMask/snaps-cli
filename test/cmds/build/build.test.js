// const { build } = require('../../../dist/src/cmds/build/bundle');
// const { utils } = require('../../../dist/src/utils/validate-fs');

// const mockArgv = {
//   _: ['build'],
//   verboseErrors: false,
//   v: false,
//   'verbose-errors': false,
//   suppressWarnings: false,
//   sw: false,
//   'suppress-warnings': false,
//   src: 'index.js',
//   s: 'index.js',
//   dist: 'dist',
//   d: 'dist',
//   outfileName: 'bundle.js',
//   n: 'bundle.js',
//   'outfile-name': 'bundle.js',
//   sourceMaps: false,
//   'source-maps': false,
//   stripComments: false,
//   strip: false,
//   'strip-comments': false,
//   port: 8081,
//   p: 8081,
//   eval: true,
//   e: true,
//   manifest: true,
//   m: true,
//   populate: true,
//   environment: 'worker',
//   env: 'worker',
//   '$0': '/usr/local/bin/mm-snap',
//   bundle: 'dist/bundle.js',
// };

// describe('bundle and build', () => {
//   describe('build function', () => {

//     afterEach(() => {
//       jest.restoreAllMocks();
//     });

//     it('snapEval successfully executes and logs to console', async () => {
//       const validateOutfileNameMock = jest.spyOn(utils, 'validateOutfileName');
//       await build(mockArgv);
//       expect(validateOutfileNameMock).toHaveBeenCalledTimes(1);
//     });
//   });
// });
