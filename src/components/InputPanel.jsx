import { formatCurrency } from '../utils/format'

const INPUTS = [
  {
    key: 'annualExpense',
    label: '年支出',
    unit: '元/年',
    min: 30000,
    max: 1000000,
    step: 5000,
    default: 120000,
    format: (v) => formatCurrency(v),
  },
  {
    key: 'currentAge',
    label: '当前年龄',
    unit: '岁',
    min: 18,
    max: 60,
    step: 1,
    default: 25,
    format: (v) => `${v} 岁`,
  },
  {
    key: 'retireAge',
    label: '目标退休年龄',
    unit: '岁',
    min: 30,
    max: 70,
    step: 1,
    default: 45,
    format: (v) => `${v} 岁`,
  },
  {
    key: 'currentSavings',
    label: '已有储蓄',
    unit: '元',
    min: 0,
    max: 5000000,
    step: 10000,
    default: 0,
    format: (v) => formatCurrency(v),
  },
  {
    key: 'annualReturn',
    label: '预期年化收益率',
    unit: '%',
    min: 0,
    max: 15,
    step: 0.5,
    default: 7,
    isPercent: true,
    format: (v) => `${v}%`,
  },
  {
    key: 'inflationRate',
    label: '通货膨胀率',
    unit: '%',
    min: 0,
    max: 10,
    step: 0.5,
    default: 3,
    isPercent: true,
    format: (v) => `${v}%`,
  },
  {
    key: 'swr',
    label: '安全提现率',
    unit: '%',
    min: 3,
    max: 6,
    step: 0.5,
    default: 4,
    isPercent: true,
    format: (v) => `${v}%`,
  },
]

export default function InputPanel({ values, onChange }) {
  const handleChange = (key, rawValue, isPercent) => {
    const val = isPercent ? rawValue / 100 : rawValue
    onChange(key, val)
  }

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6 space-y-5">
      <h2 className="text-lg font-semibold text-warm-dark flex items-center gap-2">
        <span className="text-2xl">📝</span>
        调整你的参数
      </h2>

      {INPUTS.map((input) => {
        const rawValue = input.isPercent
          ? Math.round((values[input.key] ?? input.default / 100) * 100 * 10) / 10
          : values[input.key] ?? input.default

        return (
          <div key={input.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-warm-muted font-medium">
                {input.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={rawValue}
                  onChange={(e) =>
                    handleChange(input.key, parseFloat(e.target.value) || 0, input.isPercent)
                  }
                  className="w-20 text-right text-sm font-semibold text-warm-dark bg-warm-highlight rounded-lg px-2 py-1 border border-warm-border focus:outline-none focus:border-warm-primary"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                />
                <span className="text-xs text-warm-muted">{input.unit}</span>
              </div>
            </div>
            <input
              type="range"
              value={rawValue}
              onChange={(e) =>
                handleChange(input.key, parseFloat(e.target.value), input.isPercent)
              }
              min={input.min}
              max={input.max}
              step={input.step}
              className="w-full"
            />
          </div>
        )
      })}
    </div>
  )
}
