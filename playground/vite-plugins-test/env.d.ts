interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_FEATURE: boolean
  readonly VITE_PORT: number
  readonly VITE_PORT2: number
  readonly VITE_TEST: boolean
  readonly VITE_TIMEOUT: number
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
