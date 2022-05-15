const express = require('express');
const router = express.Router(); // 配置路由模块
const validateToken = require('../utils/validateToken');
const { timingSetToken } = require('../utils/tokenConfig');
const formmessage = require('../utils/formmessage');
const sendMeaasge = require('../utils/sendmessage');
const config = require('../config')

// 项目启动后获取Token
timingSetToken();


// get请求验证token有效性
router.get('/', (req, res) => {
  validateToken(req).then((t) => {
    res.send(t);
  }).catch(e => {
    res.send('hello');
  })
});

// 接收到微信请求
router.post('/', (req, res) => {
  // 调用方法回复微信消息
  formmessage(req.body).then((xml) => {
    res.send(xml);
  });
});

// 自定义消息
router.post('/custom-msg', (req, res) => {
  // wechat user id
  const data = req.body || {};
  const pwd = data.password;
  const msg = data.message || '';
  if (pwd !== config.customMessagePassword) {
    res.send('failed. invalid password');
    return;
  }
  if (!msg) {
    res.send('failed. message is empty');
    return;
  }
  sendMeaasge(config.customMessageWechatId, msg)
    .then(e => {
      res.send('success');
    })
    .catch(e => {
      res.send('failed');
    });
});

module.exports = router;
