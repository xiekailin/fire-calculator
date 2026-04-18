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
import { formatCurrency, formatCurrencyFull } from '../utils/format'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const data = payload[0]?.payload
  return (
    <div className="bg-warm-card rounded-xl shadow-lg border border-warm-border p-3 text-sm">
      <div className="font-semibold text-warm-dark mb-2">
        {data?.age} 岁（第 {label} 年）
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-warm-primary inline-block" />
          <span className="text-warm-muted">累计资产：</span>
          <span className="font-semibold text-warm-dark">
            {formatCurrency(data?.balance)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-warm-accent inline-block" />
          <span className="text-warm-muted">目标线：</span>
          <span className="font-semibold text-warm-dark">
            {formatCurrency(data?.target)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-warm-gold inline-block" />
          <span className="text-warm-muted">本金投入：</span>
          <span className="font-semibold text-warm-dark">
            {formatCurrency(data?.savings)}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatYAxis(value) {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}亿`
  if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
  return value
}

export default function GrowthChart({ data }) {
  if (!data?.length) return null

  const lastPoint = data[data.length - 1]
  const targetValue = lastPoint?.target || 0

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-4 flex items-center gap-2">
        <span className="text-xl">📈</span>
        资产增长曲线
      </h3>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8A87C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E8A87C" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F0C27F" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F0C27F" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E6DC" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#636E72', fontSize: 12 }}
              tickFormatter={(v) => `${v}年`}
            />
            <YAxis
              tick={{ fill: '#636E72', fontSize: 12 }}
              tickFormatter={formatYAxis}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={targetValue}
              stroke="#85CDCA"
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{
                value: 'FIRE 目标',
                position: 'right',
                fill: '#85CDCA',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#F0C27F"
              strokeWidth={2}
              fill="url(#savingsGradient)"
              name="本金投入"
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#E8A87C"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              name="累计资产"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-warm-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-warm-primary" />
          累计资产（含收益）
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-warm-gold" />
          本金投入
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-warm-accent" style={{ borderBottom: '2px dashed #85CDCA' }} />
          FIRE 目标线
        </div>
      </div>
    </div>
  )
}
