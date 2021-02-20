const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cors = require('cors')
var morgan = require('morgan')
const app = express()
const router = require('./app/route/books/index')
const config = require('config')

// Database
mongoose.connect(config.mongo.BOOKSDATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connection.once('open',function(){
  console.log('Connected to Mongo');
}).on('error',function(err){
  console.log('Mongo Error', err);
})

// Express
app.use(bodyParser.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(cors())

//Routes
app.use('',router)
app.listen(config.port.BOOKS_PORT,()=>{
  console.log(`Serve is up and running at the port ${config.port.BOOKS_PORT}`)
})