<template>
  <!--
    [核心设计] 使用 Teleport 将 Toast 传送到 body 根节点下。
    这样可以避免被任何父组件（如 GameView）的 overflow: hidden 或 z-index 层级限制所遮挡。
  -->
  <Teleport to="body">
    <Transition name="toast-fade">
      <div v-if="visible" class="toast-container">
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

// 内部状态
const visible = ref(false);
const message = ref('');
let timer = null;

/**
 * 触发显示 Toast 提示
 *
 * @param {string} msg 提示的文本内容
 * @param {number} duration 显示时长（毫秒），默认 2500ms
 */
const show = (msg, duration = 2500) => {
  message.value = msg;
  visible.value = true;

  // [防抖处理] 如果上一次 Toast 还没消失又被再次触发，清除上一个定时器，重新计时
  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    visible.value = false;
  }, duration);
};

// 暴露给父组件调用
defineExpose({ show });
</script>

<style scoped>
/* ==========================================
   样式与动画
   ========================================== */
.toast-container {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  z-index: 9999;

  /*
    [核心体验] 禁用鼠标/触摸事件穿透。
    确保 Toast 提示出现时，玩家依然可以点击它背后的按钮（如“重新开始”）。
  */
  pointer-events: none;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

/* Vue 的 Transition 进场与离场动画 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
