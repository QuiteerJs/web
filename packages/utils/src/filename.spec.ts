import { describe, expect, it } from 'vitest'
import { FILE_TYPE_EXTENSIONS, FileType, getFileExtension, getFileFullName, getFileName } from './filename'

describe('filename module', () => {
  describe('getFileFullName', () => {
    it('should resolve file name from url with query and hash', () => {
      expect(getFileFullName('https://example.com/path/report.pdf?x=1#top')).toBe('report.pdf')
    })

    it('should resolve file name from windows path', () => {
      expect(getFileFullName('C:\\docs\\file.DOCX')).toBe('file.DOCX')
    })

    it('should decode uri components', () => {
      expect(getFileFullName('https://example.com/%E6%96%87%E6%A1%A3.pdf')).toBe('文档.pdf')
    })
  })

  describe('getFileName', () => {
    it('should return base name without extension', () => {
      expect(getFileName('/tmp/report.final.pdf')).toBe('report.final')
    })

    it('should keep name when no extension', () => {
      expect(getFileName('README')).toBe('README')
    })

    it('should keep dotfile name without extension', () => {
      expect(getFileName('.gitignore')).toBe('.gitignore')
    })
  })

  describe('getFileExtension', () => {
    it('should return lowercase extension', () => {
      expect(getFileExtension('photo.JPG')).toBe('jpg')
    })

    it('should return empty string when no extension', () => {
      expect(getFileExtension('README')).toBe('')
    })

    it('should return empty string when trailing dot', () => {
      expect(getFileExtension('report.')).toBe('')
    })
  })

  describe('file type extension map', () => {
    it('should include common extensions', () => {
      expect(FILE_TYPE_EXTENSIONS[FileType.Image]).toContain('png')
      expect(FILE_TYPE_EXTENSIONS[FileType.Pdf]).toContain('pdf')
      expect(FILE_TYPE_EXTENSIONS[FileType.Doc]).toContain('docx')
      expect(FILE_TYPE_EXTENSIONS[FileType.Excel]).toContain('xlsx')
      expect(FILE_TYPE_EXTENSIONS[FileType.Ppt]).toContain('pptx')
    })
  })
})
