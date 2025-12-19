import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Asignaciones - Proyecto Interno RX',
          description: 'Gestión de proyectos, recursos y horas por períodos. Una app re cheta.'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~bootstrap': resolve(__dirname, './node_modules/bootstrap')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/scss/variables";`,
        // Remove deprecation warnings from bootstrap 5
        // Apparently, it's gonna be fixed in Bootstrap 6. Reenable if updated
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      }
    }
  }
})
