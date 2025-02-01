// 获取画布元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 创建图片对象
const imgIdle1 = new Image();
const imgIdle2 = new Image();
imgIdle1.src = 'images/idle1.png';  // 请确保路径正确
imgIdle2.src = 'images/idle2.png';  // 请确保路径正确

// 定义当前显示的图片标志
let currentImage = 1;

// 图片加载完成后启动动画
let imagesLoaded = 0;
const totalImages = 2; // 我们有两个图片

// 检查图片是否加载完毕
function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    startIdleAnimation();
  }
}

// 设置图片加载完成的回调
imgIdle1.onload = checkImagesLoaded;
imgIdle2.onload = checkImagesLoaded;

// 轮流切换待机图片
function startIdleAnimation() {
  setInterval(function() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 根据当前图片标志来决定绘制哪张图片
    if (currentImage === 1) {
      ctx.drawImage(imgIdle1, 0, 0);
      currentImage = 2;
    } else {
      ctx.drawImage(imgIdle2, 0, 0);
      currentImage = 1;
    }
  }, 500); // 每500毫秒切换一次
}
