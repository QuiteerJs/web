export type BoxSize = '1x1' | '1x2' | '2x1' | '2x2'

export interface BoxGroupProps {
  width?: number
  height?: number
  autoWidth?: boolean
  autoHeight?: boolean
  scrollX?: boolean
  scrollY?: boolean
  showScrollbar?: boolean
  /** 网格行数 */
  rowSize?: number
  /** 网格列数 */
  colSize?: number
}

export interface BoxItemProps {
  id: string
  title?: string
  size: BoxSize
  editable?: boolean
  disableDrag?: boolean
}
