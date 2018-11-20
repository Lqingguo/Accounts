/**
 * Created by liqin on 2018/11/20.
 */
const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');
(async ()=>{

  //首先连接数据库
  await db;

  //调用crawler模块开始爬数据
  const movies = await crawler();
  //调用save方法将爬到的数据添加到数据库中
  await save(movies);

})();