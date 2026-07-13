import React, { createContext, useContext, useState, useEffect } from 'react'

const CarbonContext = createContext(null)

const STORAGE_KEY = 'carboncheck:lastResult'

export function CarbonProvider({ children }) {
  const [lastResult, setLastResultState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const setLastResult = (result) => {
    setLastResultState(result)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    } catch {
      // storage unavailable — non-fatal, state still updates in-memory
    }
  }

  useEffect(() => {
    // no-op sync hook reserved for future cross-tab sync
  }, [lastResult])

  return (
    <CarbonContext.Provider value={{ lastResult, setLastResult }}>
      {children}
    </CarbonContext.Provider>
  )
}

export function useCarbon() {
  const ctx = useContext(CarbonContext)
  if (!ctx) throw new Error('useCarbon must be used within a CarbonProvider')
  return ctx
}
