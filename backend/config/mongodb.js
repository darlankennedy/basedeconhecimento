const mongosse = require('mongoose')
const {mongodb} = require('./../.env')

mongosse.connect(mongodb,{useNewUrlParser:true})
    .catch(e => {
        const msg = 'ERRO! Não foi possivel conectar com o MongoDb'
        console.log('\x1b[41m%s\x1b[37m',msg,'\x1b[0m')
    })