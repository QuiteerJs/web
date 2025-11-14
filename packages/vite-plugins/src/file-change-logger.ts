import type { Plugin } from 'vite'
import path from 'node:path'
import { formatTimestamp } from '@quiteer/utils'
import { bold, cyan, gray, green, red, yellow } from 'kolorist'

export interface FileChangeLoggerOptions {
  /** 仅在开发模式启用，默认 true */
  devOnly?: boolean
  /** 要监听的事件列表，默认 ['change','add','unlink'] */
  events?: Array<'change' | 'add' | 'unlink'>
  /** 输出前缀文本，默认 'file' */
  label?: string
}

/**
 * 函数：创建文件改动日志插件
 * 作用：在开发服务器中美观地打印文件变更路径（新增/修改/删除）
 */
export function fileChangeLoggerPlugin(options: FileChangeLoggerOptions = {}): Plugin {
  const devOnly = options.devOnly ?? true
  const events = options.events ?? ['change', 'add', 'unlink']
  const label = options.label ?? 'file'

  /**
   * 函数：格式化输出
   * 作用：将事件与绝对路径进行着色美化
   */
  function log(event: 'change' | 'add' | 'unlink', absPath: string) {
    const full = path.resolve(absPath)
    const time = formatTimestamp(new Date())
    const tag = bold(cyan(`[${label}]`))
    const coloredEvt = event === 'change' ? yellow('修改') : event === 'add' ? green('新增') : red('删除')
    // eslint-disable-next-line no-console
    console.log(`${tag} ${coloredEvt} ${gray(time)} → ${full}`)
  }

  return {
    name: 'quiteer-file-change-logger',
    /**
     * 函数：控制插件应用阶段
     * 作用：默认只在 dev 启用，避免影响构建输出
     */
    apply: (_config, env) => (devOnly ? env.command === 'serve' : true),

    /**
     * 函数：开发服务器钩子
     * 作用：监听 chokidar 事件并输出美化日志
     */
    configureServer(server) {
      const watcher = server.watcher
      if (events.includes('change'))
        watcher.on('change', p => log('change', p))
      if (events.includes('add'))
        watcher.on('add', p => log('add', p))
      if (events.includes('unlink'))
        watcher.on('unlink', p => log('unlink', p))
    }
  }
}
