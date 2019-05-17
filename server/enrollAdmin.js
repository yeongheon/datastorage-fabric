'use strict'

const FabricCAServices = require('fabric-ca-client')
const { FileSystemWallet, X509WalletMixin } = require('fabric-network')
const fs = require('fs')
const path = require('path')

// get network variables from config.json
const configPath = path.join(process.cwd(), 'config.json')
const configJSON = fs.readFileSync(configPath, 'utf8')
const config = JSON.parse(configJSON)

let connection_file = config.connection_file
let appAdmin = config.appAdmin
let appAdminSecret = config.appAdminSecret
let orgMSPID = config.orgMSPID
let caName = config.caName

const ccpPath = path.join(process.cwd(), connection_file)
const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
const ccp = JSON.parse(ccpJSON)

async function main() {
    try {
        // create a CA client
        const caURL = ccp.certificateAuthorities[caName].url
        const ca = new FabricCAServices(caURL)

        // create a new filesystem based wallet
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)

        // check if admin has been enrolled in wallet
        const adminExists = await wallet.exists(appAdmin)
        if (adminExists) {
            console.log('An identity for the admin user already exists')
            return
        }
        
        // enroll and import the admin user to the wallet
        const enrollment = await ca.enroll({
            enrollmentID: appAdmin,
            enrollmentSecret: appAdminSecret,
        })
        const identity = X509WalletMixin.createIdentity(
            orgMSPID, enrollment.certificate, enrollment.key.toBytes()
        )
        wallet.import(appAdmin, identity)
        console.log('Successfully enrolled App admin ' + appAdmin + ' and imported to the wallet')
    } catch (e) {
        console.error('Failed to enroll app admin ' + appAdmin + `: ${e}`)
        process.exit(1)
    }
}

main()
