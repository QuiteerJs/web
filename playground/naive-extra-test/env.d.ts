interface ImportMetaEnv {
  readonly VITE_BASE_URL: "http://localhost:10902"
  readonly VITE_DESC: "发布环境变量" | "开发环境变量" | "测试环境变量" | "生产环境变量" | "通用环境变量" | "预发布环境变量"
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
