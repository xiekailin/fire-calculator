import { useState } from 'react'

const PORTFOLIOS = [
  {
    key: 'sp500',
    name: '标普 500',
    ticker: 'SPY / VOO',
    nominalReturn: 0.107,
    realReturn: 0.075,
    maxDrawdown: -0.339,
    desc: '美国大盘股，覆盖 500 家龙头公司',
    color: '#E8A87C',
  },
  {
    key: 'nasdaq100',
    name: '纳斯达克 100',
    ticker: 'QQQ',
    nominalReturn: 0.13,
    realReturn: 0.10,
    maxDrawdown: -0.371,
    desc: '科技股为主，波动大但长期回报高',
    color: '#85CDCA',
  },
  {
    key: 'total_market',
    name: '全市场指数',
    ticker: 'VTI',
    nominalReturn: 0.102,
    realReturn: 0.07,
    maxDrawdown: -0.355,
    desc: '覆盖全美约 4000 只股票，最分散',
    color: '#6BCB77',
  },
  {
    key: 'stock_bond_6040',
    name: '60/40 股债',
    ticker: 'VT + BND',
    nominalReturn: 0.085,
    realReturn: 0.055,
    maxDrawdown: -0.20,
    desc: '60% 股票 + 40% 债券，稳健型',
    color: '#F0C27F',
  },
  {
    key: 'custom',
    name: '自定义',
    ticker: '—',
    nominalReturn: 0.07,
    realReturn: 0.04,
    maxDrawdown: -0.25,
    desc: '手动输入预期收益率',
    color: '#D4A574',
  },
]

export default function InvestmentPortfolio({ annualReturn, activePortfolio, onSelect }) {
  const [expanded, setExpanded] = useState(false)

  const active = PORTFOLIOS.find((p) => p.key === activePortfolio) || PORTFOLIOS[0]

  return (
    <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold text-warm-dark flex items-center gap-2">
          <span className="text-xl">📈</span>
          投资组合
          <span className="text-sm font-normal text-warm-muted">
            ({active.name})
          </span>
        </h3>
        <span className={`text-warm-muted transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {PORTFOLIOS.map((p) => {
            const isActive = activePortfolio === p.key
            return (
              <button
                key={p.key}
                onClick={() => onSelect(p.key, p.nominalReturn)}
                className={`w-full text-left rounded-xl p-4 border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-2 bg-warm-highlight'
                    : 'border-warm-border bg-white hover:border-warm-primary/30'
                }`}
                style={isActive ? { borderColor: p.color } : {}}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-semibold text-warm-dark text-sm">{p.name}</span>
                    <span className="text-xs text-warm-muted">{p.ticker}</span>
                  </div>
                  {isActive && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warm-primary/10 text-warm-primary">
                      已选择
                    </span>
                  )}
                </div>
                <p className="text-xs text-warm-muted mb-2">{p.desc}</p>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-warm-muted">名义年化 </span>
                    <span className="font-semibold text-warm-dark">
                      {(p.nominalReturn * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-warm-muted">实际年化 </span>
                    <span className="font-semibold text-warm-dark">
                      {(p.realReturn * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-warm-muted">最大回撤 </span>
                    <span className="font-semibold text-warm-danger">
                      {(p.maxDrawdown * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </button>
            )
          })}

          <p className="text-[10px] text-warm-muted leading-relaxed">
            数据来源：基于 1990-2024 年历史回测，仅供参考，不构成投资建议。实际收益因市场环境而异。
          </p>
        </div>
      )}
    </div>
  )
}
