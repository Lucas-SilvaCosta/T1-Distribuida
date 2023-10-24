'use strict'

const axios = require('axios')
// const validator = require('../utils/xmlValidator/xmlparser')
// const CustomError = require('../utils/CustomError')
// const WrapperError = require('../utils/WrapperError')
const app = require('../app')

const apprun = 'http://appmarbles:8080'

/**
 * Implements logic behind API routes.
 * @module Controller 
 */
module.exports = () => {
    const controller = {}

    /**
     * Endpoint to handle write operations.
     * @memberof module:Controller
     * @param {*} req HTTP request.
     * @param {*} res HTTP response.
     * @param {*} next 
     */
    controller.submit = async (req, res, next) => {
        try {
            if (!req.rawBody.Owner || req.rawBody.Owner == "") {
                throw Error("Invalid Owner value")
            }
            if (!req.rawBody.Color || req.rawBody.Color == "") {
                throw Error("Invalid Color value")
            }
            if (!req.rawBody.Size || req.rawBody.Size == 0) {
                throw Error("Invalid Size value")
            }

            const appParams = { op: 'write', path: req.rawBody }
            try {
                await axios.post(apprun + '/write', {
                    data: appParams
                })

                res.status(200).json({
                    message: "Transação enviada com sucesso",
                    success: true
                })
                return next()
            } catch (error) {
                if (error.response) {
                    throw new Error("Application error | "+error.response.data.message)
                } else {
                    throw new WrapperError("Error sending request to application | "+error)
                }
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * Endpoint to handle read operations.
     * @memberof module:Controller
     * @param {*} req HTTP request.
     * @param {*} res HTTP response.
     * @param {*} next 
     */
    controller.read = async (req, res, next) => {
        try {

            const body = req.body
            const data = req.body.data
            const { funcName } = req.params

            // Verify function name.
            if (funcName === undefined || funcName === "") {
                throw new Error('Invalid function name')
            }

            let result
            switch (funcName) {

                case "getAllMarbles":
                    result = await app.getAllMarbles()
                    break

                case "getMarble":
                    result = await app.getMarble(data.Owner, data.Color)
                    break

                default:
                    throw new Error('Invalid function name')
            }

            res.status(200).json({
                message: "Transação enviada com sucesso",
                success: true,
                result: result
            })

        } catch (error) {
            next(error)
        }
    }

    return controller
}