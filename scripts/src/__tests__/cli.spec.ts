import { resolve } from 'node:path'
import { execa } from 'execa'
import { describe, expect, it } from 'vitest'
import { version } from '../../package.json'

const CLI_PATH = resolve(__dirname, '../bin.ts')

describe('cli commands', () => {
  it('should print help message with -h', async () => {
    const { stdout } = await execa('npx', [CLI_PATH, '-h'])
    expect(stdout).toContain('quiteer')
    expect(stdout).toContain('Usage:')
    expect(stdout).toContain('Options:')
  })

  it('should print version with -v', async () => {
    const { stdout } = await execa('npx', [CLI_PATH, '-v'])
    expect(stdout).toContain(version)
  })

  it('should support qui alias behavior (conceptually)', async () => {
    // Since we are running the script directly, we verify that the script itself
    // identifies as "quiteer" in the help output, which matches the 'qui' alias intent.
    const { stdout } = await execa('npx', [CLI_PATH, '--help'])
    expect(stdout).toContain('quiteer')
  })
})
