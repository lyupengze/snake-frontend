# 🐍 Snake Battle Frontend (Vue 3 + TypeScript)

![Vue](https://img.shields.io/badge/Vue-3.x-42b883.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8DB.svg)
![Capacitor](https://img.shields.io/badge/Capacitor-6.x-53B9FF.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

这是 **SnakeBattle** 的响应式客户端。基于现代 **Vue 3 + TypeScript** 构建，不仅提供丝滑的 Web 体验，更通过 **Tauri (Rust)** 和 **Capacitor** 实现了桌面端与安卓端的全平台覆盖。

🔗 **在线试玩地址**: [http://snakebattle.cn](http://snakebattle.cn) _(备案审核中，暂可通过 IP 访问)_

## ✨ 核心特性

- **🏗️ 全量 TypeScript 架构**：
  - 核心引擎、渲染器、网络层、音频层 100% TS 化。
  - 严格的类型检查（`vue-tsc`），彻底杜绝运行时的类型隐式转换 Bug。
- **🎮 三大游戏模式**：
  - **经典模式**：撞墙即死，考验极限。
  - **每日挑战**：全服共享同一随机种子，纯看技术。
  - **穿墙模式**：越界循环，配合专属的“空间裂隙”霓虹光晕特效与吸入音效。
- **🎨 炫酷皮肤系统**：
  - 内置经典绿、赛博蓝、熔岩红等 5 套主题，蛇身、食物、特效完美联动。
- **🔊 纯代码 8-bit 音效**：
  - 摒弃外部音频文件，基于 Web Audio API 手写 `AudioBuffer` 合成复古音效。
  - 包含“心跳保活”机制，防止移动端音频硬件休眠。
- **🍞 优雅的 UI 反馈**：
  - 彻底摒弃原生 `alert`，自研全局 `Toast` 轻提示组件。
  - 精准捕获后端状态码（403/413/429），给玩家最舒适的异常提示。
- **🌐 跨端统一网络层**：
  - Web 走同源代理，Tauri 走 Rust 插件，Capacitor 走原生 HTTP，彻底绕过 WebView CORS 限制。
- **🎲 确定性防作弊**：
  - `PRNG.ts` 生成的食物序列与 C++ 后端实现 1:1 位级对齐，动作序列随时等待服务器重放校验。

## 🚀 快速开始

### 环境配置

- 本地开发：`.env.development` 中配置 `VITE_API_BASE_URL=http://127.0.0.1:8080`
- 生产打包：`.env.production` 中配置 `VITE_API_BASE_URL=https://你的域名`

### 安装与运行

```bash
npm install
npm run dev
```

### 多端构建

```bash
# 1. 构建 Web 静态产物 (dist)
npm run build

# 2. 构建 Tauri 桌面端 (MSI)
npm run tauri:build

# 3. 同步并打包 Android 端 (APK)
npm run cap:sync
cd android && ./gradlew assembleDebug
```

## 🧠 架构说明

- `src/game/SnakeEngine.ts`：纯逻辑状态机，负责物理推进与动作记录（与 C++ 后端 1:1 对齐）。
- `src/game/Renderer.ts`：Canvas 纯渲染层，支持 Retina 适配、发光特效与时空裂隙动画。
- `src/utils/audio.ts`：音频合成器，支持心跳保活与多端音效播放。
- `src/composables/useSnakeGame.ts`：控制器，连接引擎、网络层与 Vue 响应式状态。
