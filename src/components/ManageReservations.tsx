import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { 
  ArrowLeft, 
  Calendar,
  DollarSign,
  MapPin,
  Package,
  MessageCircle,
  CheckCircle,
  Clock,
  X,
  AlertCircle
} from 'lucide-react'
import { getRenterBookings, updateBookingStatus } from '../lib/database'
import { Booking } from '../lib/supabase'
import { format } from 'date-fns'

interface ManageReservationsProps {
  user: any
  onBack: () => void
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: X,
  completed: CheckCircle
}

export function ManageReservations({ user, onBack }: ManageReservationsProps) {
  const [reservations, setReservations] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getRenterBookings(user.id)
      setReservations(data)
    } catch (error) {
      console.error('Error loading reservations:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  const handleCancelReservation = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return
    }

    try {
      await updateBookingStatus(bookingId, 'cancelled')
      loadReservations() // Refresh data
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      alert('Error cancelling reservation. Please try again.')
    }
  }

  const getStatusInfo = (status: string) => {
    const IconComponent = statusIcons[status as keyof typeof statusIcons] || AlertCircle
    return { IconComponent, color: statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800' }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return `${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reservations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
            <p className="text-gray-600">View and manage your storage bookings</p>
          </div>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No reservations yet</h3>
          <p className="text-gray-600 mb-6">Start by finding storage space for your items</p>
          <Button onClick={onBack} className="bg-primary hover:bg-primary/90">
            Find Storage Space
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => {
            const { IconComponent, color } = getStatusInfo(reservation.status || 'pending')
            const isActive = reservation.status === 'confirmed'
            const isPending = reservation.status === 'pending'
            const isCancellable = ['pending', 'confirmed'].includes(reservation.status || '')

            return (
              <Card key={reservation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-80 h-48 lg:h-auto">
                      <img
                        src={reservation.storage_space?.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'}
                        alt={reservation.storage_space?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {reservation.storage_space?.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{reservation.storage_space?.location_address}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDateRange(reservation.start_date, reservation.end_date)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge className={color}>
                              <IconComponent className="w-3 h-3 mr-1" />
                              {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}
                            </Badge>
                            {isActive && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${reservation.total_price}</div>
                          <div className="text-sm text-gray-600">total</div>
                        </div>
                      </div>

                      {/* Host Info */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Host</h4>
                            <p className="text-sm text-gray-600">{reservation.host?.full_name}</p>
                            <p className="text-xs text-gray-500">{reservation.host?.email}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {reservation.special_requests && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                            {reservation.special_requests}
                          </p>
                        </div>
                      )}

                      {/* Status Messages */}
                      {isPending && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-900">Pending Confirmation</span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your reservation is waiting for host approval. You'll be notified once confirmed.
                          </p>
                        </div>
                      )}

                      {isActive && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Reservation Confirmed</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Your storage space is reserved and ready for use during the specified dates.
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {isCancellable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Reservation
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Host
                        </Button>
                      </div>

                      {/* Booking Details */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          Booked on {format(new Date(reservation.created_at || ''), 'MMM dd, yyyy')} • 
                          Booking ID: {reservation.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}