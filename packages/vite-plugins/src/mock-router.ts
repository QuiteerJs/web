import type { Plugin } from 'vite'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { bold, cyan, gray, green } from 'kolorist'

export interface MockRouterOptions {
  /** API 前缀，默认 '/api' */
  apiPrefix?: string
  /** Mock 目录，默认 '<root>/mock' */
  mockDir?: string
  /** 文件扩展名，默认 '.json' */
  extension?: string
  /** 响应延迟毫秒，默认 0 */
  delay?: number
  /** 未匹配时的策略：'pass' 交给下一中间件；'404' 直接返回 404，默认 'pass' */
  onMiss?: 'pass' | '404'
}

/**
 * 函数：创建 API Mock 自动路由插件
 * 作用：在开发模式下将请求路径映射到 mock 目录的静态文件，例如
 *      /api/user/list => <root>/mock/user/list.json
 */
export function mockRouterPlugin(options: MockRouterOptions = {}): Plugin {
  const apiPrefix = options.apiPrefix ?? '/api'
  const extension = options.extension ?? '.json'
  const delay = options.delay ?? 0
  const onMiss = options.onMiss ?? 'pass'

  let rootDir: string = ''
  let mockAbsDir: string = ''

  /**
   * 函数：构建文件映射路径
   * 作用：将请求的 pathname 映射到 mock 目录下的文件完整路径
   */
  function mapToFilePath(pathname: string): string {
    const rel = pathname.replace(apiPrefix, '').replace(/^\//, '')
    return path.join(mockAbsDir, rel + extension)
  }

  /**
   * 函数：发送 JSON 响应
   * 作用：统一设置头部并输出内容，支持延迟
   */
  async function sendJson(res: any, content: string, status = 200): Promise<void> {
    const run = () => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      res.end(content)
    }
    if (delay > 0)
      setTimeout(run, delay)
    else
      run()
  }

  return {
    name: 'quiteer-mock-router',
    /**
     * 函数：仅在开发服务器启用
     * 作用：避免影响生产构建与预览
     */
    apply: (_config, env) => env.command === 'serve',

    /**
     * 函数：解析配置
     * 作用：确定项目根目录与 mock 目录绝对路径
     */
    configResolved(config) {
      rootDir = config.root
      mockAbsDir = path.isAbsolute(options.mockDir ?? '')
        ? (options.mockDir as string)
        : path.join(rootDir, options.mockDir ?? 'mock')
    },

    /**
     * 函数：开发服务器中间件
     * 作用：拦截匹配的 API 请求并返回本地 mock 文件内容
     */
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = req.url ?? '/'
          const u = new URL(url, 'http://localhost')
          const pathname = u.pathname
          if (!pathname.startsWith(apiPrefix))
            return next()
          const file = mapToFilePath(pathname)
          try {
            await fs.access(file)
          }
          catch {
            if (onMiss === '404')
              return sendJson(res, JSON.stringify({ message: 'Mock Not Found' }), 404)
            return next()
          }
          const buf = await fs.readFile(file, 'utf8')
          // 美化输出：提示已命中 mock 文件
          // eslint-disable-next-line no-console
          console.log(`${bold(cyan('[mock]'))} 命中 ${green(path.relative(rootDir, file))} ${gray(pathname)}`)
          return sendJson(res, buf, 200)
        }
        catch {
          return sendJson(res, JSON.stringify({ message: 'Mock Error' }), 500)
        }
      })
    }
  }
}
