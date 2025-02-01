const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 小鸡当前位置
let chickX = canvas.width / 2;
let chickY = canvas.height / 2;

// 图片素材路径
const chickImage = new Image();
chickImage.src = 'images/chick.png'; // 小鸡图片路径

const eggImage = new Image();
eggImage.src = 'images/egg.png';    // 鸡蛋图片路径

const scoreImage = new Image();
scoreImage.src = 'images/score.png'; // 分数底板图片路径

// 图片加载检测
chickImage.onload = function() {
  console.log("chick.png 加载成功");
};
chickImage.onerror = function() {
  console.error("chick.png 加载失败");
};

eggImage.onload = function() {
  console.log("egg.png 加载成功");
};
eggImage.onerror = function() {
  console.error("egg.png 加载失败");
};

scoreImage.onload = function() {
  console.log("score.png 加载成功");
};
scoreImage.onerror = function() {
  console.error("score.png 加载失败");
};

// 游戏主循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制小鸡
  if (chickImage.complete) {
    ctx.drawImage(chickImage, chickX, chickY);
    console.log("绘制小鸡");
  }

  // 使用 setTimeout 替代 setInterval
  setTimeout(gameLoop, 16);
}

// 确保所有图片加载完成
Promise.all([
  new Promise(resolve => { chickImage.onload = resolve; }),
  new Promise(resolve => { eggImage.onload = resolve; }),
  new Promise(resolve => { scoreImage.onload = resolve; })
]).then(() => {
  console.log("所有图片加载完成，启动游戏循环");
  gameLoop(); // 启动游戏循环
}).catch(error => {
  console.error("图片加载失败，无法启动游戏", error);
});
