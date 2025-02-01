// 获取画布元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 创建图片对象
const imgIdle1 = new Image();
const imgIdle2 = new Image();
imgIdle1.src = 'images/idle1.png';  // 图片路径
imgIdle2.src = 'images/idle2.png';  // 图片路径

// 当前显示的图片
let currentImage = imgIdle1;

// 设定动画间隔（每500ms切换图片）
let frame = 0;  // 计数器，用于切换帧

// 绘制函数
function draw() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制当前的图片
  ctx.drawImage(currentImage, 0, 0);  // 你可以设置位置

  // 每次切换图片
  frame++;
  if (frame % 10 === 0) {  // 每10帧切换一次图片
    currentImage = (currentImage === imgIdle1) ? imgIdle2 : imgIdle1;
  }

  // 继续下一帧
  requestAnimationFrame(draw);
}

// 等待图片加载完成后开始绘制
imgIdle1.onload = imgIdle2.onload = function() {
  draw();
};
