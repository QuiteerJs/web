#!/usr/bin/env tsx
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import cac from 'cac'
import { getNaiveTheme } from './preset/naive-ui/theme'

const cli = cac('quiteer-unocss')

/**
 * 核心命令实现
 *
 * 使用 cac 定义 'theme' 命令，将 Naive UI 的主题配置导出为 JSON 文件。
 * 默认在当前工作目录（通常是根目录）生成 naive-theme.json。
 */
cli
  .command('theme', 'Export naive-ui theme to JSON file in project root')
  .option('-o, --output <path>', 'Output path for JSON file', { default: 'unocss-theme.json' })
  .action(async (options) => {
    try {
      const theme = getNaiveTheme()

      if (!theme) {
        throw new Error('Generated theme is undefined or null')
      }

      const outputPath = path.isAbsolute(options.output)
        ? options.output
        : path.resolve(process.cwd(), options.output)

      const themeJson = JSON.stringify(theme, null, 2)

      if (!themeJson) {
        throw new Error('Failed to stringify theme to JSON')
      }

      await fs.writeFile(outputPath, themeJson, 'utf-8')

      console.log(`✅ Successfully exported naivetheme to: ${outputPath}`)
    }
    catch (error) {
      console.error('❌ Failed to export theme:', error)
      process.exit(1)
    }
  })

cli.help()
cli.parse()
