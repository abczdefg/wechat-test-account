const axios = require('axios');
const { getToken } = require('../utils/tokenConfig');

async function sendMeaasge (toUser, message) {
  const token = await getToken();
  return axios.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${token}`, {
    touser: toUser,
    msgtype: 'text',
    text: {
      content: message
    }
  }, {
    headers: {
      'content-type': 'application/json'
    },
  });
}
module.exports = sendMeaasge;
