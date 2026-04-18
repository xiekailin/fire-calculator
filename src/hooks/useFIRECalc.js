import { useMemo } from 'react'

/**
 * FIRE 核心计算 hook
 * 支持负债：负债月供扣减可用储蓄，负债还清后月供释放转入 FIRE 储蓄
 */
export function useFIRECalc({
  annualExpense = 120000,
  currentAge = 25,
  retireAge = 45,
  currentSavings = 0,
  annualReturn = 0.07,
  inflationRate = 0.03,
  swr = 0.04,
  debts = [],
} = {}) {
  return useMemo(() => {
    const yearsToRetire = retireAge - currentAge
    if (yearsToRetire <= 0) {
      return {
        targetAsset: 0,
        inflatedTarget: 0,
        monthlySavings: 0,
        savingsToExpenseRatio: 0,
        growthData: [],
        milestones: [],
        yearsToRetire: 0,
        canRetire: true,
        monthlyExpense: Math.round(annualExpense / 12),
        totalMonths: 0,
        totalDebtMonthly: 0,
        debtPayoffPoints: [],
      }
    }

    // 0. 负债月供
    const enabledDebts = debts.filter((d) => d.enabled)
    const totalDebtMonthly = enabledDebts.reduce((sum, d) => sum + d.monthlyPayment, 0)
    const totalDebtBalance = enabledDebts.reduce((sum, d) => sum + d.balance, 0)

    // 每笔负债的还清时间（月数）
    const debtPayoffMap = {}
    for (const d of enabledDebts) {
      debtPayoffMap[d.key] = d.remainingMonths
    }

    // 1. 基础目标资产（4% 法则）
    const targetAsset = annualExpense / swr

    // 2. 考虑通胀后的退休时目标
    const inflatedTarget = targetAsset * Math.pow(1 + inflationRate, yearsToRetire)

    // 3. 每月需储蓄金额（先用无负债的基础公式算总需求）
    const monthlyReturn = annualReturn / 12
    const totalMonths = yearsToRetire * 12

    // 按月模拟：根据负债还清状态动态调整月储蓄
    // 先用无负债公式算出"需要的月总储蓄能力"
    const futureSavings = currentSavings * Math.pow(1 + monthlyReturn, totalMonths)
    const gap = inflatedTarget - futureSavings

    // 用数值方法求解：找到一个"基础月储蓄"使得到退休时达到目标
    // 每月的实际储蓄 = 基础月储蓄 + 当月已释放的负债月供
    // 因为负债释放是非线性的，需要迭代求解
    const baseMonthlySavings = solveMonthlySavings(
      currentSavings,
      inflatedTarget,
      monthlyReturn,
      totalMonths,
      enabledDebts,
    )

    const monthlyExpense = annualExpense / 12
    // 实际首月需储蓄 = 基础月储蓄（不含负债释放）
    const firstMonthSavings = baseMonthlySavings
    const savingsToExpenseRatio =
      monthlyExpense > 0 ? (firstMonthSavings + totalDebtMonthly) / monthlyExpense : 0

    // 4. 按月模拟资产增长（带负债释放）
    const monthlyBalances = [currentSavings]
    const debtPayoffPoints = []
    let balance = currentSavings
    const paidOffKeys = new Set()

    for (let m = 1; m <= totalMonths; m++) {
      // 计算本月释放的负债月供
      let releasedThisMonth = 0
      for (const d of enabledDebts) {
        if (!paidOffKeys.has(d.key) && m > d.remainingMonths) {
          paidOffKeys.add(d.key)
          releasedThisMonth += d.monthlyPayment
          debtPayoffPoints.push({
            key: d.key,
            label: d.label,
            icon: d.icon,
            month: m,
            age: currentAge + m / 12,
            releasedAmount: d.monthlyPayment,
          })
        }
      }

      // 本月实际储蓄 = 基础储蓄 + 已释放的负债月供
      const releasedSoFar = enabledDebts
        .filter((d) => paidOffKeys.has(d.key))
        .reduce((sum, d) => sum + d.monthlyPayment, 0)
      const actualSavings = baseMonthlySavings + releasedSoFar

      balance = (balance + actualSavings) * (1 + monthlyReturn)
      monthlyBalances.push(balance)
    }

    // 按年采样用于图表
    const growthData = []
    let cumulativeSavings = currentSavings
    for (let y = 0; y <= yearsToRetire; y++) {
      const monthIdx = y * 12
      const bal = monthlyBalances[Math.min(monthIdx, totalMonths)]
      const inflatedExpenseAtYear = annualExpense * Math.pow(1 + inflationRate, y)
      const targetAtYear = inflatedExpenseAtYear / swr

      // 计算累计本金（含负债释放的金额）
      if (y > 0) {
        const prevMonthIdx = (y - 1) * 12
        for (let m = prevMonthIdx + 1; m <= monthIdx && m <= totalMonths; m++) {
          const releasedSoFar = enabledDebts
            .filter((d) => d.remainingMonths < m)
            .reduce((sum, d) => sum + d.monthlyPayment, 0)
          cumulativeSavings += baseMonthlySavings + releasedSoFar
        }
      }

      growthData.push({
        year: y,
        age: currentAge + y,
        balance: Math.round(bal),
        target: Math.round(targetAtYear),
        savings: Math.round(cumulativeSavings),
      })
    }

    // 5. 里程碑
    const milestones = [
      { label: '起步', percent: 0, age: currentAge },
      {
        label: '25%',
        percent: 25,
        age: findMilestoneAge(monthlyBalances, inflatedTarget, 0.25, currentAge),
      },
      {
        label: '50%',
        percent: 50,
        age: findMilestoneAge(monthlyBalances, inflatedTarget, 0.5, currentAge),
      },
      {
        label: '75%',
        percent: 75,
        age: findMilestoneAge(monthlyBalances, inflatedTarget, 0.75, currentAge),
      },
      {
        label: 'FIRE!',
        percent: 100,
        age: retireAge,
      },
    ]

    return {
      targetAsset: Math.round(targetAsset),
      inflatedTarget: Math.round(inflatedTarget),
      monthlySavings: Math.round(firstMonthSavings),
      totalMonthlyOutflow: Math.round(firstMonthSavings + totalDebtMonthly),
      savingsToExpenseRatio,
      growthData,
      milestones,
      yearsToRetire,
      canRetire: gap <= 0,
      monthlyExpense: Math.round(monthlyExpense),
      totalMonths,
      totalDebtMonthly,
      totalDebtBalance,
      debtPayoffPoints,
    }
  }, [
    annualExpense,
    currentAge,
    retireAge,
    currentSavings,
    annualReturn,
    inflationRate,
    swr,
    debts,
  ])
}

