import { promises as fs } from 'fs';
import { logError } from './misc';

/**
 * Checks whether the given path string resolves to an existing directory, and
 * optionally creates the directory if it doesn't exist.
 *
 * @param pathString - The path string to check
 * @param createDir - Whether to create the directory if it doesn't exist
 * @returns - Whether the given path is an existing directory
 */
export async function isDirectory(pathString: string, createDir: boolean): Promise<boolean> {
  try {
    const stats = await fs.stat(pathString);
    console.log('1');
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      if (!createDir) {
        console.log('2');
        return false;
      }
      try {
        await fs.mkdir(pathString);
        console.log('3');
        return true;
      } catch (mkdirError) {
        console.log('4');
        logError(`Directory '${pathString}' could not be created.`, mkdirError);
        process.exit(1);
      }
    }
    console.log('5');
    return false;
  }
}

/**
   * Checks whether the given path string resolves to an existing file.
   *
   * @param {string} pathString - The path string to check
   * @returns {boolean} - Whether the given path is an existing file
   */
export async function isFile(pathString: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pathString);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}
