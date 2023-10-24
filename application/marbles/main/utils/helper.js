'use strict'

/*
#######################
### Helper Functions ###
#######################
*/

/** @module Helper */

/** @function
 * @moduleOf module:Helper
 * @name bufferToStringResponse
 * @param {string} bufferResponse - buffer response from the chaincode.
 * @returns {String} Buffer response converted to string.
 */
function bufferToStringResponse(bufferResponse) {
    return Buffer.from(bufferResponse, 'utf-8').toString()
}

/**
 * @name jsonPrettyOutput 
 * @moduleOf module:Helper
 * @param {json} jsonResponse - json string.
 * @returns {String} - parse a json to a formatted json as string.
 */
function jsonPrettyOutput(jsonResponse) {
    return JSON.stringify(JSON.parse(jsonResponse), undefined, 4)
}

module.exports = {
    jsonPrettyOutput,
    bufferToStringResponse
}
