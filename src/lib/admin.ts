import { createClient } from '@/lib/supabase/client'

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin'
}

export async function promoteUserToAdmin(email: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('promote_to_admin', {
    user_email: email
  })

  if (error) {
    console.error('Error promoting user to admin:', error)
    return false
  }

  return data || false
}