import baseConfig from './vite.config.js'
import { defineConfig, mergeConfig } from 'vite'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8'
      }
    }
  })
)
