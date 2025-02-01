// Polyfill: 确保在不支持 requestAnimationFrame 的环境下使用 setTimeout 实现
window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               function(callback) {
                                  return setTimeout(callback, 1000 / 60);
                               };

// 获取 canvas 和绘图上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 小鸡当前位置（基准位置，用于移动和状态计算）
let chickX = canvas.width / 2;
let chickY = canvas.height / 2;
// 新目标位置（移动时用）
let targetX = chickX;
let targetY = chickY;
// 当前状态：idle（待机）、moving（移动）、egg（下蛋）
let currentState = "idle";
// 移动速度（每帧移动的像素值，可根据需要调整）
const moveSpeed = 5;

// 已下鸡蛋数组，每个元素为 { x, y }（鸡蛋绘制位置）
const laidEggs = [];
// 分数（每下一个蛋加 1）
let score = 0;

// 图片素材路径
const chickImage = new Image();
chickImage.src = 'images/chick.png'; // 小鸡的静态图片
chickImage.onerror = function() { console.error("加载 chick.png 失败"); };

const eggImage = new Image();
eggImage.src = 'images/egg.png'; // 鸡蛋的静态图片
eggImage.onerror = function() { console.error("加载 egg.png 失败"); };

const scoreImage = new Image();
scoreImage.src = 'images/score.png'; // 分数底板的静态图片
scoreImage.onerror = function() { console.error("加载 score.png 失败"); };

// 游戏主循环
function gameLoop(timestamp) {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 先绘制所有已下的鸡蛋
  laidEggs.forEach(egg => {
    ctx.drawImage(eggImage, egg.x, egg.y);
  });
  
  // 状态机逻辑处理
  if (currentState === "moving") {
    // 计算当前位置与目标位置的差值
    const dx = targetX - chickX;
    const dy = targetY - chickY;
    if (Math.abs(dx) < moveSpeed && Math.abs(dy) < moveSpeed) {
      // 到达目标位置，切换到下蛋状态
      chickX = targetX;
      chickY = targetY;
      currentState = "egg";
    } else {
      // 按直线方向移动
      const angle = Math.atan2(dy, dx);
      chickX += moveSpeed * Math.cos(angle);
      chickY += moveSpeed * Math.sin(angle);
    }
  } else if (currentState === "egg") {
    // 下蛋逻辑
    laidEggs.push({
      x: chickX + chickImage.width / 2 - eggImage.width / 2,
      y: chickY + chickImage.height
    });
    score++;
    currentState = "idle"; // 下蛋后回到待机状态
  }
  
  // 绘制小鸡
  if (chickImage.complete) {
    ctx.drawImage(chickImage, chickX, chickY);
  }
  
  // 绘制右上角分数板
  if (scoreImage.complete) {
    const scoreBoardX = canvas.width - scoreImage.width - 10;
    const scoreBoardY = 10;
    ctx.drawImage(scoreImage, scoreBoardX, scoreBoardY);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(score, scoreBoardX + scoreImage.width / 2, scoreBoardY + scoreImage.height / 2 + 7);
  }
  
  window.requestAnimationFrame(gameLoop);
}

// 监听 canvas 的点击事件：仅在 idle 状态下响应点击
canvas.addEventListener("click", function(event) {
  if (currentState !== "idle") return;
  
  // 获取点击位置（相对于 canvas）
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  
  // 检查点击是否落在小鸡范围内
  if (clickX >= chickX && clickX <= chickX + chickImage.width &&
      clickY >= chickY && clickY <= chickY + chickImage.height) {
    // 随机生成新的目标位置（保证小鸡不会超出画布边界）
    targetX = Math.random() * (canvas.width - chickImage.width);
    targetY = Math.random() * (canvas.height - chickImage.height);
    // 切换到移动状态
    currentState = "moving";
  }
});

// 启动游戏循环
window.requestAnimationFrame(gameLoop);
