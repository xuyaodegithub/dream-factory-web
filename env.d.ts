/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: string
  readonly VITE_BASE_URL: string
  readonly __APP_VERSION__: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
