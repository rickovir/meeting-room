import { Room } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin } from 'lucide-react'

interface RoomListProps {
  rooms: Room[]
  selectedRoom: Room | null
  onRoomSelect: (room: Room) => void
}

export function RoomList({ rooms, selectedRoom, onRoomSelect }: RoomListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Rooms</CardTitle>
        <CardDescription>Select a room to view its schedule</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedRoom?.id === room.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => onRoomSelect(room)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{room.name}</h3>
              <Badge variant={selectedRoom?.id === room.id ? 'default' : 'secondary'}>
                {selectedRoom?.id === room.id ? 'Selected' : 'Available'}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
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
        ))}
      </CardContent>
    </Card>
  )
}