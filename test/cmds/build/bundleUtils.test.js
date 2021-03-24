const EventEmitter = require('events');
const fs = require('fs');
const {
  createBundleStream,
  closeBundleStream,
  postProcess,
} = require('../../../dist/src/cmds/build/bundleUtils');
const miscUtils = require('../../../dist/src/utils/misc');

jest.mock('fs', () => ({
  createWriteStream: jest.fn(),
}));

describe('bundleUtils', () => {
  describe('createBundleStream', () => {
    let mockStream;

    beforeEach(() => {
      jest.spyOn(fs, 'createWriteStream').mockImplementation(() => {
        mockStream = new EventEmitter();
        mockStream.end = () => undefined;
        jest.spyOn(mockStream, 'on');
        jest.spyOn(mockStream, 'end');
        return mockStream;
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('writes error on error event', async () => {
      const mockWriteError = jest
        .spyOn(miscUtils, 'writeError')
        .mockImplementation();
      createBundleStream('foo');
      const finishPromise = new Promise((resolve, _reject) => {
        mockStream.on('error', () => {
          expect(mockWriteError).toHaveBeenCalled();
          resolve();
        });
      });
      mockStream.emit('error', new Error('error'));
      await finishPromise;
    });
  });

  describe('closeBundleStream', () => {
    let mockStream;

    beforeEach(() => {
      jest.spyOn(fs, 'createWriteStream').mockImplementation(() => {
        mockStream = new EventEmitter();
        mockStream.end = () => undefined;
        jest.spyOn(mockStream, 'on');
        jest.spyOn(mockStream, 'end');
        return mockStream;
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('closes stream with bundleString', async () => {
      const mockWritableStream = fs.createWriteStream();
      await closeBundleStream(mockWritableStream, 'foo', false);
      const finishPromise = new Promise((resolve, _reject) => {
        expect(mockWritableStream.end).toHaveBeenCalledWith('foo');
        resolve();
      });
      await finishPromise;
    });

    it('if bundleString is null, closes stream with empty line', async () => {
      const mockWritableStream = fs.createWriteStream();
      await closeBundleStream(mockWritableStream, null, false);
      const finishPromise = new Promise((resolve, _reject) => {
        expect(mockWritableStream.end).toHaveBeenCalledWith(null);
        resolve();
      });
      await finishPromise;
    });
  });
  describe('postProcess', () => {
    it('trims the string', async () => {
      expect(postProcess(' trimMe ', { stripComments: true })).toStrictEqual(
        'trimMe',
      );
    });

    it('processes options correctly', async () => {
      expect(
        postProcess('/* delete me */postProcessMe', { stripComments: true }),
      ).toStrictEqual('postProcessMe');
    });
  });
});
