# SnakeBattle Frontend

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-✓-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-✓-646cff.svg)](https://vitejs.dev/)
[![Tauri](https://img.shields.io/badge/Tauri-2-FFC131.svg)](https://tauri.app/)
[![Capacitor](https://img.shields.io/badge/Capacitor-✓-119eff.svg)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)]()

Vue 3 + TypeScript 跨平台贪吃蛇游戏客户端，支持 Web、Tauri 桌面端和 Capacitor Android 端。

## 技术栈

| 层面 | 技术 |
|---|---|
| 框架 | Vue 3 + TypeScript + Vite |
| 路由 | Vue Router (HTML5 History) |
| 桌面端 | Tauri 2 (Rust) |
| 移动端 | Capacitor (Android) |
| 渲染 | Canvas 2D |
| 音频 | Web Audio API (合成音效) |

## 项目结构

```
src/
├── game/                  # 游戏核心引擎（纯逻辑，无 Vue 依赖）
│   ├── SnakeEngine.ts     # 物理推进、碰撞检测、动作录制
│   ├── Renderer.ts        # Canvas 渲染（主题皮肤、Retina 适配、穿墙特效）
│   ├── AutoPilot.ts       # AI 寻路（BFS 贪心 + 安全校验）
│   └── PRNG.ts            # Mulberry32 伪随机（与 C++ 后端比特级对齐）
├── composables/
│   └── useSnakeGame.ts    # 引擎 ↔ Vue 响应式桥接
├── views/                 # 页面组件
├── components/            # 可复用组件（Leaderboard, Toast）
├── utils/
│   ├── api.ts             # 跨端 HTTP 封装（Web / Tauri / Capacitor 三端适配）
│   └── audio.ts           # 音效管理器（预生成 AudioBuffer + 心跳保活）
└── router/                # 路由配置
```

## 游戏模式

- **经典模式** — 撞墙即死
- **每日挑战** — 全服共享同一随机种子，按日期结算
- **穿墙模式** — 越界循环，附带边缘光晕特效

## 快速开始

```bash
npm install
npm run dev
```

开发环境通过 Vite 代理将 `/api` 请求转发到 `http://127.0.0.1:8080`，并自动注入 `X-Internal-Secret` 头。

### 环境变量

| 文件 | 用途 |
|---|---|
| `.env.example` | 配置模板 |
| `.env.development` | 开发环境（留空走代理） |
| `.env.production` | 生产环境（原生端必须填写后端绝对路径） |

原生端（Tauri / Capacitor）缺少 `VITE_API_BASE_URL` 配置时，应用会直接阻断启动。

## 多端构建

```bash
# Web 静态产物
npm run build

# Tauri 桌面端 (MSI)
npm run tauri:build

# Android 端
npm run cap:sync
cd android && ./gradlew assembleDebug
```

## 跨端网络适配

`src/utils/api.ts` 在运行时探测宿主环境，自动选择对应的网络层：

- **Web** — `window.fetch`，走同源代理
- **Tauri** — `@tauri-apps/plugin-http`，绕过 WebView CORS
- **Capacitor** — `CapacitorHttp` 原生插件，带域名白名单防 SSRF

## 防作弊机制

前端 `PRNG.ts` 的 Mulberry32 算法与后端 `ReplayEngine.cpp` 保持比特级一致。游戏结束后，前端将操作序列提交给服务器，服务器用相同种子重放验证分数。任何偏差都会触发 403 拦截。

## 分数提交容错

提交分数时，前端根据 HTTP 状态码分类处理：

| 状态码 | 行为 | 原因 |
|---|---|---|
| 200 | 清空 gameId，跳转排行榜 | 成功 |
| 403 | 清空 gameId，本局结束 | 作弊/会话过期，不可恢复 |
| 413 | 清空 gameId，本局结束 | 游戏过长，无法修复 |
| 400 | 保留 gameId，可重试 | 输入校验失败（名字不合法、数据格式异常等） |
| 429/500/网络错误 | 保留 gameId，可重试 | 临时故障 |

重试上限 3 次，超出后按钮显示"本局无法上榜"并禁用。开始新游戏时状态自动重置。
