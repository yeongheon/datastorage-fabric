'use strict'

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network')
const fs = require('fs')
const path = require('path')

const configPath = path.join(process.cwd(), '../config.json')
const configJSON = fs.readFileSync(configPath, 'utf8')
const config = JSON.parse(configJSON)
// Parse config variables from config.json

let connection_file = config.connection_file
let userName = config.userName
let gatewayDiscovery = config.gatewayDiscovery

const ccpPath = path.join(process.cwd(), '../' + connection_file)
const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
const ccp = JSON.parse(ccpJSON)
// parse connection variables from connection_file

exports.createAsset = async function(assetID, assetURI, assetHash) {
    try {
        let response = {}
        let timestamp = new Date().toISOString()

        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), '../wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        const userExists = await wallet.exists(userName)
        if (!userExists) {
            console.log('An identity for User ' + userName + ' doesn not exists in the Wallet')
            console.log('Run the registerUser.js before run this script')
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first'

            return response
        }

        // create new gateway to connect peer
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: userName,
            discovery: gatewayDiscovery
        })

        // get the network to deploy contract
        const network = await gateway.getNetwork('mychannel')
        
        // get the contract from the network
        const contract = network.getContract('data-storage')

        // submit tx
        console.log(assetID, userName, assetURI, assetHash, timestamp)
        await contract.submitTransaction('createAsset', assetID, userName, assetURI, assetHash, timestamp)
        console.log('Transaction has been submitted')

        // disconnect from the gateway
        await gateway.disconnect()

        response.msg = 'createAsset Transaction has been submitted'
        return response
    } catch (e) {
        console.error(`Failed to submit transaction: ${e}`)
        let response = {}
        response = JSON.stringify(e.message)
        
        return response
    }
} // Create Research Asset

exports.updateAsset = async function(assetID, assetURI, assetHash, newVersion) {
    try {
        let response = {}
        let timestamp = new Date().toISOString()

        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), '../wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        const userExists = await wallet.exists(userName)
        if (!userExists) {
            console.log('An identity for User ' + userName + ' doesn not exists in the Wallet')
            console.log('Run the registerUser.js before run this script')
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first'

            return response
        }

        // create new gateway to connect peer
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: userName,
            discovery: gatewayDiscovery
        })

        // get the network to deploy contract
        const network = await gateway.getNetwork('mychannel')
        
        // get the contract from the network
        const contract = network.getContract('data-storage')

        // submit tx
        console.log(assetID, userName, assetURI, assetHash, newVersion, timestamp)
        await contract.submitTransaction('updateAsset', assetID, userName, assetURI, assetHash, newVersion, timestamp)
        console.log('Transaction has been submitted')

        // disconnect from the gateway
        await gateway.disconnect()

        response.msg = 'updateAsset Transaction has been submitted'
        return response
    } catch (e) {
        console.error(`Failed to submit transaction: ${e}`)
        let response = {}
        response = JSON.stringify(e.message)
        
        return response
    }
} // Update Research Asset to New Version

exports.queryAllAsset = async function() {
    try {
        let response = {}

        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), '../wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        const userExists = await wallet.exists(userName)
        if (!userExists) {
            console.log('An identity for User ' + userName + ' doesn not exists in the Wallet')
            console.log('Run the registerUser.js before run this script')
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first'

            return response
        }

        // create new gateway to connect peer
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: userName,
            discovery: gatewayDiscovery
        })

        // get the network to deploy contract
        const network = await gateway.getNetwork('mychannel')
        
        // get the contract from the network
        const contract = network.getContract('data-storage')

        // submit tx
        const result = await contract.evaluateTransaction('queryAllAsset')
        console.log(`Transaction has been evaluated, result is ${result.toString()}`)

        // disconnect from the gateway
        await gateway.disconnect()

        return result
    } catch (e) {
        console.error(`Failed to evaluate transaction: ${e}`)
        let response = {}
        response = JSON.stringify(e.message)
        
        return response
    }
} // Query all Asset without URI information

