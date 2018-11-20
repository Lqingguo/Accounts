//首先引入express
const express = require('express');
//引入sha1加密算法
const xiaoxi=require('./pluck/xiaoxi')
//创建一个express对象
const sha1 = require('sha1');
const {url,appID} = require('./config');
const Wechat= require('./wekbek/accesstoken')
const wechat = new Wechat();
const app = express();

/*
  1. 搭建开发者服务器, 使用中间件接受请求
  2. 默认localhost:3000访问本地服务器， 需要一个互联网能够访问的域名地址
    借助ngrok工具，能将本地地址映射为互联网能访问的域名地址
  3. 测试号管理页面填写服务器配置：
    url：通过ngrok映射的地址   http://3389687c.ngrok.io
    token：参与微信签名加密的参数， 自己定义，尽量复杂
  4. 验证微信服务器有效性
    目的：验证消息来自于微信服务器， 同时返回一个特定参数给微信服务器（告诉微信服务器我这里准备ok）
    
    - 将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序排序
    - 将排序后的参数拼接在一起，进行sha1加密
    - 加密后的到的就是微信签名，将其与微信发送过来的微信签名对比，
      - 如果一样，说明消息来自于微信服务器，返回echostr给微信服务器
      - 如果不一样，说明消息不是微信服务器发送过来的，返回error
 */

//使用中间件的方式接收请求，因为不知道发过来请求的地址
app.set('views','views');
app.set('view engine','ejs');
app.get('/search',async(req,res)=>{
  //得到临时数据
  const {ticket} = await wechat.fetchTicket();
  //随机字符串
  const noncestr = Math.random().toString().split('.')[1];
  //事件戳
  const timestamp = parseInt(Date.now()/1000);
  //将四个参数按照key=value的方式组合一个数组
  const arr=[
    `noncestr=${noncestr}`,
    `jsapi_ticket=${ticket}`,
    `timestamp=${timestamp}`,
    `url=${url}/search`
  ];
  //排序, 以&拼接成一个字符串，再进行sha1加密，得到的就是加密签名
  const signature = sha1(arr.sort().join('&'));
  res.render('search',{
    signature,
    timestamp,
    noncestr,
    appID
  });
})

app.use(xiaoxi());

//监听一个端口号，
app.listen(3000, err => {
  //当使用这个端口号的时候返回服务器启动成功了
  if (!err) console.log('服务器启动成功了~');
  //当出错的时候打印这个错误
  else console.log(err);
});
