type EnvValue = string | { value: string, obfuscate?: boolean }
type EnvItem<RequiredKeys extends PropertyKey = never> = { desc: EnvValue } & Record<RequiredKeys, EnvValue> & Record<string, EnvValue>

type EnvName = 'development' | 'production' | 'test' | 'staging' | 'release'
export type EnvConfig<RequiredKeys extends PropertyKey = never, EnvNames extends string = never> = {
  default: { desc: EnvValue } & Partial<Omit<EnvItem<RequiredKeys>, 'desc'>>
} & { [K in EnvName | EnvNames]: EnvItem<RequiredKeys> }

export default {
  default: {
    desc: '通用环境变量',
    testUrl: 'https://quiteerjs.github.io/web/'
  },
  development: {
    desc: '开发环境变量',
    baseURL: {
      value: 'http://localhost:3000',
      obfuscate: true
    },
    apiURL: '/api',
    uploadURL: '/files',
    gisJs: '/gis',
    gisCss: '/gis',
    title: 'xxx'
  },
  production: {
    desc: '生产环境变量',
    baseURL: {}
  },
  test: {
    desc: '测试环境变量',
    baseURL: ''
  },
  staging: {
    desc: '预发布环境变量',
    baseURL: ''
  },
  release: {
    desc: '发布环境变量',
    baseURL: ''
  },
  test_1: {
    desc: '自定义环境变量',
    baseURL: ''
  }
} satisfies EnvConfig<'baseURL', 'test_1'>
