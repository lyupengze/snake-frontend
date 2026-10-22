# 🎮 Snake Game Frontend (Vue 3 / Canvas)

![Vue](https://img.shields.io/badge/Vue-3.x-42b883.svg)
![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)
![Vue Router](https://img.shields.io/badge/Router-4.x-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

这是一个基于 **Vue3 + Canvas** 构建的响应式贪吃蛇游戏客户端，支持 PC 键盘操作与移动端触屏滑动，并内置了配合后端防作弊系统的“输入记录”机制。

🔗 **在线试玩地址**: [http://39.106.162.26](http://39.106.162.26)

## ✨ 核心特性

- **🛡️ 防作弊输入录制**：配合后端的重放校验，引擎会将玩家的每一次转向精准记录为 `{ tick, dir }`，在游戏结束时与成绩一同提交给服务器验算。
- **🎲 每日挑战确定性生成**：自研 `Mulberry32` 纯整数伪随机算法（PRNG），确保在相同 `seed` 下，全世界的食物生成序列绝对一致，且与 C++ 后端 1:1 对齐。
- **📺 帧同步与时间补偿**：抛弃 `setInterval`，采用 `requestAnimationFrame` 驱动游戏主循环，并内置基于 `timestamp` 的帧补偿算法，彻底告别切后台掉帧和定时器漂移。
- **🖼️ Retina 高清渲染**：Canvas 完美适配 `devicePixelRatio`，解决高分屏拉伸模糊，蛇身采用内边距设计，质感拉满。
- **🧹 极致的生命周期管理**：具名函数解绑所有事件监听（`touchstart/touchmove/keydown`），并在 `onUnmounted` 中彻底清理 `requestAnimationFrame`，杜绝内存泄漏。
- **📱 移动端完美适配**：响应式 Flex 布局，支持丝滑的触屏滑动操作，彻底禁用移动端浏览器的默认滑动行为。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
# 产物将输出至 dist/ 目录，可直接托管给 Nginx 等服务器
```

## 🧠 架构设计亮点

1. **渲染与逻辑分离**：`Renderer.js` 纯粹负责 Canvas 绘制，`SnakeEngine.js` 纯粹负责状态机与碰撞逻辑，`useSnakeGame.js` 负责编排网络与生命周期。
2. **Vue Router 多页面路由**：拆分为主页 (`HomeView`)、游戏页 (`GameView`) 与排行榜 (`LeaderboardView`)，实现无刷新单页应用体验。
3. **网络健壮性**：所有 `fetch` 请求均严格校验 HTTP 状态码（`res.ok`），结合 `Promise.all` 并发拉取每日数据，避免网络异常导致的白屏。
