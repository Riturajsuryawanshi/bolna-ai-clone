'use client'

import { useState } from 'react'
import { 
  Bot, 
  Phone, 
  Database, 
  Layers, 
  History, 
  Mic, 
  Code, 
  Settings, 
  Building, 
  CreditCard,
  FileText,
  Menu,
  X
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Agent Setup', href: '/dashboard/agents', icon: Bot },
  { name: 'Call History', href: '/dashboard/calls', icon: History },
  { name: 'My Numbers', href: '/dashboard/numbers', icon: Phone },
  { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: Database },
  { name: 'Batches', href: '/dashboard/batches', icon: Layers },
  { name: 'Voice Lab', href: '/dashboard/voice-lab', icon: Mic },
  { name: 'Developers', href: '/dashboard/developers', icon: Code },
  { name: 'Providers', href: '/dashboard/providers', icon: Settings },
  { name: 'Workplace', href: '/dashboard/workplace', icon: Building },
]

export default function DashboardLayout({ children, currentPath = '/dashboard/agents' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">Bolna</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    currentPath === item.href
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">Bolna</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    currentPath === item.href
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex-1 flex justify-between items-center px-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.href === currentPath)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>Balance: $25.00</span>
              </div>
              <Button variant="outline" size="sm">
                Add Funds
              </Button>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Docs
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}