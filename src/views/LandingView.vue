<script setup lang="ts">
import LandingHeader from '../components/landing/LandingHeader.vue';
import HeroSection from '../components/landing/HeroSection.vue';
import GameplaySection from '../components/landing/GameplaySection.vue';
import FeaturesSection from '../components/landing/FeaturesSection.vue';
import PreviewSection from '../components/landing/PreviewSection.vue';
import StackSection from '../components/landing/StackSection.vue';
import OpenSourceSection from '../components/landing/OpenSourceSection.vue';
import { useLockedNotice } from '../composables/useLockedNotice';

const { showLocked, lockedLabel, dismissLocked } = useLockedNotice();
const techBadges = ['Vue 3', 'TypeScript', 'Vite', 'Tauri 2', 'Capacitor', 'Canvas 2D', 'Web Audio', 'MIT License'];
</script>

<template>
  <div class="landing">
    <LandingHeader />
    <HeroSection />

    <div class="stack-strip" aria-label="技术栈关键词">
      <span v-for="badge in techBadges" :key="badge">{{ badge }}</span>
    </div>

    <section id="play" class="section"><GameplaySection /></section>
    <section id="tech" class="section"><FeaturesSection /></section>
    <section id="preview" class="section"><PreviewSection /></section>
    <section id="stack" class="section"><StackSection /></section>
    <section id="opensource" class="cta"><OpenSourceSection /></section>

    <!-- 从被拦截页面跳回时的提示 -->
    <transition name="toast">
      <div v-if="showLocked" class="locked-toast" role="status">
        <span>「{{ lockedLabel }}」页面在展示模式下暂未开放</span>
        <button type="button" aria-label="关闭提示" @click="dismissLocked">×</button>
      </div>
    </transition>
  </div>
</template>

<style src="../styles/landing.css"></style>
