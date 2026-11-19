<template>
  <div class="hero-visual">
    <div class="board-card">
      <div class="board-chrome">
        <span class="dot dot-red"></span>
        <span class="dot dot-amber"></span>
        <span class="dot dot-green"></span>
        <span class="board-url">snakebattle.cn</span>
        <span class="board-badge">DISPLAY ONLY</span>
      </div>

      <div class="board-body">
        <svg
          class="board-svg"
          viewBox="0 0 440 440"
          role="img"
          aria-label="SnakeBattle 游戏画面示意图：一条绿色贪吃蛇正朝红色食物移动"
        >
          <defs>
            <linearGradient id="boardBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#101a12" />
              <stop offset="1" stop-color="#090c0a" />
            </linearGradient>
            <linearGradient id="snakeGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stop-color="#1b5e20" />
              <stop offset="0.55" stop-color="#43a047" />
              <stop offset="1" stop-color="#7ee787" />
            </linearGradient>
            <radialGradient id="boardGlow" cx="0.82" cy="0.12" r="0.6">
              <stop offset="0" stop-color="#4caf50" stop-opacity="0.16" />
              <stop offset="1" stop-color="#4caf50" stop-opacity="0" />
            </radialGradient>
            <pattern id="boardGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
            </pattern>
            <filter id="appleGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="440" height="440" rx="18" fill="url(#boardBg)" />
          <rect width="440" height="440" rx="18" fill="url(#boardGrid)" />
          <rect width="440" height="440" rx="18" fill="url(#boardGlow)" />

          <!-- 蛇身：从尾部到头部，尾部颜色更深 -->
          <g>
            <rect x="93" y="317" width="30" height="30" rx="7" fill="#1b5e20" />
            <rect x="93" y="285" width="30" height="30" rx="7" fill="#235f27" />
            <rect x="125" y="285" width="30" height="30" rx="7" fill="#2e7d32" />
            <rect x="125" y="253" width="30" height="30" rx="7" fill="#337f36" />
            <rect x="125" y="221" width="30" height="30" rx="7" fill="#388e3c" />
            <rect x="157" y="221" width="30" height="30" rx="7" fill="#3d9741" />
            <rect x="189" y="221" width="30" height="30" rx="7" fill="#43a047" />
            <rect x="189" y="189" width="30" height="30" rx="7" fill="#48aa4c" />
            <rect x="189" y="157" width="30" height="30" rx="7" fill="#4caf50" />
            <rect x="221" y="157" width="30" height="30" rx="7" fill="#5bb95e" />
            <rect
              x="253"
              y="157"
              width="30"
              height="30"
              rx="7"
              fill="url(#snakeGrad)"
              stroke="#8ee894"
              stroke-opacity="0.35"
              stroke-width="1.5"
            />
          </g>

          <!-- 眼睛：看向右侧的食物 -->
          <circle cx="262" cy="168" r="4.2" fill="#ffffff" />
          <circle cx="264" cy="168" r="2.1" fill="#0b120d" />
          <circle cx="276" cy="168" r="4.2" fill="#ffffff" />
          <circle cx="278" cy="168" r="2.1" fill="#0b120d" />

          <!-- 舌头 -->
          <path d="M286 178h14" stroke="#e53935" stroke-width="3" stroke-linecap="round" />
          <path
            d="m300 178 7-5m-7 5 7 5"
            stroke="#e53935"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
          />

          <!-- 食物 -->
          <g filter="url(#appleGlow)">
            <rect x="317" y="157" width="30" height="30" rx="7" fill="#e53935" />
            <rect x="323" y="163" width="9" height="9" rx="2" fill="#ffffff" fill-opacity="0.42" />
          </g>

          <!-- 边角装饰 -->
          <circle cx="377" cy="86" r="2" fill="#7ee787" fill-opacity="0.5" />
          <circle cx="70" cy="120" r="1.6" fill="#7ee787" fill-opacity="0.35" />
          <circle cx="360" cy="330" r="1.8" fill="#7ee787" fill-opacity="0.3" />
        </svg>

        <span class="board-caption">静态示意图 · 不可操作</span>
      </div>
    </div>

    <div class="float-chip chip-one">
      <span class="chip-dot"></span>
      Canvas 2D · 60 FPS
    </div>
    <div class="float-chip chip-two">
      <span class="chip-dot"></span>
      Mulberry32 回放校验
    </div>
  </div>
</template>
