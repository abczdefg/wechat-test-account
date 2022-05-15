const express = require('express');
const app = express();
const router = require('./router');
const xmlparser = require('express-xml-bodyparser');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded());
app.use(xmlparser());
app.use(bodyParser.json());

// 挂载并使用
app.use(router)

app.listen(8088, () => {
  console.log('服务已启动');
});