/**
 * 二分法求解月储蓄额
 * 使得到 totalMonths 后，balance 达到 target
 */
function solveMonthlySavings(
  currentSavings,
  target,
  monthlyReturn,
  totalMonths,
  enabledDebts,
) {
  let lo = 0
  let hi = target / totalMonths * 2 // 上限
  const eps = 1 // 1元精度

  for (let iter = 0; iter < 50; iter++) {
    const mid = (lo + hi) / 2
    const finalBalance = simulateGrowth(
      currentSavings, mid, monthlyReturn, totalMonths, enabledDebts,
    )
    if (finalBalance < target) {
      lo = mid
    } else {
      hi = mid
    }
    if (hi - lo < eps) break
  }

  return Math.max(0, (lo + hi) / 2)
}

/**
 * 模拟增长
 */
function simulateGrowth(currentSavings, baseMonthly, monthlyReturn, totalMonths, enabledDebts) {
  let balance = currentSavings
  const paidOffKeys = new Set()

  for (let m = 1; m <= totalMonths; m++) {
    for (const d of enabledDebts) {
      if (!paidOffKeys.has(d.key) && m > d.remainingMonths) {
        paidOffKeys.add(d.key)
      }
    }
    const releasedSoFar = enabledDebts
      .filter((d) => paidOffKeys.has(d.key))
      .reduce((sum, d) => sum + d.monthlyPayment, 0)
    balance = (balance + baseMonthly + releasedSoFar) * (1 + monthlyReturn)
  }
  return balance
}

/**
 * 找到达到目标百分比时的年龄
 */
function findMilestoneAge(monthlyBalances, target, percent, currentAge) {
  const threshold = target * percent
  for (let m = 0; m < monthlyBalances.length; m++) {
    if (monthlyBalances[m] >= threshold) {
      return currentAge + m / 12
    }
  }
  return currentAge + (monthlyBalances.length - 1) / 12
}
