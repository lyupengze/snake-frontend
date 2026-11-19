<script setup lang="ts">
defineProps<{
  index: string;
  title: string;
}>();
</script>

<template>
  <div class="section-head">
    <span class="section-index">{{ index }}</span>
    <h2>{{ title }}</h2>
    <p class="section-desc"><slot /></p>
  </div>
</template>
