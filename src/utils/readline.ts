import readline from 'readline';

let _readlineInterface: readline.Interface;

export function openPrompt(): void {
  _readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function prompt(question: string, def?: string, shouldClose?: boolean, readlineInterface = _readlineInterface): Promise<string> {
  if (readlineInterface === undefined) {
    openPrompt();
    // eslint-disable-next-line no-param-reassign
    readlineInterface = _readlineInterface;
  }
  return new Promise((resolve, _reject) => {
    let queryString = `${question} `;
    if (def) {
      queryString += `(${def}) `;
    }
    readlineInterface.question(queryString, (answer: string) => {
      if (!answer || !answer.trim()) {
        if (def !== undefined) {
          resolve(def);
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
