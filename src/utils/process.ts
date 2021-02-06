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
