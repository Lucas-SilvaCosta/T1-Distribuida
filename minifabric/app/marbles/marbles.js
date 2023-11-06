'use strict'

/*
#######################
### Marble Functions ###
#######################
*/

/** @module MarbleFunctions */

/** @function
 * @moduleOf MarbleFunctions
 * @name addMarble
 * @param {Object} contract - hyperledger fabric contract.
 * @param {String} owner - owner name.
 * @param {String} color - marble color.
 * @param {int} size - marble size.
 * @returns {Object} - response from the chaincode.
 */
async function addMarble(contract, owner, size, color) {
    return contract.submitTransaction('AddMarble', owner, size, color)
}

/** @function
 * @moduleOf MarbleFunctions
 * @name getAllMarbles
 * @param {Object} contract - hyperledger fabric contract.
 * @returns {Object} response from the chaincode.
 */
async function getAllMarbles(contract) {
    return contract.evaluateTransaction("GetAllMarbles")
}

/** @function
 * @moduleOf MarbleFunctions
 * @name getMarble
 * @param {Object} contract - hyperledger fabric contract.
 * @param {String} owner - owner name.
 * @param {String} color - marble color.
 * @returns {Object} response from the chaincode.
 */
async function getMarble(contract, owner, color) {
    return contract.evaluateTransaction("GetMarble", owner, color)
}



module.exports = {
    // Write.
    addMarble,
    // Read.
    getAllMarbles,
    getMarble,
}
