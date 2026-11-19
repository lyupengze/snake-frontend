# SnakeBattle

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-✓-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-✓-646cff.svg)](https://vitejs.dev/)
[![Tauri](https://img.shields.io/badge/Tauri-2-FFC131.svg)](https://tauri.app/)
[![Capacitor](https://img.shields.io/badge/Capacitor-✓-119eff.svg)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)]()

一套代码、三端同源的跨平台贪吃蛇客户端：Web、Tauri 桌面端（Windows）与 Capacitor
Android 端共用同一套 Vue 3 + TypeScript 代码与 Canvas 渲染管线。

- 展示主页：<https://snakebattle.cn>
- 前端仓库：<https://github.com/lyupengze/snake-frontend>
- 后端仓库：<https://github.com/lyupengze/snake-backend>

> **展示模式说明**
>
> 由于尚未取得游戏版号，Web 端当前只开放项目展示页，不提供在线试玩。全部玩法、
> 排行榜与 AI 演示代码均完整保留在仓库中；版号下发后通过一个环境变量即可恢复。
> 原生安装包（Tauri / Capacitor）是私人分发的完整版本，启动后仍进入原游戏菜单。

## 功能概览

### 玩法

- **经典模式** — 撞墙即死，保留最原始的贪吃蛇规则。
- **每日挑战** — 全服共享同一随机种子，每天按日期结算排名，同一棋盘只此一次。
- **穿墙模式** — 越界从另一侧循环出现，棋盘边缘带光晕提示。
- **AI 寻路演示** — BFS 贪心叠加安全校验的 AutoPilot，可观看自动吃满棋盘。
- **排行榜** — 分数提交、每日榜与经典榜查询。

### 体验与工程

- 5 套系统主题配色，Canvas 渲染与页面元素色彩联动。
- Web Audio API 实时合成音效，支持一键静音。
- 移动端全屏触摸操作、安全内边距与 Retina 自适应。
- 纯逻辑引擎与渲染层解耦，可脱离 Vue 单测与复用。
- Mulberry32 PRNG 与后端 C++ 重放引擎比特级对齐，服务端重放验证分数。
- 分数提交按 HTTP 状态码分级重试，避免网络抖动导致成绩丢失。

## 技术栈

| 层面     | 技术                                  |
| -------- | ------------------------------------- |
| 框架     | Vue 3 + TypeScript + Vite             |
| 路由     | Vue Router（HTML5 History）           |
| 桌面端   | Tauri 2（Rust）                       |
| 移动端   | Capacitor（Android）                  |
| 渲染     | Canvas 2D                             |
| 音频     | Web Audio API（合成音效）             |
| 质量保障 | vue-tsc 严格类型检查 + GitHub Actions |

## 项目结构

```text
src/
├── game/                  # 游戏核心引擎（纯逻辑，无 Vue 依赖）
│   ├── SnakeEngine.ts     # 物理推进、碰撞检测、动作录制
│   ├── Renderer.ts        # Canvas 渲染（主题皮肤、Retina、穿墙特效）
│   ├── AutoPilot.ts       # AI 寻路（BFS 贪心 + 安全校验）
│   └── PRNG.ts            # Mulberry32 伪随机（与 C++ 后端比特级对齐）
├── composables/
│   └── useSnakeGame.ts    # 引擎 ↔ Vue 响应式桥接
├── views/
│   ├── LandingView.vue    # 项目展示主页（Web 端默认首页）
│   ├── HomeView.vue       # 游戏菜单（原生端默认首页）
│   ├── GameView.vue       # 游戏主界面
│   ├── LeaderboardView.vue
│   └── AIDemoView.vue
├── components/            # 可复用组件（Leaderboard、Toast 等）
├── config/
│   └── site.ts            # 站点信息、仓库地址、ICP 备案号、玩法开关
├── utils/
│   ├── runtime.ts         # Tauri / Capacitor / Web 运行时探测
│   ├── api.ts             # 跨端 HTTP 封装（三端网络适配）
│   └── audio.ts           # 音效管理器（预生成 AudioBuffer + 心跳保活）
├── router/                # 路由与展示模式守卫
└── App.vue                # 全局布局与全站页脚
src-tauri/                 # Tauri 桌面端壳与配置
android/                   # Capacitor Android 工程
public/                    # 静态资源、更新日志、维护页
```

## 快速开始

要求 Node.js 22+（CI 使用 Node 22）与 npm。

```bash
npm install
npm run dev
```

开发环境通过 Vite 代理把 `/api` 转发到 `http://127.0.0.1:8080`，并自动注入
`X-Internal-Secret` 请求头，因此本地开发无需配置后端绝对地址。

## 环境变量

| 文件                | 用途                                                     |
| ------------------- | -------------------------------------------------------- |
| `.env.example`      | 配置模板，可复制后修改                                   |
| `.env.development`  | 开发环境，留空走 Vite 代理                               |
| `.env.production`   | Web 生产环境（展示模式，玩法关闭）                       |
| `.env.native`       | 原生端构建，完整玩法 + 线上 API `https://snakebattle.cn` |
| `.env.native.local` | 本地私有覆盖（已被 Git 忽略）                            |

核心变量：

| 变量                    | 说明                                                    |
| ----------------------- | ------------------------------------------------------- |
| `VITE_API_BASE_URL`     | 后端地址；原生端必填，缺失会在启动时直接阻断并给出提示  |
| `VITE_GAMEPLAY_ENABLED` | 是否开放可玩路由；Web 默认 `false`，原生构建固定 `true` |

## 构建与发布

```bash
# Web 静态产物（展示模式，首页为项目介绍页）
npm run build

# Tauri 桌面端（MSI）；beforeBuildCommand 会自动执行 build:native
npm run tauri:build

# Android：构建原生模式产物 → 同步 → Gradle 打包
npm run build:native
npx cap sync android
cd android && ./gradlew assembleDebug
```

产物位置：

- Web：`dist/`
- Windows MSI：`src-tauri/target/release/bundle/msi/`
- Android APK：`android/app/build/outputs/apk/debug/app-debug.apk`

`build:native` 使用 Vite 的 `native` 模式加载 `.env.native`，并在 `vite.config.ts`
中校验 `VITE_API_BASE_URL` 与 `VITE_GAMEPLAY_ENABLED=true`。任一缺失都会让构建
直接失败，避免误打出「只有展示主页」的安装包。

## 展示模式与玩法开关

Web 端默认运行在展示模式（`src/config/site.ts` 中 `SITE.gameplayEnabled = false`）：

- `/` 是项目展示主页，介绍玩法、技术亮点、界面预览与开源入口；
- `/menu`、`/game`、`/leaderboard`、`/ai-demo` 的代码与路由全部保留，但访问时统一
  重定向回 `/?locked=<page>`，并在页面底部提示「展示模式下暂未开放」；
- 所有页面底部统一展示 ICP 备案号：`京ICP备2026074972号`。

原生 App 通过 `.env.native` 固定开启玩法，并且只在原生环境把 `/` 重定向到 `/menu`，
安装包启动后与旧版本完全一致。原生菜单底部提供「查看展示主页」入口，展示页顶部提供
「返回主页」，该返回链接仅在原生端渲染，Web 端不可见。

版号下发后，把 `src/config/site.ts` 中的 `GAMEPLAY_ENABLED` 改为 `true`，或在 Web
构建时设置：

```bash
VITE_GAMEPLAY_ENABLED=true
```

即可恢复全部可玩页面，业务代码无需改动。

## 跨端网络适配

`src/utils/api.ts` 在运行时探测宿主环境，自动选择对应网络层：

- **Web** — `window.fetch`，走同源代理；
- **Tauri** — `@tauri-apps/plugin-http`，绕过 WebView CORS；
- **Capacitor** — `CapacitorHttp` 原生插件，带域名白名单防止 SSRF。

原生端缺少 `VITE_API_BASE_URL` 时应用会阻断启动，而不是静默请求错误地址。

## 公平性与容错

前端 `PRNG.ts` 的 Mulberry32 算法与后端 `ReplayEngine.cpp` 保持比特级一致。游戏
结束后，前端把操作序列提交给服务器，服务器用相同种子重放验证分数；任何偏差都会
触发 403。

分数提交按状态码分类处理：

| 状态码               | 行为                    | 原因                     |
| -------------------- | ----------------------- | ------------------------ |
| 200                  | 清空 gameId，跳转排行榜 | 成功                     |
| 403                  | 清空 gameId，本局结束   | 作弊或会话过期，不可恢复 |
| 413                  | 清空 gameId，本局结束   | 游戏过长，无法修复       |
| 400                  | 保留 gameId，可重试     | 输入校验失败             |
| 429 / 500 / 网络错误 | 保留 gameId，可重试     | 临时故障                 |

重试上限 3 次，超出后按钮显示「本局无法上榜」并禁用；开始新游戏时状态自动重置。

## 部署

1. `npm run build` 生成 `dist/`；
2. 将 `dist/` 部署到静态服务器；
3. Vue Router 使用 HTML5 History 模式，Nginx 需配置回退：

   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

4. 全站页脚由 `src/App.vue` 统一渲染，包含前端 / 后端仓库入口与 ICP 备案号；
   `public/maintenance.html` 作为维护页同样展示备案信息。

## 相关仓库

| 仓库                                                          | 内容                                      |
| ------------------------------------------------------------- | ----------------------------------------- |
| [snake-frontend](https://github.com/lyupengze/snake-frontend) | Vue 3 / TypeScript 跨平台客户端、展示主页 |
| [snake-backend](https://github.com/lyupengze/snake-backend)   | 排行榜、每日种子、分数重放校验等后端服务  |

## License

[MIT](./LICENSE)
