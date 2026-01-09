import type { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from 'naive-ui'

import { QuiActionButton, QuiBaseButton } from './components/button'
import { QuiForm } from './components/form'
import { QuiIcon, QuiIconPicker } from './components/icon'
import { DEFAULT_LAYOUT_TYPE, QuiLayout } from './components/layout'
import { QuiProvider } from './components/provider'
import { QuiSearchBar } from './components/search-bar'
import { QuiTable } from './components/table'

import { AcceptType, QuiUpload } from './components/upload'
import 'virtual:uno.css'

export {
  QuiActionButton,
  QuiBaseButton,
  QuiForm,
  QuiIcon,
  QuiIconPicker,
  QuiLayout,
  QuiProvider,
  QuiSearchBar,
  QuiTable,
  QuiUpload
}

export {
  AcceptType
}

export { DEFAULT_LAYOUT_TYPE }

export type { ActionItem, BaseButtonProps } from './components/button'
export type { CustomSwitchProps, FormProps, FormSchema } from './components/form'
export type { LayoutProps, LayoutType, RouteMeta } from './components/layout'

export type { ProviderProps } from './components/provider'
export type { SearchBarProps } from './components/search-bar'
export type {
  TableColumn,
  TableColumns,
  TableExportType,
  TableFetchFn,
  TableProps,
  TableSettings,
  TableSize
} from './components/table'
export type { UploadProps } from './components/upload'
export * from './context'
export * from './hooks'

declare global {
  interface Window {
    $message?: MessageApi
    $dialog?: DialogApi
    $notification?: NotificationApi
    $loadingBar?: LoadingBarApi
  }
}
