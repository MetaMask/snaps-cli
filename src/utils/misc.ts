import { Arguments } from 'yargs';

export const permRequestKeys = [
  '@context',
  'id',
  'parentCapability',
  'invoker',
  'date',
  'caveats',
  'proof',
];

export const CONFIG_PATHS = [
  'snap.config.json',
];

/**
 * Sets global variable snaps which tracks user settings:
 * watch mode activation, verbose errors messages, and whether to suppress warnings.
 *
 * @param {Argument} argv - arguments as an object generated by yargs
 */
export function setSnapGlobals(argv: Arguments<{
  verboseErrors: unknown;
  suppressWarnings: unknown;
}>) {
  if (['w', 'watch'].includes(argv._[0] as string)) {
    global.snaps.isWatching = true;
  } else {
    global.snaps.isWatching = false;
  }
  if (Object.prototype.hasOwnProperty.call(argv, 'verboseErrors')) {
    global.snaps.verboseErrors = Boolean(argv.verboseErrors);
  }
  if (Object.prototype.hasOwnProperty.call(argv, 'suppressWarnings')) {
    global.snaps.suppressWarnings = Boolean(argv.suppressWarnings);
  }
}

/**
   * Sanitizes inputs. Currently normalizes paths.
   *
   * @param {Argument} argv - arguments as an object generated by yargs
   */
export function sanitizeInputs(argv: Arguments) {
  Object.keys(argv).forEach((key) => {
    if (typeof argv[key] === 'string') {
      if (argv[key] === './') {
        argv[key] = '.';
      } else if ((argv[key] as string).startsWith('./')) {
        argv[key] = (argv[key] as string).substring(2);
      }
    }
  });
}

/**
 * Logs an error message to console. Logs original error if it exists and
 * the verboseErrors global is true.
 *
 * @param msg - The error message
 * @param err - The original error
 */
export function logError(msg: string, err?: Error): void {
  console.error(msg);
  if (err && global.snaps.verboseErrors) {
    console.error(err);
  }
}

/**
   * Logs a warning message to console.
   *
   * @param msg - The warning message
   */
export function logWarning(msg: string, error?: Error): void {
  if (msg && !global.snaps.suppressWarnings) {
    console.warn(msg);
    if (error && global.snaps.verboseErrors) {
      console.error(error);
    }
  }
}

/**
 * Trims leading and trailing periods "." and forward slashes "/" from the
 * given path string.
 *
 * @param pathString - The path string to trim.
 * @returns - The trimmed path string.
 */
export function trimPathString(pathString: string): string {
  return pathString.replace(/^[./]+|[./]+$/gu, '');
}
