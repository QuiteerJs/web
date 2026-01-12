import type { HtmlTagDescriptor, HtmlVirtualConfig } from '../src/virtual-html'
import { describe, expect, it } from 'vitest'
import {

  normalizePagePath,
  renderAttrs,
  renderHtmlDocument,
  renderTag,
  toLinkTag,
  toScriptTag
} from '../src/virtual-html'

describe('virtual HTML', () => {
  describe('renderAttrs', () => {
    it('should render basic attributes', () => {
      expect(renderAttrs({ id: 'app', class: 'main' })).toBe(' id="app" class="main"')
    })

    it('should handle boolean attributes', () => {
      expect(renderAttrs({ checked: true, disabled: false })).toBe(' checked')
    })

    it('should handle number attributes', () => {
      expect(renderAttrs({ width: 100 })).toBe(' width="100"')
    })

    it('should ignore null/undefined', () => {
      expect(renderAttrs({ id: null, class: undefined })).toBe('')
    })

    it('should escape quotes', () => {
      expect(renderAttrs({ title: 'say "hello"' })).toBe(' title="say &quot;hello&quot;"')
    })
  })

  describe('renderTag', () => {
    it('should render normal tag', () => {
      const tag: HtmlTagDescriptor = { tag: 'div', attrs: { id: 'app' }, children: 'hello' }
      expect(renderTag(tag)).toBe('<div id="app">hello</div>')
    })

    it('should render void tag', () => {
      const tag: HtmlTagDescriptor = { tag: 'img', attrs: { src: 'a.png' } }
      expect(renderTag(tag)).toBe('<img src="a.png">')
    })

    it('should render self-closing tag', () => {
      // Note: renderTag logic checks voidTags list. If tag is in voidTags, it self-closes.
      // If not in voidTags, it closes with </tag>.
      // The interface has selfClosing property but implementation uses voidTags list for void elements structure
      // or standard structure.
      // Actually, looking at implementation:
      // if (voidTags.includes(t)) return `<${t}${attrs}>`
      // return `<${t}${attrs}>${children}</${t}>`
      // So selfClosing property in descriptor seems unused in renderTag function directly
      // but might be used in higher level logic if any.
      // Wait, let's check renderTag implementation again from previous read.

      // implementation:
      // function renderTag(d: HtmlTagDescriptor): string {
      //   const attrs = renderAttrs(d.attrs)
      //   const t = d.tag
      //   const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
      //   if (voidTags.includes(t))
      //     return `<${t}${attrs}>`
      //   const children = d.children ?? ''
      //   return `<${t}${attrs}>${children}</${t}>`
      // }

      const meta: HtmlTagDescriptor = { tag: 'meta', attrs: { charset: 'utf-8' } }
      expect(renderTag(meta)).toBe('<meta charset="utf-8">')
    })
  })

  describe('normalizePagePath', () => {
    it('should normalize basic path', () => {
      expect(normalizePagePath('/about')).toEqual({
        primary: '/about/index.html',
        aliases: ['/about', '/about/']
      })
    })

    it('should normalize index.html', () => {
      expect(normalizePagePath('/index.html')).toEqual({
        primary: '/index.html',
        aliases: []
      })
    })

    it('should normalize directory path', () => {
      expect(normalizePagePath('/nested/')).toEqual({
        primary: '/nested/index.html',
        aliases: ['/nested/', '/nested']
      })
    })

    it('should add leading slash', () => {
      expect(normalizePagePath('about')).toEqual({
        primary: '/about/index.html',
        aliases: ['/about', '/about/']
      })
    })
  })

  describe('toScriptTag', () => {
    it('should convert script config', () => {
      const script = { src: '/main.js', async: true, type: 'module' }
      const tag = toScriptTag(script)
      expect(tag).toEqual({
        tag: 'script',
        attrs: { src: '/main.js', async: true, type: 'module' },
        position: 'body-append'
      })
    })
  })

  describe('toLinkTag', () => {
    it('should convert link config', () => {
      const link = { src: '/style.css' }
      const tag = toLinkTag(link)
      expect(tag).toEqual({
        tag: 'link',
        attrs: { rel: 'stylesheet', href: '/style.css' },
        selfClosing: true,
        position: 'head'
      })
    })
  })

  describe('renderHtmlDocument', () => {
    it('should render complete document', () => {
      const cfg: HtmlVirtualConfig = {
        title: 'Test App',
        entry: '/src/main.ts',
        htmlAttrs: { lang: 'en' },
        bodyAttrs: { class: 'dark' },
        tags: [
          { tag: 'meta', attrs: { name: 'description', content: 'test' }, position: 'head' }
        ]
      }

      const html = renderHtmlDocument(cfg)

      expect(html).toContain('<html lang="en">')
      expect(html).toContain('<title>Test App</title>')
      expect(html).toContain('<meta charset="utf-8">') // default
      expect(html).toContain('<meta name="viewport"') // default
      expect(html).toContain('<meta name="description" content="test">')
      expect(html).toContain('<body class="dark">')
      expect(html).toContain('<div id="app"></div>')
      expect(html).toContain('<script type="module" src="/src/main.ts"></script>')
    })

    it('should not duplicate default meta if provided', () => {
      const cfg: HtmlVirtualConfig = {
        tags: [
          { tag: 'meta', attrs: { charset: 'gbk' }, position: 'head' }
        ]
      }
      const html = renderHtmlDocument(cfg)
      expect(html).toContain('<meta charset="gbk">')
      expect(html).not.toContain('<meta charset="utf-8">')
    })
  })
})
