import { describe, expect, it } from 'vitest'
import {
  capitalize,
  isString,
  kebabCase,
  snakeCase,
  trim,
  truncate
} from '../string'

describe('string module', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('hELLO')).toBe('HELLO') // implementation only changes first char
    })

    it('should return empty string for empty input', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('HelloWorld')).toBe('hello-world')
      expect(kebabCase('helloWorld')).toBe('hello-world')
      expect(kebabCase('hello world')).toBe('hello-world')
      expect(kebabCase('Hello World')).toBe('hello-world')
    })
  })

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('HelloWorld')).toBe('hello_world')
      expect(snakeCase('helloWorld')).toBe('hello_world')
      expect(snakeCase('hello world')).toBe('hello_world')
      expect(snakeCase('Hello World')).toBe('hello_world')
    })
  })

  describe('trim', () => {
    it('should trim whitespace', () => {
      expect(trim('  hello  ')).toBe('hello')
      expect(trim('hello')).toBe('hello')
    })
  })

  describe('truncate', () => {
    it('should truncate string if longer than maxLength', () => {
      expect(truncate('hello world', 5)).toBe('he...')
      expect(truncate('hello world', 11)).toBe('hello world')
    })

    it('should use custom suffix', () => {
      expect(truncate('hello world', 5, '*')).toBe('hell*')
    })
  })

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString({})).toBe(false)
    })
  })
})
