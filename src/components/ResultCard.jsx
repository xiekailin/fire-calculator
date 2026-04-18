import { formatCurrency, formatCurrencyFull, formatPercent, formatYears } from '../utils/format'

function StatCard({ icon, label, value, subtext, color = 'primary' }) {
  const colors = {
    primary: 'from-warm-primary/10 to-warm-gold/10 border-warm-primary/20',
    accent: 'from-warm-accent/10 to-emerald-50 border-warm-accent/20',
    success: 'from-warm-success/10 to-emerald-50 border-warm-success/20',
    gold: 'from-warm-gold/10 to-amber-50 border-warm-gold/20',
  }

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 border card-hover`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-warm-muted mb-1">{label}</div>
      <div className="text-2xl font-bold text-warm-dark animate-fade-in-up">
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-warm-muted mt-1">{subtext}</div>
      )}
    </div>
  )
}

export default function ResultCard({ result }) {
  const {
    targetAsset,
    inflatedTarget,
    monthlySavings,
    savingsToExpenseRatio,
    yearsToRetire,
    canRetire,
    monthlyExpense,
  } = result

  if (canRetire) {
    return (
      <div className="bg-gradient-to-br from-warm-success/10 to-emerald-50 rounded-2xl p-8 border border-warm-success/20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-warm-dark mb-2">
          你已经可以退休了！
        </h3>
        <p className="text-warm-muted">
          你的储蓄已经达到 FIRE 目标，恭喜实现财富自由！
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 主要结果 - 大卡片 */}
      <div className="bg-gradient-to-br from-warm-primary/10 via-warm-highlight to-warm-gold/10 rounded-2xl p-6 border border-warm-primary/20 card-hover">
        <div className="text-center mb-2">
          <span className="text-sm text-warm-muted">退休时需要资产</span>
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-warm-primary to-warm-secondary bg-clip-text text-transparent">
            {formatCurrency(inflatedTarget)}
          </span>
        </div>
        <div className="text-center text-sm text-warm-muted mt-2">
          基于 {formatCurrency(targetAsset)} 当前购买力，经通胀调整
        </div>
      </div>

      {/* 四个统计卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon="💰"
          label="每月需储蓄"
          value={formatCurrencyFull(monthlySavings)}
          subtext={`占月支出 ${formatPercent(savingsToExpenseRatio)}`}
          color="primary"
        />
        <StatCard
          icon="⏳"
          label="距退休时间"
          value={formatYears(yearsToRetire)}
          subtext={`共 ${yearsToRetire * 12} 个月`}
          color="accent"
        />
        <StatCard
          icon="📊"
          label="月均支出"
          value={formatCurrencyFull(monthlyExpense)}
          subtext="年支出 / 12"
          color="gold"
        />
        <StatCard
          icon="🎯"
          label="储蓄率"
          value={formatPercent(savingsToExpenseRatio)}
          subtext="每月储蓄 / 月支出"
          color="success"
        />
      </div>
    </div>
  )
}
