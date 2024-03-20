import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  const config: { [key: string]: any } = {
    plugins: [[vue()]],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }

  if (mode != 'addon') {
    config.plugins[0].push(viteSingleFile())
  } else {
    config.build = { outDir: '../grid-inject' }
  }
  return config
})
