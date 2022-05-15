const msgTemplate = require('./messageTemplate');

function formmessage(req) {
  // 获取微信传递过来的xml
  let xml = req.xml;
  return new Promise((resolve, reject) => {
    // 判断发送的消息类型
    switch (xml.msgtype[0]) {
      // 接收到文本消息
      case 'text':
        const reply = xml.content[0];
        const msgdata = {
          FromUserName: xml.fromusername[0],
          ToUserName: xml.tousername[0],
          reply,
        };
        resolve(msgTemplate.textMessage(msgdata));
        break;
      default:
        // 发送无用的消息是响应一个空字符串
        resolve('');
        break;
    }
  });
}

module.exports = formmessage;
