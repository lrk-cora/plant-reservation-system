const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 创建数据库文件，存在项目根目录
const db = new sqlite3.Database(path.join(__dirname, 'reserve.db'), (err) => {
  if (err) console.error('数据库连接失败', err.message);
  else console.log('数据库连接成功');
});

// 创建预约表
db.run(`CREATE TABLE IF NOT EXISTS reserveList (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reserveType TEXT,
  plantName TEXT,
  reserveDate TEXT,
  reserveTime TEXT,
  userName TEXT,
  phone TEXT,
  remark TEXT,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = db;