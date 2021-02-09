const readline = require('readline');
const { openPrompt, prompt, closePrompt } = require('../../dist/src/utils/readline');

jest.mock('readline', () => {
  return { createInterface: jest.fn() };
});

describe('readline', () => {

  afterAll(() => {
    jest.unmock('readline');
  });

  describe('openPrompt', () => {
    it('should open a prompt', () => {
      const createInterfaceSpy = jest.spyOn(readline, 'createInterface');
      openPrompt();
      expect(createInterfaceSpy).toHaveBeenCalled();
    });
  });

  describe('prompt', () => {
    it('should open a prompt, display message, and read in user input from stdin', async () => {
      const questionMock = jest.fn((_, cb) => cb('answer '));

      const promptResult = await prompt('question', undefined, undefined, { question: questionMock });
      // const promptResult = await prompt({
      //   question: 'question',
      //   readlineInterface: { question: questionMock },
      // })
      expect(promptResult).toStrictEqual('answer');
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
