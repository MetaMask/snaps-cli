const { promises: fs } = require('fs');
const pathUtils = require('path');
const rimraf = require('rimraf');
const { isFile, isDirectory } = require('../dist/src/utils');

const FS_TEST_DIR = 'fs-sandbox';

function getPath(path) {
  return path
    ? pathUtils.join(__dirname, FS_TEST_DIR, path)
    : pathUtils.join(__dirname, FS_TEST_DIR);
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

describe('isFile', () => {

  beforeEach(async () => {
    await createTestFiles(
      'file.txt',
      'empty-dir',
      'dir',
      'dir/file.txt',
    );
  });

  afterEach(async () => {
    cleanupTestFiles();
  });

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

  // it('checks whether the given path string resolves to an existing directory', async () => {
  //   let result = await isDirectory('wrong/path/', false);
  //   expect(result).toStrictEqual(false);

  //   result = await isDirectory('path/to/dir/file.txt', false);
  //   expect(result).toStrictEqual(false);

  //   console.log('DIRNAME', __dirname)

  //   // result = await isDirectory('path/to/dir/empty-dir', false);
  //   // expect(result).toStrictEqual(true);

  //   // result = await isDirectory('path/to/dir', false);
  //   // expect(result).toStrictEqual(true);

  //   // expect(await isDirectory('hthnthnt', false)).toThrow('ENOENT');

  //   // eslint-disable-next-line no-empty-function
  //   // const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  //   // result = await isDirectory('', true);
  //   // expect(result).toStrictEqual(false);
  //   // expect(mockExit).toHaveBeenCalledWith(1);

  //   // const spy = jest.spyOn(fs, 'mkdir');
  //   // result = await isDirectory('hnthntnht', true);
  //   // expect(result).toStrictEqual(true);
  //   // expect(spy).toHaveBeenCalled();

  // });

});
