'use client'
import { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'

export const CompanyContext = createContext()

export const CompaniesProvider = ({ children }) => {
  const [companies, setCompanies] = useState([])

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier`)
      setCompanies(response.data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers])

  const addCompany = useCallback((company) => {
    if (!company) return
    setCompanies(prev => [...prev, company])
  
  }, []);

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
    removeCompany,
    isCompany
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}