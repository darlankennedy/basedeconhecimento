const express = require('express');
const app = express();
const consign = require('consign');
const db = require('./config/db');
const port = 3000;
const mongosse = require('mongoose')
const cors = require('cors');
require('./config/mongodb')

app.use(cors({
    origin:'*'
}));
app.db = db
app.mongosse = mongosse

consign()
.include('./config/passport.js')
.then('./config/middleware.js')
.then('./api/validation.js')
.then('./api')
.then('./schedule')
.then('./config/routes.js')
.into(app)

app.listen(port,()=>{
    console.log(`${port} porta do backend Executando.....`)
});
