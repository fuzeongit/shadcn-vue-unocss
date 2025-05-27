import { defineConfig, presetIcons } from 'unocss';
import { presetWind } from '@unocss/preset-wind3';
import presetAnimations from 'unocss-preset-animations';
import { builtinColors, presetShadcn } from 'unocss-preset-shadcn';
import { presetSoybeanAdmin } from '@sa/uno-preset';

// 辅助函数：从 theme.colors 获取颜色值
function getPresetColor(color: string, theme: any): string | undefined {
  // 处理形如 "blue-500" 的色阶
  const [name, shade] = color.split('-');
  const colorGroup = theme.colors?.[name];

  if (shade) {
    return colorGroup?.[shade]; // 返回 blue-500 对应的值
  }
  return colorGroup?.DEFAULT || colorGroup?.['500']; // 默认返回 DEFAULT 或 500 色阶
}
export default defineConfig({
  content: {
    pipeline: {
      // 包括所有前端文件
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        /src\/components\/ui\/.*\.[jt]s($|\?)/,
        /src\/plugins\/.*\.[jt]s($|\?)/
      ]
    }
  },
  presets: [
    presetWind(),
    presetIcons({
      scale: 1.3
    }),
    presetAnimations(),
    presetShadcn(
      builtinColors.map(c => ({ color: c })),
      {
        globals: true,
        componentLibrary: 'reka'
      }
    ),
    presetSoybeanAdmin()
  ],
  shortcuts: [
    [
      /^tag-(.*)-(.*)$/,
      ([, color, size], { theme }) => {
        let textColor = '';
        // 这里我想拿到预设的颜色
        const parsed = getPresetColor(color, theme);
        if (parsed) {
          textColor = parsed;
        } else {
          textColor = color; // 直接使用 #ccc 这样的颜色
        }
        return `rounded-full text-${size} px-3 py-1 inline-flex items-center c-${color} bg-[color-mix(in_srgb,${textColor},white_80%)]`;
      }
    ]
  ]
});
