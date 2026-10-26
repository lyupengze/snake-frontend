<template>
  <!-- Teleport 到 body 根节点，避免被父组件的 overflow/z-index 遮挡 -->
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

const visible = ref(false);
const message = ref('');
let timer = null;

const show = (msg, duration = 2500) => {
  message.value = msg;
  visible.value = true;

  // 防抖：重复触发时重置计时器
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    visible.value = false;
  }, duration);
};

defineExpose({ show });
</script>

<style scoped>
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
  /* 禁用事件穿透，Toast 出现时仍可点击背后的按钮 */
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
