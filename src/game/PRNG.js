// src/game/PRNG.js
export function createSeededRandom(seed) {
  // 强制转换为 32 位无符号整数，防止越界污染
  let a = seed >>> 0;

  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) >>> 0;
    // 返回纯纯的 32 位整数
    return (t ^ (t >>> 14)) >>> 0;
  };
}
