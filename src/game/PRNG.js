/**
 * 带种子的伪随机数生成器 (Mulberry32 算法)
 *
 * [核心注意]：后端 C++ ReplayEngine.cpp 中使用了完全相同的算法。
 * 任何修改（包括运算顺序、位运算长度）都必须在前后端同步进行，
 * 否则会导致食物生成序列错位，重放校验失败 (403)。
 *
 * @param {number} seed 服务器下发的 32 位随机种子
 * @returns {function(): number} 返回一个无参数的函数，每次调用返回一个 32 位无符号整数
 */
export function createSeededRandom(seed) {
  // 强制转换为 32 位无符号整数，防止传入负数或超出 JS 安全整数范围导致越界污染
  let a = seed >>> 0;

  return function () {
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
