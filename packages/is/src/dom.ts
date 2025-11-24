/** @description: 判断是否是标签元素 */
export function isElement(el: unknown): el is HTMLElement {
  return el instanceof HTMLElement
}

/** @description: 判断是否为标签元素（含 tagName） */
export function isTagElement(el: unknown): el is HTMLElement {
  return isElement(el) && el.tagName !== undefined
}

/** @description: 判断是否是注释节点 */
export function isComment(el: unknown): el is Comment {
  return el instanceof Comment
}

/** @description: 判断是否是文本节点 */
export function isTextNode(el: unknown): el is Text {
  return el instanceof Text
}

/** @description: 判断是否是元素节点 */
export function isElementNode(el: unknown): el is HTMLElement {
  return isTagElement(el) || isComment(el) || isTextNode(el)
}

/** @description: 判断是否是文档节点 */
export function isDocumentNode(el: unknown): el is Document {
  return el instanceof Document
}

/** @description: 判断是否是文档片段节点 */
export function isDocumentFragmentNode(el: unknown): el is DocumentFragment {
  return el instanceof DocumentFragment
}

/** @description: 判断是否是任意节点 */
export function isNode(el: unknown): el is Node {
  return isElementNode(el) || isDocumentNode(el) || isDocumentFragmentNode(el)
}

/** @description: 判断是否是节点列表 */
export function isNodeList(el: unknown): el is NodeList {
  return el instanceof NodeList
}

/** @description: 判断是否是元素节点列表 */
export function isElementNodeList(el: unknown): el is NodeListOf<HTMLElement> {
  return isNodeList(el) && Array.from(el).every(isElementNode)
}

/** @description: 是否为多媒体元素 */
export function isMediaElement(el: unknown): el is HTMLMediaElement {
  return el instanceof HTMLMediaElement
}

/** @description: 是否为图片元素 */
export function isImageElement(el: unknown): el is HTMLImageElement {
  return el instanceof HTMLImageElement
}

/** @description: 是否为音频元素 */
export function isAudioElement(el: unknown): el is HTMLAudioElement {
  return el instanceof HTMLAudioElement
}

/** @description: 是否为视频元素 */
export function isVideoElement(el: unknown): el is HTMLVideoElement {
  return el instanceof HTMLVideoElement
}

/** @description: 是否为画布元素 */
export function isCanvasElement(el: unknown): el is HTMLCanvasElement {
  return el instanceof HTMLCanvasElement
}

/** @description: 是否为 SVG 元素 */
export function isSvgElement(el: unknown): el is SVGElement {
  return el instanceof SVGElement
}
