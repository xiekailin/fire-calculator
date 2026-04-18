/**
 * 格式化货币金额（自适应单位）
 */
export function formatCurrency(value) {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(2)} 亿`
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)} 万`
  }
  return `${value.toFixed(0)} 元`
}

/**
 * 格式化货币金额（完整元）
 */
export function formatCurrencyFull(value) {
  return value.toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  })
}

/**
 * 格式化百分比
 */
export function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * 格式化年/月
 */
export function formatYears(years) {
  const y = Math.floor(years)
  const m = Math.round((years - y) * 12)
  if (m === 0) return `${y} 年`
  return `${y} 年 ${m} 个月`
}
