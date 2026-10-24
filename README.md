# 🎮 Snake Battle Frontend (Vue 3 / Canvas)

![Vue](https://img.shields.io/badge/Vue-3.x-42b883.svg)
![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8DB.svg)
![Capacitor](https://img.shields.io/badge/Capacitor-6.x-53B9FF.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

这是 **贪吃蛇大作战 (Snake Battle)** 的响应式客户端。不仅支持丝滑的 Web 体验，更通过 **Tauri (Rust)** 和 **Capacitor** 实现了桌面端与安卓端的**全平台制霸**。

🔗 **在线试玩地址**: [http://39.106.162.26](http://39.106.162.26)

## ✨ 核心特性

- **🎮 丰富玩法**：支持经典模式（撞墙死）、每日挑战（固定日期种子）以及全新的**穿墙模式 (Wrap-around)**。
- **📱 全端覆盖 (Cross-Platform)**：
  - **Web**：直接部署至 Nginx。
  - **Desktop**：通过 Tauri 2 打包为极简原生 `.msi`。
  - **Android**：通过 Capacitor 打包为原生 `.apk`。
  - **统一品牌**：全端图标同步更新，应用名统一为「贪吃蛇大作战」。
- **🔊 纯代码 8-bit 音效 (Web Audio API)**：
  - 无需加载外部音效文件，纯代码合成复古 8-bit 吃食物与死亡音效。
  - 自带静音开关，状态持久化存储。
- **🍞 优雅的 UI 反馈 (Toast)**：
  - 彻底摒弃原生 `alert`，自研全局 Toast 轻提示组件。
  - 精准捕获后端 HTTP 状态码（403/413/网络错误），给玩家最准确的错误反馈。
- **🌐 跨端统一网络层 (API Adapter)**：
  - 自研 `src/utils/api.js`。Web 走同源代理，Tauri 走 Rust 插件，Capacitor 走原生 `CapacitorHttp`。
  - 采用 **环境变量注入 (Fail-Fast)**，原生端漏配直接阻断运行。
- **🎲 确定性伪随机算法 (PRNG)**：
  - 采用 `Mulberry32` 算法生成食物序列，纯 32 位整数运算，与 C++ 后端实现 1:1 的底层位级对齐。
- **📺 帧同步与时间补偿**：
  - 基于 `requestAnimationFrame` 驱动循环，内置时间戳补偿算法，切后台不再掉帧错位。

## 🚀 快速开始

### 环境配置

- **本地开发**：在 `.env.development` 中配置 `VITE_API_BASE_URL=http://127.0.0.1:8080`。
- **生产打包**：在 `.env.production` 中配置线上真实地址。

### 启动 Web 开发服务器

```bash
npm install
npm run dev
```

### 构建与多端打包

```bash
# 1. 构建 Web 静态产物
npm run build

# 2. 构建 Tauri 桌面端
npm run tauri:build

# 3. 同步并打包 Android 端
npm run cap:sync
cd android && ./gradlew assembleDebug
```

## 🧠 架构设计亮点

1. **渲染与逻辑解耦**：
   - `Renderer.js`：处理 Canvas 纯渲染，无副作用。
   - `SnakeEngine.js`：负责无副作用的状态推进与动作记录（含穿墙模式坐标计算）。
   - `useSnakeGame.js`：作为控制器，负责编排游戏生命周期、UI 状态与网络请求。
2. **移动端极佳手感**：`touchstart/touchend` 配合 30px 阈值实现顺滑的手势滑动判定，`touch-action: none` 彻底禁用页面滚动。
