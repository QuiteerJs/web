/**
 * 类型：将对象的所有属性设为可选（深层）
 * 作用：用于配置对象的增量更新等场景
 */
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T

/**
 * 类型：将对象的所有属性设为必选（深层）
 * 作用：用于确保完整配置
 */
export type DeepRequired<T> = T extends object ? { [K in keyof T]-?: DeepRequired<T[K]> } : T

/**
 * 类型：对象的非空属性键集合
 * 作用：过滤掉可能为 undefined 的属性键
 */
export type RequiredKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? never : K }[keyof T]

/**
 * 类型：对象的可选属性键集合
 * 作用：提取包含 undefined 的属性键
 */
export type OptionalKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T]

/**
 * 类型：提取对象的值联合类型
 * 作用：便于获得对象 value 的联合类型
 */
export type ValueOf<T> = T[keyof T]

/**
 * 类型：联合转交叉
 * 作用：在高级类型推导中合并联合为交叉
 */
export type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (x: infer I) => any ? I : never

/**
 * 类型：美化类型显示
 * 作用：展开交叉类型以获得更友好的提示
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

/**
 * 类型：深只读
 * 作用：将对象及其嵌套属性设为只读
 */
export type ReadonlyDeep<T> = T extends object ? { readonly [K in keyof T]: ReadonlyDeep<T[K]> } : T

/**
 * 类型：深可变
 * 作用：将对象及其嵌套属性移除 readonly
 */
export type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T

/**
 * 类型：精确匹配对象结构
 * 作用：确保没有多余属性
 */
export type Exact<T, U extends T> = U & { [K in Exclude<keyof U, keyof T>]?: never }

/**
 * 类型：按值类型挑选键
 * 作用：Pick 出值类型匹配的键集合
 */
export type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]

/**
 * 类型：按值类型筛选对象属性
 * 作用：保留值类型匹配的属性
 */
export type PickByValue<T, V> = Pick<T, KeysOfType<T, V>>

/**
 * 类型：按值类型排除对象属性
 * 作用：移除值类型匹配的属性
 */
export type OmitByValue<T, V> = Omit<T, KeysOfType<T, V>>

/**
 * 类型：可空
 * 作用：将所有属性设为 T | null
 */
export type Nullable<T> = { [K in keyof T]: T[K] | null }

/**
 * 类型：深可空
 * 作用：递归设置属性为可空
 */
export type NullableDeep<T> = T extends object ? { [K in keyof T]: NullableDeep<T[K]> | null } : T | null

/**
 * 类型：原始类型集合
 * 作用：用于泛型约束
 */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined

/**
 * 类型：JSON 值类型
 * 作用：描述可序列化的 JSON 结构
 */
export type JSONValue = Primitive | { [x: string]: JSONValue } | JSONValue[]

/**
 * 类型：品牌类型
 * 作用：通过唯一 symbol 为基本类型打上品牌
 */
export type Brand<T, B extends string> = T & { readonly __brand: B }

/**
 * 类型：条件相等判断
 * 作用：用于类型分支判断
 */
export type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B

/**
 * 类型：是否 any
 * 作用：判断类型是否为 any
 */
export type IsAny<T> = 0 extends (1 & T) ? true : false

/**
 * 类型：是否 never
 * 作用：判断类型是否为 never
 */
export type IsNever<T> = [T] extends [never] ? true : false

/**
 * 类型：元组转联合
 * 作用：将元组的元素类型合并为联合类型
 */
export type TupleToUnion<T extends readonly any[]> = T[number]

/**
 * 类型：联合转元组（简化版）
 * 作用：在部分场景下将联合近似转为元组
 */
export type UnionToTuple<U> = U extends any ? [U] : never

/**
 * 类型：覆盖属性
 * 作用：用 U 的同名键覆盖 T
 */
export type Overwrite<T, U> = { [K in keyof T]: K extends keyof U ? U[K] : T[K] }

/**
 * 类型：合并对象（浅）
 * 作用：将两对象合并为新对象
 */
export type Merge<T, U> = { [K in keyof (T & U)]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never }

/**
 * 类型：展开类型显示
 * 作用：在提示中显示完整结构
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

/**
 * 类型：宽泛的函数类型
 * 作用：匹配任意参数和返回值的函数类型
 */
export type AnyFunction<T> = T extends (...args: any[]) => any ? T : never
