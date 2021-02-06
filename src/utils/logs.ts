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
