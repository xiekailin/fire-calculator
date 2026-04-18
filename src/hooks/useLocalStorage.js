import { useState, useEffect, useCallback } from 'react'

/**
 * 封装 useState + localStorage 持久化
 * @param {string} key - localStorage 键名
 * @param {*} initialValue - 默认值
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch {
          // localStorage 满或隐私模式，静默失败
        }
        return newValue
      })
    },
    [key],
  )

  return [storedValue, setValue]
}
