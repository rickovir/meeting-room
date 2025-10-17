'use client'

import { useState } from 'react'
import { Room, TimeSlot } from '@/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { parse, format, addMinutes, startOfDay } from 'date-fns'

interface BookingDialogProps {
  room: Room
  timeSlot: TimeSlot
  onClose: () => void
  onBookingCreated: () => void
}

export function BookingDialog({ room, timeSlot, onClose, onBookingCreated }: BookingDialogProps) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Parse the time slot to get actual datetime
      const today = startOfDay(new Date())
      const [time, period] = timeSlot.time.split(' ')
      const [hours, minutes] = time.split(':').map(Number)

      let hour = hours
      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0

      const startTime = new Date(today)
      startTime.setHours(hour, minutes, 0, 0)

      const endTime = addMinutes(startTime, 30)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to make a booking')
      }

      const { error } = await supabase.from('bookings').insert({
        title,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        user_id: user.id,
        room_id: room.id
      })

      if (error) {
        throw error.message
      }

      onBookingCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book {room.name}</DialogTitle>
          <DialogDescription>
            Reserve this room for {timeSlot.time} (30 minutes)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBooking}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                placeholder="e.g., Team Standup, Client Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Room:</strong> {room.name}</p>
              <p><strong>Time:</strong> {timeSlot.time} (30 minutes)</p>
              {room.location && <p><strong>Location:</strong> {room.location}</p>}
              {room.capacity && <p><strong>Capacity:</strong> {room.capacity} people</p>}
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}