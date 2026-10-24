import { CapacitorHttp } from '@capacitor/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// ==========================================
// 环境探测与配置
// ==========================================

const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL;

// 探测当前运行环境（通过类型断言骗过 TS，因为 window 对象原生没有这些属性）
const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;
const isCapacitor =
  typeof window !== 'undefined' &&
  (window as any).Capacitor &&
  (window as any).Capacitor.getPlatform() !== 'web';
const isNative = isTauri || isCapacitor;

// [Fail-Fast 机制] 原生端打包时如果漏配 VITE_API_BASE_URL，直接阻断运行，防止带病上线
if (isNative && !ENV_API_BASE) {
  throw new Error(
    '[Fatal] 原生端(App/Tauri)必须配置 VITE_API_BASE_URL。请在 .env.production 中设置后端地址。'
  );
}

// 确定 API 基础路径：Web 端为空字符串（走代理），原生端为绝对路径
const API_BASE = isNative ? ENV_API_BASE : ENV_API_BASE || '';

export interface RequestOptions extends RequestInit {
  body?: any;
}

/**
 * 统一网络请求封装（适配 Web, Tauri, Capacitor）
 *
 * @param url 请求路径（如 '/api/leaderboard'）
 * @param options fetch 配置项
 * @returns 标准 Response 对象或 Capacitor 模拟对象
 */
export async function request(url: string, options: RequestOptions = {}): Promise<any> {
  const fullUrl = `${API_BASE}${url}`;

  // 1. Tauri 桌面端：使用 Rust 底层发起请求，绕过浏览器 CORS
  if (isTauri) {
    return tauriFetch(fullUrl, options);
  }

  // 2. Capacitor 移动端：使用原生 HTTP 插件
  if (isCapacitor) {
    const response = await CapacitorHttp.request({
      url: fullUrl,
      method: options.method || 'GET',
      headers: (options.headers as Record<string, string>) || {},
      // Capacitor 原生层要求传入对象而不是字符串
      data: typeof options.body === 'string' ? JSON.parse(options.body) : options.body,
    });
    // 封装成与 fetch API 一致的结构
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
    };
  }

  // 3. Web 浏览器端
  return window.fetch(fullUrl, options);
}

// 导出环境判断供 UI 层使用
export const env = {
  isTauri,
  isCapacitor,
  isNative,
};
