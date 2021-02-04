// const { cli } = require('../dist/src/cli');
// const { default: commands } = require('../dist/src/cmds');

// /**
//  * Gets a mock argv array for the cli function.
//  */
// const getMockArgv = (...args) => ['', '', ...args];

// /**
//  * Gets an array of mock yargs command object, and a map object of command
//  * names to their mock handlers.
//  */
// const getMockCommands = () => {
//   const mockCommands = [];
//   const mockHandlerMap = {};

//   commands.forEach((commandObj) => {
//     const mockCommandObj = {
//       ...commandObj,
//       handler: jest.fn(),
//     };
//     mockCommands.push(mockCommandObj);
//     mockHandlerMap[commandObj.command[0]] = mockCommandObj.handler;
//   });

//   return [mockCommands, mockHandlerMap];
// };

// describe('command line interface', () => {

//   let mockCommands;
//   let mockHandlerMap;

//   beforeEach(() => {
//     [mockCommands, mockHandlerMap] = getMockCommands();
//   });

//   describe('build', () => {
//     it('should work', () => {
//       cli(
//         getMockArgv('build'),
//         mockCommands,
//       );
//       expect(mockHandlerMap.build).toHaveBeenCalledWith('build');
//     });
//   });
// });
