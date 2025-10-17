'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoomManagement } from './room-management'
import { UserManagement } from './user-management'
import { ArrowLeft, Settings, Users, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AdminDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage rooms, users, and system settings</p>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Room Management
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <RoomManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}