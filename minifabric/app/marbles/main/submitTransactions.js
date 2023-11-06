'use strict'

/**@module SubmitTransactions 
 * @description Submits transactions to the ledgers */

// const { XMLParser } = require('fast-xml-parser')
const marbles = require('../marbles.js')
const helper = require('./utils/helper')
// const objConv = require('./utils/assetlibFormater.js')
// const jsonDiff = require('./utils/diff')
// const CustomError = require('./utils/CustomError')
// const WrapperError = require('./utils/WrapperError')
const axios = require('axios')
// const appxmlog = 'http://appxmlog:8080'

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

    // if (!reqJson.Owner || reqJson.Owner == "") { throw Error("Invalid Owner value")}
    // if (!reqJson.Color || reqJson.Color == "") { throw Error("Invalid Color value")}
    // if (!reqJson.Size  || reqJson.Size  == "") { throw Error("Invalid Size value")}

    await marbles.addMarble(marblesContract, reqJson.Owner, reqJson.Color, reqJson.Size)

    return true

    // let options = {
    //     attrNodeName: "#attr",
    //     textNodeName: "#text",
    //     attributeNamePrefix: "",
    //     arrayMode: "false",
    //     ignoreAttributes: false,
    //     parseAttributeValue: false,
    //     ignoreDeclaration: true,
    //     explicitArray: false,
    //     parseTagValue: false
    // }

    // const parser = new XMLParser(options)

    // Reads file containing xml processed by API.
    // var newXML = reqXml
    // let reqJSON = parser.parse(newXML.toString())
    // let version = reqJSON['DocumentoHistoricoEscolarFinal']['infHistoricoEscolar']['versao']
    
    // Assetlibformat to preare Historico to Chaincode.
    // let historicoJsonInAssetlibPattern = objConv.formatHistorico(reqJSON['DocumentoHistoricoEscolarFinal'])
    // let jsonAlunoAssetPattern = objConv.formatAluno(reqJSON['DocumentoHistoricoEscolarFinal']['infHistoricoEscolar']['Aluno'])

    // JSON Diff to find alterations in XML.
    // const appParamsRead = { op: 'read', type:"readLastRecord", id: jsonAlunoAssetPattern.private['CPF'] }
    // let xmlFromLedger
    // try {
    //     const appres = await axios.post(appxmlog+'/read', {
    //         data: appParamsRead
    //     })
    //     xmlFromLedger = parser.parse(appres.data.result)
    //     xmlFromLedger = xmlFromLedger['DocumentoHistoricoEscolarFinal']['infHistoricoEscolar']
    // } catch (err) {
    //     xmlFromLedger = {}
    // }

    // let diff = jsonDiff.diffHist(xmlFromLedger,
    //     reqJSON['DocumentoHistoricoEscolarFinal']['infHistoricoEscolar'])
    // let keys = diff[0]

    // // Update to aluno.
    // let alunoDiff = false
    // let historicoDiff = false

    // // Verify each key to define difference.
    // if (keys != undefined) {
    //     for (let i = 0; i < keys.length; i++) {
    //         let key = keys[i]
    //         if (key.includes("Aluno")) {
    //             alunoDiff = true
    //         } else if (key.includes("DadosCurso")) {
    //             historicoDiff = true
    //         } else if (key.includes("IesEmissora")) {
    //             historicoDiff = true
    //         } else if (key.includes("HistoricoEscolar")) {
    //             historicoDiff = true
    //         } else if (key.includes("SegurancaHistorico")) {
    //             historicoDiff = true
    //         }
    //     }
    // }
    // let exists = "false"

    // exists = await academicRecords.alunoExists(academicRecordsContract, jsonAlunoAssetPattern.private['CPF'])

    // exists = helper.bufferToStringResponse(exists) == "true"

    // const appParams = { op: 'write', path: reqXml, id:jsonAlunoAssetPattern.private['CPF'], version: version }

    // if (alunoDiff && historicoDiff) {
    //     console.log("Update on Aluno and Historico")

    //     if (exists) {
    //         // Aluno exists, update.
    //         await academicRecords.updateAluno(academicRecordsContract, JSON.stringify(jsonAlunoAssetPattern.private), 
    //             historicoJsonInAssetlibPattern.public['iesEmissora'])
    //     } else {
    //         // Create new aluno.
    //         await academicRecords.createAluno(academicRecordsContract, JSON.stringify(jsonAlunoAssetPattern.public),
    //             JSON.stringify(jsonAlunoAssetPattern.private), historicoJsonInAssetlibPattern.public['iesEmissora'])
    //     }
    //     // Add historico.
    //     await academicRecords.createHistoricoEscolar(academicRecordsContract, JSON.stringify(historicoJsonInAssetlibPattern.public),
    //         JSON.stringify(historicoJsonInAssetlibPattern.private))
            
    //     try {
    //         await axios.post(appxmlog+'/write', {
    //             data: appParams
    //         })
    //     } catch (error) {
    //         if (error.response) {
    //             throw new CustomError("applicationError", errContext, error.response.data.message)
    //         } else {
    //             throw new WrapperError("axiosError", errContext, error)
    //         }
    //     }

    // } else if (alunoDiff) {
    //     console.log("Update on Aluno.")

    //     if (exists) {
    //         // Update aluno.
    //         await academicRecords.updateAluno(academicRecordsContract, JSON.stringify(jsonAlunoAssetPattern.private),
    //             historicoJsonInAssetlibPattern.public['iesEmissora'])
    //     } else {
    //         // Create new aluno.
    //         await academicRecords.createAluno(academicRecordsContract, JSON.stringify(jsonAlunoAssetPattern.public),
    //             JSON.stringify(jsonAlunoAssetPattern.private), historicoJsonInAssetlibPattern.public['iesEmissora'])
    //     }

    //     // Save new XML.
    //     try {
    //         await axios.post(appxmlog+'/write', {
    //             data: appParams
    //         })
    //     } catch (error) {
    //         if (error.response) {
    //             throw new CustomError("applicationError", errContext, error.response.data.message)
    //         } else {
    //             throw new WrapperError("axiosError", errContext, error)
    //         }
    //     }

    // } else if (historicoDiff) {
    //     console.log("Update on Historico")

    //     // Update historico.
    //     await academicRecords.createHistoricoEscolar(academicRecordsContract, JSON.stringify(historicoJsonInAssetlibPattern.public),
    //         JSON.stringify(historicoJsonInAssetlibPattern.private))
    //     // Save new XML.
    //     try {
    //         await axios.post(appxmlog+'/write', {
    //             data: appParams
    //         })
    //     } catch (error) {
    //         if (error.response) {
    //             throw new CustomError("applicationError", errContext, error.response.data.message)
    //         } else {
    //             throw new WrapperError("axiosError", errContext, error)
    //         }
    //     }

    // } else {
    //     console.log("Nothing to update.")
    //     return true
    // }
}

module.exports = { submitTransaction }
