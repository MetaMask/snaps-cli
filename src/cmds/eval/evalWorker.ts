/* global lockdown, Compartment, BigInt */

import { parentPort } from 'worker_threads';
import { readFileSync } from 'fs';
import cryptography from 'crypto';

require('ses/lockdown');

declare var lockdown: any;
declare var Compartment: any;

lockdown({
  mathTaming: 'unsafe',
  errorTaming: 'unsafe',
});

if (parentPort !== null) {
  parentPort.on('message', (message: any) => {

    const { pluginFilePath } = message;
  
    const compartment = new Compartment(getMockApi());
    // Wrap the IIFE in an arrow function, because mocking the wallet is iffy
    compartment.evaluate(
      // '() => ' + readFileSync(pluginFilePath, 'utf8')
      readFileSync(pluginFilePath, 'utf8'),
    );
    setTimeout(() => process.exit(0), 1000); // Hacky McHack
    
  });
}

function getMockApi() {
  return {
    console,
    wallet: {
      registerRpcMessageHandler: () => true,
    },
    BigInt,
    setTimeout,
    cryptography,
    SubtleCrypto: () => undefined,
    fetch: () => true,
    XMLHttpRequest: () => true,
    WebSocket: () => true,
    Buffer,
    Date,

    window: {
      cryptography,
      SubtleCrypto: () => undefined,
      fetch: () => true,
      XMLHttpRequest: () => true,
      WebSocket: () => true,
    },
  };
}
