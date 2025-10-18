'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthButton } from '@/components/auth-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { RoomList } from '@/components/room-list'
import { CalendarView } from '@/components/calendar-view'
import { MyBookings } from '@/components/my-bookings'
import { Room, Booking } from '@/types'
import { globalState } from '@/lib/global-state'
import { Building2, Calendar, Clock } from 'lucide-react'

interface DashboardContentProps {
  user: any
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRooms = useCallback(async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching rooms:', error)
    } else {
      setRooms(data || [])
      if (data && data.length > 0) {
        setSelectedRoom(data[0])
      }
    }
    setLoading(false)
  }, [supabase])

  const fetchBookings = useCallback(async (roomId: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_id', roomId)
      .gte('start_time', today.toISOString())
      .lt('start_time', tomorrow.toISOString())
      .order('start_time')

    if (error) {
      console.error('Error fetching bookings:', error)
    } else {
      setBookings(data || [])
    }
  }, [supabase])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  // Listen for global refresh events
  useEffect(() => {
    const unsubscribe = globalState.subscribe(() => {
      fetchRooms()
    })
    return unsubscribe
  }, [fetchRooms])

  useEffect(() => {
    if (selectedRoom) {
      fetchBookings(selectedRoom.id)
    }
  }, [selectedRoom, fetchBookings])

  const handleBookingCreated = () => {
    if (selectedRoom) {
      fetchBookings(selectedRoom.id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-secondary/3 via-background to-primary/3 pointer-events-none"></div>

      <header className="glass border-b border-border/50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">MeetSpace</h1>
              <p className="text-sm text-muted-foreground">Meeting Room Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email}!
          </h2>
          <p className="text-muted-foreground">
            Book meeting rooms and manage your workspace efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rooms List */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <RoomList
              rooms={rooms}
              selectedRoom={selectedRoom}
              onRoomSelect={setSelectedRoom}
            />
          </div>

          {/* Right Column - Calendar and Bookings */}
          <div className="lg:col-span-2 space-y-8">
            {selectedRoom && (
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CalendarView
                  room={selectedRoom}
                  bookings={bookings}
                  onBookingCreated={handleBookingCreated}
                />
              </div>
            )}

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <MyBookings userId={user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}