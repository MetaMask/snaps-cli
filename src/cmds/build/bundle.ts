import browserify from 'browserify';
import { YargsArgs } from '../../types/yargs';
import { writeError } from '../../utils/misc';
import { createBundleStream, closeBundleStream } from './bundleUtils';

/**
 * Builds a Snap bundle JSON file from its JavaScript source.
 *
 * @param src - The source file path
 * @param dest - The destination file path
 * @param argv - arguments as an object generated by yargs
 * @param argv.sourceMaps - Whether to output sourcemaps
 * @param argv.stripComments - Whether to remove comments from code
 */
export function bundle(
  src: string,
  dest: string,
  argv: YargsArgs,
): Promise<boolean> {
  const { sourceMaps: debug } = argv;

  return new Promise((resolve, _reject) => {
    const bundleStream = createBundleStream(dest);
    browserify(src, { debug }).bundle(
      async (bundleError, bundleBuffer: Buffer) =>
        await canCloseStream({
          bundleError,
          bundleBuffer,
          bundleStream,
          src,
          dest,
          resolve,
          argv,
        }),
    );
  });
}

interface CloseStreamArgs {
  bundleError: any;
  bundleBuffer: Buffer;
  bundleStream: NodeJS.WritableStream;
  src: string;
  dest: string;
  resolve: any;
  argv: YargsArgs;
}

export async function canCloseStream({
  bundleError,
  bundleBuffer,
  bundleStream,
  src,
  dest,
  resolve,
  argv,
}: CloseStreamArgs) {
  if (bundleError) {
    await writeError('Build error:', bundleError.message, bundleError);
  }

  try {
    closeBundleStream(
      bundleStream,
      bundleBuffer ? bundleBuffer.toString() : null,
      { stripComments: argv.stripComments },
    );
    if (bundleBuffer) {
      console.log(`Build success: '${src}' bundled as '${dest}'!`);
    }
    resolve(true);
  } catch (closeError) {
    await writeError('Write error:', closeError.message, closeError, dest);
  }
}
