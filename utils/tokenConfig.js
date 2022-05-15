const fs = require('fs');
const path = require('path');
const axios = require('axios');
const fileUrl = path.resolve(__dirname, '../public/token.json');
const config = require('../config');
const APPID = config.APPID;
const APPSECRET = config.APPSECRET;
let INTERTIME = (7200 - 60) * 1000; // 设置一个默认的定期获取token的时间

// 单位秒
const getNow = () => Math.ceil(new Date().getTime() / 1000);

// 保存Token
async function setToken() {
  const tokenConfig = await getTokenConfig();
  const { current_time = 0, expires_in = 0, token } = tokenConfig;
  let now = getNow();
  let fileContent = {};
  let expireTime = INTERTIME;
  if (now < current_time + expires_in) {
    expireTime = expires_in - (now - current_time);
    fileContent = {
      current_time: now,
      expires_in: expireTime,
      token,
    }
  } else {
    const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`);
    now = getNow();
    expireTime = res.data.expires_in;
    fileContent = {
      current_time: now,
      expires_in: expireTime,
      token: res.data.access_token,
    }
  }
  return new Promise((resolve) => {
    fs.writeFile(fileUrl, JSON.stringify(fileContent), (fserr, fsres) => {
      resolve();
    });
  });
}

// 定时获取Token
function timingSetToken() {
  setToken().then(() => {
    setTimeout(() => {
      timingSetToken();
    }, INTERTIME);
  });
}

// 获取Token
function getTokenConfig() {
  return new Promise((resolve, reject) => {
    // 从json中读取保存的Token
    fs.readFile(fileUrl, (err, data) => {
      resolve(JSON.parse(data));
    });
  });
}

// 获取Token
function getToken() {
  return getTokenConfig().then(data => data.token);
}

module.exports = {
  setToken, // 更新token
  getToken, // 返回获取到的token
  timingSetToken, // 定时更新token
};
