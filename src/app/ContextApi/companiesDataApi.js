'use client'
import { createContext, useState, useCallback, useEffect } from 'react'

export const CompanyContext = createContext()

export const CompaniesProvider = ({ children }) => {
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    // Dummy data of companies, replace it with api call
    setCompanies([
      {
        id: 1,
        companyName: "Company 1",
        owner: "Owner 1",
        contact: "1234567890",
        address: "Address 1",
      },
      {
        id: 2,
        companyName: "Company 2",
        owner: "Owner 2",
        contact: "1234567890",
        address: "Address 2",
      },
      {
        id: 3,
        companyName: "Company 3",
        owner: "Owner 3",
        contact: "1234567890",
        address: "Address 3",
      },
    ]);

  }, [setCompanies]);

  const addCompany = useCallback((companyId) => {
    if (!companyId) return
    setCompanies(prev => {
      if (prev.includes(companyId)) return prev
      return [...prev, companyId]
    })
  }, [])

  const removeCompany = useCallback((companyId) => {
    if (!companyId) return
    setCompanies(prev => prev.filter(id => id !== companyId))
  }, [])

  const isCompany = useCallback((companyId) => {
    if (!companyId) return false
    return companies.includes(companyId)
  }, [companies])

  const value = {
    companies,
    setCompanies,
    addCompany,
    removeCompany,
    isCompany
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}