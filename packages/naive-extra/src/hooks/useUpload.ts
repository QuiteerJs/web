import type { UploadProps } from 'naive-ui'
import type { Props as QuiUploadProps } from '../components/upload/props'
import { AcceptType } from '../components/upload/enum'

/**
 * 上传组件属性辅助函数
 *
 * 提供一组便捷的方法来生成不同类型的上传组件属性配置（如图片、视频、音频）。
 *
 * @param config - 基础上传配置
 * @returns 包含获取不同类型上传属性的方法对象
 *
 * @example
 * ```ts
 * const { getImageUploadProps } = useUploadProps({ max: 5 })
 * const props = getImageUploadProps({ action: '/upload' })
 * ```
 */
export function useUploadProps(config: QuiUploadProps) {
  const uploadComponentProps: QuiUploadProps = {
    defaultUpload: true,
    max: 1,
    accept: undefined,
    ...config
  }

  /**
   * 获取通用上传属性
   *
   * @param option - 额外的上传配置
   * @returns 合并后的上传属性
   */
  const getUploadProps = (option?: UploadProps): UploadProps => {
    return { ...uploadComponentProps, ...option }
  }

  /**
   * 获取图片上传属性
   *
   * @param option - 额外的上传配置
   * @returns 图片上传配置
   */
  const getImageUploadProps = (option?: UploadProps): UploadProps => {
    return {
      ...getUploadProps({ accept: AcceptType.Image }),
      ...option
    }
  }

  /**
   * 获取视频上传属性
   *
   * @param option - 额外的上传配置
   * @returns 视频上传配置
   */
  const getVedioUploadProps = (option?: UploadProps): UploadProps => {
    return {
      ...getUploadProps({ accept: AcceptType.Video }),
      ...option
    }
  }

  /**
   * 获取音频上传属性
   *
   * @param option - 额外的上传配置
   * @returns 音频上传配置
   */
  const getAudioUploadProps = (option?: UploadProps): UploadProps => {
    return {
      ...getUploadProps({ accept: AcceptType.Audio }),
      ...option
    }
  }

  return {
    getUploadProps,
    getImageUploadProps,
    getVedioUploadProps,
    getAudioUploadProps
  }
}
