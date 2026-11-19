import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/**
 * 展示模式下，被拦截页面会带 `locked` 查询参数跳回主页。
 * 这里集中处理提示条的状态与关闭逻辑，避免展示页组件里堆路由细节。
 */
const PAGE_NAMES: Record<string, string> = {
  home: '游戏菜单',
  game: '游戏',
  leaderboard: '排行榜',
  'ai-demo': 'AI 寻路演示',
};

export function useLockedNotice() {
  const route = useRoute();
  const router = useRouter();

  // 从 URL 查询参数解析被拦截的页面，默认空（不显示提示）
  const lockedPage = ref(typeof route.query.locked === 'string' ? route.query.locked : '');
  const showLocked = computed(() => Boolean(lockedPage.value));
  const lockedLabel = computed(() => PAGE_NAMES[lockedPage.value] ?? '该页面');

  const dismissLocked = () => {
    lockedPage.value = '';
    const query = { ...route.query };
    delete query.locked;
    router.replace({ query });
  };

  return { showLocked, lockedLabel, dismissLocked };
}
