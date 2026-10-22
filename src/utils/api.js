import { CapacitorHttp } from '@capacitor/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

// 【核心改造】从环境变量读取
const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// 如果是网页版（非 App），并且没配环境变量，就默认用相对路径（走 Nginx 同源代理）
const isWeb =
  typeof window !== 'undefined' &&
  !window.__TAURI_INTERNALS__ &&
  !(window.Capacitor && window.Capacitor.isNative);
const API_BASE = isWeb && !ENV_API_BASE ? '' : ENV_API_BASE;

export async function request(url, options = {}) {
  const fullUrl = `${API_BASE}${url}`;

  // 1. 桌面端环境 (Tauri)
  const isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
  if (isTauri) {
    return tauriFetch(fullUrl, options);
  }

  // 2. 移动端环境 (Capacitor / 纯血鸿蒙)
  const isNative = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNative;
  if (isNative) {
    const response = await CapacitorHttp.request({
      url: fullUrl,
      method: options.method || 'GET',
      headers: options.headers || {},
      data: options.body ? JSON.parse(options.body) : undefined,
    });
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
    };
  }

  // 3. 普通网页端
  return window.fetch(fullUrl, options);
}
