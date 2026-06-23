// 后端接口地址，本地测试固定，部署后换成你的公网IP/域名
const baseUrl = "http://localhost:3000/api";

// ========== 替换为后端接口请求 ==========
const ReserveDB = {
  // 获取所有预约（管理员）
  async getAll() {
    const res = await fetch(`${baseUrl}/all`);
    const result = await res.json();
    return result.code === 200 ? result.data : [];
  },
  // 新增预约（用户提交）
  async add(item) {
    const res = await fetch(`${baseUrl}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    return await res.json();
  },
  // 删除预约
  async del(id) {
    const res = await fetch(`${baseUrl}/del/${id}`, { method: "DELETE" });
    return await res.json();
  }
};

// 页面导航高亮（保留原有逻辑，无需改动）
window.addEventListener('DOMContentLoaded', function () {
  const path = location.pathname
  const navLinks = document.querySelectorAll('.nav-links a')
  navLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (path.includes(href)) {
      link.style.color = '#b7e4c7'
    }
  })
})

// 弹窗通用函数（保留）
function showModal(id) {
  document.getElementById(id).classList.add('show')
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show')
}