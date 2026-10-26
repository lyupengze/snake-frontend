import { CapacitorHttp } from '@capacitor/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL;

// 运行时探测当前宿主环境
const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;
const isCapacitor =
  typeof window !== 'undefined' &&
  (window as any).Capacitor &&
  (window as any).Capacitor.getPlatform() !== 'web';
const isNative = isTauri || isCapacitor;

// Fail-Fast：原生端缺少后端地址配置时直接阻断启动，防止带病上线
if (isNative && !ENV_API_BASE) {
  throw new Error(
    '[Fatal] 原生端(App/Tauri)必须配置 VITE_API_BASE_URL。请在 .env.production 中设置后端地址。'
  );
}

// Web 端走同源代理（空字符串），原生端走绝对路径
const API_BASE = isNative ? ENV_API_BASE : ENV_API_BASE || '';

export interface RequestOptions extends RequestInit {
  body?: any;
}

// 统一网络请求层：根据运行环境自动选择 Tauri 插件 / Capacitor 原生 HTTP / 浏览器 fetch
export async function request(url: string, options: RequestOptions = {}): Promise<any> {
  const fullUrl = `${API_BASE}${url}`;

  if (isTauri) {
    return tauriFetch(fullUrl, options);
  }

  if (isCapacitor) {
    // 域名白名单校验，防止 SSRF
    const parsedUrl = new URL(fullUrl);
    const allowedHosts = ['39.106.162.26', 'snakebattle.cn', 'localhost', '127.0.0.1'];

    if (!allowedHosts.includes(parsedUrl.hostname)) {
      console.error(`[Security] 拦截了向未知域名的请求: ${parsedUrl.hostname}`);
      throw new Error(`Blocked request to unauthorized host: ${parsedUrl.hostname}`);
    }

    const response = await CapacitorHttp.request({
      url: fullUrl,
      method: options.method || 'GET',
      headers: (options.headers as Record<string, string>) || {},
      // Capacitor 原生层要求传入对象而非字符串
      data: typeof options.body === 'string' ? JSON.parse(options.body) : options.body,
    });

    // 适配为与 fetch API 一致的返回结构
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
    };
  }

  return window.fetch(fullUrl, options);
}

export const env = {
  isTauri,
  isCapacitor,
  isNative,
};
