# MeetSpace - Meeting Room Booking System

A modern, responsive meeting room booking application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Sign up and log in with email/password
- **Role-Based Access**: User and Admin roles with different permissions
- **Room Management**: View available meeting rooms with capacity and location info
- **Admin Room Management**: Add, edit, and delete meeting rooms (admin only)
- **User Management**: Promote/demote users and manage permissions (admin only)
- **Calendar View**: Visual time slot interface showing availability
- **Booking System**: Click available time slots to book rooms
- **Booking Management**: View and cancel your upcoming bookings
- **Admin Booking View**: View all bookings in the system (admin only)
- **Real-time Updates**: Instant calendar updates when bookings are made
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Database, Auth, API)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project (get one at [supabase.com](https://supabase.com))

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd fullstack-web
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select an existing one
3. Navigate to Settings → API
4. Copy the Project URL and anon public key

### 3. Set Up Database

Run the database schema in your Supabase project:

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `database/schema.sql`
3. Run the SQL script to create tables and RLS policies

This will create:
- `profiles` table (extends Supabase Auth with role support)
- `rooms` table (with sample meeting rooms)
- `bookings` table
- Row Level Security policies
- Sample rooms for testing
- Admin helper functions

### 4. Set Up First Admin User

After setting up the database and creating your first user account:

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `database/setup-admin.sql`
3. Replace `'your-email@example.com'` with your actual email
4. Run the SQL script to promote your user to admin

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Regular Users:
1. **Sign Up**: Create a new account with your email and password
2. **Log In**: Sign in to access the dashboard
3. **Select Room**: Choose a meeting room from the left panel
4. **View Schedule**: See today's availability in the calendar view
5. **Book Slot**: Click on any available (green) time slot
6. **Enter Details**: Add a meeting title and confirm booking
7. **Manage Bookings**: View and cancel your bookings at the bottom

### For Admin Users:
Admins have all the functionality of regular users plus:

1. **Access Admin Panel**: Click "Admin Panel" in the top navigation
2. **Room Management**:
   - Add new meeting rooms with name, location, and capacity
   - Edit existing room details
   - Delete rooms (also removes all bookings for that room)
3. **User Management**:
   - View all registered users and their booking counts
   - Promote users to admin role
   - Demote admins back to regular users
4. **Enhanced Booking View**: Can see all bookings in the system

### Admin Badge:
Admin users will see an "Admin" badge next to their name and have access to the admin panel button in the navigation.

## Database Schema

### Tables

- **profiles**: User profiles linked to Supabase Auth with role support (`user`/`admin`)
- **rooms**: Meeting room information (name, location, capacity)
- **bookings**: Booking records linking users and rooms

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only see their own bookings (except admins can see all)
- Admins can create, update, and delete rooms
- Public read access to rooms list
- Secure authentication flow
- Role-based access control

## Development

### Project Structure

```
src/
├── app/                 # Next.js 13+ app directory
│   ├── dashboard/       # Main dashboard page
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── auth-button.tsx
│   ├── booking-dialog.tsx
│   ├── calendar-view.tsx
│   ├── dashboard-content.tsx
│   ├── my-bookings.tsx
│   └── room-list.tsx
├── lib/               # Utility functions
│   ├── supabase/      # Supabase client setup
│   └── utils.ts       # General utilities
└── types/             # TypeScript type definitions
```

### Key Components

- **CalendarView**: Interactive time slot grid with booking status
- **RoomList**: Available rooms with selection
- **BookingDialog**: Modal for creating new bookings
- **MyBookings**: User's booking management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.