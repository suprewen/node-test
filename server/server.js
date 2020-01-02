// 使用 require 指令来载入 http 模块，并将实例化的 HTTP 赋值给变量 http
const http = require('http')
// 载入 url 模块
// 我们需要的所有数据都会包含在 request 对象中，该对象作为
const url = require('url')

function start (route, handle) {
  function onRequest (req, res) {
    let postData = ''
    let pathname = url.parse(req.url).pathname
    console.log(`request received from ${pathname}`)

    // 设置接收数据的编码格式为 UTF-8, node-formidable自身会处理
    // req.setEncoding('utf8')

    // 为了使整个过程非阻塞，Node.js 会将 POST 数据拆分成很多小的数据块，然后通过触发特定的事件，
    // 将这些小数据块传递给回调函数
    // 这里特定的事件有 data 事件（表示新的小数据块到达了）以及 end 事件（表示所有的数据都已经接收完毕）

    /* 修改为文件上传，取消掉对 postData 的处理 */
    /* req.addListener('data', postDataChuck => {
      postData += postDataChuck
      console.log(`received POST data chuck ${postDataChuck}`)
    })

    req.addListener('end', () => {
      route(handle, pathname, res, postData)
    }) */

    // 将 request 对象从服务器开始一路通过请求路由，再传递给请求处理程序
    route(handle, pathname, res, req)

    // 响应头
    // res.writeHead(200, { 'Content-Type': 'text/plain' })
    // 发送响应数据
    // res.end('content')
  }

  // 使用 http.createServer() 方法创建服务器，并使用 listen 方法绑定 3001 端口，函数通过 request, response 参数来接收和响应数据
  const server = http.createServer(onRequest)

  server.listen(3001, '127.0.0.1', () => {
    console.log('server started at 3001')
  })
}

exports.start = start
