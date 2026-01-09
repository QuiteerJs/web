/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import {
  isAudioElement,
  isCanvasElement,
  isComment,
  isDocumentFragmentNode,
  isDocumentNode,
  isElement,
  isElementNode,
  isElementNodeList,
  isImageElement,
  isMediaElement,
  isNode,
  isNodeList,
  isSvgElement,
  isTagElement,
  isTextNode,
  isVideoElement
} from '../dom'

describe('isDOM module', () => {
  // Setup JSDOM environment objects for testing
  const doc = document
  const div = document.createElement('div')
  const span = document.createElement('span')
  const text = document.createTextNode('text')
  const comment = document.createComment('comment')
  const fragment = document.createDocumentFragment()
  const img = document.createElement('img')
  const video = document.createElement('video')
  const audio = document.createElement('audio')
  const canvas = document.createElement('canvas')
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  it('isElement', () => {
    expect(isElement(div)).toBe(true)
    expect(isElement(text)).toBe(false)
    expect(isElement({})).toBe(false)
  })

  it('isTagElement', () => {
    expect(isTagElement(div)).toBe(true)
    expect(isTagElement(text)).toBe(false) // Text node has no tagName in HTMLElement sense (undefined in implementation check)
    // Actually, HTMLElement always has tagName. Text node is NOT HTMLElement.
    // The implementation checks: isElement(el) && el.tagName !== undefined
    // isElement checks instanceof HTMLElement.
    // So this is redundant but correct.
  })

  it('isComment', () => {
    expect(isComment(comment)).toBe(true)
    expect(isComment(div)).toBe(false)
  })

  it('isTextNode', () => {
    expect(isTextNode(text)).toBe(true)
    expect(isTextNode(div)).toBe(false)
  })

  it('isElementNode', () => {
    // isTagElement || isComment || isTextNode
    expect(isElementNode(div)).toBe(true)
    expect(isElementNode(comment)).toBe(true)
    expect(isElementNode(text)).toBe(true)
    expect(isElementNode(doc)).toBe(false)
  })

  it('isDocumentNode', () => {
    expect(isDocumentNode(doc)).toBe(true)
    expect(isDocumentNode(div)).toBe(false)
  })

  it('isDocumentFragmentNode', () => {
    expect(isDocumentFragmentNode(fragment)).toBe(true)
    expect(isDocumentFragmentNode(div)).toBe(false)
  })

  it('isNode', () => {
    // isElementNode || isDocumentNode || isDocumentFragmentNode
    expect(isNode(div)).toBe(true)
    expect(isNode(text)).toBe(true)
    expect(isNode(doc)).toBe(true)
    expect(isNode(fragment)).toBe(true)
    expect(isNode({})).toBe(false)
  })

  it('isNodeList', () => {
    const nodeList = doc.querySelectorAll('div')
    expect(isNodeList(nodeList)).toBe(true)
    expect(isNodeList([])).toBe(false)
  })

  it('isElementNodeList', () => {
    div.appendChild(span)
    // const nodeList = div.childNodes // NodeList containing span (HTMLElement)
    // Note: querySelectorAll returns NodeList in some envs, but HTMLCollection in others?
    // Standard: NodeList.
    const queryList = doc.querySelectorAll('div')

    expect(isElementNodeList(queryList)).toBe(true)

    // Create a NodeList with a non-element
    div.appendChild(text)
    // childNodes is a NodeList
    // But isElementNodeList checks if every item isElementNode (Tag, Comment, or Text)
    // Wait, isElementNode implementation: isTagElement || isComment || isTextNode
    // So a list of text nodes IS an ElementNodeList by this definition?
    // Name is confusing: "ElementNodeList" usually implies list of Elements.
    // But implementation says: Array.from(el).every(isElementNode)
    // And isElementNode includes Text and Comment.
    // So yes, mixed content is true.
    expect(isElementNodeList(div.childNodes)).toBe(true)
  })

  it('isMediaElement', () => {
    expect(isMediaElement(video)).toBe(true)
    expect(isMediaElement(audio)).toBe(true)
    expect(isMediaElement(img)).toBe(false)
  })

  it('isImageElement', () => {
    expect(isImageElement(img)).toBe(true)
    expect(isImageElement(div)).toBe(false)
  })

  it('isAudioElement', () => {
    expect(isAudioElement(audio)).toBe(true)
    expect(isAudioElement(video)).toBe(false)
  })

  it('isVideoElement', () => {
    expect(isVideoElement(video)).toBe(true)
    expect(isVideoElement(audio)).toBe(false)
  })

  it('isCanvasElement', () => {
    expect(isCanvasElement(canvas)).toBe(true)
    expect(isCanvasElement(div)).toBe(false)
  })

  it('isSvgElement', () => {
    expect(isSvgElement(svg)).toBe(true)
    expect(isSvgElement(div)).toBe(false)
  })
})
