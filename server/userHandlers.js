const userModel = require('./userModel')
const express = require('express')
const router = express.Router()

const handleId = function (idString) {
  return idString.replace(/"/g, '')
}

const handleError = function (res, err) {
  res.status(500).send(err)
}

// 渲染用户列表
// callback 形式
/* router.get('/user', (req, res) => {
  userModel.find((err, users) => {
    if (err) return handleError(res, err)
    res.render('index.html', {
      fruits: ['1', '2', '3'],
      users
    })
  })

  // Promise 形式
  userModel.find().then(ret => {
    res.render('index.html', {
      fruits: ['1', '2', '3'],
      users: ret
    })
  }, err => {
    res.send(err)
  })
}) */

// async await 形式
router.get('/user', async (req, res) => {
  try {
    let users = await userModel.find()
      .catch(e => {
        // throw 之后的语句将不会被执行，并且控制将被传递到调用堆栈中的第一个 catch 块
        throw e
      })

    res.render('index.html', {
      fruits: ['2', '2', '4'],
      users
    })
  } catch (e) {
    handleError(res, e)
  }
})

// 渲染新增用户
router.get('/user/new', (req, res) => {
  res.render('new.html')
})

// 处理新增用户请求
router.post('/user/new', (req, res) => {
  new userModel(req.body).save(err => {
    if (err) return handleError(res, err)
    res.redirect('/user')
  })
})

// 渲染编辑页面
router.get('/user/edit', (req, res) => {
  userModel.findById(handleId(req.query.id), (err, user) => {
    if (err) return handleError(res, err)
    res.render('edit.html', {
      user
    })
  })
})

// 处理编辑用户请求
router.post('/user/edit', (req, res) => {
  userModel.findByIdAndUpdate(handleId(req.body.id), req.body, err => {
    if (err) return handleError(res, err)
    res.redirect('/user')
  })
})

// 处理删除用户请求
router.get('/user/delete', async (req, res) => {
  /* userModel.findByIdAndRemove(handleId(req.query.id), err => {
    if (err) return handleError(res, err)
    res.redirect('/user')
  }) */

  try {
    await userModel.findByIdAndRemove(req.query.id)
      .catch(e => {
        throw e
      })

    res.redirect('/user')
  } catch (e) {
    handleError(res, e)
  }
})

module.exports = router
