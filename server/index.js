const server = require('./server')
const router = require('./router')
const requestHandlers = require('./requestHandlers')
const userHandlers = require('./userHandlers')

const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/nodetest')

app.use('/node_modules/', express.static('./node_modules'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('express-art-template'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(userHandlers)

app.listen(3000, () => {
  console.log('server started at 3000')
})

let handle = {}
handle['/'] = requestHandlers.start
handle['/start'] = requestHandlers.start
handle['/upload'] = requestHandlers.upload
handle['/show'] = requestHandlers.show
handle['/asynctest'] = requestHandlers.asynctest

// 函数式编程
server.start(router.route, handle)