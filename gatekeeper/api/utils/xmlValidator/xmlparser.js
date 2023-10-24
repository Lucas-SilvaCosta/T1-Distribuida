'use strict'

const validator = require('xsd-schema-validator')
const path = require('path')

// Validates XML tags.
async function validateXML(xmlText, xsdFileName) {
    let dir = path.resolve(__dirname, xsdFileName)
    return new Promise((resolve, reject) => {
        validator.validateXML(xmlText, dir, function (err, result) {
            if (err) {
                return reject({
                    error: true,
                    message: result.messages
                })
            }
            return resolve(
                {
                    error: false,
                    message: result.valid
                }
            )
        })
    })
}

module.exports = {
    validateXML
}
