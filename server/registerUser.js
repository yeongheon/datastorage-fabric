'use strict'

const { fileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network')
const fs = require('fs')
const path = require('path')

const configPath = path.join(process.cwd(), 'config.json')
const configJSON = fs.readFileSync(configPath, 'utf8')
const config = JSON.parse(configJSON)

let connection_file = config.connection_file
let appAdmin = config.appAdmin
let orgMSPID = config.orgMSPID
let userName = config.userName
let gatewayDiscovery = config.gatewayDiscovery

const ccpPath = path.join(process.cwd(), connection_file)
const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
const ccp = JSON.parse(ccpJSON)

async function main() {
    try {
        // make new wallet based on filesystem
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new fileSystemWallet(walletPath)
        console.log(`Wallet Path: ${walletPath}`)

        // check if user exists in the wallet
        const userExists = await wallet.exists(userName)
        if (userExists) {
            console.log('An identity for the user already exists in the wallet')
            return
        }

        // check if admin already enrolled in the network
        const adminExists = await wallet.exists(appAdmin)
        if (!adminExists) {
            console.log('An identity for the administartor does not exists in the wallet')
            console.log('Run the enrollAdmiin.js before using this script')
            return
        }

        // create a new gateway to connect node
        const gateway = new Gateway()
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: appAdmin,
            discovery: gatewayDiscovery
        })

        // create a new gateway to interact with CA
        const ca = gateway.getClient().getCertificateAuthority()
        const adminIdentity = gateway.getCurrentIdentity()

        // register and enroll the user, get new identity into the wallet
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userName,
            role: 'client'
        }, adminIdentity)
        const enrollment = await ca.enroll({
            enrollmentID: userName,
            enrollmentSecret: secret
        })
        const userIdentity = X509WalletMixin.createIdentity(
            orgMSPID,
            enrollment.certificate,
            enrollment.key.toBytes()
            )
        wallet.import(userName, userIdentity)
        console.log('Successfully registered and enrolled admin user ' + userName + ' and imported into the wallet')
    } catch (e) {
        console.error('Failed to register ' + userName + `due to ${e}`)
        process.exit(1)
    }
}

main()
