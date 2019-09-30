const { errors: rpcErrors } = require('eth-json-rpc-errors')

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'ping':
      return 'Pong!'
    default:
      throw rpcErrors.eth.methodNotFound()
  }
})

