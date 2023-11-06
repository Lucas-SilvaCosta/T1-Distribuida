'use strict'

const { json } = require('express')
const express = require('express')
const bodyParser = require('body-parser')
const mini = require('./main')

const port = 8080
const host = '0.0.0.0'

const app = express()
app.use(json())

app.post('/write', async (req, res, next) => {
    try {
        await mini.start(req.body.data)
    } catch (error) {
        return next(error)
    }

    const returnJson = {
        message: "Successfully executed application",
        success: true
    }

    console.log(returnJson)
    res.status(200).json(returnJson)

    return next()
})

app.post('/read', async (req, res, next) => {
    let result
    try {
        result = await mini.start(req.body.data)
    }
    catch (error) {
        return next(error)
    }

    const returnJson = {
        message: "Successfully executed application",
        success: true,
        result: result
    }

    console.log(returnJson)
    res.status(200).json(returnJson)

    return next()
})

app.use(bodyParser)

// app.use(errorHandler)

app.listen(port, host)