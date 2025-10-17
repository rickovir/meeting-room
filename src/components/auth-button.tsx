'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/hooks/use-admin'
import { Badge } from '@/components/ui/badge'
import { Settings } from 'lucide-react'

export function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { isAdmin, loading: adminLoading } = useAdmin()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading || adminLoading) {
    return <Button disabled>Loading...</Button>
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Welcome, {user.user_metadata?.full_name || user.email}
          </span>
          {isAdmin && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Admin
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          )}
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => router.push('/login')}>
        Sign In
      </Button>
      <Button onClick={() => router.push('/signup')}>
        Sign Up
      </Button>
    </div>
  )
}