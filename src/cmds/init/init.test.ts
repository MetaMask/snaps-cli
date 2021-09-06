import * as buildModule from '../build';
import * as initHandlerModule from './initHandler';
import * as initModule from '.';

describe('init module', () => {
  it('console logs if successful', async () => {
    const mockArgv = { foo: 'bar' };
    const initHandlerMock = jest
      .spyOn(initHandlerModule, 'initHandler')
      .mockImplementation(() => mockArgv as any);
    const buildMock = jest.spyOn(buildModule, 'build').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();

    // TODO: Fix index.ts exports
    await (initModule as any).handler({ ...(mockArgv as any) });
    expect(initHandlerMock).toHaveBeenCalledWith(mockArgv);
    expect(buildMock).toHaveBeenCalledWith({
      foo: 'bar',
      manifest: false,
      eval: true,
    });
    expect(global.console.log).toHaveBeenCalledTimes(2);
  });
});
