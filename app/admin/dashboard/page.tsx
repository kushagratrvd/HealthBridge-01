"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, LogOut, Star, User, ChevronDown, Bell, Users, BarChart, Settings, Shield } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const [adminName] = useState("Alex Thompson")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HealthBridge</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Globe className="h-4 w-4" />
                  <span>English</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Español</DropdownMenuItem>
                <DropdownMenuItem>हिन्दी</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={adminName} />
                    <AvatarFallback>AT</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{adminName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="grid gap-8">
          <section className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {adminName}</h1>
            <p className="text-muted-foreground">Here's an overview of the platform's performance and key metrics.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Button className="h-auto py-4 gap-2" asChild>
              <Link href="/admin/users">
                <Users className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>User Management</span>
                  <span className="text-xs text-muted-foreground">Add, remove, or edit users</span>
                </div>
              </Link>
            </Button>

            <Button className="h-auto py-4 gap-2" asChild>
              <Link href="/admin/reports">
                <BarChart className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Analytics & Reports</span>
                  <span className="text-xs text-muted-foreground">View detailed statistics</span>
                </div>
              </Link>
            </Button>

            <Button className="h-auto py-4 gap-2" asChild>
              <Link href="/admin/settings">
                <Settings className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>System Settings</span>
                  <span className="text-xs text-muted-foreground">Configure platform options</span>
                </div>
              </Link>
            </Button>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Platform Usage Statistics</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,427</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 8%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Provider Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <Progress value={78} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.8%</div>
                  <Progress value={99.8} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">User Management</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/users">Manage All Users</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Patients</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">876</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active this month:</span>
                    <span>642</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Providers</CardTitle>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">124</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active this month:</span>
                    <span>118</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Administrators</CardTitle>
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">28</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active this month:</span>
                    <span>26</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container py-6 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HealthBridge. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

