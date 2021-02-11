const { promises: fs } = require('fs');
const pathUtils = require('path');
const rimraf = require('rimraf');
const { isFile, isDirectory } = require('../../dist/src/utils/fs');

const BASE_PATH = pathUtils.join(__dirname, 'fs-sandbox');

function getPath(path) {
  return path ? pathUtils.join(BASE_PATH, path) : BASE_PATH;
}

async function createFile(fileName, data = 'foo') {
  await fs.writeFile(getPath(fileName), data);
}

async function createDir(dirName) {
  await fs.mkdir(getPath(dirName));
}

const isFileRegEx = /\w+\.\w+$/u;

async function createTestFiles(...paths) {
  await createDir();
  for (const path of paths) {
    if (isFileRegEx.test(path)) {
      await createFile(path);
    } else {
      await createDir(path);
    }
  }
}

function cleanupTestFiles() {
  rimraf.sync(getPath());
}

describe('file system checks', () => {
  beforeEach(async () => {
    await createTestFiles(
      'file.txt',
      'empty-dir',
      'dir',
      'dir/file.txt',
    );
  });

  afterEach(() => {
    cleanupTestFiles();
  });

  describe('isFile', () => {
    it('checks whether the given path string resolves to an existing file', async () => {
      let result = await isFile(getPath('file.txt'));
      expect(result).toStrictEqual(true);

      result = await isFile(getPath('dir/file.txt'));
      expect(result).toStrictEqual(true);

      result = await isFile(getPath('dir'));
      expect(result).toStrictEqual(false);

      result = await isFile(getPath('empty-dir'));
      expect(result).toStrictEqual(false);

      result = await isFile(getPath('wrong/path'));
      expect(result).toStrictEqual(false);
    });
  });

  describe('isDirectory', () => {

    afterEach(() => {
      jest.restoreAllMocks();
      delete global.snaps;
    });

    it('checks whether the given path string resolves to an existing directory', async () => {
      const result = await isDirectory('wrong/path/', false);
      expect(result).toStrictEqual(false);
    });

    it('mkdir error is handled correctly', async () => {

      global.snaps = {
        verboseErrors: false,
        suppressWarnings: false,
        isWatching: false,
      };

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined);
      jest.spyOn(console, 'error').mockImplementation();

      await isDirectory('wrong/path/', true);
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(global.console.error).toHaveBeenCalledWith('Directory \'wrong/path/\' could not be created.');

      delete global.snaps;

    });

    it('makes a directory when given a valid directory path that does not exist', async () => {

      jest.spyOn(fs, 'mkdir')
        .mockImplementationOnce(async (path) => {
          await createDir(path);
        });
      const result = await isDirectory('new-dir', true);
      expect(result).toStrictEqual(true);
    });

  });
});
