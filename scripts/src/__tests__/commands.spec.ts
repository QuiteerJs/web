import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setupCli } from '../bin'
import {
  cleanup,
  generateConfig,
  generateDirTree,
  gitCommit,
  gitCommitAdd,
  gitCommitVerify,
  gitRemoteBranches,
  release,
  selfUpdate,
  updatePkg
} from '../commands'
import { generateChangelogFiles } from '../commands/changelog'
import { gitCommitTz } from '../customize/git-commit'
import { gitCommitVerifyTz } from '../customize/git-commit-verify'

// Mock dependencies
const mockGenerateConfig = vi.mocked(generateConfig)
const mockCleanup = vi.mocked(cleanup)
const mockUpdatePkg = vi.mocked(updatePkg)
const mockSelfUpdate = vi.mocked(selfUpdate)
const mockGenerateDirTree = vi.mocked(generateDirTree)
const mockGitCommitAdd = vi.mocked(gitCommitAdd)
const mockGitCommit = vi.mocked(gitCommit)
const mockGitCommitVerify = vi.mocked(gitCommitVerify)
const mockGitRemoteBranches = vi.mocked(gitRemoteBranches)
const mockRelease = vi.mocked(release)
const mockGenerateChangelogFiles = vi.mocked(generateChangelogFiles)
const mockGitCommitTz = vi.mocked(gitCommitTz)
const mockGitCommitVerifyTz = vi.mocked(gitCommitVerifyTz)

vi.mock('../commands/changelog', () => ({
  generateChangelogFiles: vi.fn()
}))

vi.mock('../customize/git-commit', () => ({
  gitCommitTz: vi.fn()
}))

vi.mock('../customize/git-commit-verify', () => ({
  gitCommitVerifyTz: vi.fn()
}))

vi.mock('../commands', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../commands')>()
  return {
    ...actual,
    checkUpdateAndNotify: vi.fn(),
    generateConfig: vi.fn(),
    cleanup: vi.fn(),
    updatePkg: vi.fn(),
    selfUpdate: vi.fn(),
    generateDirTree: vi.fn(),
    gitCommitAdd: vi.fn(),
    gitCommit: vi.fn(),
    gitCommitVerify: vi.fn(),
    gitRemoteBranches: vi.fn(),
    release: vi.fn()
  }
})

vi.mock('../config', () => ({
  loadCliOptions: vi.fn().mockResolvedValue({
    cleanupDirs: ['dist'],
    ncuCommandArgs: ['-u'],
    dirTree: { md: false, output: 'tree.md', ignore: [] },
    gitCommit: { add: true },
    lang: 'zh-cn',
    gitCommitVerifyIgnores: [],
    changelog: { formats: 'both', groupOutput: 'CHANGELOG.md', timelineOutput: 'TIMELINE.md' }
  })
}))

// Store actions mapped by command name (via global to share with mock)
// const commandActions: Record<string, (...args: any[]) => any> = {}

// Mock cac
vi.mock('cac', () => {
  return {
    default: () => ({
      version: vi.fn().mockReturnThis(),
      help: vi.fn().mockReturnThis(),
      parse: vi.fn(),
      command: (name: string) => {
        const cmdName = name.split(' ')[0]
        const cmdObj = {
          alias: vi.fn().mockReturnThis(),
          option: vi.fn().mockReturnThis(),
          action: (fn: (...args: any[]) => any) => {
            // Delay assignment to avoid TDZ if commandActions is not yet initialized
            // However, this factory runs after hoisting.
            // But 'commandActions' is defined in the top level scope of the module.
            // 'vi.mock' is hoisted to the top.
            // So when this factory runs, 'commandActions' might be TDZ if it's declared with 'const' below the hoisting point?
            // Actually, variables declared with const are TDZ until declaration.
            // Mock factories run *before* the module body executes (conceptually).
            // BUT here we are inside the factory.

            // To fix this, we can't access top-level variables from inside vi.mock factory if they are not hoisted.
            // We should use a side-channel or put commandActions on global/window or just import a helper.

            // Simpler fix: Define a local variable inside the mock factory or use a mutable object defined outside if possible?
            // No, vitest mock factory is isolated.

            // Workaround: We can't easily share scope.
            // But we can expose a way to get the actions.
            // Or we can mock 'cac' to return a specific object that we can inspect later.

            // Let's attach the actions to a property on the mocked object itself?
            // Or use a global registry.

            (globalThis as any).__TEST_COMMAND_ACTIONS__ = (globalThis as any).__TEST_COMMAND_ACTIONS__ || {};
            (globalThis as any).__TEST_COMMAND_ACTIONS__[cmdName] = fn

            return cmdObj
          }
        }
        return cmdObj
      }
    })
  }
})

