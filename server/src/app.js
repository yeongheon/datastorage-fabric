const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

var network = require('./fabric/network.js')

const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

// > a.asset1
// { V0: { assetHash: '0xdeadbeef', assetURI: 'uri1' },
//   V1: { assetHash: '0xbeefdead', assetURI: 'uri2' },
// userName: "Admin@org1.example.com", permissionList: ["User1@org2.example.com"] }

app.post('/createAsset', (req, res) => {
    console.log(req.body)
    network.queryAllAsset()
    .then((response) => {
        console.log(response)
        let assetList = JSON.parse(JSON.parse(response))
        let numAsset = assetList.length
        let newID = 'Asset' + numAsset
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
    network.query
})

app.get('/queryAllAsset', (req, res) => {
    network.queryAllAsset()
    .then((response) => {
        let assetList = JSON.parse(response)
        res.send(assetList)
    })
})


