import http from 'http';
import serveHandler from 'serve-handler';
import yargs from 'yargs';
import builders from '../../builders';
import { logError, validateDirPath } from '../../utils';
import { Argument } from '../../types/yargs';

module.exports.command = ['serve', 's'];
module.exports.desc = 'Locally serve Snap file(s) for testing';
module.exports.builder = (yarg: yargs.Argv) => {
  yarg
    .option('root', builders.root)
    .option('port', builders.port);
};
module.exports.handler = (argv: Argument) => serve(argv);

/**
 * Starts a local, static HTTP server on the given port with the given root
 * directory.
 *
 * @param {object} argv - arguments as an object generated by yargs
 * @param {string} argv.root - The root directory path string
 * @param {number} argv.port - The server port
 */
async function serve(argv: Argument) {

  const { port, root } = argv;

  await validateDirPath(root as string, true);

  console.log(`\nStarting server...`);

  const server = http.createServer(async (req, res) => {
    await serveHandler(req, res, {
      public: root as string,
    });
  });

  server.listen({ port }, () => {
    console.log(`Server listening on: http://localhost:${port}`);
  });

  server.on('request', (request) => {
    console.log(`Handling incoming request for: ${request.url}`);
  });

  server.on('error', (err) => {
    if ((err as any).code === 'EADDRINUSE') {
      logError(`Server error: Port ${port} already in use.`);
    } else {
      logError(`Server error: ${err.message}`, err);
    }
    process.exit(1);
  });

  server.on('close', () => {
    console.log('Server closed');
    process.exit(1);
  });
}
