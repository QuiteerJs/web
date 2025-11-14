import type { Plugin } from 'vite'

export type ConsoleLevel = 'off' | 'error' | 'warn' | 'info' | 'log' | 'debug' | 'trace'

export interface RemoveConsoleOptions {
  /** 最低保留的 console 等级，低于该等级的调用将被移除，默认 'warn' */
  level?: ConsoleLevel
  /** 开发服务器是否应用，默认 true */
  stripInDev?: boolean
  /** 构建是否应用，默认 true */
  stripInBuild?: boolean
  /** 自定义需要移除的方法列表，优先于 level 控制 */
  methods?: Array<'trace' | 'debug' | 'log' | 'info' | 'warn' | 'error'>
  /** 包含的文件正则过滤，默认处理 js/ts/jsx/tsx/vue */
  include?: RegExp[]
  /** 排除的文件正则过滤 */
  exclude?: RegExp[]
  /** 是否处理 .vue 文件中的 <script> 代码，默认 true */
  processVue?: boolean
}

const SEVERITY: Record<Exclude<ConsoleLevel, 'off'>, number> = {
  trace: 10,
  debug: 20,
  log: 30,
  info: 40,
  warn: 50,
  error: 60
}

/**
 * 函数：判断文件是否需要处理
 * 作用：基于 include/exclude 和扩展名过滤
 */
function shouldProcess(id: string, opt: Required<Omit<RemoveConsoleOptions, 'methods' | 'include' | 'exclude' | 'processVue'>> & Pick<RemoveConsoleOptions, 'methods' | 'include' | 'exclude' | 'processVue'>): boolean {
  const exts = [/\.[mc]?jsx?$/, /\.[mc]?tsx?$/]
  const vueRe = /\.vue$/
  const inIncludes = !opt.include?.length || opt.include.some(r => r.test(id))
  const inExcludes = opt.exclude?.some(r => r.test(id)) ?? false
  if (inExcludes)
    return false
  if (!inIncludes)
    return false
  if (vueRe.test(id))
    return !!opt.processVue
  return exts.some(r => r.test(id))
}

/**
 * 函数：根据 level 计算需要移除的方法集合
 * 作用：生成一个 Set 以供匹配时快速判断
 */
function buildMethodsToStrip(level: ConsoleLevel, custom?: RemoveConsoleOptions['methods']): Set<string> {
  if (custom?.length)
    return new Set(custom)
  if (level === 'off')
    return new Set()
  const min = SEVERITY[level]
  const all: Array<keyof typeof SEVERITY> = ['trace', 'debug', 'log', 'info', 'warn', 'error']
  return new Set(all.filter(m => SEVERITY[m] < min))
}

/**
 * 函数：移除代码中的 console 调用
 * 作用：在不使用第三方解析器的情况下，避开字符串与注释，删除匹配的调用表达式
 */
