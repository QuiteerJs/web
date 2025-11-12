import antfu from '@antfu/eslint-config'

export default antfu({
  markdown: false,
  rules: {
    // 限制使用 console：警告级别
    // - 允许的白名单方法：info、warn、error、time、timeEnd
    // - 其它 console 调用将触发 warn（可改为 'off' | 'error'）
    'no-console': ['warn', { allow: ['info', 'warn', 'error', 'time', 'timeEnd'] }],
    // 禁用原生规则（可选，避免冲突）
    'no-unused-vars': 'off',
    // 启用 unused-imports 版本，并配置忽略 _
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: false,
        reportUsedIgnorePattern: false
      }
    ],
    // 末尾逗号（JS/TS 通用）：不允许任何场景出现末尾逗号
    // - 适用于对象、数组、函数参数、导入导出等
    'style/comma-dangle': ['error', 'never'],
    '@stylistic/comma-dangle': ['error', 'never']
  }
})
