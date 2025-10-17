'use client'

import { useState, useEffect, useCallback } from 'react'
import { Profile } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { promoteUserToAdmin } from '@/lib/admin'
import { format } from 'date-fns'
import { Crown, Search, User } from 'lucide-react'

interface ProfileWithBookingCount extends Profile {
  booking_count?: number
}

export function UserManagement() {
  const [users, setUsers] = useState<ProfileWithBookingCount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  const supabase = createClient()

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        bookings(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data?.map(profile => ({
        ...profile,
        booking_count: profile.bookings?.[0]?.count || 0
      })) || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handlePromoteUser = async (userId: string, email: string, currentRole: string) => {
    setUpdatingUser(userId)

    try {
      if (currentRole === 'admin') {
        // Demote admin to user
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'user' })
          .eq('id', userId)

        if (error) throw error
      } else {
        // Promote user to admin
        const success = await promoteUserToAdmin(email)
        if (!success) throw new Error('Failed to promote user')
      }

      fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    } finally {
      setUpdatingUser(null)
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          View users and manage admin permissions
        </CardDescription>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, username, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">
                      {user.full_name || 'Unknown User'}
                    </h3>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? (
                        <div className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Admin
                        </div>
                      ) : (
                        'User'
                      )}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {user.username && `@${user.username}`}
                    {user.username && user.id && ' • '}
                    {user.id.slice(0, 8)}...
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {user.booking_count || 0} bookings
                    {user.updated_at && ` • Last active ${format(new Date(user.updated_at), 'MMM d, yyyy')}`}
                  </div>
                </div>
                <Button
                  variant={user.role === 'admin' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => handlePromoteUser(user.id, user.username || '', user.role)}
                  disabled={updatingUser === user.id}
                >
                  {updatingUser === user.id ? (
                    'Updating...'
                  ) : user.role === 'admin' ? (
                    'Remove Admin'
                  ) : (
                    'Promote to Admin'
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}