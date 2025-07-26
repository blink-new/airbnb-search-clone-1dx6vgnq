import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  DollarSign,
  MapPin,
  Package,
  Users,
  CheckCircle,
  Clock,
  X
} from 'lucide-react'
import { getStorageSpacesByHost, getHostBookings, updateStorageSpace, deleteStorageSpace } from '../lib/database'
import { StorageSpace, Booking } from '../lib/supabase'
import { format } from 'date-fns'

interface ManageListingsProps {
  user: any
  onBack: () => void
}

const storageTypeLabels = {
  dorm_room: 'Dorm Room',
  apartment: 'Apartment',
  garage: 'Garage',
  closet: 'Closet',
  basement: 'Basement',
  storage_unit: 'Storage Unit'
}

const sizeLabels = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  extra_large: 'Extra Large'
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
}

export function ManageListings({ user, onBack }: ManageListingsProps) {
  const [listings, setListings] = useState<StorageSpace[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editingListing, setEditingListing] = useState<StorageSpace | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [listingsData, bookingsData] = await Promise.all([
        getStorageSpacesByHost(user.id),
        getHostBookings(user.id)
      ])
      setListings(listingsData)
      setBookings(bookingsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleEditListing = (listing: StorageSpace) => {
    setEditingListing(listing)
    setEditForm({
      title: listing.title,
      description: listing.description,
      price_per_month: listing.price_per_month,
      capacity_description: listing.capacity_description || '',
      rules: listing.rules || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingListing) return

    try {
      await updateStorageSpace(editingListing.id, editForm)
      setEditingListing(null)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Error updating listing. Please try again.')
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    try {
      await deleteStorageSpace(listingId)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Error deleting listing. Please try again.')
    }
  }

  const getListingBookings = (listingId: string) => {
    return bookings.filter(booking => booking.storage_space?.id === listingId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Your Listings</h1>
            <p className="text-gray-600">View and manage your storage spaces and bookings</p>
          </div>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Start earning by listing your storage space</p>
          <Button onClick={onBack} className="bg-primary hover:bg-primary/90">
            Create Your First Listing
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {listings.map((listing) => {
            const listingBookings = getListingBookings(listing.id)
            const activeBookings = listingBookings.filter(b => b.status === 'confirmed')
            const pendingBookings = listingBookings.filter(b => b.status === 'pending')

            return (
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-80 h-48 lg:h-auto">
                      <img
                        src={listing.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{listing.location_address}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${listing.price_per_month}/month</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="secondary">
                              {storageTypeLabels[listing.storage_type as keyof typeof storageTypeLabels]}
                            </Badge>
                            <Badge variant="outline">
                              {sizeLabels[listing.size_category as keyof typeof sizeLabels]}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${listing.price_per_month}</div>
                          <div className="text-sm text-gray-600">per month</div>
                        </div>
                      </div>

                      {/* Booking Status */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Active Bookings</span>
                          </div>
                          <div className="text-2xl font-bold text-green-900">{activeBookings.length}</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-900">Pending</span>
                          </div>
                          <div className="text-2xl font-bold text-yellow-900">{pendingBookings.length}</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Total Earnings</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-900">
                            ${listingBookings.reduce((sum, booking) => sum + Number(booking.total_price), 0)}
                          </div>
                        </div>
                      </div>

                      {/* Recent Bookings */}
                      {listingBookings.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Recent Bookings</h4>
                          <div className="space-y-2">
                            {listingBookings.slice(0, 3).map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{booking.renter?.full_name}</div>
                                    <div className="text-xs text-gray-600">
                                      {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd')}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                                    {booking.status}
                                  </Badge>
                                  <span className="text-sm font-medium">${booking.total_price}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditListing(listing)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Listing</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                  id="title"
                                  value={editForm.title || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={editForm.description || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label htmlFor="price">Price per Month</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  value={editForm.price_per_month || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, price_per_month: parseFloat(e.target.value) }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="capacity">Capacity Description</Label>
                                <Input
                                  id="capacity"
                                  value={editForm.capacity_description || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, capacity_description: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="rules">Rules</Label>
                                <Textarea
                                  id="rules"
                                  value={editForm.rules || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, rules: e.target.value }))}
                                  rows={2}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setEditingListing(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
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