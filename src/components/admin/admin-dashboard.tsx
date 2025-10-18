'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoomManagement } from './room-management'
import { UserManagement } from './user-management'
import { ArrowLeft, Users, Building, Shield, Activity, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AdminDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-deep-charcoal via-background to-brand-secondary/10 pointer-events-none" />

      <header className="glass border-b border-border/50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 bg-background/50 border-border/50 hover:bg-background/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">System Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">System Online</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Administration Center</h2>
          </div>
          <p className="text-muted-foreground">Manage rooms, users, and system settings with full control</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="card-enhanced bg-card/60 backdrop-blur-sm border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Rooms</p>
                    <p className="text-2xl font-bold text-foreground">--</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-enhanced bg-card/60 backdrop-blur-sm border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">--</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-enhanced bg-card/60 backdrop-blur-sm border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">System Status</p>
                    <p className="text-2xl font-bold text-success">Operational</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="rooms" className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <TabsList className="grid w-full grid-cols-2 lg:w-96 bg-card/60 backdrop-blur-sm border-border/50">
            <TabsTrigger value="rooms" className="flex items-center gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-primary">
              <Building className="h-4 w-4" />
              Room Management
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-primary">
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