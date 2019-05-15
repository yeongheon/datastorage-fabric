'use strict'

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network')
const fs = require('fs')
const path = require('path')

const configPath = path.join(process.cwd(), '/config.json')
const configJSON = fs.readFileSync(configPath, 'utf8')
const config = JSON.parse(configJSON)
// Parse config variables from config.json

let connection_file = config.connection_file
let userName = config.userName
let gatewayDiscovery = config.gatewayDiscovery

const ccpPath = path.join(process.cwd(), connection_file)
const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
const ccp = JSON.parse(ccpJSON)
// parse connection variables from connection_file

exports.createAsset = async function(assetID, researcherID, assetURI, assetHash) {
    let response = {}
    
    // make new wallet based on filesystem
    const walletPath = path.join(process.cwd(), '/wallet')
    const wallet = new FileSystemWallet(walletPath)
    console.log(`Wallet Path: ${walletPath}`)


} // Create Research Asset

exports.updateAsset = async function(assetID, researcherID, assetURI, assetHash) {
    // func
} // Update Research Asset to New Version

exports.queryAllAsset = async function() {
    // func
} // Query all Asset without URI information

exports.queryAssetbyID = async function(assetID) {
    // func
} // Query target asset by ID

exports.requestAccess = async function (assetID, researcherID) {
    // func
} // Request permission of research data URI

exports.grantAccess = async function (assetID, researcherID) {
    // func
} // Grant permission of research data URI

exports.revokeAccess = async function (assetID, researcherID) {
    // func
} // Revoke permission of research data URI