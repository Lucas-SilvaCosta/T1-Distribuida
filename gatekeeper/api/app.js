'use strict'

const axios = require('axios')
// const CustomError = require('./utils/CustomError')
// const WrapperError = require('./utils/WrapperError')

const apprun = 'http://appmarbles:8080'

async function getAllMarbles() {
    const appParams = {
        op: 'read',
        type: 'getAllMarbles'
    }

    return await request(appParams)
}

async function getMarble(owner, color) {
    if (owner === undefined || owner === "") { throw new Error('Invalid Owner value') }
    if (color === undefined || color === "") { throw new Error('Invalid Color value') }
    
    const appParams = {
        op: 'read',
        type: 'getMarble',
        Owner: owner,
        Color: color
    }

    return await request(appParams)
}

async function request(appParams) {
    // Sends POST request to application.
    try {
        const appres = await axios.post(apprun + '/read', { data: appParams })
        const result = JSON.parse(appres.data.result)
        return result
    } catch (error) {
        if (error.response) {
            throw new Error("Application error | "+error.response.data.message)
        } else {
            throw new Error("Error on request to application")
        }
    }
}

module.exports = {
    getAllMarbles,
    getMarble
}
