import { CapacitorHttp } from '@capacitor/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// 1. 获取环境变量（可能为 undefined）
const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL;

// 2. 探测当前运行环境
const isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNative;
const isNative = isTauri || isCapacitor;

// 3. 核心防线：如果是原生 App 端，且没有配环境变量，直接报错崩溃，绝不带病上线！
if (isNative && !ENV_API_BASE) {
  throw new Error(
    '[Fatal] 原生端(App/Tauri)必须配置 VITE_API_BASE_URL。请在 .env.production 中设置后端地址。'
  );
}

// 4. 智能回退
// 网页端：如果没配环境变量，就等于空字符串 ''，自动走 Vite Proxy 或 Nginx 同源代理
// 原生端：走到这里说明上面的 if 没触发，ENV_API_BASE 绝对有值
const API_BASE = isNative ? ENV_API_BASE : ENV_API_BASE || '';

export async function request(url, options = {}) {
  const fullUrl = `${API_BASE}${url}`;

  // 桌面端环境 (Tauri)
  if (isTauri) {
    return tauriFetch(fullUrl, options);
  }

  // 移动端环境 (Capacitor)
  if (isCapacitor) {
    const response = await CapacitorHttp.request({
      url: fullUrl,
      method: options.method || 'GET',
      headers: options.headers || {},
      data: typeof options.body === 'string' ? JSON.parse(options.body) : options.body,
    });
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
    };
  }

  // 普通网页端
  return window.fetch(fullUrl, options);
}
