function route (handle, pathname, res, req) {
  console.log(`About to route a request for ${pathname}`)
  if (typeof handle[pathname] === 'function') {
    return handle[pathname](res, req)
  } else {
    console.log(`no request handler for ${pathname}`)
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('404 Not found')
  }
}

exports.route = route