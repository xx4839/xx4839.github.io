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
// 当前状态：idle（待机）、moving（移动）、egg（下蛋动画）
let currentState = "idle";
// 动画帧索引和时间控制
let frameIndex = 0;
let lastFrameTime = 0;
const frameInterval = 200; // 每帧切换间隔（毫秒）

// 移动速度（每帧移动的像素值，可根据需要调整）
const moveSpeed = 5;

// 已下鸡蛋数组，每个元素为 { x, y }（鸡蛋绘制位置）
const laidEggs = [];
// 分数（每下一个蛋加 1）
let score = 0;

// 图片素材路径数组
const idleFramesSrc = ['images/idle1.png', 'images/idle2.png'];
const moveFramesSrc = ['images/move1.png', 'images/move2.png'];
const eggAnimFramesSrc = ['images/egg1.png', 'images/egg2.png'];

// 用于存放加载后的 Image 对象
const idleFrames = [];
const moveFrames = [];
const eggAnimFrames = [];

// 新增素材：静态鸡蛋和分数底板
const eggImage = new Image();
eggImage.src = 'images/egg.png';
eggImage.onerror = function() { console.error("加载 egg.png 失败"); };

const scoreImage = new Image();
scoreImage.src = 'images/score.png';
scoreImage.onerror = function() { console.error("加载 score.png 失败"); };

// 通用图片加载函数：依次加载各组图片
function loadImages(sources, targetArray, callback) {
  let loadedCount = 0;
  sources.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === sources.length) {
        callback();
      }
    };
    img.onerror = () => {
      console.error("加载图片失败：", src);
    };
    targetArray.push(img);
  });
}

// 依次加载待机、移动、下蛋动画帧，加载完成后启动游戏循环
loadImages(idleFramesSrc, idleFrames, () => {
  loadImages(moveFramesSrc, moveFrames, () => {
    loadImages(eggAnimFramesSrc, eggAnimFrames, () => {
      window.requestAnimationFrame(gameLoop);
    });
  });
});

// 游戏主循环
function gameLoop(timestamp) {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 先绘制所有已下的鸡蛋
  laidEggs.forEach(egg => {
    ctx.drawImage(eggImage, egg.x, egg.y);
  });
  
  // 取小鸡尺寸（假设所有动画帧尺寸一致，以 idleFrames[0] 为准）
  const chickWidth = idleFrames[0].width;
  const chickHeight = idleFrames[0].height;
  
  // 根据时间更新动画帧
  if (timestamp - lastFrameTime > frameInterval) {
    frameIndex++;
    lastFrameTime = timestamp;
  }
  
  // 状态机逻辑处理
  if (currentState === "moving") {
    // 计算当前位置与目标位置的差值
    const dx = targetX - chickX;
    const dy = targetY - chickY;
    if (Math.abs(dx) < moveSpeed && Math.abs(dy) < moveSpeed) {
      // 到达目标位置，切换到下蛋动画状态，并重置帧索引
      chickX = targetX;
      chickY = targetY;
      currentState = "egg";
      frameIndex = 0;
    } else {
      // 按直线方向移动
      const angle = Math.atan2(dy, dx);
      chickX += moveSpeed * Math.cos(angle);
      chickY += moveSpeed * Math.sin(angle);
    }
  } else if (currentState === "egg") {
    // 播放下蛋动画，当动画播放完毕时执行下蛋逻辑
    if (frameIndex >= eggAnimFrames.length) {
      // 下蛋位置：小鸡正下方，以小鸡底部为基准居中显示
      laidEggs.push({
        x: chickX + chickWidth / 2 - eggImage.width / 2,
        y: chickY + chickHeight
      });
      score++;
      currentState = "idle";
      frameIndex = 0;
    }
  }
  
  // 根据当前状态选择对应的动画帧数组
  let currentFrameArray;
  if (currentState === "moving") {
    currentFrameArray = moveFrames;
  } else if (currentState === "egg") {
    currentFrameArray = eggAnimFrames;
  } else {
    currentFrameArray = idleFrames;
  }
  
  // 在下蛋状态中，为了模拟“跳起来下蛋”，小鸡整体上移半个身位
  let offsetY = (currentState === "egg") ? -chickHeight / 2 : 0;
  
  // 绘制小鸡（始终绘制在鸡蛋之上）
  const frame = currentFrameArray[frameIndex % currentFrameArray.length];
  ctx.drawImage(frame, chickX, chickY + offsetY);
  
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
  
  // 取小鸡尺寸
  const chickWidth = idleFrames[0].width;
  const chickHeight = idleFrames[0].height;
  
  // 检查点击是否落在小鸡范围内（idle 状态下小鸡未偏移）
  if (clickX >= chickX && clickX <= chickX + chickWidth &&
      clickY >= chickY && clickY <= chickY + chickHeight) {
    // 随机生成新的目标位置（保证小鸡不会超出画布边界）
    targetX = Math.random() * (canvas.width - chickWidth);
    targetY = Math.random() * (canvas.height - chickHeight);
    // 切换到移动状态，重置动画帧
    currentState = "moving";
    frameIndex = 0;
  }
});
