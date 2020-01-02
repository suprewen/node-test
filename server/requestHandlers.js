const querystring = require('querystring')
const fs = require('fs')
const formiable = require('formidable')
const path = require('path')

function start (res) {
  console.log('Request handler start was called')

  var body = '<html>' +
    '<head>' +
    '<meta http-equiv="Content-Type" content="text/html; ' +
    'charset=UTF-8" />' +
    '</head>' +
    '<body>' +
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<input type="file" name="upload"></input>' +
    '<input type="submit" value="Upload file" />' +
    '</form>' +
    '</body>' +
    '</html>'

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write(body)
  res.end()
}

function upload (res, req) {
  console.log('Request handler upload was called')
  /* res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(`You've sent ${querystring.parse(postData).text}`) */

  let form = new formiable.IncomingForm()
  // 设置上传的文件的保存路径
  form.uploadDir = path.join(__dirname, '/tmp/')
  console.log('about to parse')
  form.parse(req, function (err, fields, files) {
    console.log('parsing done', files)
    try {
      // 把上传的文件都更名为 test.png 
      fs.renameSync(files.upload.path, path.join(__dirname, '/tmp/test.png'))
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write('received image:<br/>')
      res.write('<img src="/show" />')
      res.end()
    } catch (e) {
      console.log(e)
      res.end('oops, something went wrong')
    }

  })
}

function show (res) {
  console.log('Request handler show was called')
  fs.readFile(path.join(__dirname, '/tmp/test.png'), 'binary', (err, file) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.write(err + '\n')
      res.end()
    } else {
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.write(file, 'binary')
      res.end()
    }
  })
}

async function asynctest (res) {
  function getFoo () {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('foo\n')
      }, 3000)
    })
  }

  function getBar () {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Bar\n')
      }, 3000)
    })
  }

  // 回调函数写法
  function getCallback (callback) {
    setTimeout(() => {
      callback('callback\n')
    }, 3000)
  }

  /* 
  * 写在 await 之前是并发，写在 await 之后是继发
  */
  getCallback((data) => {
    res.write(data)
  })

  // 以下是继发执行
  /* 
  * await 后面是 Promise 对象或者 thenable 对象时才会暂停等待 Promise 对象的结果（resolve 或 reject 中的参数)
  * 否则直接返回对应的值
  */
  // let foo = await getFoo()
  // let bar = await getBar()

  // 并发执行, 写法 1
  /* 
  * Promise.all 的返回  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  * Promise.all([getFoo(), getBar()]).then(res => {}) ===> res 就是 ['foo', 'bar'], 所以 await 等到的结果就是 ['foo', 'bar']
  */
  let [foo, bar] = await Promise.all([getFoo(), getBar()])

  // 并发执行，写法 2
  /* 
  * 一旦新建 Promise 对象就会立即执行，所以这样可以做到并发
  */
  /* let fooPromise = getFoo()
  let barPromise = getBar()
  let foo = await fooPromise
  let bar = await barPromise */

  res.end(foo + bar)
}

exports.start = start
exports.upload = upload
exports.show = show
exports.asynctest = asynctest