const Trailers = require('../../modul/trailers');
//创建一个模块用来用来将获取到的数据添加到数据库中
module.exports = async movies => {

  for (var i = 0; i < movies.length; i++) {
    let item = movies[i];
    console.log(item);
    await Trailers.create(item);
  }
}
