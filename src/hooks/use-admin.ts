'use client'

import { useState, useEffect } from 'react'
import { isCurrentUserAdmin } from '@/lib/admin'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const adminStatus = await isCurrentUserAdmin()
        setIsAdmin(adminStatus)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [])

  return { isAdmin, loading }
}