exports.queryAssetbyID = async function(assetID) {
    try {
        let response = {}

        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), '../wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        const userExists = await wallet.exists(userName)
        if (!userExists) {
            console.log('An identity for User ' + userName + ' doesn not exists in the Wallet')
            console.log('Run the registerUser.js before run this script')
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first'

            return response
        }

        // create new gateway to connect peer
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: userName,
            discovery: gatewayDiscovery
        })

        // get the network to deploy contract
        const network = await gateway.getNetwork('mychannel')
        
        // get the contract from the network
        const contract = network.getContract('data-storage')

        // submit tx
        const result = await contract.evaluateTransaction('queryAssetbyID', assetID, userName)
        console.log(`Transaction has been evaluated, result is ${result.toString()}`)

        // disconnect from the gateway
        await gateway.disconnect()

        return result
    } catch (e) {
        console.error(`Failed to evaluate transaction: ${e}`)
        let response = {}
        response = JSON.stringify(e.message)
        
        return response
    }
} // Query target asset by ID

exports.requestAccess = async function (assetID) {
    try {
        let response = {}

        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), '../wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        const userExists = await wallet.exists(userName)
        if (!userExists) {
            console.log('An identity for User ' + userName + ' doesn not exists in the Wallet')
            console.log('Run the registerUser.js before run this script')
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first'

            return response
        }

        // create new gateway to connect peer
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: userName,
            discovery: gatewayDiscovery
        })

        // get the network to deploy contract
        const network = await gateway.getNetwork('mychannel')
        
        // get the contract from the network
        const contract = network.getContract('data-storage')

        // submit tx
        await contract.submitTransaction('requestAccess', assetID, userName)
        console.log('Transaction has been submitted')

        // disconnect from the gateway
        await gateway.disconnect()

        response.msg = 'requestAccess Transaction has been submitted'
        return response
    } catch (e) {
        console.error(`Failed to submit transaction: ${e}`)
        let response = {}
        response = JSON.stringify(e.message)
        
        return response
    }
} // Request permission of research data URI

exports.grantAccess = async function (assetID, researcherID) {
    try {
        let response = {}

        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), '../wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        const userExists = await wallet.exists(userName)
        if (!userExists) {
            console.log('An identity for User ' + userName + ' doesn not exists in the Wallet')
            console.log('Run the registerUser.js before run this script')
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first'

            return response
        }

        // create new gateway to connect peer
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: userName,
            discovery: gatewayDiscovery
        })

        // get the network to deploy contract
        const network = await gateway.getNetwork('mychannel')
        
        // get the contract from the network
        const contract = network.getContract('data-storage')

        // submit tx
        await contract.submitTransaction('grantAccess', assetID, userName, researcherID)
        console.log('Transaction has been submitted')

        // disconnect from the gateway
        await gateway.disconnect()

        response.msg = 'grantAccess Transaction has been submitted'
        return response
    } catch (e) {
        console.error(`Failed to submit transaction: ${e}`)
        let response = {}
        response = JSON.stringify(e.message)
        
        return response
    }
} // Grant permission of research data URI

exports.revokeAccess = async function (assetID, researcherID) {
    try {
        let response = {}

        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), '../wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        const userExists = await wallet.exists(userName)
        if (!userExists) {
            console.log('An identity for User ' + userName + ' doesn not exists in the Wallet')
            console.log('Run the registerUser.js before run this script')
            response.error = 'An identity for the user ' + userName + ' does not exist in the wallet. Register ' + userName + ' first'

            return response
        }

        // create new gateway to connect peer
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: userName,
            discovery: gatewayDiscovery
        })

        // get the network to deploy contract
        const network = await gateway.getNetwork('mychannel')
        
        // get the contract from the network
        const contract = network.getContract('data-storage')

        // submit tx
        await contract.submitTransaction('revokeAccess', assetID, userName, researcherID)
        console.log('Transaction has been submitted')

        // disconnect from the gateway
        await gateway.disconnect()

        response.msg = 'revokeAccess Transaction has been submitted'
        return response
    } catch (e) {
        console.error(`Failed to submit transaction: ${e}`)
        let response = {}
        response = JSON.stringify(e.message)
        
        return response
    }
} // Revoke permission of research data URI
