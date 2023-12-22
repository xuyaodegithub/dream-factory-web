import { fileURLToPath, URL } from 'node:url'
import { splitVendorChunkPlugin, loadEnv } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({ command, mode }) => {
  const env: any = loadEnv(mode, process.cwd(), '')
  console.log(env.VITE_MODE)
  return {
    server: {
      // host: 'dev.dreamher.cn',
      port: 8080
    },
    build: {
      assetsDir: 'static',
      sourcemap: false,
      commonjsOptions: {
        include: [
          /node_modules/
        ]
      },
    },
    optimizeDeps: {
      include: [
        "@authing/guard-vue3"
      ]
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
      splitVendorChunkPlugin()

    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // vite 配置
    define: {
      __APP_VERSION__: JSON.stringify('v1.0.0')
    },
  }
})
