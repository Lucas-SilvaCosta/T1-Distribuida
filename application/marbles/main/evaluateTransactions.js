'use strict'

/**@module EvaluateTransactions */
const marbles = require('../marbles')
const helper = require('./utils/helper')
// const CustomError = require('./utils/CustomError')

/**
 * Process transactions of type read.
 * @param {*} marblesContract - Marbles contract interface.
 * @param {json} option - Define the type and parammeters about this executation.
 */
async function evaluateTransaction(marblesContract, option) {
    let response

    // Type check.
    switch (option['type']) {
        case 'getAllMarbles':
            response = await marbles.getAllMarbles(marblesContract)
            return helper.jsonPrettyOutput(helper.bufferToStringResponse(response))

        case 'getMarble':
            response = await marbles.getMarble(marblesContract, option['Owner'], option['Color'])
            return helper.jsonPrettyOutput(helper.bufferToStringResponse(response))

        default:
            throw new Error('Invalid function name error')
    }
}

module.exports = { evaluateTransaction }