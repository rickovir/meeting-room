import { Room } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, DoorOpen, Building2, Activity, Calendar } from 'lucide-react'

interface RoomListProps {
  rooms: Room[]
  selectedRoom: Room | null
  onRoomSelect: (room: Room) => void
}

export function RoomList({ rooms, selectedRoom, onRoomSelect }: RoomListProps) {
  return (
    <Card className="card-enhanced glass animate-scale-in border-border/30">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-t-xl border-b border-border/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Meeting Rooms
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80 font-medium">
                Select a room to view schedule
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/30">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span>{rooms.length} rooms</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {rooms.map((room, index) => (
          <div
            key={room.id}
            className={`group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
              selectedRoom?.id === room.id
                ? 'border-primary bg-gradient-to-r from-primary/10 to-secondary/10 shadow-2xl shadow-primary/20'
                : 'border-border/40 bg-card/60 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5'
            }`}
            onClick={() => onRoomSelect(room)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background gradient effect for selected room */}
            {selectedRoom?.id === room.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            )}

            <div className="relative z-10 p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    selectedRoom?.id === room.id
                      ? 'bg-primary shadow-lg shadow-primary/50 scale-125'
                      : 'bg-muted-foreground/60 group-hover:bg-primary/70'
                  }`}></div>
                  <div>
                    <h3 className={`font-bold text-lg transition-colors duration-300 ${
                      selectedRoom?.id === room.id
                        ? 'text-foreground'
                        : 'text-foreground/90 group-hover:text-foreground'
                    }`}>
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={selectedRoom?.id === room.id ? 'default' : 'secondary'}
                        className={`text-xs font-semibold transition-all duration-300 ${
                          selectedRoom?.id === room.id
                            ? 'bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg'
                            : 'bg-muted/70 text-muted-foreground border-border/40 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/40'
                        }`}
                      >
                        {selectedRoom?.id === room.id ? 'Active' : 'Available'}
                      </Badge>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        selectedRoom?.id === room.id ? 'bg-primary' : 'bg-muted-foreground/40'
                      }`}></div>
                      <span className="text-xs text-muted-foreground/70 font-medium">
                        {room.capacity ? `${room.capacity} capacity` : 'No capacity info'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-4 text-sm transition-colors duration-300 ${
                selectedRoom?.id === room.id
                  ? 'text-foreground/80'
                  : 'text-muted-foreground group-hover:text-foreground/70'
              }`}>
                {room.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-current" />
                    <span className="font-medium">{room.location}</span>
                  </div>
                )}
                {room.capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-current" />
                    <span className="font-medium">{room.capacity} people</span>
                  </div>
                )}
              </div>

              {selectedRoom?.id === room.id && (
                <div className="mt-4 pt-3 border-t border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary animate-pulse" />
                    <p className="text-xs text-primary font-bold">
                      Currently viewing schedule
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Animated hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 dark:via-white/5"></div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}