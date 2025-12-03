interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_BASE_URL: string
  readonly VITE_DESC: string
  readonly VITE_GIS_CSS: string
  readonly VITE_GIS_JS: string
  readonly VITE_TEST_URL: string
  readonly VITE_TITLE: string
  readonly VITE_UPLOAD_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
