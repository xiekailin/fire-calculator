import { useState, useCallback } from 'react'
import InputPanel from './components/InputPanel'
import ResultCard from './components/ResultCard'
import GrowthChart from './components/GrowthChart'
import MilestoneBar from './components/MilestoneBar'
import TipsSection from './components/TipsSection'
import Dashboard from './components/Dashboard'
import ExpenseBreakdown from './components/ExpenseBreakdown'
import FIREStrategyCompare from './components/FIREStrategyCompare'
import RetirementSimChart from './components/RetirementSimChart'
import InvestmentPortfolio from './components/InvestmentPortfolio'
import DebtPanel, { DEFAULT_DEBTS } from './components/DebtPanel'
import { useFIRECalc } from './hooks/useFIRECalc'
import { useExpenseBreakdown, DEFAULT_CATEGORIES } from './hooks/useExpenseBreakdown'
import { useLocalStorage } from './hooks/useLocalStorage'

const DEFAULT_VALUES = {
  annualExpense: 120000,
  currentAge: 25,
  retireAge: 45,
  currentSavings: 0,
  annualReturn: 0.07,
  inflationRate: 0.03,
  swr: 0.04,
}

export default function App() {
  // localStorage 持久化
  const [values, setValues] = useLocalStorage('fire-values', DEFAULT_VALUES)
  const [rawCategories, setCategories] = useLocalStorage('fire-categories', DEFAULT_CATEGORIES)
  const [debts, setDebts] = useLocalStorage('fire-debts', DEFAULT_DEBTS)
  const [activeTab, setActiveTab] = useLocalStorage('fire-tab', 'params')
  const [activeStrategy, setActiveStrategy] = useLocalStorage('fire-strategy', 'traditional')
  const [activePortfolio, setActivePortfolio] = useLocalStorage('fire-portfolio', 'sp500')

  // 强制校验：如果 categories 的 key 和默认不匹配（旧缓存），重置
  const defaultKeys = DEFAULT_CATEGORIES.map((c) => c.key).join(',')
  const rawKeys = rawCategories.map((c) => c.key).join(',')
  const categories = rawKeys === defaultKeys ? rawCategories : DEFAULT_CATEGORIES
  if (rawKeys !== defaultKeys) {
    setCategories(DEFAULT_CATEGORIES)
  }

  // 收支明细
  const expenseData = useExpenseBreakdown(categories)

  // 核心计算（传入负债数据）
  const result = useFIRECalc({ ...values, debts })

  // 参数修改
  const handleChange = useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [setValues])

  // 收支明细修改 → 同步年支出
  const handleExpenseChange = useCallback((newCategories) => {
    setCategories(newCategories)
    const total = newCategories.reduce((sum, c) => sum + c.amount, 0) * 12
    setValues((prev) => ({ ...prev, annualExpense: total }))
  }, [setCategories, setValues])

  // 负债修改
  const handleDebtChange = useCallback((newDebts) => {
    setDebts(newDebts)
  }, [setDebts])

  // 投资组合切换
  const handlePortfolioSelect = useCallback((key, nominalReturn) => {
    setActivePortfolio(key)
    setValues((prev) => ({ ...prev, annualReturn: nominalReturn }))
  }, [setActivePortfolio, setValues])

  // 策略切换
  const handleStrategySelect = useCallback((key, multiplier, partTimeCoverage) => {
    setActiveStrategy(key)
    const baseExpense = expenseData.annualTotal
    const adjustedExpense = Math.round(baseExpense * multiplier)
    if (partTimeCoverage) {
      setValues((prev) => ({
        ...prev,
        annualExpense: adjustedExpense,
        swr: 0.08,
      }))
    } else {
      setValues((prev) => ({ ...prev, annualExpense: adjustedExpense }))
    }
  }, [setActiveStrategy, setValues, expenseData.annualTotal])

  // 重置
  const handleReset = useCallback(() => {
    setValues(DEFAULT_VALUES)
    setCategories(DEFAULT_CATEGORIES)
    setDebts(DEFAULT_DEBTS)
    setActiveStrategy('traditional')
    setActivePortfolio('sp500')
  }, [setValues, setCategories, setDebts, setActiveStrategy, setActivePortfolio])

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Header */}
      <header className="bg-gradient-to-r from-warm-primary via-warm-secondary to-warm-gold text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            FIRE 财富自由计算器
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            输入你的财务参数，规划通往财富自由之路
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Left: Input Panel */}
          <div className="space-y-4">
            {/* Tab 切换：3 个 Tab */}
            <div className="flex bg-warm-card rounded-xl border border-warm-border overflow-hidden">
              <button
                onClick={() => setActiveTab('params')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'params'
                    ? 'bg-warm-primary text-white'
                    : 'text-warm-muted hover:text-warm-dark'
                }`}
              >
                📝 参数
              </button>
              <button
                onClick={() => setActiveTab('expense')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'expense'
                    ? 'bg-warm-primary text-white'
                    : 'text-warm-muted hover:text-warm-dark'
                }`}
              >
                📊 收支
              </button>
              <button
                onClick={() => setActiveTab('debt')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'debt'
                    ? 'bg-warm-primary text-white'
                    : 'text-warm-muted hover:text-warm-dark'
                }`}
              >
                🏦 负债
              </button>
            </div>

            {/* Tab 内容 */}
            {activeTab === 'params' && (
              <InputPanel values={values} onChange={handleChange} />
            )}
            {activeTab === 'expense' && (
              <ExpenseBreakdown
                categories={expenseData.categories}
                monthlyTotal={expenseData.monthlyTotal}
                onChange={handleExpenseChange}
              />
            )}
            {activeTab === 'debt' && (
              <DebtPanel debts={debts} onChange={handleDebtChange} />
            )}

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-warm-muted bg-warm-card border border-warm-border hover:border-warm-primary hover:text-warm-primary transition-colors"
            >
              恢复默认值
            </button>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {/* 仪表盘 */}
            <Dashboard result={result} values={values} />

            {/* 结果卡片 */}
            <ResultCard result={result} />

            {/* 投资组合选择 */}
            <InvestmentPortfolio
              annualReturn={values.annualReturn}
              activePortfolio={activePortfolio}
              onSelect={handlePortfolioSelect}
            />

            {/* 策略对比 */}
            <FIREStrategyCompare
              values={values}
              activeStrategy={activeStrategy}
              onSelect={handleStrategySelect}
            />

            {/* 资产增长曲线 */}
            <GrowthChart data={result.growthData} />

            {/* 退休后消耗模拟 */}
            <RetirementSimChart result={result} values={values} />

            {/* 里程碑 */}
            <MilestoneBar
              milestones={result.milestones}
              currentAge={values.currentAge}
              retireAge={values.retireAge}
            />

            {/* 建议 */}
            <TipsSection result={result} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-warm-muted">
        <p>FIRE 财富自由计算器 · 仅供参考，不构成投资建议</p>
        <p className="mt-1">基于 4% 安全提现法则，考虑通货膨胀与复利增长</p>
      </footer>
    </div>
  )
}
