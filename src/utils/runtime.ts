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
  !!capacitor &&
  typeof capacitor.getPlatform === 'function' &&
  capacitor.getPlatform() !== 'web';

export const isNative = isTauri || isCapacitor;
