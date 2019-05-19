'use strict'

const { Contract } = require('fabric-contract-api')

class DataStorage extends Contract {
    
    async initLedger(ctx) {
        console.info('Iniitalizing Ledger')
    } // maybe not used in actual the PoC system

    async createAsset(ctx, assetID, userName, assetURI, assetHash, timestamp) {
        console.info('Creating Asset: ' + assetID)

        const asset = {
            userName: userName,
            v1: {assetHash: assetHash,
                assetURI: assetURI,
                timestamp: timestamp
            },
            permissionList: [ userName ],
            requestList: [],
            lastVersion: 'v1'
        }

        await ctx.stub.putState(assetID, Buffer.from(JSON.stringify(asset)))
        console.info('Created asset: ' + assetID)
    }

    async updateAsset(ctx, assetID, userName, assetURI, assetHash, newVersion, timestamp) {
        console.info('Updating Asset: ' + assetID)

        const assetAsBytes = await ctx.stub.getState(assetID)
        if (!assetAsBytes || assetAsBytes.length == 0) {
            throw new Error(`${assetID} does not exist`)
        }
        
        const asset = JSON.parse(assetAsBytes.toString())
        if (asset.userName != userName) {
            throw new Error(`Cannot update asset due to username mismatch. Original username was ${asset.userName} but ${userName} request to update the asset.`)
        }

        asset.lastVersion = newVersion
        asset[newVersion] = { assetHash: assetHash, assetURI: assetURI, timestamp: timestamp }

        await ctx.stub.putState(assetID, Buffer.from(JSON.stringify(asset)))
        console.info('Asset Updated: ' + assetID)
    }

    async queryAllAsset(ctx) {
        console.info('Querying all of assets')
        const startKey = 'Asset1'
        const endKey = 'Asset999'

        const iterator = await ctx.stub.getStateByRange(startKey, endKey)
        const allResults = []
        
        while (true) {
            const res = await iterator.next()

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'))

                const Key = res.value.key
                let Record
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'))

                    for (let i = 1; i <= parseInt(Record.lastVersion.replace(/\D/g, "")); i++) {
                        delete Record['v'+i].assetURI
                    }
                } catch (e) {
                    console.log(e)
                    Record = res.value.value.toString('utf8')
                }
                allResults.push({ Key, Record })
            }
            if (res.done) {
                console.log('End of Data')
                await iterator.close()
                console.info(allResults)
                return JSON.stringify(allResults)
            }
        }
    }

    async queryAssetbyID(ctx, assetID, userName) {
        console.info('Querying asset by its own ID')
        const assetAsBytes = await ctx.stub.getState(assetID)
        if (!assetAsBytes || assetAsBytes.length == 0) {
            throw new Error(`${assetID} does not exist`)
        }

        const asset = JSON.parse(assetAsBytes.toString())
        if (asset.userName != userName && !asset.permissionList.includes(userName)) {
            throw new Error(`Cannot query asset due to username mismatch. Original username was ${asset.userName}, permitted list was ${asset.permissionList} but ${userName} request to query the asset.`)
        }

        return assetAsBytes.toString()
    }

    async requestAccess(ctx, assetID, userName) {
        console.info('Requesting Access for the asset of others')
        const assetAsBytes = await ctx.stub.getState(assetID)
        if (!assetAsBytes || assetAsBytes.length == 0) {
            throw new Error(`${assetID} does not exist`)
        }

        const asset = JSON.parse(assetAsBytes.toString())
        if (asset.permissionList.includes(userName)) {
            throw new Error(`userName ${userName} already have a permission to access this asset`)
        }
        if (asset.requestList.includes(userName)) {
            throw new Error(`userName ${userName} already requested to access this asset`)
        }

        asset.requestList.push(userName)

        await ctx.stub.putState(assetID, Buffer.from(JSON.stringify(asset)))
        console.info('Asset Updated: ' + assetID)
    }

    async grantAccess(ctx, assetID, userName, researcherID) {
        console.info('Granting access for the reqeust')
        const assetAsBytes = await ctx.stub.getState(assetID)
        if (!assetAsBytes || assetAsBytes.length == 0) {
            throw new Error(`${assetID} does not exist`)
        }

        const asset = JSON.parse(assetAsBytes.toString())
        if (asset.userName != userName) {
            throw new Error(`${userName} is not a asset holder. Holder: ${asset.userName}`)
        }
        if (asset.permissionList.includes(researcherID)) {
            throw new Error(`${researcherID} already registered in the permission list`)
        }
        if (!asset.requestList.includes(researcherID)) {
            throw new Error(`${researcherID} does not requested permission of this asset`)
        }

        asset.permissionList.push(researcherID)
        asset.requestList.pop(researcherID)

        await ctx.stub.putState(assetID, Buffer.from(JSON.stringify(asset)))
        console.info('Granted Access: ' + assetID)
    }

    async revokeAccess(ctx, assetID, userName, researcherID) {
        console.info('Revoking access for the reqeust')
        const assetAsBytes = await ctx.stub.getState(assetID)
        if (!assetAsBytes || assetAsBytes.length == 0) {
            throw new Error(`${assetID} does not exist`)
        }

        const asset = JSON.parse(assetAsBytes.toString())
        if (asset.userName != userName) {
            throw new Error(`${userName} is not a asset holder. Holder: ${asset.userName}`)
        }
        if (!asset.permissionList.includes(researcherID)) {
            throw new Error(`${researcherID} does not registered in the permission list`)
        }

        asset.permissionList.pop(researcherID)

        await ctx.stub.putState(assetID, Buffer.from(JSON.stringify(asset)))
        console.info('Revoked Access: ' + assetID)
    }
}

module.exports = DataStorage