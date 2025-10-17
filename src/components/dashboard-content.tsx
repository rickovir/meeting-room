'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthButton } from '@/components/auth-button'
import { RoomList } from '@/components/room-list'
import { CalendarView } from '@/components/calendar-view'
import { MyBookings } from '@/components/my-bookings'
import { Room, Booking } from '@/types'
import { globalState } from '@/lib/global-state'

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MeetSpace</h1>
          <AuthButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rooms List */}
          <div className="lg:col-span-1">
            <RoomList
              rooms={rooms}
              selectedRoom={selectedRoom}
              onRoomSelect={setSelectedRoom}
            />
          </div>

          {/* Right Column - Calendar and Bookings */}
          <div className="lg:col-span-2 space-y-8">
            {selectedRoom && (
              <CalendarView
                room={selectedRoom}
                bookings={bookings}
                onBookingCreated={handleBookingCreated}
              />
            )}

            <MyBookings userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}