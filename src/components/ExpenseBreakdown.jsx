export default function ExpenseBreakdown({ categories, monthlyTotal, onChange }) {
  const handleAmountChange = (key, amount) => {
    onChange(
      categories.map((c) =>
        c.key === key ? { ...c, amount: Math.max(0, amount) } : c
      )
    )
  }

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span>
        收支明细
      </h3>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className="flex items-center gap-3 bg-warm-highlight/50 rounded-xl px-4 py-2.5"
          >
            <span className="text-lg w-5 text-center">{cat.icon}</span>
            <span className="text-sm text-warm-dark font-medium w-16">
              {cat.label}
            </span>
            <div className="flex-1">
              <input
                type="range"
                value={cat.amount}
                onChange={(e) =>
                  handleAmountChange(cat.key, parseInt(e.target.value) || 0)
                }
                min={0}
                max={30000}
                step={100}
                className="w-full"
              />
            </div>
            <input
              type="number"
              value={cat.amount}
              onChange={(e) =>
                handleAmountChange(cat.key, parseInt(e.target.value) || 0)
              }
              className="w-16 text-right text-sm font-semibold text-warm-dark bg-white rounded-lg px-2 py-1 border border-warm-border focus:outline-none focus:border-warm-primary"
              min={0}
              max={50000}
              step={100}
            />
            <span className="text-xs text-warm-muted w-8">元/月</span>
          </div>
        ))}
      </div>

      {/* 月支出汇总 */}
      <div className="mt-4 pt-4 border-t border-warm-border flex justify-between items-center">
        <span className="text-sm text-warm-muted">月支出合计</span>
        <span className="text-lg font-bold text-warm-dark">
          {monthlyTotal.toLocaleString()} 元/月
        </span>
      </div>
    </div>
  )
}
