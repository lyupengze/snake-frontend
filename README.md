# 🎮 Snake Game Frontend (Vue 3 / Canvas)

![Vue](https://img.shields.io/badge/Vue-3.x-42b883.svg)
![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)
![Vue Router](https://img.shields.io/badge/Router-4.x-green.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8DB.svg)
![Capacitor](https://img.shields.io/badge/Capacitor-6.x-53B9FF.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

这是一个基于 **Vue3 + Canvas** 构建的响应式贪吃蛇客户端。不仅支持丝滑的 Web 体验，更通过 **Tauri (Rust)** 和 **Capacitor** 实现了桌面端与安卓端的**全平台制霸**。

🔗 **在线试玩地址**: [http://39.106.162.26](http://39.106.162.26)

## ✨ 核心特性

- **📱 全端覆盖 (Cross-Platform)**：
  - **Web**：直接部署至 Nginx / 静态服务器。
  - **Desktop**：通过 Tauri 2 打包为极简原生 `.exe` / `.msi`。
  - **Android**：通过 Capacitor 打包为原生 `.apk`。
- **🌐 跨端统一网络层 (API Adapter)**：
  - 自研 `src/utils/api.js`。在 Web 端使用相对路径；在 Tauri 端利用 Rust 发起请求；在 Capacitor 端利用原生 `CapacitorHttp` 发起请求，彻底绕过 WebView 的跨域限制。
  - 采用**环境变量注入 (Fail-Fast)**，原生端缺配环境变量直接崩溃阻断打包，绝不带病上线。
- **🛡️ 防作弊输入录制**：摒弃前端生成种子，严格遵循服务器下发的权威 `seed`。引擎实时记录玩家的所有有效转向 `{ tick, dir }`，死亡后提交给后端进行状态重放校验。
- **🎲 确定性伪随机算法 (PRNG)**：采用 `Mulberry32` 算法生成食物序列，纯 32 位整数运算，与 C++ 后端实现 1:1 的底层位级对齐。
- **📺 帧同步与时间补偿**：抛弃 `setInterval`，基于 `requestAnimationFrame` 驱动循环，内置时间戳补偿算法，切后台不再掉帧错位。
- **🖼️ Retina 高清渲染**：Canvas 完美适配 `devicePixelRatio`，固定 400x400 逻辑坐标系，彻底解决高分屏边缘模糊和画布裁剪问题。
- **🧹 极致生命周期**：具名函数解绑所有事件（`keydown/touch`），`onUnmounted` 中清理 `requestAnimationFrame`，杜绝内存泄漏。

## 🚀 快速开始

### 环境配置

基于 Vite 的环境变量系统：

- 本地开发环境：在 `.env.development` 中配置 `VITE_API_BASE_URL=http://127.0.0.1:8080`
- 生产打包环境：在 `.env.production` 中配置真实的线上后端地址。

### 安装依赖

```bash
npm install
```

### 启动 Web 开发服务器

```bash
npm run dev
```

### 构建与多端打包

```bash
# 1. 构建 Web 静态产物 (dist/)
npm run build

# 2. 构建 Tauri 桌面端
npx tauri build

# 3. 同步并打包 Android 端
npx cap sync
cd android && ./gradlew assembleDebug
```

## 🧠 架构设计亮点

1. **渲染与逻辑解耦**：`Renderer.js` 处理 Canvas 纯渲染；`SnakeEngine.js` 负责无副作用的状态推进与动作记录；`useSnakeGame.js` 作为控制器负责编排生命周期与网络请求。
2. **移动端极佳手感**：`touchstart/touchend` 配合 30px 阈值实现顺滑的手势滑动判定，`touch-action: none` 彻底禁用页面滚动。
