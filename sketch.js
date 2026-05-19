let hands;
let camera;
let currentStatus = "等待偵測...";

function setup() {
  createCanvas(640, 480);

  // 初始化 MediaPipe Hands
  hands = new Hands({
    locateFile: (file) => {
      // 這行非常重要！它解決了內部資源找不到導致的 404 錯誤
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  hands.onResults(onResults);

  // 初始化相機
  const videoElement = document.createElement('video');
  camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
  });
  camera.start();
}

function draw() {
  background(220);
  
  // 顯示當前狀態
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(50);
  text(currentStatus, width/2, height/2);
  
  textSize(16);
  text("愛心 = CONTINUE | 食指 = END", width/2, height - 30);
}

function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // 呼叫 gesture_logic.js 中的 detectGesture 函式
    const gesture = detectGesture(results.multiHandLandmarks[0]);
    
    if (gesture === 'CONTINUE') {
      currentStatus = "❤️ 繼續 (CONTINUE)";
    } else if (gesture === 'END') {
      currentStatus = "☝️ 結束 (END)";
    }
  } else {
    currentStatus = "未偵測到手部";
  }
}
