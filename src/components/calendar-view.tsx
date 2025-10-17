'use client'

import { useState } from 'react'
import { Room, Booking, TimeSlot } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingDialog } from '@/components/booking-dialog'
import { format, addMinutes, isBefore, isAfter, startOfDay } from 'date-fns'

interface CalendarViewProps {
  room: Room
  bookings: Booking[]
  onBookingCreated: () => void
}

export function CalendarView({ room, bookings, onBookingCreated }: CalendarViewProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  // Generate time slots from 8 AM to 6 PM in 30-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const currentDate = startOfDay(new Date())
    currentDate.setHours(8, 0, 0, 0) // Start at 8 AM

    for (let i = 0; i < 20; i++) { // 20 slots from 8 AM to 6 PM
      const startTime = new Date(currentDate)
      const endTime = addMinutes(startTime, 30)
      const timeString = format(startTime, 'h:mm a')

      // Check if this slot is booked
      const booking = bookings.find(b => {
        const bookingStart = new Date(b.start_time)
        const bookingEnd = new Date(b.end_time)
        return (isBefore(startTime, bookingEnd) && isAfter(endTime, bookingStart))
      })

      slots.push({
        time: timeString,
        available: !booking,
        booking
      })

      currentDate.setMinutes(currentDate.getMinutes() + 30)
    }

    return slots
  }

  const handleTimeSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot)
      setShowBookingDialog(true)
    }
  }

  const timeSlots = generateTimeSlots()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{room.name} - Schedule</CardTitle>
          <CardDescription>
            Today&apos;s availability for {room.name}
            {room.location && ` • ${room.location}`}
            {room.capacity && ` • ${room.capacity} people`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSlotClick(slot)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  slot.available
                    ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer'
                    : 'border-red-200 bg-red-50 text-red-800 cursor-not-allowed'
                }`}
                disabled={!slot.available}
              >
                <div className="text-center">
                  <div className="font-semibold">{slot.time}</div>
                  <div className="text-xs mt-1">
                    {slot.available ? 'Available' : 'Booked'}
                  </div>
                  {slot.booking && (
                    <div className="text-xs mt-1 truncate">
                      {slot.booking.title}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {showBookingDialog && selectedTimeSlot && (
        <BookingDialog
          room={room}
          timeSlot={selectedTimeSlot}
          onClose={() => setShowBookingDialog(false)}
          onBookingCreated={() => {
            setShowBookingDialog(false)
            onBookingCreated()
          }}
        />
      )}
    </>
  )
}