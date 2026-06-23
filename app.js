const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态资源配置
app.use(express.static(__dirname));
// 首页默认跳转
app.get('/', (req, res) => {
  res.redirect('/html/index.html');
});

// 数据库文件
const DB_FILE = path.join(__dirname, 'data.json');
// 初始化数据库结构：预约表 + 植物表
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initData = {
      reserveList: [], // 用户预约数据
      plantList: [     // 初始自带植物数据
        { id: 1, name: "绿萝", type: "online", desc: "适合线上观察", img: "lvlu.jpg", status: 1 },
        { id: 2, name: "多肉拼盘", type: "offline", desc: "适合新手种植", img: "duorou.jpg", status: 1 },
        { id: 3, name: "薄荷", type: "both", desc: "线上线下均可", img: "bohe.jpg", status: 1 },
        { id: 4, name: "向日葵", type: "both", desc: "生长速度快", img: "xiangrikui.jpg", status: 0 }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initData, null, 2), 'utf8');
  }
}
initDB();

// 读取完整数据库
function getDB() {
  const content = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(content);
}
// 写入完整数据库
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ====================== 【1. 用户预约接口】 ======================
// 新增预约
app.post('/api/reserve/add', (req, res) => {
  const item = req.body;
  const db = getDB();
  const newItem = {
    id: Date.now(),
    createTime: new Date().toLocaleString(),
    ...item
  };
  db.reserveList.push(newItem);
  saveDB(db);
  res.json({ code: 200, msg: '预约成功', id: newItem.id });
});
// 获取全部预约
app.get('/api/reserve/all', (req, res) => {
  const db = getDB();
  res.json({ code: 200, data: db.reserveList });
});
// 删除预约
app.delete('/api/reserve/del/:id', (req, res) => {
  const delId = Number(req.params.id);
  const db = getDB();
  db.reserveList = db.reserveList.filter(item => item.id !== delId);
  saveDB(db);
  res.json({ code: 200, msg: '删除成功' });
});

// ====================== 【2. 植物动态管理全套接口】 ======================
// 获取全部植物（前端页面调用）
app.get('/api/plant/all', (req, res) => {
  const db = getDB();
  // 必须完整返回 code + data
  res.json({ code: 200, data: db.plantList });
});
// 新增植物（管理员后台）
app.post('/api/plant/add', (req, res) => {
  const info = req.body;
  const db = getDB();
  const newId = Date.now();
  db.plantList.push({ id: newId, ...info });
  saveDB(db);
  res.json({ code: 200, msg: '植物新增成功', id: newId });
});
// 编辑植物
app.put('/api/plant/edit/:id', (req, res) => {
  const editId = Number(req.params.id);
  const info = req.body;
  const db = getDB();
  const index = db.plantList.findIndex(p => p.id === editId);
  if(index === -1) return res.json({code:500,msg:"植物不存在"});
  db.plantList[index] = { ...db.plantList[index], ...info };
  saveDB(db);
  res.json({ code: 200, msg: '编辑成功' });
});
// 删除植物
app.delete('/api/plant/del/:id', (req, res) => {
  const delId = Number(req.params.id);
  const db = getDB();
  db.plantList = db.plantList.filter(p => p.id !== delId);
  saveDB(db);
  res.json({ code: 200, msg: '删除成功' });
});

app.listen(port, () => {
  console.log(`服务运行：http://localhost:${port}`);
  console.log(`管理员后台地址：http://localhost:${port}/html/admin.html`);
});