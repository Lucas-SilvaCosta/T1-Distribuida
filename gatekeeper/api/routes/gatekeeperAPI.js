'use strict'

/**
 * API endpoints
 * @module Routes 
 * @example
 */
module.exports = app => {
    const controller = app.controllers.gatekeeperAPI
    app.route('/api/gatekeeper/submit')
        .post(controller.submit)
    app.route('/api/gatekeeper/read/:funcName')
        .post(controller.read)
}