export function stripConsoleCalls(code: string, methods: Set<string>): string {
  let i = 0
  const len = code.length
  let out = ''
  let inS: '"' | '\'' | '`' | null = null
  let inLC = false // line comment
  let inBC = false // block comment
  while (i < len) {
    const ch = code[i]
    const next = code[i + 1]

    // 处理换行，结束行注释
    if (inLC && ch === '\n') {
      inLC = false
      out += ch
      i++
      continue
    }
    // 结束块注释
    if (inBC && ch === '*' && next === '/') {
      inBC = false
      i += 2
      out += '*/'
      continue
    }
    // 进入行注释
    if (!inS && !inBC && !inLC && ch === '/' && next === '/') {
      inLC = true
      out += '//'
      i += 2
      continue
    }
    // 进入块注释
    if (!inS && !inBC && !inLC && ch === '/' && next === '*') {
      inBC = true
      out += '/*'
      i += 2
      continue
    }
    // 处理字符串进入/退出
    if (!inLC && !inBC) {
      if (!inS && isQuote(ch)) {
        inS = ch
        out += ch
        i++
        continue
      }
      else if (inS) {
        // 处理字符串内的转义
        out += ch
        i++
        if (ch === '\\') {
          out += code[i] ?? ''
          i++
        }
        else if (ch === inS) {
          inS = null
        }
        continue
      }
    }

    // 尝试匹配 console.<method>(
    if (!inS && !inLC && !inBC && ch === 'c' && code.slice(i, i + 8) === 'console.') {
      // 读取方法名
      let j = i + 8
      let method = ''
      while (j < len && /[a-z]/i.test(code[j])) {
        method += code[j]
        j++
      }
      if (!methods.has(method)) {
        // 不剥离该方法，按原样输出一个字符并继续
        out += ch
        i++
        continue
      }
      // 跳过空白，期望遇到 '('
      while (j < len && /\s/.test(code[j])) j++
      if (code[j] !== '(') {
        // 非调用表达式，跳过
        out += ch
        i++
        continue
      }
      // 找到匹配括号位置
      let depth = 0
      let k = j
      let localInS: '"' | '\'' | '`' | null = null
      let localInLC = false
      let localInBC = false
      while (k < len) {
        const c = code[k]
        const n = code[k + 1]
        if (localInLC && c === '\n') {
          localInLC = false
        }
        else if (localInBC && c === '*' && n === '/') {
          localInBC = false
          k += 2
          continue
        }
        else if (!localInS && !localInLC && !localInBC && c === '/' && n === '/') {
          localInLC = true
          k += 2
          continue
        }
        else if (!localInS && !localInLC && !localInBC && c === '/' && n === '*') {
          localInBC = true
          k += 2
          continue
        }
        else if (!localInLC && !localInBC) {
          if (!localInS && isQuote(c)) {
            localInS = c
            k++
            continue
          }
          if (localInS) {
            if (c === '\\') {
              k += 2
              continue
            }
            if (c === localInS) {
              localInS = null
              k++
              continue
            }
            k++
            continue
          }
        }
        if (c === '(') {
          depth++
        }
        else if (c === ')') {
          depth--
          if (depth === 0) {
            k++
            break
          }
        }
        k++
      }
      // 跳过可能的尾随分号与空白
      while (k < len && /[\s;]/.test(code[k])) k++
      // 完全移除该调用表达式
      i = k
      continue
    }

    // 默认输出当前字符
    out += ch
    i++
  }
  return out
}

/**
 * 函数：判断字符是否为引号
 * 作用：提供类型守卫，缩窄为 '"' | '\'' | '`'
 */
function isQuote(ch: string): ch is '"' | '\'' | '`' {
  return ch === '"' || ch === '\'' || ch === '`'
}

/**
 * 函数：处理 .vue 文件中的 <script> 代码
 * 作用：提取 <script> 或 <script setup> 内容进行剥离，再拼回原文件
 */
function processVueSFC(code: string, methods: Set<string>): string {
  const scriptBlocks = [...code.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
  if (!scriptBlocks.length)
    return code
  let transformed = code
  for (const m of scriptBlocks) {
    const full = m[0]
    const inner = m[1] ?? ''
    const stripped = stripConsoleCalls(inner, methods)
    transformed = transformed.replace(full, full.replace(inner, stripped))
  }
  return transformed
}

/**
 * 函数：创建移除 console 的 Vite 插件
 * 作用：根据传入的等级与过滤规则剥离控制台调用
 */
export function removeConsolePlugin(options: RemoveConsoleOptions = {}): Plugin {
  const {
    level = 'warn',
    stripInDev = true,
    stripInBuild = true,
    methods,
    include,
    exclude,
    processVue = true
  } = options

  const methodsToStrip = buildMethodsToStrip(level, methods)

  return {
    name: 'quiteer-remove-console',
    enforce: 'pre',
    /**
     * 函数：控制插件应用的阶段
     * 作用：根据配置决定在 dev/build 阶段是否启用
     */
    apply: (_config, env) => env.command === 'serve' ? stripInDev : stripInBuild,

    /**
     * 函数：核心 transform 钩子
     * 作用：对匹配的文件移除指定等级以下的 console 调用
     */
    transform(code, id) {
      if (!shouldProcess(id, { level, stripInDev, stripInBuild, processVue, methods, include, exclude }))
        return null
      const run = (src: string) => stripConsoleCalls(src, methodsToStrip)
      const transformed = id.endsWith('.vue') && processVue ? processVueSFC(code, methodsToStrip) : run(code)
      if (transformed === code)
        return null
      return { code: transformed, map: null }
    }
  }
}
