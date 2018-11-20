
const {writeFile, readFile,creatReadStream} = require('fs');
const {parseString} = require('xml2js')
module.exports ={
  //创建一个函数用来解析服务器发送过来的数据
  getUserDataAsync(req){
    //给他返回一个promise对象 因为他都是异步函数，要用promise函数来配合async函数结局异步回校
    return new Promise(resolve=>{
      let result='';

      req.on('data',data=>{
        result+=data.toString();
      })
        //当数据接收完毕的时候返回接收到的数据
        .on('end',()=>{
          resolve(result);
        })
    })
  },
  //封装一个函数用来解决将xml数据转换为js对象
  getUserDataxmljs(xmlData){
    return new Promise((resolve,reject)=>{
      //trim：true去掉空格
      parseString(xmlData,{trim:true},(err,data)=>{
        if(!err){
          //没有失败的话，将转换成功的data传出去
          resolve(data)
        }else{
          //失败了传出去哪里出错了方便以后查找
          reject('getUserDataxmljs出了问题'+err)
        }
      })
    })
  },
  //将对象下的属性值为数组的转换为字符串的形式
  formatMessage({xml}){
    //创建一个空对象用来接
    let result = {};
    //遍历这个对象
    for(let i in xml){
      //创建一个边量用来存储xml上的属性值
      let value = xml[i];
      //把这个每个属性值添加到这个属性上
      result[i] = value[0];
    }
    //把这个值返回
    return result;
  },
  //写入封装方法
  writeFileAsync (filePath, data) {
    return new Promise((resolve, reject) => {
      //js对象没办法存储，会默认调用toString() --->  [object Object]
      //将js对象转化为json字符串
     writeFile(filePath, JSON.stringify(data), err => {
        if (!err) {
          resolve();
        } else {
          reject('writeFileAsync方法出了问题：' + err);
        }
      })
    })
  },
  readFileAsync (filePath) {
    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        //读取的data数据  二进制数据，buffer
        if (!err) {
          //在调用JSON.parse将json字符串解析为js对象
          resolve(JSON.parse(data.toString()));
        } else {
          reject('readFileAsync方法出了问题:' + err);
        }
      })
    })
  }


};