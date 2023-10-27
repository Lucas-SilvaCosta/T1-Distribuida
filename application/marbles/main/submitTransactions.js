'use strict'

/**@module SubmitTransactions 
 * @description Submits transactions to the ledgers */

const marbles = require('../marbles.js')
const helper = require('./utils/helper')
const axios = require('axios')

/**
 * Process transactions of type write.
 * @async
 * @param {*} marblesContract - academicRecords contract interface.
 * @param {String} reqJson - json file.
 * @returns {Promise<Boolean>} - A boolean value indicating whether the transaction was successful or not.
 */
async function submitTransaction(marblesContract, reqJson) {
    const errContext = "Não foi possível submeter a transação."
    if (reqJson === '') {
        throw new Error('Invalid json request')
    }

    await marbles.addMarble(marblesContract, reqJson.Owner, reqJson.Color, reqJson.Size)

    return true
}

module.exports = { submitTransaction }
