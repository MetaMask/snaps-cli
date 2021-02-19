const http = require('http');
const { serve } = require('../../../dist/src/cmds/serve/serve');
const utils = require('../../../dist/src/utils/validate-fs');

const mockArgv = {
  _: ['serve'],
  verboseErrors: false,
  v: false,
  'verbose-errors': false,
  suppressWarnings: false,
  sw: false,
  'suppress-warnings': false,
  root: '.',
  r: '.',
  port: 8081,
  p: 8081,
  '$0': '/usr/local/bin/mm-snap',
};

describe('serve', () => {
  describe('Starts a local, static HTTP server on the given port with the given root directory.', () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('snapEval successfully executes and logs to console', async () => {
      const mockServerObj = {
        listen: () => console.log('Server listening on: http://localhost:8081'),
        on: jest.fn(),
      };
      jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(http, 'createServer').mockImplementation(() => mockServerObj);
      const validateDirPathMock = jest.spyOn(utils, 'validateDirPath').mockImplementation(() => true);
      await serve(mockArgv);
      expect(validateDirPathMock).toHaveBeenCalledTimes(1);
      expect(global.console.log).toHaveBeenCalledWith('\nStarting server...');
      expect(global.console.log).toHaveBeenCalledWith('Server listening on: http://localhost:8081');
    });
  });
});
