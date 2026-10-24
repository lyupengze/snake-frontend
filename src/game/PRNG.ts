/**
 * 带种子的伪随机数生成器 (Mulberry32 算法)
 *
 * [核心警告]
 * 这里面的任何数学运算和位运算，必须与后端 C++ (ReplayEngine.cpp) 保持 1:1 绝对一致。
 * 哪怕相差 1 个比特，都会导致前后端生成的食物序列错位，从而触发防作弊的 403 拦截。
 *
 * @param seed 服务器下发的 32 位无符号随机种子
 * @returns 返回一个闭包函数，每次调用返回一个 32 位无符号整数
 */
export function createSeededRandom(seed: number): () => number {
  // 强制转换为 32 位无符号整数，防止外部传入负数或浮点数导致位运算异常
  let a = seed >>> 0;

  return function (): number {
    // 状态推进：加上一个 32 位魔数
    a = (a + 0x6d2b79f5) >>> 0;

    let t = a;
    // 位运算混合：Math.imul 确保进行 32 位有符号整数乘法（模拟 C++ uint32_t 乘法溢出）
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) >>> 0;

    // 返回纯正的 32 位无符号整数结果
    return (t ^ (t >>> 14)) >>> 0;
  };
}
