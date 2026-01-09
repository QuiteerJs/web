import type { NaiveExtraThemeConfig } from '@quiteer/naive-extra'
import { defineStore } from 'pinia'

const DEFAULT_COLORS = {
  primary: '#18a058',
  info: '#2080f0',
  success: '#18a058',
  warning: '#f0a020',
  error: '#d03050'
}

export const useAppStore = defineStore('app', {
  state: () => ({
    config: {
      themeMode: 'light',
      localeMode: 'zh',
      palette: { ...DEFAULT_COLORS },
      borderRadius: 4
    } as NaiveExtraThemeConfig
  }),
  actions: {
    init() {
      const savedConfig = localStorage.getItem('__app_config__')
      if (savedConfig) {
        try {
          this.config = JSON.parse(savedConfig)
        }
        catch {}
      }
    },
    save() {
      localStorage.setItem('__app_config__', JSON.stringify(this.config))
    },
    setZh() {
      this.config.localeMode = 'zh'
      this.save()
    },
    setEn() {
      this.config.localeMode = 'en'
      this.save()
    },
    toggleLocale() {
      this.config.localeMode = this.config.localeMode === 'zh' ? 'en' : 'zh'
      this.save()
    },
    setDark() {
      this.config.themeMode = 'dark'
      this.save()
    },
    setLight() {
      this.config.themeMode = 'light'
      this.save()
    },
    toggleTheme() {
      this.config.themeMode = this.config.themeMode === 'dark' ? 'light' : 'dark'
      this.save()
    },
    setPrimary(hex: string) {
      if (!this.config.palette)
        this.config.palette = { ...DEFAULT_COLORS }
      this.config.palette.primary = hex
      this.save()
    },
    setPalette(next: Partial<typeof DEFAULT_COLORS>) {
      if (!this.config.palette)
        this.config.palette = { ...DEFAULT_COLORS }
      this.config.palette = { ...this.config.palette, ...next }
      this.save()
    },
    setBorderRadius(radius: number) {
      this.config.borderRadius = radius
      this.save()
    },
    resetColors() {
      this.config.palette = { ...DEFAULT_COLORS }
      this.save()
    }
  },
  getters: {
    isDark(): boolean {
      return this.config.themeMode === 'dark'
    },
    colors(): typeof DEFAULT_COLORS {
      return (this.config.palette || DEFAULT_COLORS) as typeof DEFAULT_COLORS
    },
    primary(): string {
      return this.colors.primary
    }
  }
})
