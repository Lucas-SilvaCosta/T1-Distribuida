'use strict'

/**
 * Process transactions of type read.
 * @param {json} old - Old xml json to compare.
 * @param {json} new - New xml json to compare.
 */
const jsonDiff = require('json-diff')
function diffHist(old_, new_) {
    var diff = jsonDiff.diff(old_, new_)
    if (diff != undefined) {
        var keys = Object.keys(diff)

        // Return the differentes keys.
        return [keys, diff]
    } else {
        return [undefined, undefined]
    }
}

module.exports = { diffHist }
