const { init } = require('../../dist/src/cmds/init/init');
const initializeModule = require('../../dist/src/cmds/init/initialize');
const buildModule = require('../../dist/src/cmds/build');

describe('init', () => {
  describe('init', () => {

    afterEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('console logs if successful', async () => {
      const initHandlerMock = jest.spyOn(initializeModule, 'initHandler').mockImplementation(() => {});
      const buildMock = jest.spyOn(buildModule, 'build').mockImplementation();
      jest.spyOn(console, 'log').mockImplementation();

      await init({});
      expect(initHandlerMock).toHaveBeenCalledWith({});
      expect(buildMock).toHaveBeenCalledWith({ manifest: false, eval: true });
      expect(global.console.log).toHaveBeenCalledTimes(1);
    });
  });
});
