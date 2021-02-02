import { promises as filesystem, createWriteStream } from 'fs';
import browserify from 'browserify';
import stripComments from 'strip-comments';
import { logError } from '../../utils';
import { YargsArgs, Option } from '../../types/yargs';

export function bundle(src: string, dest: string, argv: YargsArgs): Promise<boolean> {

  const { sourceMaps: debug } = argv;

  return new Promise((resolve, _reject) => {

    const bundleStream = createBundleStream(dest);

    browserify(src, { debug })

      // TODO: Just give up on babel, which we may not even need?
      // This creates globals that SES doesn't like
      // .transform('babelify', {
      //   presets: ['@babel/preset-env'],
      // })
      .bundle(async (bundleError, bundleBuffer: Buffer) => {

        if (bundleError) {
          await writeError('Build error:', bundleError.message, bundleError);
        }

        // TODO: minification, probably?
        // const { error, code } = terser.minify(bundle.toString())
        // if (error) {
        //   await writeError('Build error:', error.message, error, dest)
        // }
        // closeBundleStream(bundleStream, code.toString())

        closeBundleStream(bundleStream, bundleBuffer ? bundleBuffer.toString() : null, { stripComments: argv.stripComments })
          .then(() => {
            if (bundleBuffer) {
              console.log(`Build success: '${src}' bundled as '${dest}'!`);
            }
            resolve(true);
          })
          .catch(async (closeError) => await writeError('Write error:', closeError.message, closeError, dest));
      });
  });
}

function createBundleStream(dest: string): NodeJS.WritableStream {
  const stream = createWriteStream(dest, {
    autoClose: false,
    encoding: 'utf8',
  });
  stream.on('error', async (err) => {
    await writeError('Write error:', err.message, err, dest);
  });
  return stream;
}

async function closeBundleStream(stream: NodeJS.WritableStream, bundleString: string | null, options: Option): Promise<void> {
  stream.end(postProcess(bundleString, options) as string);
}

function postProcess(bundleString: string | null, options: Option): string | null {

  if (typeof bundleString !== 'string') {
    return null;
  }

  let processedString = bundleString.trim();

  if (options.stripComments) {
    processedString = stripComments(processedString);
  }

  // .import( => ["import"](
  processedString = processedString.replace(/\.import\(/gu, '["import"](');

  // stuff.eval(otherStuff) => (1, stuff.eval)(otherStuff)
  processedString = processedString.replace(
    /((?:\b[\w\d]*[\])]?\.)+eval)(\([^)]*\))/gu,
    '(1, $1)$2',
  );

  // if we don't do the above, the below causes syntax errors if it encounters
  // things of the form: "something.eval(stuff)"
  // eval(stuff) => (1, eval)(stuff)
  processedString = processedString.replace(/(\b)(eval)(\([^)]*\))/gu, '$1(1, $2)$3');

  // SES interprets syntactically valid JavaScript '<!--' and '-->' as illegal
  // HTML comment syntax.
  // '<!--' => '<! --' && '-->' => '-- >'
  processedString = processedString.replace(/<!--/gu, '< !--');
  processedString = processedString.replace(/-->/gu, '-- >');

  // Browserify provides the Buffer global as an argument to modules that use
  // it, but this does not work in SES. Since we pass in Buffer as an endowment,
  // we can simply remove the argument.
  processedString = processedString.replace(/^\(function \(Buffer\)\{$/gmu, '(function (){');

  if (processedString.length === 0) {
    throw new Error(
      `Bundled code is empty after postprocessing.`,
    );
  }

  // handle some cases by declaring missing globals
  // Babel regeneratorRuntime
  if (processedString.indexOf('regeneratorRuntime') !== -1) {
    processedString = `var regeneratorRuntime;\n${processedString}`;
  }

  return processedString;
}

async function writeError(prefix: string, msg: string, err: Error, destFilePath?: string): Promise<void> {
  let processedPrefix = prefix;
  if (!prefix.endsWith(' ')) {
    processedPrefix += ' ';
  }

  logError(processedPrefix + msg, err);
  try {
    if (destFilePath) {
      await filesystem.unlink(destFilePath);
    }
  } catch (unlinkError) {
    logError(`${processedPrefix}Failed to unlink mangled file.`, unlinkError);
  }

  // unless the watcher is active, exit
  if (!global.snaps.isWatching) {
    process.exit(1);
  }
}
