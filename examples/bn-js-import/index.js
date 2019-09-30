const { errors: rpcErrors } = require('eth-json-rpc-errors')
const BN = require('bn.js')

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'ping':
      return await pong(originString);
    default:
      throw rpcErrors.eth.methodNotFound()
  }
})

async function pong (originString) {
  const approved = await promptUser('Do you want domain ' + originString +' to receive a pong?')
  if (approved) {
    return 'Pong!'
  } else {
    throw rpcErrors.eth.unauthorized()
  }
}

async function promptUser (message) {
  const response = await wallet.send({ method: 'confirm', params: [message] })
  return response.result
}
