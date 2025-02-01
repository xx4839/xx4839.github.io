const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 加载图片
const chickImage = new Image();
const eggImage = new Image();
chickImage.src = 'images/chick.png'; // 小鸡图片路径
eggImage.src = 'images/egg.png';    // 鸡蛋图片路径

// 小鸡的初始位置和速度
const chick = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  speed: 5
};

// 两个鸡蛋的位置
const eggs = [
  { x: 300, y: 200, width: 30, height: 40 },
  { x: 500, y: 400, width: 30, height: 40 }
];

// 绘制小鸡
function drawChick() {
  ctx.drawImage(chickImage, chick.x, chick.y, chick.width, chick.height);
}

// 绘制鸡蛋
function drawEggs() {
  eggs.forEach(egg => {
    ctx.drawImage(eggImage, egg.x, egg.y, egg.width, egg.height);
  });
}

// 清除画布
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 更新游戏状态
function update() {
  clearCanvas();
  drawChick();  // 绘制小鸡
  drawEggs();   // 绘制鸡蛋
}

// 处理键盘输入
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      chick.y -= chick.speed;
      break;
    case 'ArrowDown':
      chick.y += chick.speed;
      break;
    case 'ArrowLeft':
      chick.x -= chick.speed;
      break;
    case 'ArrowRight':
      chick.x += chick.speed;
      break;
  }
});

// 游戏循环
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// 确保图片加载完成后再启动游戏
Promise.all([
  new Promise(resolve => { chickImage.onload = resolve; }),
  new Promise(resolve => { eggImage.onload = resolve; })
]).then(() => {
  gameLoop(); // 启动游戏循环
});
