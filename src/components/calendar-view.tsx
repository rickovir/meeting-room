'use client'

import { useState } from 'react'
import { Room, Booking, TimeSlot } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingDialog } from '@/components/booking-dialog'
import { format, addMinutes, isBefore, isAfter, startOfDay } from 'date-fns'
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'

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
      <Card className="card-enhanced glass animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-xl border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-xl shadow-primary/25 border border-primary/30">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {room.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-3 text-sm text-muted-foreground/80 font-medium mt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Today&apos;s schedule</span>
                </div>
                {room.location && (
                  <>
                    <span className="text-border/50">•</span>
                    <span className="text-foreground/90">{room.location}</span>
                  </>
                )}
                {room.capacity && (
                  <>
                    <span className="text-border/50">•</span>
                    <span className="text-foreground/90">{room.capacity} people</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleTimeSlotClick(slot)}
                className={`h-32 p-4 rounded-xl border-2 text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group ${
                  slot.available
                    ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-400 hover:shadow-emerald-500/25 cursor-pointer dark:border-emerald-500/50 dark:bg-gradient-to-br dark:from-emerald-950/90 dark:to-emerald-900/90 dark:text-white dark:hover:from-emerald-900/90 dark:hover:to-emerald-800/90 dark:hover:border-emerald-400'
                    : 'border-rose-500/60 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 cursor-not-allowed opacity-90 dark:border-rose-500/50 dark:bg-gradient-to-br dark:from-rose-950/90 dark:to-rose-900/90 dark:text-white'
                }`}
                disabled={!slot.available}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-center relative z-10 h-full flex flex-col justify-between">
                  <div className={`font-bold text-lg drop-shadow-sm ${
                    slot.available ? 'text-emerald-700 dark:text-white' : 'text-rose-700 dark:text-white'
                  }`}>{slot.time}</div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs mb-2">
                        {slot.available ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-300 drop-shadow-sm" />
                            <span className="text-emerald-700 dark:text-emerald-100 font-semibold">Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-300 drop-shadow-sm" />
                            <span className="text-rose-700 dark:text-rose-100 font-semibold">Booked</span>
                          </>
                        )}
                      </div>
                      {slot.booking && (
                        <div className={`text-xs truncate font-bold rounded-md px-2 py-1 backdrop-blur-sm ${
                          slot.available
                            ? 'text-emerald-700 bg-emerald-100/70 dark:text-white/90 dark:bg-black/20'
                            : 'text-rose-700 bg-rose-100/70 dark:text-white/90 dark:bg-black/20'
                        }`}>
                          {slot.booking.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Animated background effect */}
                {slot.available && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-110 group-hover:scale-100 dark:from-white/10 dark:via-transparent"></div>
                )}
                {/* Shimmer effect for available slots */}
                {slot.available && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000 dark:via-white/5"></div>
                )}
              </button>
            ))}
          </div>

          {/* Time indicator */}
          <div className="mt-8 flex items-center justify-center gap-2.5 text-xs text-muted-foreground/90 font-medium bg-muted/50 rounded-full px-4 py-2 backdrop-blur-sm border border-border/30">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>All times are shown in your local timezone</span>
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