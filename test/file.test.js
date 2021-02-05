const fs = require('fs');
const mock = require('mock-fs');
const { isFile, isDirectory } = require('../dist/src/utils');

mock({
  'path/to/fake/dir': {
    'some-file.txt': 'file content here',
    'empty-dir': {/** empty directory */},
  },
  'nt/thnt/file.txt': 'file content here',
});

describe('isFile', () => {

  afterEach(mock.restore);

  // it('checks whether the given path string resolves to an existing file', async () => {
  //   let data = await isFile('path/to/file.txt');
  //   expect(data).toStrictEqual(true);
  //   data = await isFile('path/file.txt');
  //   expect(data).toStrictEqual(false);
  // });

  it('checks whether the given path string resolves to an existing directory', async () => {
    let data = await isDirectory('path/to/', false);
    expect(data).toStrictEqual(true);

    data = await isDirectory('shnthnt', false);
    expect(data).toStrictEqual(false);

    // expect(await isDirectory('hthnthnt', false)).toThrow('ENOENT');

    // eslint-disable-next-line no-empty-function
    // const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    // data = await isDirectory('', true);
    // expect(data).toStrictEqual(false);
    // expect(mockExit).toHaveBeenCalledWith(1);

    // const spy = jest.spyOn(fs, 'mkdir');
    // data = await isDirectory('hnthntnht', true);
    // expect(data).toStrictEqual(true);
    // expect(spy).toHaveBeenCalled();

  });

});
