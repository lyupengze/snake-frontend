/**
 * 站点级配置。
 *
 * 2026-11 起，网站进入「展示模式」：因尚未取得游戏版号，公网只保留介绍页，
 * 游戏、排行榜、AI 演示等可玩页面暂时关闭对外入口（相关代码与路由均完整保留）。
 *
 * 版号下发后，只需把 GAMEPLAY_ENABLED 置为 true（或在构建时设置
 * VITE_GAMEPLAY_ENABLED=true），即可恢复全部页面，无需改动业务代码。
 */
export const GAMEPLAY_ENABLED = import.meta.env.VITE_GAMEPLAY_ENABLED === 'true';

export const SITE = {
  name: 'SnakeBattle',
  version: 'v1.2.0',
  /** 前端开源仓库地址 */
  githubUrl: 'https://github.com/lyupengze/snake-frontend',
  /** 后端开源仓库地址 */
  backendGithubUrl: 'https://github.com/lyupengze/snake-backend',
  /** ICP 备案号：所有页面底部统一展示 */
  icpNumber: '京ICP备2026074972号',
  /** 工信部备案查询系统 */
  icpUrl: 'https://beian.miit.gov.cn/',
  /** 业务页面是否对外开放 */
  gameplayEnabled: GAMEPLAY_ENABLED,
} as const;
