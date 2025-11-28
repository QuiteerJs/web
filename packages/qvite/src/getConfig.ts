import type { QviteConfig, QviteConfigFn } from './typings'
import { join } from 'node:path'
import { isFunction } from '@quiteer/is'
import { parserConfig } from '@quiteer/parser-config'
import { pathExists } from 'fs-extra'
import { store } from './store'

const NOT_FOUND = '找不到 qvite.config.ts | qvite.config.js | qvite.config.json , 请在根目录下添加配置文件 , 或显式的指定配置文件路径（相对于根目录）'
const PARSING_FAILED = '找到了配置文件,但解析配置文件失败！'

const root = store.get('root') as string

async function configPath(filePath: string) {
  if (filePath)
    return join(root, filePath)

  const configList = ['ts', 'mjs', 'cjs', 'js'].map(suffix => `${join(root, 'qvite.config')}.${suffix}`)

  const index = (await Promise.all(configList.map(path => pathExists(path)))).findIndex(flag => flag)

  if (index > -1)
    return configList[index]

  throw new Error(NOT_FOUND)
}

export async function getConfig(filePath: string): Promise<QviteConfig> {
  const path = await configPath(filePath)

  try {
    const option: QviteConfig = await parserConfig(path, 'qvite.config')

    if (isFunction(option)) {
      const configFn = option as QviteConfigFn
      return configFn({ command: store.get('command')!, mode: store.get('mode')!, root })
    }

    return option
  }
  catch (error) {
    console.error('error :>> ', error)
    throw new Error(PARSING_FAILED)
  }
}
