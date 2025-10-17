'use client'

import { useState, useEffect, useCallback } from 'react'
import { Room } from '@/types'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoomForm } from './room-form'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Users, MapPin } from 'lucide-react'
import { globalState } from '@/lib/global-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/hooks/use-toast'

export function RoomManagement() {
  const { isAdmin, loading } = useAdmin()
  const { toast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [deletingRoom, setDeletingRoom] = useState<number | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    roomId: number | null
    roomName: string | null
  }>({ open: false, roomId: null, roomName: null })
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
    }
    setLoadingRooms(false)
  }, [supabase])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const handleDeleteClick = (roomId: number, roomName: string) => {
    setConfirmDialog({
      open: true,
      roomId,
      roomName
    })
  }

  const handleConfirmDelete = async () => {
    if (!confirmDialog.roomId) return

    setDeletingRoom(confirmDialog.roomId)
    setConfirmDialog({ open: false, roomId: null, roomName: null })

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', confirmDialog.roomId)

    if (error) {
      console.error('Error deleting room:', error)
      toast({
        title: "Error",
        description: `Failed to delete room: ${error.message}`,
        variant: "destructive",
      })
    } else {
      fetchRooms()
      globalState.refresh() // Trigger global refresh
      toast({
        title: "Room deleted",
        description: `${confirmDialog.roomName} has been successfully deleted.`,
      })
    }
    setDeletingRoom(null)
  }

  const handleRoomSaved = () => {
    setShowForm(false)
    setEditingRoom(null)
    fetchRooms()
    globalState.refresh() // Trigger global refresh
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You don&apos;t have permission to manage rooms.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Room Management
                <Badge variant="secondary">Admin</Badge>
              </CardTitle>
              <CardDescription>Add, edit, and delete meeting rooms</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Room
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRooms ? (
            <div className="text-center py-8">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No rooms found. Create your first room!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      {room.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {room.location}
                        </div>
                      )}
                      {room.capacity && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {room.capacity} people
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingRoom(room)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(room.id, room.name)}
                      disabled={deletingRoom === room.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deletingRoom === room.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {(showForm || editingRoom) && (
        <RoomForm
          room={editingRoom}
          onClose={() => {
            setShowForm(false)
            setEditingRoom(null)
          }}
          onSaved={handleRoomSaved}
        />
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, roomId: null, roomName: null })
        }
        title="Delete Room"
        description={`Are you sure you want to delete "${confirmDialog.roomName}"? This action cannot be undone and will also delete all bookings associated with this room.`}
        confirmText="Delete Room"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        loading={deletingRoom !== null}
        variant="destructive"
      />
    </>
  )
}