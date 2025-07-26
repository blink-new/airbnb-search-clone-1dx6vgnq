import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { SearchBar } from './components/SearchBar'
import { StorageCard } from './components/StorageCard'
import { FilterPanel } from './components/FilterPanel'
import { ListSpaceForm } from './components/ListSpaceForm'
import { StorageDetails } from './components/StorageDetails'
import { BookingConfirmation } from './components/BookingConfirmation'
import { Homepage } from './components/Homepage'
import { ManageListings } from './components/ManageListings'
import { ManageReservations } from './components/ManageReservations'
import { Button } from './components/ui/button'
import { Plus, MapPin, Calendar, Users, CheckCircle } from 'lucide-react'
import { searchStorageSpaces, SearchFilters, createBooking, createStorageSpace, ensureProfile } from './lib/database'
import { StorageSpace } from './lib/supabase'

interface AppStorageSpace {
  id: string
  hostId: string
  title: string
  description: string
  campus: string
  address: string
  storageType: string
  sizeCategory: string
  pricePerMonth: number
  availableFrom: string
  availableUntil: string
  capacityDescription: string
  amenities: string[]
  images: string[]
  hostName: string
  rating: number
  reviewCount: number
}

// Helper function to transform Supabase data to App format
const transformStorageSpace = (space: StorageSpace): AppStorageSpace => ({
  id: space.id,
  hostId: space.host_id,
  title: space.title,
  description: space.description,
  campus: space.host?.university || 'Baylor University',
  address: space.location_address,
  storageType: space.storage_type,
  sizeCategory: space.size_category,
  pricePerMonth: space.price_per_month,
  availableFrom: space.available_from,
  availableUntil: space.available_until,
  capacityDescription: space.capacity_description || '',
  amenities: space.amenities,
  images: space.images,
  hostName: space.host?.full_name || 'Unknown Host',
  rating: space.host?.rating || 0,
  reviewCount: space.host?.total_reviews || 0
})

