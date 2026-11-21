/**
 * 运行时宿主环境探测。
 *
 * 不依赖 Tauri / Capacitor 插件，供路由、网络层等模块共用，
 * 避免为了判断一个布尔值而把原生插件打进首屏包。
 */
type CapacitorGlobal = {
  Capacitor?: { getPlatform?: () => string };
};

const capacitor =
  typeof window !== 'undefined' ? (window as unknown as CapacitorGlobal).Capacitor : undefined;

export const isTauri =
  typeof window !== 'undefined' &&
  !!(window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;

export const isCapacitor =
  !!capacitor && typeof capacitor.getPlatform === 'function' && capacitor.getPlatform() !== 'web';

export const isNative = isTauri || isCapacitor;

const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

// 手机/平板浏览器：UA 命中，或主指针为粗指针（无 hover）时视为移动端。
// Tauri 桌面端忽略粗指针判断，避免带触屏的 Windows 设备被误判为移动端。
const isMobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|HarmonyOS|Windows Phone/i.test(
  userAgent
);

const isCoarsePointer =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/**
 * 是否运行在移动端（Capacitor Android/iOS 或手机浏览器）。
 *
 * 用于只对网页端/桌面端开放的界面能力（例如游戏画布放大）。
 */
export const isMobileDevice = isCapacitor || isMobileUserAgent || (!isTauri && isCoarsePointer);
