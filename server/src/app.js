const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

var network = require('./fabric/network.js')

const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

// > a.Asset1
// { v0: { assetHash: '0xdeadbeef', assetURI: 'uri1' },
//   v1: { assetHash: '0xbeefdead', assetURI: 'uri2' },
// userName: "Admin@org1.example.com", permissionList: ["User1@org2.example.com"],
// lastVersion: v1}

app.post('/createAsset', (req, res) => {
    console.log(req.body)
    network.queryAllAsset()
    .then((response) => {
        console.log(response)
        let assetList = JSON.parse(JSON.parse(response))
        let numAsset = assetList.length
        let newID = 'Asset' + numAsset+1
        network.createAsset(newID,
            req.body.assetURI,
            req.body.assetHash)
            .then((response) => {
                res.send(response)
            })
    })
})

app.post('/updateAsset', (req, res) => {
    console.log(req.body)
    network.queryAllAsset()
    .then((response) => {
        console.log(response)
        let assetList = JSON.parse(JSON.parse(response))
        let assetID = req.body.assetID
        let newVersion = 'v'+(parseInt(assetList.assetID.lastVersion.replace(/\D/g, ""))+1)
        network.updateAsset(assetID,
            req.body.assetURI,
            req.body.assetHash,
            newVersion)
            .then((response) => {
                res.send(response)
            })

    })
})

app.get('/queryAllAsset', (req, res) => {
    network.queryAllAsset()
    .then((response) => {
        let assetList = JSON.parse(response)
        res.send(assetList)
    })
})

app.get('/queryAssetbyID', (req, res) => {
    network.queryAssetbyID(req.body.assetID)
    .then((response) => {
        let asset = JSON.parse(response)
        res.send(asset)
    })
})

app.post('/requestAccess', (req, res) => {
    network.requestAccess(req.body.assetID)
    .then((response) => {
        res.send(response)
    })
})

app.post('/grantAccess', (req, res) => {
    network.grantAccess(req.body.assetID,
        req.body.researcherID)
        .then((response) => {
            res.send(response)
        })
})

app.post('/revokeAccess', (req, res) => {
    network.revokeAccess(req.body.assetID,
        req.body.researcherID)
        .then((response) => {
            res.send(response)
        })
})

app.listen(process.env.PORT || 8081)