type ViewType = 'homepage' | 'search' | 'list-space' | 'storage-details' | 'booking-confirmation' | 'booking-success' | 'manage-listings' | 'manage-reservations' | 'listing-success'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('homepage')
  const [selectedSpace, setSelectedSpace] = useState<AppStorageSpace | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [storageSpaces, setStorageSpaces] = useState<AppStorageSpace[]>([])
  const [filteredSpaces, setFilteredSpaces] = useState<AppStorageSpace[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    campus: '',
    startDate: '',
    endDate: '',
    storageType: 'any',
    priceRange: [0, 200],
    sizeCategory: 'any'
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadStorageSpaces = async () => {
    try {
      setSearchLoading(true)
      const result = await searchStorageSpaces({}, 1, 50) // Load first 50 spaces
      const transformedSpaces = result.spaces.map(transformStorageSpace)
      setStorageSpaces(transformedSpaces)
      setFilteredSpaces(transformedSpaces)
    } catch (error) {
      console.error('Error loading storage spaces:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  // Load initial storage spaces
  useEffect(() => {
    if (user) {
      loadStorageSpaces()
    }
  }, [user])

  const performSearch = async (filters: SearchFilters) => {
    try {
      setSearchLoading(true)
      const result = await searchStorageSpaces(filters, 1, 50)
      const transformedSpaces = result.spaces.map(transformStorageSpace)
      setFilteredSpaces(transformedSpaces)
    } catch (error) {
      console.error('Error searching storage spaces:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return

    // Convert app filters to database filters
    const dbFilters: SearchFilters = {
      university: searchFilters.campus || 'Baylor University',
      storageType: searchFilters.storageType !== 'any' ? searchFilters.storageType : undefined,
      sizeCategory: searchFilters.sizeCategory !== 'any' ? searchFilters.sizeCategory : undefined,
      minPrice: searchFilters.priceRange[0],
      maxPrice: searchFilters.priceRange[1],
      startDate: searchFilters.startDate,
      endDate: searchFilters.endDate
    }

    performSearch(dbFilters)
  }, [searchFilters, user])

  // Handler functions
  const handleListSpace = async (spaceData: any) => {
    try {
      if (!user) return
      
      // Ensure user profile exists
      await ensureProfile(user)
      
      const storageSpaceData = {
        host_id: user.id,
        title: spaceData.title,
        description: spaceData.description,
        storage_type: spaceData.storageType,
        size_category: spaceData.sizeCategory,
        capacity_description: spaceData.capacityDescription || '',
        price_per_month: spaceData.pricePerMonth,
        location_address: spaceData.locationAddress,
        campus_area: spaceData.campusArea || '',
        available_from: spaceData.availableFrom,
        available_until: spaceData.availableUntil,
        amenities: spaceData.amenities || [],
        rules: spaceData.rules || '',
        images: spaceData.images || [],
        can_help_move: spaceData.canHelpMove || false,
        has_vehicle: spaceData.hasVehicle || false,
        vehicle_type: spaceData.vehicleType || '',
        move_in_time: spaceData.moveInTime || '',
        move_out_time: spaceData.moveOutTime || ''
      }
      
      console.log('Submitting storage space data:', storageSpaceData)
      await createStorageSpace(storageSpaceData)
      setCurrentView('listing-success')
      loadStorageSpaces() // Refresh the list
    } catch (error) {
      console.error('Error creating storage space:', error)
      alert(`Error creating storage space: ${error.message}. Please try again.`)
    }
  }

  const handleViewDetails = (space: AppStorageSpace) => {
    setSelectedSpace(space)
    setCurrentView('storage-details')
  }

  const handleBookSpace = (bookingInfo: any) => {
    setBookingData(bookingInfo)
    setCurrentView('booking-confirmation')
  }

  const handleConfirmBooking = async (finalBookingData: any) => {
    try {
      if (!user || !selectedSpace) return
      
      const bookingInfo = {
        storage_space_id: selectedSpace.id,
        renter_id: user.id,
        host_id: selectedSpace.hostId,
        start_date: finalBookingData.startDate,
        end_date: finalBookingData.endDate,
        total_price: finalBookingData.totalPrice,
        status: 'confirmed' as const,
        special_requests: finalBookingData.specialRequests
      }
      
      await createBooking(bookingInfo)
      setCurrentView('booking-success')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Error creating booking. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">StowBnb</h1>
            <p className="text-gray-700">Find secure storage space from fellow students on your campus</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-sm text-gray-800">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              Perfect for summer breaks & semester transitions
            </div>
            <div className="flex items-center text-sm text-gray-800">
              <Users className="w-4 h-4 mr-2 text-primary" />
              Student-to-student trusted community
            </div>
            <div className="flex items-center text-sm text-gray-800">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              On-campus and nearby locations
            </div>
          </div>

          <Button 
            onClick={() => blink.auth.login()} 
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium shadow-lg"
          >
            Sign In to Get Started
          </Button>
        </div>
      </div>
    )
  }

  // Render different views based on current state
  if (currentView === 'homepage') {
    return (
      <Homepage 
        onListSpace={() => setCurrentView('list-space')}
        onBookSpace={() => setCurrentView('search')}
        onManageListings={() => setCurrentView('manage-listings')}
        onManageReservations={() => setCurrentView('manage-reservations')}
      />
    )
  }

  if (currentView === 'list-space') {
    return (
      <div className="min-h-screen bg-background">
        <ListSpaceForm 
          onSubmit={handleListSpace}
          onCancel={() => setCurrentView('homepage')}
        />
      </div>
    )
  }

  if (currentView === 'storage-details' && selectedSpace) {
    return (
      <div className="min-h-screen bg-background">
        <StorageDetails 
          space={selectedSpace}
          onBack={() => setCurrentView('search')}
          onBook={handleBookSpace}
        />
      </div>
    )
  }

  if (currentView === 'booking-confirmation' && selectedSpace && bookingData) {
    return (
      <div className="min-h-screen bg-background">
        <BookingConfirmation 
          bookingData={bookingData}
          space={selectedSpace}
          onBack={() => setCurrentView('storage-details')}
          onConfirm={handleConfirmBooking}
        />
      </div>
    )
  }

  if (currentView === 'booking-success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your storage space has been reserved. You can manage your reservations anytime.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setCurrentView('manage-reservations')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View My Reservations
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setCurrentView('homepage')
                setSelectedSpace(null)
                setBookingData(null)
              }}
              className="w-full"
            >
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'listing-success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Listing Created!</h1>
          <p className="text-gray-600 mb-8">
            Your storage space is now live and available for booking. You can manage your listings anytime.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setCurrentView('manage-listings')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Manage My Listings
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentView('homepage')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'manage-listings') {
    return (
      <div className="min-h-screen bg-background">
        <ManageListings 
          user={user}
          onBack={() => setCurrentView('homepage')}
        />
      </div>
    )
  }

  if (currentView === 'manage-reservations') {
    return (
      <div className="min-h-screen bg-background">
        <ManageReservations 
          user={user}
          onBack={() => setCurrentView('homepage')}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-white/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setCurrentView('homepage')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">StowBnb</h1>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center space-x-2 border-primary/20 text-gray-800 hover:bg-primary hover:text-white"
                onClick={() => setCurrentView('list-space')}
              >
                <Plus className="w-4 h-4" />
                <span>List Your Space</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex text-gray-700 hover:text-gray-900"
                onClick={() => setCurrentView('manage-listings')}
              >
                My Listings
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex text-gray-700 hover:text-gray-900"
                onClick={() => setCurrentView('manage-reservations')}
              >
                My Reservations
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-800">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => blink.auth.logout()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar 
            onSearch={(filters) => setSearchFilters(prev => ({ ...prev, ...filters }))}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterPanel 
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchLoading ? 'Searching...' : `${filteredSpaces.length} storage spaces available`}
              </h2>
              <select className="glass-card border border-white/30 rounded-lg px-3 py-2 text-sm text-gray-800">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Distance</option>
              </select>
            </div>

            {searchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => (
                  <StorageCard 
                    key={space.id} 
                    space={space} 
                    onViewDetails={() => handleViewDetails(space)}
                  />
                ))}
              </div>
            )}

            {!searchLoading && filteredSpaces.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No storage spaces found</h3>
                <p className="text-gray-700">Try adjusting your search criteria or check back later for new listings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App