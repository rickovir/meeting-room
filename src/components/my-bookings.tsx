'use client'

import { useState, useEffect, useCallback } from 'react'
import { Booking } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'
import { Trash2, Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react'

interface MyBookingsProps {
  userId: string
}

export function MyBookings({ userId }: MyBookingsProps) {
  const [bookings, setBookings] = useState<(Booking & { room_name: string; capacity?: number; location?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const supabase = createClient()

  const fetchMyBookings = useCallback(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (name, capacity, location)
      `)
      .eq('user_id', userId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching bookings:', error)
    } else {
      setBookings(data?.map(b => ({
        ...b,
        room_name: b.rooms.name,
        capacity: b.rooms.capacity,
        location: b.rooms.location
      })) || [])
    }
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => {
    fetchMyBookings()
  }, [fetchMyBookings])

  const handleCancelBooking = async (bookingId: number) => {
    setCancellingId(bookingId)
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (error) {
      console.error('Error canceling booking:', error)
    } else {
      fetchMyBookings() // Refresh the list
    }
    setCancellingId(null)
  }

  const getTimeStatus = (startTime: Date) => {
    if (isToday(startTime)) return { label: 'Today', color: 'emerald' }
    if (isTomorrow(startTime)) return { label: 'Tomorrow', color: 'blue' }
    if (isThisWeek(startTime)) return { label: 'This Week', color: 'purple' }
    return { label: 'Upcoming', color: 'gray' }
  }

  if (loading) {
    return (
      <Card className="card-enhanced glass animate-slide-up border-border/30">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-t-xl border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Bookings
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80 font-medium">
                Your upcoming meeting room reservations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading your bookings...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-enhanced glass animate-slide-up border-border/30">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-t-xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                My Bookings
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80 font-medium">
                Your upcoming meeting room reservations
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/30 dark:bg-muted/50">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-muted/50 dark:to-muted rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border/30 dark:border-border/30">
              <Calendar className="w-10 h-10 text-primary dark:text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don&apos;t have any upcoming bookings. Select a room and time slot to make your first reservation.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <AlertCircle className="w-4 h-4" />
              <span>Tip: Book rooms in advance to secure your spot</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const startTime = new Date(booking.start_time)
              const endTime = new Date(booking.end_time)
              const timeStatus = getTimeStatus(startTime)

              return (
                <div
                  key={booking.id}
                  className="group relative overflow-hidden rounded-xl border-2 border-border/40 bg-card/60 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {booking.title}
                          </h4>
                          <Badge className={`bg-gradient-to-r from-${timeStatus.color}-500/20 to-${timeStatus.color}-600/20 text-${timeStatus.color}-100 border-${timeStatus.color}-500/30 font-semibold`}>
                            {timeStatus.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-muted/70 text-muted-foreground border-border/40 font-medium">
                            {booking.room_name}
                          </Badge>
                          {booking.capacity && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>{booking.capacity} people</span>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">
                              {format(startTime, 'EEEE, MMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">
                              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                            </span>
                          </div>
                          {booking.location && (
                            <div className="flex items-center gap-2 text-sm sm:col-span-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="font-medium text-foreground">{booking.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-rose-600 dark:to-rose-700 dark:hover:from-rose-700 dark:hover:to-rose-800"
                      >
                        {cancellingId === booking.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Cancel Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}