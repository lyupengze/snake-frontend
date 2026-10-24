import { CapacitorHttp } from '@capacitor/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// ==========================================
// 环境探测与配置
// ==========================================

// 获取环境变量中配置的 API 基础路径
const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL;

// 探测当前运行环境（Tauri 桌面端 / Capacitor 移动端）
const isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNative;
const isNative = isTauri || isCapacitor;

// [Fail-Fast 机制] 原生端打包时如果漏配 VITE_API_BASE_URL，直接阻断运行，防止带病上线
if (isNative && !ENV_API_BASE) {
  throw new Error(
    '[Fatal] 原生端(App/Tauri)必须配置 VITE_API_BASE_URL。请在 .env.production 中设置后端地址。'
  );
}

// 确定 API 基础路径：
// Web 端：如果未配环境变量，则为空字符串 ''（走 Nginx 同源代理或 Vite Proxy）
// 原生端：由于前面的拦截，这里绝对有值
const API_BASE = isNative ? ENV_API_BASE : ENV_API_BASE || '';

// ==========================================
// 统一网络请求封装
// ==========================================

/**
 * 发起 HTTP 请求（自动适配 Web, Tauri, Capacitor 环境）
 * @param {string} url 请求路径，如 '/api/leaderboard'
 * @param {object} options fetch 配置项
 * @returns {Promise<Response|object>} 标准 Response 对象或 Capacitor 模拟对象
 */
export async function request(url, options = {}) {
  const fullUrl = `${API_BASE}${url}`;

  // 1. Tauri 桌面端：使用 Tauri 原生 HTTP 插件（绕过浏览器 CORS 限制）
  if (isTauri) {
    return tauriFetch(fullUrl, options);
  }

  // 2. Capacitor 移动端：使用 Capacitor 原生 HTTP 插件
  if (isCapacitor) {
    const response = await CapacitorHttp.request({
      url: fullUrl,
      method: options.method || 'GET',
      headers: options.headers || {},
      // Capacitor 原生层要求传入对象而不是字符串
      data: typeof options.body === 'string' ? JSON.parse(options.body) : options.body,
    });
    // 封装成与 fetch API 一致的结构，保持调用方代码统一
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
    };
  }

  // 3. Web 浏览器端：使用原生 fetch
  return window.fetch(fullUrl, options);
}

// [新增] 导出环境判断，供 UI 层根据平台差异化渲染
export const env = {
  isTauri,
  isCapacitor,
  isNative,
};
