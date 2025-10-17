export interface Room {
  id: number;
  name: string;
  location: string | null;
  capacity: number | null;
  created_at: string;
}

export interface Booking {
  id: number;
  start_time: string;
  end_time: string;
  title: string;
  user_id: string;
  room_id: number;
  created_at: string;
}

export interface Profile {
  id: string;
  updated_at: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booking?: Booking;
}