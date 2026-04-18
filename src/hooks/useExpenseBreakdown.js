import { useMemo } from 'react'

const DEFAULT_CATEGORIES = [
  { key: 'housing', label: '住房', icon: '🏠', amount: 3000 },
  { key: 'living', label: '生活开销', icon: '🍜', amount: 6500 },
]

export function useExpenseBreakdown(categories = DEFAULT_CATEGORIES) {
  return useMemo(() => {
    const monthlyTotal = categories.reduce((sum, c) => sum + c.amount, 0)
    const annualTotal = monthlyTotal * 12

    const breakdown = categories.map((c) => ({
      ...c,
      percent: monthlyTotal > 0 ? c.amount / monthlyTotal : 0,
    }))

    return {
      categories: breakdown,
      monthlyTotal,
      annualTotal,
    }
  }, [categories])
}

export { DEFAULT_CATEGORIES }
