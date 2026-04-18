import { useMemo } from 'react'
import { formatCurrency, formatCurrencyFull } from '../utils/format'

const STRATEGIES = [
  {
    key: 'lean',
    name: 'Lean FIRE',
    subtitle: '极简生活',
    icon: '🌿',
    expenseMultiplier: 0.6,
    desc: '年支出降至当前 60%，追求极简生活方式',
    color: 'border-warm-accent/40 bg-warm-accent/5',
    activeColor: 'border-warm-accent bg-warm-accent/10 ring-1 ring-warm-accent/30',
  },
  {
    key: 'traditional',
    name: '传统 FIRE',
    subtitle: '维持现状',
    icon: '🎯',
    expenseMultiplier: 1.0,
    desc: '保持当前生活水平，最经典的 FIRE 路径',
    color: 'border-warm-primary/40 bg-warm-primary/5',
    activeColor: 'border-warm-primary bg-warm-primary/10 ring-1 ring-warm-primary/30',
  },
  {
    key: 'fat',
    name: 'Fat FIRE',
    subtitle: '品质生活',
    icon: '🏖️',
    expenseMultiplier: 1.5,
    desc: '退休后享受更高品质生活，年支出 1.5 倍',
    color: 'border-warm-gold/40 bg-warm-gold/5',
    activeColor: 'border-warm-gold bg-warm-gold/10 ring-1 ring-warm-gold/30',
  },
  {
    key: 'barista',
    name: 'Barista FIRE',
    subtitle: '兼职退休',
    icon: '☕',
    expenseMultiplier: 1.0,
    partTimeCoverage: 0.5,
    desc: '退休后兼职覆盖 50% 支出，目标更低',
    color: 'border-warm-secondary/40 bg-warm-secondary/5',
    activeColor: 'border-warm-secondary bg-warm-secondary/10 ring-1 ring-warm-secondary/30',
  },
]

function calcStrategy(params, strategy) {
  const {
    annualExpense,
    currentAge,
    retireAge,
    currentSavings,
    annualReturn,
    inflationRate,
    swr,
  } = params

  const years = retireAge - currentAge
  if (years <= 0) return null

  const adjustedExpense = annualExpense * strategy.expenseMultiplier
  const effectiveExpense = strategy.partTimeCoverage
    ? adjustedExpense * (1 - strategy.partTimeCoverage)
    : adjustedExpense

  const targetAsset = effectiveExpense / swr
  const inflatedTarget = targetAsset * Math.pow(1 + inflationRate, years)

  const monthlyReturn = annualReturn / 12
  const totalMonths = years * 12
  const futureSavings = currentSavings * Math.pow(1 + monthlyReturn, totalMonths)
  const gap = inflatedTarget - futureSavings

  let monthlySavings = 0
  if (gap > 0) {
    if (monthlyReturn === 0) {
      monthlySavings = gap / totalMonths
    } else {
      monthlySavings =
        (gap * monthlyReturn) / (Math.pow(1 + monthlyReturn, totalMonths) - 1)
    }
  }

  return {
    key: strategy.key,
    name: strategy.name,
    icon: strategy.icon,
    targetAsset: Math.round(targetAsset),
    inflatedTarget: Math.round(inflatedTarget),
    monthlySavings: Math.round(monthlySavings),
    canRetire: gap <= 0,
  }
}

export default function FIREStrategyCompare({ values, activeStrategy, onSelect }) {
  const results = useMemo(() => {
    return STRATEGIES.map((s) => calcStrategy(values, s)).filter(Boolean)
  }, [values])

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-4 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        FIRE 策略对比
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {results.map((r, idx) => {
          const strategy = STRATEGIES[idx]
          const isActive = activeStrategy === r.key

          return (
            <button
              key={r.key}
              onClick={() => onSelect(r.key, strategy.expenseMultiplier, strategy.partTimeCoverage)}
              className={`rounded-xl p-4 border-2 text-left transition-all duration-200 ${
                isActive ? strategy.activeColor : strategy.color
              } hover:shadow-md cursor-pointer`}
            >
              <div className="text-2xl mb-1">{r.icon}</div>
              <div className="font-semibold text-warm-dark text-sm">{r.name}</div>
              <div className="text-[10px] text-warm-muted mb-3">{strategy.desc}</div>

              {r.canRetire ? (
                <div className="text-xs text-warm-success font-semibold">
                  已达标！
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div>
                    <div className="text-[10px] text-warm-muted">目标资产</div>
                    <div className="text-sm font-bold text-warm-dark">
                      {formatCurrency(r.inflatedTarget)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-warm-muted">每月储蓄</div>
                    <div className="text-sm font-bold text-warm-dark">
                      {formatCurrencyFull(r.monthlySavings)}
                    </div>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
