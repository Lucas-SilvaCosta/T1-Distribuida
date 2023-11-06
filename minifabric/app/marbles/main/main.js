'use strict'

const { Gateway, Wallets } = require('fabric-network')
const fs = require('fs')
const path = require('path')
const evaluateT = require("./evaluateTransactions")
const submitT = require("./submitTransactions")

/**
 * Runs appmarbles applicaton.
 * @param {*} reqParams - request parameters.
 */
async function start(reqParams) {
    // Load the network configuration.
    const ccpPath = path.resolve(__dirname, '..', '..', 'connection.json')
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'))
        
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join('/vars/profiles/vscode/wallets', process.env.ORG_NAME)
    const wallet = await Wallets.newFileSystemWallet(walletPath)
        
    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get('Admin')
    
    if (!identity) { throw new Error('Wallet admin not found') }
        
        
    // Network definitions.
    const gateway = new Gateway()
    await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } })
    const network = await gateway.getNetwork('mychannel')
    const marblesContract = network.getContract('marbles')
        
    // Option.
    let responseParams
    let result

    if (!reqParams.hasOwnProperty('op')) { // eslint-disable-line
        throw new CustomError('invalidOPParameter', errContext)
    }    

    switch (reqParams['op']) {
        case "write":
            await submitT.submitTransaction(marblesContract, reqParams.path)
            break
        
        case "read":
            // Wait for the response from the contract.
            result = await evaluateT.evaluateTransaction(marblesContract, reqParams)
            break
        
        default:
            throw new Error('Invalid function name')
    }
        
    // Disconnect from the gateway.
    gateway.disconnect()
    return result
}

module.exports = { start }
