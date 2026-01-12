import { describe, expect, it } from 'vitest'
import { stripConsoleCalls } from '../src/remove-console'

describe('remove Console', () => {
  const methods = new Set(['log', 'info', 'debug'])

  it('should remove console.log', () => {
    const code = 'console.log("hello");'
    expect(stripConsoleCalls(code, methods)).toBe('void 0;')
  })

  it('should remove console.info with arguments', () => {
    const code = 'console.info("info", 123);'
    expect(stripConsoleCalls(code, methods)).toBe('void 0;')
  })

  it('should not remove console.error (not in set)', () => {
    const code = 'console.error("error");'
    expect(stripConsoleCalls(code, methods)).toBe(code)
  })

  it('should handle multiline calls', () => {
    const code = `
      console.log(
        "a",
        "b"
      );
    `
    expect(stripConsoleCalls(code, methods).trim()).toBe('void 0;')
  })

  it('should ignore console in strings', () => {
    const code = 'const a = "console.log(1)";'
    expect(stripConsoleCalls(code, methods)).toBe(code)
  })

  it('should ignore console in comments', () => {
    const code = '// console.log(1)'
    expect(stripConsoleCalls(code, methods)).toBe(code)
  })

  it('should ignore console in block comments', () => {
    const code = '/* console.log(1) */'
    expect(stripConsoleCalls(code, methods)).toBe(code)
  })

  it('should handle nested parentheses', () => {
    const code = 'console.log(fn(1, 2));'
    expect(stripConsoleCalls(code, methods)).toBe('void 0;')
  })

  it('should handle mixed content', () => {
    const code = `
      const a = 1;
      console.log(a);
      const b = 2;
      `
    const expected = `
      const a = 1;
      void 0;
      const b = 2;
      `
    expect(stripConsoleCalls(code, methods)).toBe(expected)
  })
})