const getCommandActions = () => (globalThis as any).__TEST_COMMAND_ACTIONS__ || {}

describe('cLI Commands Logic', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    ;(globalThis as any).__TEST_COMMAND_ACTIONS__ = {}
    // Re-run setupCli to populate commandActions
    await setupCli()
  })

  it('generate-config should call generateConfig', async () => {
    await getCommandActions()['generate-config']()
    expect(mockGenerateConfig).toHaveBeenCalled()
  })

  it('remove should call cleanup with parsed paths', async () => {
    await getCommandActions().remove('a,b')
    expect(mockCleanup).toHaveBeenCalledWith(['a', 'b'])

    await getCommandActions().remove('a')
    expect(mockCleanup).toHaveBeenCalledWith(['a'])

    await getCommandActions().remove(undefined)
    // Should log info, mock console? Assuming no-op or specific behavior
  })

  it('cleanup should call cleanup with default or provided paths', async () => {
    await getCommandActions().cleanup('dist')
    expect(mockCleanup).toHaveBeenCalledWith(['dist'])

    await getCommandActions().cleanup(undefined)
    expect(mockCleanup).toHaveBeenCalledWith(['dist']) // from default config
  })

  it('update-pkg should call updatePkg', async () => {
    await getCommandActions()['update-pkg']()
    expect(mockUpdatePkg).toHaveBeenCalledWith(['-u'])
  })

  it('self-update should call selfUpdate', async () => {
    await getCommandActions()['self-update']()
    expect(mockSelfUpdate).toHaveBeenCalled()
  })

  it('tree should call generateDirTree', async () => {
    await getCommandActions().tree('.', { md: true })
    expect(mockGenerateDirTree).toHaveBeenCalledWith('.', { md: true, output: 'tree.md', ignore: [] })
  })

  it('git-commit should call gitCommit and optionally gitCommitAdd', async () => {
    await getCommandActions()['git-commit']({ add: true, lang: 'zh-cn' })
    expect(mockGitCommitAdd).toHaveBeenCalled()
    expect(mockGitCommit).toHaveBeenCalledWith('zh-cn')

    vi.clearAllMocks()
    await getCommandActions()['git-commit']({ add: false })
    expect(mockGitCommitAdd).not.toHaveBeenCalled()
    expect(mockGitCommit).toHaveBeenCalled()
  })

  it('git-commit-verify should call gitCommitVerify', async () => {
    await getCommandActions()['git-commit-verify']({ lang: 'en-us' })
    expect(mockGitCommitVerify).toHaveBeenCalledWith('en-us', [])
  })

  it('git-branches should call gitRemoteBranches', async () => {
    await getCommandActions()['git-branches']('origin')
    expect(mockGitRemoteBranches).toHaveBeenCalledWith('origin')
  })

  it('release should call release', async () => {
    await getCommandActions().release({ tagPrefix: 'v' })
    expect(mockRelease).toHaveBeenCalledWith('v')
  })

  it('changelog should call generateChangelogFiles', async () => {
    await getCommandActions().changelog({ format: 'both' })
    expect(mockGenerateChangelogFiles).toHaveBeenCalledWith(expect.objectContaining({
      format: 'both',
      groupOutput: 'CHANGELOG.md'
    }))
  })

  it('git-commit-tianze should call gitCommitTz', async () => {
    await getCommandActions()['git-commit-tianze']({ add: true })
    expect(mockGitCommitAdd).toHaveBeenCalled()
    expect(mockGitCommitTz).toHaveBeenCalled()
  })

  it('git-commit-verify-tianze should call gitCommitVerifyTz', async () => {
    await getCommandActions()['git-commit-verify-tianze']()
    expect(mockGitCommitVerifyTz).toHaveBeenCalled()
  })
})
