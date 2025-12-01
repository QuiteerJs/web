import type { VirtualHtmlConfig, VirtualHtmlTag } from '@quiteer/vite-plugins'

/**
 * 示例：带类型提示的虚拟 HTML 配置
 *
 * 使用 `satisfies VirtualHtmlConfig` 获得更严格的 IDE 提示与约束：
 * - 未声明的字段/错误的字段类型会提示错误
 * - `position`、`selfClosing` 等联合类型有自动补全
 * - `attrs` 支持 `string|number|boolean|null|undefined`
 */
export default {
  title: '测试我自己的title',
  tags: [
    { tag: 'div', attrs: { style: 'width: 100px; height: 100px; background-color: red;' }, selfClosing: true, position: 'body-append' } as VirtualHtmlTag
  ]
} satisfies VirtualHtmlConfig
