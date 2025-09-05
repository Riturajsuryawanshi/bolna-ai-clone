'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/dashboard-layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { 
  Phone, 
  PhoneCall, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play,
  Pause,
  Search,
  Filter
} from 'lucide-react'

export default function CallsPage() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      // Mock data for now
      const mockCalls = [
        {
          id: '1',
          direction: 'OUTBOUND',
          toNumber: '+1234567890',
          fromNumber: '+1987654321',
          status: 'COMPLETED',
          duration: 180,
          cost: 0.15,
          createdAt: new Date().toISOString(),
          agent: { name: 'Sales Assistant' }
        },
        {
          id: '2',
          direction: 'INBOUND',
          toNumber: '+1987654321',
          fromNumber: '+1234567891',
          status: 'FAILED',
          duration: 0,
          cost: 0,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          agent: { name: 'Support Bot' }
        },
        {
          id: '3',
          direction: 'OUTBOUND',
          toNumber: '+1234567892',
          fromNumber: '+1987654321',
          status: 'IN_PROGRESS',
          duration: null,
          cost: null,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          agent: { name: 'Lead Qualifier' }
        }
      ]
      setCalls(mockCalls)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching calls:', error)
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'IN_PROGRESS':
        return <Play className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'FAILED':
        return 'text-red-600 bg-red-100'
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '-'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const filteredCalls = calls.filter(call => {
    const matchesFilter = filter === 'all' || call.status.toLowerCase() === filter.toLowerCase()
    const matchesSearch = searchTerm === '' || 
      call.toNumber.includes(searchTerm) || 
      call.fromNumber.includes(searchTerm) ||
      call.agent?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <DashboardLayout currentPath="/dashboard/calls">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPath="/dashboard/calls">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Call History</h2>
            <p className="text-gray-600">View and manage your call records</p>
          </div>
          <Button>
            <PhoneCall className="h-4 w-4 mr-2" />
            Start New Call
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calls.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {calls.filter(c => c.status === 'COMPLETED').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Play className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {calls.filter(c => c.status === 'IN_PROGRESS').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <span className="text-sm text-muted-foreground">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${calls.reduce((sum, call) => sum + (call.cost || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search calls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Calls</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calls List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>
              {filteredCalls.length} of {calls.length} calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(call.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                        {call.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div>
                      <div className="font-medium">
                        {call.direction === 'OUTBOUND' ? call.toNumber : call.fromNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {call.agent?.name} • {new Date(call.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="text-right">
                      <div>Duration</div>
                      <div className="font-medium">{formatDuration(call.duration)}</div>
                    </div>
                    
                    <div className="text-right">
                      <div>Cost</div>
                      <div className="font-medium">
                        {call.cost ? `$${call.cost.toFixed(2)}` : '-'}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredCalls.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No calls found matching your criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}