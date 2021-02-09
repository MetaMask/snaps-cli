const readline = require('readline');
const { openPrompt, prompt, closePrompt } = require('../../dist/src/utils/readline');

jest.mock('readline');

describe('readline', () => {

  describe('openPrompt', () => {
    it('should open a prompt', () => {
      const mockCreateInterface = jest.spyOn(readline, 'createInterface');
      openPrompt();
      expect(mockCreateInterface).toHaveBeenCalled();
    });
  });

  describe('prompt', () => {
    it('should open a prompt, display message, and read in user input from stdin', () => {
      expect(prompt('this is a question')).toStrictEqual(Promise.resolve('answer'.trim()));
    });
  });

  describe('closePrompt', () => {
    it('should close a prompt', () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const mockClose = jest.spyOn(rl, 'close');
      closePrompt();
      expect(mockClose).toHaveBeenCalled();
    });
  });
});

