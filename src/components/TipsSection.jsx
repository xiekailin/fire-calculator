import { formatCurrencyFull } from '../utils/format'

export default function TipsSection({ result }) {
  const { monthlySavings, savingsToExpenseRatio, yearsToRetire, inflatedTarget } = result

  const tips = []

  if (savingsToExpenseRatio > 0.7) {
    tips.push({
      icon: '⚡',
      title: '储蓄压力较大',
      desc: `月储蓄占支出的 ${(savingsToExpenseRatio * 100).toFixed(0)}%，建议考虑降低年支出标准，或延长退休年龄来减轻压力。`,
    })
  } else if (savingsToExpenseRatio > 0.5) {
    tips.push({
      icon: '💪',
      title: '适度挑战',
      desc: `月储蓄占支出的 ${(savingsToExpenseRatio * 100).toFixed(0)}%，有一定挑战但可行。关注收入增长机会，逐步提升储蓄率。`,
    })
  } else if (savingsToExpenseRatio > 0) {
    tips.push({
      icon: '🌱',
      title: '节奏良好',
      desc: `月储蓄占支出的 ${(savingsToExpenseRatio * 100).toFixed(0)}%，保持这个节奏，坚持就是胜利！`,
    })
  }

  if (yearsToRetire > 20) {
    tips.push({
      icon: '⏰',
      title: '时间是你最大的盟友',
      desc: '超过 20 年的投资周期中，复利效应会非常显著。即使每月少存一点，拉长时间也能达成目标。',
    })
  }

  tips.push({
    icon: '📊',
    title: '资产配置建议',
    desc: '年轻时可配置较高比例的权益类资产（如指数基金），随年龄增长逐步增加固收类资产，降低波动风险。',
  })

  tips.push({
    icon: '🛡️',
    title: '别忘了应急储备',
    desc: `在 FIRE 储蓄之外，建议保留 3-6 个月生活费（约 ${formatCurrencyFull(monthlySavings > 0 ? result.monthlyExpense * 6 : result.monthlyExpense * 6)}）作为应急资金。`,
  })

  tips.push({
    icon: '🔄',
    title: '定期检视计划',
    desc: '每年至少检视一次，根据实际收支、收益率和通胀变化调整储蓄计划。生活总有惊喜，保持灵活。',
  })

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-4 flex items-center gap-2">
        <span className="text-xl">💡</span>
        给你的建议
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="flex gap-3 p-4 rounded-xl bg-warm-highlight/50 border border-warm-border/50"
          >
            <span className="text-2xl flex-shrink-0">{tip.icon}</span>
            <div>
              <div className="font-semibold text-sm text-warm-dark mb-1">
                {tip.title}
              </div>
              <div className="text-xs text-warm-muted leading-relaxed">
                {tip.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
