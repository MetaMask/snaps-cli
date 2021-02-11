const readline = require('readline');
const { openPrompt, prompt, closePrompt } = require('../../dist/src/utils/readline');

jest.mock('readline', () => {
  return { createInterface: jest.fn() };
});

describe('readline', () => {

  afterAll(() => {
    jest.unmock('readline');
    jest.restoreAllMocks();
  });

  describe('openPrompt', () => {
    it('should open a prompt', () => {
      const createInterfaceSpy = jest.spyOn(readline, 'createInterface');
      openPrompt();
      expect(createInterfaceSpy).toHaveBeenCalled();
    });
  });

  describe('prompt', () => {

    let questionMock;

    afterEach(() => {
      questionMock.mockRestore();
      questionMock = null;
    });

    it('should open a prompt, read in user input from stdin, and return the trimmed input', async () => {
      questionMock = jest.fn((_, cb) => cb('answer '));
      const promptResult = await prompt({
        question: 'question',
        readlineInterface: { question: questionMock },
      });
      expect(promptResult).toStrictEqual('answer');
    });

    it('if the user fails to provide an input, the default should be used', async () => {
      questionMock = jest.fn((_, cb) => cb(''));
      const promptResult = await prompt({
        question: 'question',
        defaultValue: 'default',
        readlineInterface: { question: questionMock },
      });
      expect(promptResult).toStrictEqual('default');
    });
  });

  describe('closePrompt', () => {
    it('should close the readline interface', () => {
      const closeMock = jest.fn();
      closePrompt({ close: closeMock });
      expect(closeMock).toHaveBeenCalled();
    });
  });
});
