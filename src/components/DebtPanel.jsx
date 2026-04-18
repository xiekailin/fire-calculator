import { formatCurrencyFull } from '../utils/format'

const DEFAULT_DEBTS = [
  { key: 'mortgage', label: '房贷', icon: '🏠', enabled: false, balance: 1000000, rate: 4.2, monthlyPayment: 5000, remainingMonths: 240 },
  { key: 'car',      label: '车贷', icon: '🚗', enabled: false, balance: 150000,  rate: 5.0, monthlyPayment: 3000, remainingMonths: 48  },
  { key: 'consumer', label: '消费贷', icon: '💳', enabled: false, balance: 50000,   rate: 8.0, monthlyPayment: 2000, remainingMonths: 24  },
]

export { DEFAULT_DEBTS }

export default function DebtPanel({ debts, onChange }) {
  const handleToggle = (key) => {
    onChange(debts.map((d) =>
      d.key === key ? { ...d, enabled: !d.enabled } : d
    ))
  }

  const handleFieldChange = (key, field, value) => {
    onChange(debts.map((d) =>
      d.key === key ? { ...d, [field]: value } : d
    ))
  }

  const enabledDebts = debts.filter((d) => d.enabled)
  const totalMonthly = enabledDebts.reduce((sum, d) => sum + d.monthlyPayment, 0)
  const totalBalance = enabledDebts.reduce((sum, d) => sum + d.balance, 0)

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <h3 className="text-lg font-semibold text-warm-dark mb-4 flex items-center gap-2">
        <span className="text-xl">🏦</span>
        负债管理
      </h3>

      <div className="space-y-4">
        {debts.map((debt) => (
          <div
            key={debt.key}
            className={`rounded-xl border-2 p-4 transition-all ${
              debt.enabled
                ? 'border-warm-primary/40 bg-warm-highlight/30'
                : 'border-warm-border bg-white'
            }`}
          >
            {/* 头部：开关 + 名称 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{debt.icon}</span>
                <span className="font-semibold text-sm text-warm-dark">{debt.label}</span>
              </div>
              <button
                onClick={() => handleToggle(debt.key)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  debt.enabled ? 'bg-warm-primary' : 'bg-warm-border'
                }`}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: debt.enabled ? '20px' : '2px' }}
                />
              </button>
            </div>

            {/* 展开的输入字段 */}
            {debt.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-warm-muted">剩余本金</label>
                  <input
                    type="number"
                    value={debt.balance}
                    onChange={(e) => handleFieldChange(debt.key, 'balance', parseInt(e.target.value) || 0)}
                    className="w-full text-sm font-semibold text-warm-dark bg-white rounded-lg px-2 py-1.5 border border-warm-border focus:outline-none focus:border-warm-primary"
                    min={0}
                    step={10000}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-warm-muted">年利率 (%)</label>
                  <input
                    type="number"
                    value={debt.rate}
                    onChange={(e) => handleFieldChange(debt.key, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-semibold text-warm-dark bg-white rounded-lg px-2 py-1.5 border border-warm-border focus:outline-none focus:border-warm-primary"
                    min={0}
                    max={30}
                    step={0.1}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-warm-muted">月供 (元)</label>
                  <input
                    type="number"
                    value={debt.monthlyPayment}
                    onChange={(e) => handleFieldChange(debt.key, 'monthlyPayment', parseInt(e.target.value) || 0)}
                    className="w-full text-sm font-semibold text-warm-dark bg-white rounded-lg px-2 py-1.5 border border-warm-border focus:outline-none focus:border-warm-primary"
                    min={0}
                    step={100}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-warm-muted">剩余期数 (月)</label>
                  <input
                    type="number"
                    value={debt.remainingMonths}
                    onChange={(e) => handleFieldChange(debt.key, 'remainingMonths', parseInt(e.target.value) || 0)}
                    className="w-full text-sm font-semibold text-warm-dark bg-white rounded-lg px-2 py-1.5 border border-warm-border focus:outline-none focus:border-warm-primary"
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 汇总 */}
      {enabledDebts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-warm-border">
          <div className="flex justify-between text-sm">
            <span className="text-warm-muted">负债总额</span>
            <span className="font-semibold text-warm-dark">
              {formatCurrencyFull(totalBalance)}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-warm-muted">月供合计</span>
            <span className="font-semibold text-warm-danger">
              {formatCurrencyFull(totalMonthly)}
            </span>
          </div>
          <p className="text-[10px] text-warm-muted mt-2">
            月供将从每月可用储蓄中扣除，负债还清后释放的月供自动转入 FIRE 储蓄
          </p>
        </div>
      )}
    </div>
  )
}
