import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '../utils/format'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  return (
    <div className="bg-warm-card rounded-xl shadow-lg border border-warm-border p-3 text-sm">
      <div className="font-semibold text-warm-dark mb-1">{data?.age} 岁</div>
      <div className="text-warm-muted">
        资产余额：
        <span className={`font-semibold ${data?.balance < 0 ? 'text-warm-danger' : 'text-warm-dark'}`}>
          {formatCurrency(Math.abs(data?.balance || 0))}
          {data?.balance < 0 ? '（透支）' : ''}
        </span>
      </div>
      {data?.balance < 0 && (
        <div className="text-xs text-warm-danger mt-1">资产已耗尽</div>
      )}
    </div>
  )
}

function formatYAxis(value) {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}亿`
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
  return value
}

export default function RetirementSimChart({ result, values }) {
  const {
    inflatedTarget,
    yearsToRetire,
    canRetire,
  } = result

  const { retireAge, inflationRate, swr } = values
  const endAge = 90
  const retirementReturn = 0.04

  if (canRetire) return null

  // 模拟退休后资产消耗
  const rawData = []
  let balance = inflatedTarget
  const annualExpense = inflatedTarget * swr

  for (let age = retireAge; age <= endAge; age++) {
    rawData.push({ age, balance: Math.round(balance) })
    const yearsSinceRetire = age - retireAge
    const yearExpense = annualExpense * Math.pow(1 + inflationRate, yearsSinceRetire)
    balance = balance * (1 + retirementReturn) - yearExpense
  }

  const depletionAge = rawData.find((d) => d.balance < 0)?.age
  const moneyLasts = depletionAge ? depletionAge - 1 : endAge

  // 将负值截断为 0 用于正面积，负值单独处理
  const data = rawData.map((d) => ({
    ...d,
    positive: Math.max(0, d.balance),
    negative: d.balance < 0 ? d.balance : 0,
  }))

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-1 flex items-center gap-2">
        <span className="text-xl">🏖️</span>
        退休后资产消耗模拟
      </h3>
      <p className="text-xs text-warm-muted mb-4">
        退休后保守投资（年化 {(retirementReturn * 100).toFixed(0)}%），每年按通胀递增提取生活费
      </p>

      {/* 状态指示 */}
      <div className={`flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl ${
        moneyLasts >= endAge
          ? 'bg-warm-success/10 border border-warm-success/20'
          : 'bg-warm-danger/10 border border-warm-danger/20'
      }`}>
        <span className="text-lg">{moneyLasts >= endAge ? '✅' : '⚠️'}</span>
        <div>
          <span className={`font-semibold text-sm ${
            moneyLasts >= endAge ? 'text-warm-success' : 'text-warm-danger'
          }`}>
            {moneyLasts >= endAge
              ? `资金可维持到 ${endAge} 岁`
              : `资金在 ${moneyLasts} 岁时耗尽`
            }
          </span>
          {depletionAge && (
            <span className="text-xs text-warm-muted ml-2">
              （距预期寿命还差 {endAge - (depletionAge - 1)} 年）
            </span>
          )}
        </div>
      </div>

      {/* 图表 */}
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="retirePosGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#85CDCA" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#85CDCA" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="retireNegGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.05} />
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" />
            <XAxis
              dataKey="age"
              tick={{ fill: '#636E72', fontSize: 12 }}
              tickFormatter={(v) => `${v}岁`}
            />
            <YAxis
              tick={{ fill: '#636E72', fontSize: 12 }}
              tickFormatter={formatYAxis}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            {depletionAge && (
              <ReferenceLine
                x={depletionAge - 1}
                stroke="#FF6B6B"
                strokeDasharray="6 3"
                strokeWidth={2}
                label={{
                  value: '耗尽',
                  position: 'top',
                  fill: '#FF6B6B',
                  fontSize: 12,
                }}
              />
            )}
            <ReferenceLine y={0} stroke="#636E72" strokeWidth={1} />
            {/* 正值区域 */}
            <Area
              type="monotone"
              dataKey="positive"
              stroke="#85CDCA"
              strokeWidth={2.5}
              fill="url(#retirePosGradient)"
              name="资产余额"
            />
            {/* 负值区域（红色） */}
            <Area
              type="monotone"
              dataKey="negative"
              stroke="#FF6B6B"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              fill="url(#retireNegGradient)"
              name="透支"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
