<script setup lang="ts">
import SectionHeading from './SectionHeading.vue';
import previewImage from '../../../images/game-preview.png';
</script>

<template>
  <div class="preview-grid">
    <div>
      <SectionHeading index="03 — Preview" title="先看，不玩">
        展示模式下，游戏页不再对公网开放。下面是已完成的 Web 端界面截图，仅作预览。
      </SectionHeading>

      <ul class="preview-list">
        <li>
          <svg
            class="check"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 4.5 4.5L19 7" />
          </svg>
          5 套主题实时切换，得分与棋盘配色联动
        </li>
        <li>
          <svg
            class="check"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 4.5 4.5L19 7" />
          </svg>
          键盘方向键 / 移动端滑动手势，双端操作
        </li>
        <li>
          <svg
            class="check"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 4.5 4.5L19 7" />
          </svg>
          结束后一键提交分数，进入全服排行榜
        </li>
        <li>
          <svg
            class="check"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 4.5 4.5L19 7" />
          </svg>
          提交失败按状态码分类重试，避免误判作弊
        </li>
      </ul>
    </div>

    <figure class="shot-card">
      <div class="shot-chrome">
        <span class="dot dot-red"></span>
        <span class="dot dot-amber"></span>
        <span class="dot dot-green"></span>
        <span class="shot-url">snakebattle.cn / game</span>
      </div>
      <img :src="previewImage" alt="SnakeBattle Web 端每日挑战结算界面截图" />
      <figcaption>Web 端 · 每日挑战结算界面（历史截图）</figcaption>
    </figure>
  </div>
</template>
