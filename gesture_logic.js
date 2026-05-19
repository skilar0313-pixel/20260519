/**
 * 偵測手勢並回傳觸發動作
 * @param {Array} landmarks - MediaPipe 手部關鍵點 (21個)
 * @returns {string|null} - 'CONTINUE', 'END', 或 null
 */
function detectGesture(landmarks) {
  if (!landmarks) return null;

  // 1. 取得關鍵座標
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];

  // 計算大拇指與食指尖的距離 (手指愛心偵測)
  const heartDistance = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) + 
    Math.pow(thumbTip.y - indexTip.y, 2)
  );

  // --- 繼續：手指愛心 (大拇指與食指靠近，其餘手指收起) ---
  if (heartDistance < 0.03) { // 閾值可根據感應靈敏度調整
    return 'CONTINUE';
  }

  // --- 結束：僅伸出食指 ---
  const isIndexUp = indexTip.y < indexPip.y;
  const isMiddleDown = middleTip.y > middlePip.y;
  const isRingDown = ringTip.y > ringPip.y;
  const isPinkyDown = pinkyTip.y > pinkyPip.y;

  if (isIndexUp && isMiddleDown && isRingDown && isPinkyDown) {
    return 'END';
  }

  return null;
}