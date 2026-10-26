/**
 * Mulberry32 伪随机数生成器
 *
 * 警告：所有位运算和算术运算必须与后端 ReplayEngine.cpp 中的实现保持比特级一致。
 * 任何偏差都会导致前后端食物序列错位，触发防作弊 403 拦截。
 */
export function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;

  return function (): number {
    a = (a + 0x6d2b79f5) >>> 0;

    let t = a;
    // Math.imul 模拟 C++ uint32_t 的 32 位乘法溢出行为
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) >>> 0;

    return (t ^ (t >>> 14)) >>> 0;
  };
}
