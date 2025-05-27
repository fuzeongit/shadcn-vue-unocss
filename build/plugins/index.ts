import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ViteCompression from 'vite-plugin-compression';
import VueDevTools from 'vite-plugin-vue-devtools';
import { visualizer } from 'rollup-plugin-visualizer';
import UnoCSS from 'unocss/vite';
import unplugin from './unplugin';
/**
 * vite插件
 *
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] {
  const plugins = [
    vue(),
    vueJsx(),
    UnoCSS(),
    ...unplugin(viteEnv),
    VueDevTools(),
    // viteMockServe({
    //   mockPath: 'mock', // mock文件夹路径
    //   enable: true // 只有开发环境才开启mock
    // }),
    visualizer({
      open: false,
      gzipSize: true, // 显示 gzip 之后的体积
      brotliSize: true // 显示 brotli 之后的体积
    }),
    ViteCompression({ algorithm: 'gzip' }),
    // babel({
    //   babelConfig: {
    //     plugins: [
    //       ['@babel/plugin-proposal-decorators', { legacy: true }],
    //       ['@babel/plugin-proposal-class-properties', { loose: true }]
    //     ]
    //   }
    // })
  ];
  return plugins;
}
