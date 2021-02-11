import readline from 'readline';

let _readlineInterface: readline.Interface;

interface promptNamedParameters {
  question: string;
  defaultValue?: string;
  shouldClose?: boolean;
  readlineInterface?: readline.Interface;
}

export function openPrompt(): void {
  _readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function prompt({ question, defaultValue, shouldClose, readlineInterface = _readlineInterface }: promptNamedParameters): Promise<string> {
  if (readlineInterface === undefined) {
    openPrompt();
    // eslint-disable-next-line no-param-reassign
    readlineInterface = _readlineInterface;
  }
  return new Promise((resolve, _reject) => {
    let queryString = `${question} `;
    if (defaultValue) {
      queryString += `(${defaultValue}) `;
    }
    readlineInterface.question(queryString, (answer: string) => {
      if (!answer || !answer.trim()) {
        if (defaultValue !== undefined) {
          resolve(defaultValue);
        }
      }
      resolve(answer.trim());
      if (shouldClose) {
        readlineInterface.close();
      }
    });
  });
}

export function closePrompt(readlineInterface = _readlineInterface): void {
  if (readlineInterface) {
    readlineInterface.close();
  }
}
