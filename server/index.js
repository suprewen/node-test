const server = require('./server')
const router = require('./router')
const requestHandlers = require('./requestHandlers')

let handle = {}
handle['/'] = requestHandlers.start
handle['/start'] = requestHandlers.start
handle['/upload'] = requestHandlers.upload
handle['/show'] = requestHandlers.show
handle['/asynctest'] = requestHandlers.asynctest

// 函数式编程
server.start(router.route, handle)