'use strict'

const { Contract } = require('fabric-contract-api')

class DataStorage extends Contract {
    
    async initLedger(ctx) {
        console.info('Iniitalizing Ledger')
    } // maybe not used in actual the PoC system
}