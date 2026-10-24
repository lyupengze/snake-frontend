/// <reference types="vite/client" />

/**
 * Vue 单文件组件 (SFC) 的 TypeScript 模块声明。
 * 因为 TypeScript 原生不认识 `.vue` 文件，这里通过 `declare module` 告诉编译器：
 * 所有的 `.vue` 文件都是一个导出了默认 Vue 组件的模块。
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
