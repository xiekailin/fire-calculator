import { useEffect, useState, useRef } from 'react'
import { formatCurrency, formatCurrencyFull, formatYears } from '../utils/format'

/**
 * 数字滚动动画 hook
 */
function useAnimatedNumber(target, duration = 800) {
  const [current, setCurrent] = useState(target)
  const startRef = useRef(null)
  const fromRef = useRef(target)

  useEffect(() => {
    fromRef.current = current
    startRef.current = null
    const from = fromRef.current
    const diff = target - from

    if (Math.abs(diff) < 1) {
      setCurrent(target)
      return
    }

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(from + diff * eased)
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return current
}

/**
 * SVG 进度环
 */
function ProgressRing({ percent, size = 160, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(percent, 1) * circumference)

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F0E6DC"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E8A87C" />
          <stop offset="100%" stopColor="#85CDCA" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Dashboard({ result, values }) {
  const {
    inflatedTarget,
    monthlySavings,
    yearsToRetire,
    canRetire,
  } = result

  const { currentSavings } = values

  // 进度：已有储蓄 / 目标资产
  const progressPercent = inflatedTarget > 0 ? currentSavings / inflatedTarget : 0

  // 动画数字
  const animatedTarget = useAnimatedNumber(inflatedTarget)
  const animatedMonthly = useAnimatedNumber(monthlySavings)
  const animatedYears = useAnimatedNumber(yearsToRetire)
  const animatedProgress = useAnimatedNumber(progressPercent)

  if (canRetire) return null

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-5 flex items-center gap-2">
        <span className="text-xl">🎯</span>
        财富自由仪表盘
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        {/* 进度环 */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <ProgressRing percent={animatedProgress} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-warm-dark">
                {(animatedProgress * 100).toFixed(1)}%
              </span>
              <span className="text-xs text-warm-muted">已完成</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-warm-muted text-center">
            已有储蓄占目标比例
          </div>
        </div>

        {/* 退休倒计时 */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-xs text-warm-muted mb-2">距离退休还有</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-warm-primary to-warm-accent bg-clip-text text-transparent">
            {Math.floor(animatedYears)}
            <span className="text-lg ml-1">年</span>
            {Math.round((animatedYears - Math.floor(animatedYears)) * 12) > 0 && (
              <>
                <span className="text-lg ml-1">
                  {Math.round((animatedYears - Math.floor(animatedYears)) * 12)}
                </span>
                <span className="text-lg ml-0.5">月</span>
              </>
            )}
          </div>
          <div className="text-xs text-warm-muted mt-2">
            约 {Math.round(animatedYears * 12).toLocaleString()} 个月
          </div>
        </div>

        {/* 关键指标 */}
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-warm-primary/10 to-warm-gold/10 rounded-xl p-3">
            <div className="text-xs text-warm-muted">目标资产</div>
            <div className="text-lg font-bold text-warm-dark">
              {formatCurrency(Math.round(animatedTarget))}
            </div>
          </div>
          <div className="bg-gradient-to-r from-warm-accent/10 to-emerald-50 rounded-xl p-3">
            <div className="text-xs text-warm-muted">每月储蓄</div>
            <div className="text-lg font-bold text-warm-dark">
              {formatCurrencyFull(Math.round(animatedMonthly))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
