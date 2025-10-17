'use client'

import { useState, useEffect, useCallback } from 'react'
import { Booking } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Trash2, Calendar, Clock, MapPin } from 'lucide-react'

interface MyBookingsProps {
  userId: string
}

export function MyBookings({ userId }: MyBookingsProps) {
  const [bookings, setBookings] = useState<(Booking & { room_name: string })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchMyBookings = useCallback(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (name)
      `)
      .eq('user_id', userId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching bookings:', error)
    } else {
      setBookings(data?.map(b => ({ ...b, room_name: b.rooms.name })) || [])
    }
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => {
    fetchMyBookings()
  }, [fetchMyBookings])

  const handleCancelBooking = async (bookingId: number) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (error) {
      console.error('Error canceling booking:', error)
    } else {
      fetchMyBookings() // Refresh the list
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>Your upcoming meeting room reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading your bookings...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          My Bookings
        </CardTitle>
        <CardDescription>Your upcoming meeting room reservations</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>You don&apos;t have any upcoming bookings.</p>
            <p className="text-sm mt-2">Select a room and time slot to make a booking.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{booking.title}</h4>
                    <Badge variant="secondary">{booking.room_name}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(booking.start_time), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                  className="ml-4"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}