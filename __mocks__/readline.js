module.exports = {
  createInterface: jest.fn().mockReturnValue({
    // eslint-disable-next-line node/no-callback-literal
    question: jest.fn().mockImplementationOnce((_questionTest, cb) => {
      cb(Promise.resolve('answer'));
    }),
    close: jest.fn().mockImplementationOnce(() => undefined),
  }),
};
