// 获取画布元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 创建图片对象
const img = new Image();
img.src = 'images/idle1.png'; // 请根据实际路径修改

// 图片加载完成后绘制
img.onload = function() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制图片到画布
  ctx.drawImage(img, 0, 0);
};
