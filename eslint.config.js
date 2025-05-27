import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  {
    vue: true,
    ignores: ['node_modules/**', 'dist/**', 'src/components/ui/**']
  },
  {
    rules: {
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App']
        }
      ],
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['/^icon-/']
        }
      ],
      'vue/no-v-model-argument': 'off'
    }
  }
);
