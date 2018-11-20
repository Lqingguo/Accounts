/**
 * Created by liqin on 2018/11/17.
 */

const {getUserDataAsync,getUserDataxmljs,formatMessage} = require('../utils/toop')
const sha1 = require('sha1');
const temp =require('./temp');
const pul =require('./pul')
const config=require('../config')
module.exports=()=>{
  return async (req, res, next) => {
    //打印微信服务器发送过来的数据

    //这是微信服务器发送过来的数据
    /*
     { signature: 'ff299dfb0059ee0359f0851e30d9ae8ee439790a',  微信签名
     echostr: '3330701733801130972',  微信后台生成随机字符串
     timestamp: '1542349780',   时间戳
     nonce: '1704777037' }      微信后台生成随机数字
     */
    //首先用解构赋值的方法的到  发过来的各个属性的值
    const {signature, echostr, timestamp, nonce} = req.query;
    //由于微信服务器要识别是哪一个账号发送的。要检验timestamp，nonce和唯一一个你自己知道的和微信服务器
    //知道的token    sort（）方法是按先后顺序排列
    const {token} = config;
    const arr = [timestamp, nonce, token].sort();
    //因为他是一个数组 用join（）的方法把他数组中的变成字符串,再用sha1加密
    const str = sha1(arr.join(''));
    //method可以用来获取发送请求是用什么方式发来的
    if(req.method==='GET'){
      //判断服务器传来的数据和str是否相等，相等了就证明数据是来自于服务器
      if (signature === str) {
        //说明消息来自于微信服务器
        //当消息来自服务器的时候吧微信后台生成的随机字符串返回回去
        res.end(echostr);
      } else {
        //说明消息不来自于微信服务器返回出去一个错误
        res.end('error');
      }
      //判断，如果服务器发送过来的数据是用POST凡是发送的
    }else if(req.method ==='POST'){
      if(signature!== str){
        res.end('error');
        return
      }
      //这时用户发送过来的消息在请求体
      //掉用外部的模块获取到微信服务器发送过来的数据
      //这时获取到的数据是xml类型的
      const xmlData =await  getUserDataAsync(req);

      //这时获得的数据为xml类型的数据要将他转换为js对象
      /*
       <xml><ToUserName><![CDATA[gh_9ee0ac732292]]></ToUserName>
       <FromUserName><![CDATA[onIw01o8oGilXUydCAu7gRY9t9tg]]></FromUserName>
       <CreateTime>1542365595</CreateTime>
       <MsgType><![CDATA[text]]></MsgType>
       <Content><![CDATA[啦啦]]></Content>
       <MsgId>6624409789425008903</MsgId>
       </xml>
       * */
      //引用一个包将xml格式转换为对象模式
      const  jsdata = await getUserDataxmljs(xmlData);
      //转换成对象模式有缺点，操作不方便，属性值是用数组存储的，这时将他转换为正常的对象
      const message = formatMessage(jsdata);
      console.log(message);
      // { ToUserName: 'gh_9ee0ac732292',
      //   FromUserName: 'onIw01o8oGilXUydCAu7gRY9t9tg',
      //   CreateTime: '1542368467',
      //   MsgType: 'text',
      //   message: 'gjjyu',
      //   MsgId: '6624422124571083043' }


      //创建一个初始化的content数据作为消息回复的默认值

      //创建一个变量返回，返回的时候还得转换为xml数据类型
      const options = pul(message);
      const massage = temp(options);
      console.log(massage)
      //将创建好的xml数据返回到微信服务器
      res.send(massage)
    }else {
      res.send('error')
    }

  };
}
