'use client'

import { useState } from 'react'
import { Room } from '@/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface RoomFormProps {
  room?: Room | null
  onClose: () => void
  onSaved: () => void
}

export function RoomForm({ room, onClose, onSaved }: RoomFormProps) {
  const [name, setName] = useState(room?.name || '')
  const [location, setLocation] = useState(room?.location || '')
  const [capacity, setCapacity] = useState(room?.capacity?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const roomData = {
        name: name.trim(),
        location: location.trim() || null,
        capacity: capacity ? parseInt(capacity) : null,
      }

      if (room) {
        // Update existing room
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', room.id)

        if (error) throw error
      } else {
        // Create new room
        const { error } = await supabase
          .from('rooms')
          .insert(roomData)

        if (error) throw error
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {room ? 'Edit Room' : 'Add New Room'}
          </DialogTitle>
          <DialogDescription>
            {room ? 'Update the room details below.' : 'Enter the details for the new meeting room.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Conference Room A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Floor 1, Building A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 10"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
              />
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
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Saving...' : room ? 'Update Room' : 'Create Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}