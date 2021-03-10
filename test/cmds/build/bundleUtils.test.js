/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
/* eslint-disable jest/prefer-strict-equal */
const EventEmitter = require('events');
const fs = require('fs');
const { createBundleStream, closeBundleStream } = require('../../../dist/src/cmds/build/bundleUtils');
const miscUtils = require('../../../dist/src/utils/misc');

jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
}));

describe('bundleUtils', () => {

  //   describe('createBundleStream', () => {

  //     let mockStream;

  //     beforeEach(() => {
  //       jest.spyOn(fs, 'createWriteStream').mockImplementation(() => {
  //         mockStream = new EventEmitter();
  //         jest.spyOn(mockStream, 'on');
  //         return mockStream;
  //       });
  //     });

  //     afterEach(() => {
  //       jest.clearAllMocks();
  //       jest.restoreAllMocks();
  //     });

  //     it('writes error on error event', async () => {
  //       const mockWriteError = jest.spyOn(miscUtils, 'writeError').mockImplementation();
  //       createBundleStream('foo');
  //       const finishPromise = new Promise((resolve, _reject) => {
  //         mockStream.on('error', () => {
  //           expect(mockWriteError).toHaveBeenCalled();
  //           resolve();
  //         });
  //       });
  //       mockStream.emit('error');
  //       await finishPromise;
  //     });
  //   });

  describe('asyncPackageInit', () => {

    let mockStream;

    beforeEach(() => {
      mockStream = new EventEmitter();
      mockStream.end = () => undefined;
      jest.spyOn(mockStream, 'end');
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('emit end event', async () => {
      let mockWrite;
      const mockOptions = {};
      await closeBundleStream(mockWrite, 'foo', mockOptions);
      const finishPromise = new Promise((resolve, _reject) => {
        mockStream.end(() => {
          resolve();
        });
      });
      mockStream.emit('end');
      await finishPromise;
    });
  });

});
