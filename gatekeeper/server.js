'use strict'

const app = require('./config/express')()
const port = app.get('port')

global.MODE = process.env.NODE_ENV || 'production'

const http = require("http")
var httpServer = http.createServer(app)
// Starts running API on port.
httpServer.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})