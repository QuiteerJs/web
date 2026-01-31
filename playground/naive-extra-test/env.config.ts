import type { EnvConfig } from '@quiteer/vite'

type MyConfig = EnvConfig<'baseURL'>

export default {
  default: {
    desc: '通用环境变量',
    baseURL: 'http://localhost:10902'
  },
  development: {
    desc: '开发环境变量',
    baseURL: 'http://localhost:10902'
  },
  production: {
    desc: '生产环境变量',
    baseURL: 'http://localhost:10902'
  },
  test: {
    desc: '测试环境变量',
    baseURL: 'http://localhost:10902'
  },
  staging: {
    desc: '预发布环境变量',
    baseURL: 'http://localhost:10902'
  },
  release: {
    desc: '发布环境变量',
    baseURL: 'http://localhost:10902'
  }
} satisfies MyConfig
