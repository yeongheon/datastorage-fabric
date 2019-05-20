const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })
const fs = require('fs')
const xxhash = require('xxhash')

var network = require('./fabric/network-Org1User2.js')

const app = express()

app.set('view engine', 'jade')

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

// > a.Asset1
// { v0: { assetHash: '0xdeadbeef', assetURI: 'uri1' },
//   v1: { assetHash: '0xbeefdead', assetURI: 'uri2' },
// userName: "Admin@org1.example.com", permissionList: ["User1@org2.example.com"],
// lastVersion: v1}

app.get('/createAsset', function(req, res){
    res.render('upload')
})

app.post('/createAsset', upload.single('userfile'), (req, res) => {
    console.log(req.file)
    const uploadFile = fs.readFileSync(req.file.path),
	hash = xxhash.hash64(uploadFile, 0, 'hex')
	console.log('xxhash: ' + hash)
    network.queryAllAsset()
    .then((response) => {
        console.log(response)
        let assetList = JSON.parse(JSON.parse(response))
        let numAsset = parseInt(assetList.length)
        let newID = 'Asset' + (numAsset+1)
        console.log(newID)
        network.createAsset(newID,
            'http://localhost:8081/users/' + req.file.filename,
            hash)
            .then((response) => {
                res.send(response)
            })
    })
})

app.get('/updateAsset', function(req, res){
    res.render('update')
})

app.post('/updateAsset', upload.single('userfile'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    const uploadFile = fs.readFileSync(req.file.path),
	hash = xxhash.hash64(uploadFile, 0, 'hex')
	console.log('xxhash: ' + hash)
    network.queryAllAsset()
    .then((response) => {
        console.log(response)
        let assetList = JSON.parse(JSON.parse(response))
        let assetID = req.body.assetID
        let filter = assetList.filter(a => a.Key == assetID)
        console.log(filter)
        let newVersion = 'v'+(parseInt(filter[0].Record.lastVersion.replace(/\D/g, ""))+1)
        console.log('newVersion: ' + newVersion)
        network.updateAsset(assetID,
            'http://localhost:8081/users/' + req.file.filename,
            hash,
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

app.use('/users', express.static('uploads'))

app.listen(process.env.PORT || 8081)
