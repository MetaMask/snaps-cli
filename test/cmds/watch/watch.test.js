// const EventEmitter = require('events');
// const chokidar = require('chokidar');
// const { watch } = require('../../../dist/src/cmds/watch/watch');
// const { build } = require('../../../dist/src/cmds/build/bundle');
// const fsUtils = require('../../../dist/src/utils/validate-fs');

// const mockArgv = {
//   _: ['watch'],
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
//   '$0': '/usr/local/bin/mm-snap',
// };

// describe('watch', () => {
//   describe('Watch a directory and its subdirectories for changes, and build when files are added or changed.', () => {

//     afterEach(() => {
//       jest.restoreAllMocks();
//     });

//     let watcherEmitter;

//     const chokidarMock = jest.spyOn(chokidar, 'watch').mockImplementation(() => {
//       watcherEmitter = new EventEmitter();
//       watcherEmitter.add = () => undefined;
//       jest.spyOn(watcherEmitter, 'on');
//       jest.spyOn(watcherEmitter, 'add');
//       return watcherEmitter;
//     });

//     it('watcher handles "changed" event correctly', async () => {
//         await watch(mockArgv) // the function under test
//         const finishPromise = new Promise((resolve, _) => {
//           watcherEmitter.on('change', () => {
//             expect(bundleMock).toHaveBeenCalledWith(...);
//             resolve();
//           })
//         })
//         watcherEmitter.emit('change');
//         await finishPromise;
//       })

//     it('watcher handles "changed" event correctly', async () => {
//       await watch(mockArgv); // the function under test
//       watcherEmitter.on('change', () => {
//         expect(bundleMock).toHaveBeenCalledWith('thneat');
//       });
//       watcherEmitter.emit('change');
//     });

    // it('successfully processes arguments from yargs', async () => {
    //   let watcherEmitter;
    //   jest.spyOn(console, 'log').mockImplementation();
    //   const validateDirPathMock = jest.spyOn(fsUtils, 'validateDirPath').mockImplementation(() => true);
    //   const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);
    //   const validateOutfileNameMock = jest.spyOn(fsUtils, 'validateOutfileName').mockImplementation(() => true);
    //   const getOutfilePathMock = jest.spyOn(fsUtils, 'getOutfilePath').mockImplementation(() => 'dist/bundle.js');
    //   const bundleMock = jest.spyOn(build, 'bundle').mockImplementation(() => true);
    //   const chokidarMock = jest.spyOn(chokidar, 'watch').mockImplementation(() => {
    //     watcherEmitter = new EventEmitter();
    //     watcherEmitter.add = () => undefined;
    //     jest.spyOn(watcherEmitter, 'on');
    //     jest.spyOn(watcherEmitter, 'add');
    //     return watcherEmitter;
    //   });
    //   await watch(mockArgv);
    //   expect(validateDirPathMock).toHaveBeenCalledTimes(1);
    //   expect(validateFilePathMock).toHaveBeenCalledTimes(1);
    //   expect(validateOutfileNameMock).toHaveBeenCalledTimes(1);
    //   expect(getOutfilePathMock).toHaveBeenCalledTimes(1);
    //   expect(chokidarMock).toHaveBeenCalledWith(8081, {
    //     ignoreInitial: true,
    //     ignored: [
    //       '**/node_modules/**',
    //       `**/dist/**`,
    //       `**/test/**`,
    //       `**/tests/**`,
    //       (str) => str !== '.' && str.startsWith('.'),
    //     ],
    //   });
    //   expect(global.console.log).toHaveBeenCalledWith('Server listening on: http://localhost:8081');
    // });

    // it('successfully processes arguments from yargs', async () => {
    //   const mockServerObj = {
    //     listen: () => console.log('Server listening on: http://localhost:8081'),
    //     on: jest.fn(),
    //   };
    //   jest.spyOn(console, 'log').mockImplementation();
    //   jest.spyOn(http, 'createServer').mockImplementation(() => mockServerObj);
    //   const validateDirPathMock = jest.spyOn(fsUtils, 'validateDirPath').mockImplementation(() => true);
    //   const validateFilePathMock = jest.spyOn(fsUtils, 'validateFilePath').mockImplementation(() => true);
    //   const validateOutfileNameMock = jest.spyOn(fsUtils, 'validateOutfileName').mockImplementation(() => true);
    //   await watch(mockArgv);
    //   expect(validateDirPathMock).toHaveBeenCalledTimes(1);
    //   expect(validateFilePathMock).toHaveBeenCalledTimes(1);
    //   expect(validateOutfileNameMock).toHaveBeenCalledTimes(1);
    //   expect(global.console.log).toHaveBeenCalledWith('\nStarting server...');
    //   expect(global.console.log).toHaveBeenCalledWith('Server listening on: http://localhost:8081');
    // });
//   });
// });
