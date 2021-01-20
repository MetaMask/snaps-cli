const { parentPort } = require('worker_threads');
const { readFileSync } = require('fs');
const crypto = require('crypto');

const lockdown = require('ses/lockdown');

lockdown({
  mathTaming: 'unsafe',
  errorTaming: 'unsafe',
});

parentPort.on('message', (message) => {

  const { pluginFilePath } = message;

  const c = new Compartment(getMockApi());
  // Wrap the IIFE in an arrow function, because mocking the wallet is iffy
  c.evaluate(
    // '() => ' + readFileSync(pluginFilePath, 'utf8')
    readFileSync(pluginFilePath, 'utf8'),
  );
  // eslint-disable-next-line node/no-process-exit
  setTimeout(() => process.exit(0), 1000); // Hacky McHack
});

function getMockApi() {
  return {
    console,
    wallet: {
      registerRpcMessageHandler: () => true,
    },
    BigInt,
    setTimeout,
    crypto,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    SubtleCrypto: () => {},
    fetch: () => true,
    XMLHttpRequest: () => true,
    WebSocket: () => true,
    Buffer,
    Date,

    window: {
      crypto,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      SubtleCrypto: () => {},
      fetch: () => true,
      XMLHttpRequest: () => true,
      WebSocket: () => true,
    },
  };
}
