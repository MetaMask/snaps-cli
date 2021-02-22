const { cli } = require('../dist/src/cli');
const { default: commands } = require('../dist/src/cmds');

/**
 * Gets a mock argv array for the cli function.
 */
const getMockArgv = (...args) => ['', '', ...args];

/**
 * Gets an array of mock yargs command object, and a map object of command
 * names to their mock handlers.
 */
const getMockCommands = () => {
  const mockCommands = [];
  const mockHandlerMap = {};

  commands.forEach((commandObj) => {
    const mockCommandObj = {
      ...commandObj,
      handler: jest.fn(),
    };
    mockCommands.push(mockCommandObj);
    mockHandlerMap[commandObj.command[0]] = mockCommandObj.handler;
  });

  return [mockCommands, mockHandlerMap];
};

global.snaps = {
  verboseErrors: false,
  suppressWarnings: false,
  isWatching: false,
};

describe('command line interface', () => {
  let mockCommands;
  let mockHandlerMap;

  beforeEach(() => {
    [mockCommands, mockHandlerMap] = getMockCommands();
  });

  describe('build', () => {
    it('should work', () => {
      cli(
        getMockArgv('build'),
        mockCommands,
      );
      expect(mockHandlerMap.build).toHaveBeenCalled();
      validateCommandHandlerCall(mockHandlerMap.build, {
        verboseErrors: false,
        suppressWarnings: false,
        src: 'index.js',
        dist: 'dist',
        outfileName: 'bundle.js',
        sourceMaps: false,
        stripComments: false,
        port: 8081,
        eval: true,
        manifest: true,
        populate: true,
      });
    });
  });

  describe('eval', () => {
    it('should work', () => {
      cli(
        getMockArgv('eval'),
        mockCommands,
      );
      expect(mockHandlerMap.eval).toHaveBeenCalled();
      validateCommandHandlerCall(mockHandlerMap.eval, {
        bundle: 'dist/bundle.js',
      });
    });
  });

  describe('init', () => {
    it('should work', () => {
      cli(
        getMockArgv('init'),
        mockCommands,
      );
      expect(mockHandlerMap.init).toHaveBeenCalled();
      validateCommandHandlerCall(mockHandlerMap.init, {
        src: 'index.js',
        dist: 'dist',
        outfileName: 'bundle.js',
        port: 8081,
      });
    });
  });

  describe('manifest', () => {
    it('should work', () => {
      cli(
        getMockArgv('manifest'),
        mockCommands,
      );
      expect(mockHandlerMap.manifest).toHaveBeenCalled();
      validateCommandHandlerCall(mockHandlerMap.manifest, {
        dist: 'dist',
        port: 8081,
        populate: true,
      });
    });
  });

  describe('serve', () => {
    it('should work', () => {
      cli(
        getMockArgv('serve'),
        mockCommands,
      );
      expect(mockHandlerMap.serve).toHaveBeenCalled();
      validateCommandHandlerCall(mockHandlerMap.serve, {
        root: '.',
        port: 8081,
      });
    });
  });

  describe('watch', () => {
    it('should work', () => {
      cli(
        getMockArgv('watch'),
        mockCommands,
      );
      expect(mockHandlerMap.watch).toHaveBeenCalled();
      validateCommandHandlerCall(mockHandlerMap.watch, {
        src: 'index.js',
        dist: 'dist',
        outfileName: 'bundle.js',
        sourceMaps: false,
        stripComments: false,
      });
    });
  });
});

function validateCommandHandlerCall(mockHandler, expectedValues) {
  const { calls } = mockHandler.mock;
  expect(calls).toHaveLength(1);
  expect(calls[0]).toHaveLength(1);

  const argv = calls[0][0];

  for (const [key, value] of Object.entries(expectedValues)) {
    expect(argv[key]).toStrictEqual(value);
  }
}
