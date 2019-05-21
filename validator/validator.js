const xxhash = require('xxhash')
const fs = require('fs')
const process = require('process')

let arguments = process.argv.slice(2)
let argnum = arguments.length

if (argnum === 1) {
    try {
    const uploadFile = fs.readFileSync(arguments[0]),
	hash = xxhash.hash64(uploadFile, 0, 'hex')
    console.log('xxHash of given file : ' + hash)
    } catch (e) {
        console.log('Error during parsing, check path and try again.')
        console.log(e)
    }

} else if (argnum === 2) {
    try {
        const uploadFile = fs.readFileSync(arguments[0]),
        hash = xxhash.hash64(uploadFile, 0, 'hex')
        if (hash === arguments[1]) {
            console.log('The hash value given matches hash of the file.')
        } else {
            console.log('The hash value given does not matches hash of the file.')
            console.log('Given hash : ' + arguments[1])
            console.log('Calculated hash : ' + hash)
        }
        } catch (e) {
            console.log('Error during parsing, check path and try again.')
            console.log(e)
        }
} else {
    console.log('USAGE: node validator.js [FILE] ([HASH])')
    console.log('Calculate and validate xxhash values using the specified file directory')
}
