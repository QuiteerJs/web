export enum FileType {
  Image = 'image',
  Pdf = 'pdf',
  Doc = 'doc',
  Excel = 'excel',
  Ppt = 'ppt',
  Txt = 'txt',
  Zip = 'zip',
  Audio = 'audio',
  Video = 'video',
  Other = 'other'
}

export const FILE_TYPE_EXTENSIONS = {
  [FileType.Image]: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'],
  [FileType.Pdf]: ['pdf'],
  [FileType.Doc]: ['doc', 'docx'],
  [FileType.Excel]: ['xls', 'xlsx', 'csv'],
  [FileType.Ppt]: ['ppt', 'pptx'],
  [FileType.Txt]: ['txt', 'md', 'rtf'],
  [FileType.Zip]: ['zip', 'rar', '7z', 'tar', 'gz'],
  [FileType.Audio]: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'],
  [FileType.Video]: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'],
  [FileType.Other]: []
} as const

function getBaseName(input: string): string {
  const raw = input.trim()
  let value = raw

  if (raw.includes('://')) {
    try {
      value = new URL(raw).pathname
    }
    catch {
      value = raw
    }
  }

  value = value.split(/[?#]/)[0]
  value = value.replace(/\\/g, '/')
  const base = value.substring(value.lastIndexOf('/') + 1)
  try {
    return decodeURIComponent(base)
  }
  catch {
    return base
  }
}

export function getFileName(input: string): string {
  const base = getBaseName(input)
  const dotIndex = base.lastIndexOf('.')
  if (dotIndex <= 0)
    return base
  return base.slice(0, dotIndex)
}

export function getFileExtension(input: string): string {
  const base = getBaseName(input)
  const dotIndex = base.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === base.length - 1)
    return ''
  return base.slice(dotIndex + 1).toLowerCase()
}

export function getFileFullName(input: string): string {
  return getBaseName(input)
}
