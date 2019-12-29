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

exports.start = start
exports.upload = upload
exports.show = show
