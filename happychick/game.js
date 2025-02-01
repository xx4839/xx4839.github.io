// 获取 canvas 和绘图上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 小鸡当前位置（基准位置，用于移动和状态计算）
let chickX = canvas.width / 2;
let chickY = canvas.height / 2;
// 新目标位置（移动时用）
let targetX = chickX;
let targetY = chickY;
// 当前状态：idle（待机）、moving（移动）、egg（下蛋动画）
let currentState = "idle";

// 移动速度（每帧移动的像素值，可根据需要调整）
const moveSpeed = 5;

// 已下鸡蛋数组，每个元素为 { x, y }（鸡蛋绘制位置）
const laidEggs = [];
// 分数（每下一个蛋加 1）
let score = 0;

// 图片素材路径（只使用第一帧）
const idleImageSrc = 'images/idle1.png'; // 待机状态图片
const moveImageSrc = 'images/move1.png'; // 移动状态图片
const eggImageSrc = 'images/egg1.png';   // 下蛋状态图片

// 用于存放加载后的 Image 对象
const idleImage = new Image();
idleImage.src = idleImageSrc;
idleImage.onerror = function() { console.error("加载 idle1.png 失败"); };

const moveImage = new Image();
moveImage.src = moveImageSrc;
moveImage.onerror = function() { console.error("加载 move1.png 失败"); };

const eggImage = new Image();
eggImage.src = eggImageSrc;
eggImage.onerror = function() { console.error("加载 egg1.png 失败"); };

// 新增素材：静态鸡蛋和分数底板
const staticEggImage = new Image();
staticEggImage.src = 'images/egg.png';
staticEggImage.onerror = function() { console.error("加载 egg.png 失败"); };

const scoreImage = new Image();
scoreImage.src = 'images/score.png';
scoreImage.onerror = function() { console.error("加载 score.png 失败"); };

// 图片加载完成后启动游戏循环
let imagesLoaded = 0;
const totalImages = 5; // idleImage, moveImage, eggImage, staticEggImage, scoreImage

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    startGameLoop();
  }
}

idleImage.onload = checkImagesLoaded;
moveImage.onload = checkImagesLoaded;
eggImage.onload = checkImagesLoaded;
staticEggImage.onload = checkImagesLoaded;
scoreImage.onload = checkImagesLoaded;

// 游戏主循环
function gameLoop() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 先绘制所有已下的鸡蛋
  laidEggs.forEach(egg => {
    ctx.drawImage(staticEggImage, egg.x, egg.y);
  });
  
  // 取小鸡尺寸（假设所有图片尺寸一致，以 idleImage 为准）
  const chickWidth = idleImage.width;
  const chickHeight = idleImage.height;
  
  // 状态机逻辑处理
  if (currentState === "moving") {
    // 计算当前位置与目标位置的差值
    const dx = targetX - chickX;
    const dy = targetY - chickY;
    if (Math.abs(dx) < moveSpeed && Math.abs(dy) < moveSpeed) {
      // 到达目标位置，切换到下蛋动画状态
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
      x: chickX + chickWidth / 2 - staticEggImage.width / 2,
      y: chickY + chickHeight
    });
    score++;
    currentState = "idle";
  }
  
  // 根据当前状态选择对应的图片
  let currentImage;
  if (currentState === "moving") {
    currentImage = moveImage;
  } else if (currentState === "egg") {
    currentImage = eggImage;
  } else {
    currentImage = idleImage;
  }
  
  // 在下蛋状态中，为了模拟“跳起来下蛋”，小鸡整体上移半个身位
  let offsetY = (currentState === "egg") ? -chickHeight / 2 : 0;
  
  // 绘制小鸡（始终绘制在鸡蛋之上）
  ctx.drawImage(currentImage, chickX, chickY + offsetY);
  
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
  
  // 使用 setTimeout 递归调用 gameLoop，实现动画循环
  setTimeout(gameLoop, 1000 / 60); // 每秒 60 帧
}

// 启动游戏循环
function startGameLoop() {
  gameLoop();
}

// 监听 canvas 的点击事件：仅在 idle 状态下响应点击
canvas.addEventListener("click", function(event) {
  if (currentState !== "idle") return;
  
  // 获取点击位置（相对于 canvas）
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  
  // 取小鸡尺寸
  const chickWidth = idleImage.width;
  const chickHeight = idleImage.height;
  
  // 检查点击是否落在小鸡范围内（idle 状态下小鸡未偏移）
  if (clickX >= chickX && clickX <= chickX + chickWidth &&
      clickY >= chickY && clickY <= chickY + chickHeight) {
    // 随机生成新的目标位置（保证小鸡不会超出画布边界）
    targetX = Math.random() * (canvas.width - chickWidth);
    targetY = Math.random() * (canvas.height - chickHeight);
    // 切换到移动状态
    currentState = "moving";
  }
});
