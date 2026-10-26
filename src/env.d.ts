/// <reference types="vite/client" />

// 告诉 TypeScript 将 .vue 文件视为导出默认 Vue 组件的模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
