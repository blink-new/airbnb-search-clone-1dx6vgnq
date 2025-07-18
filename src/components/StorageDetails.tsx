import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  Star, 
  MapPin, 
  Calendar as CalendarIcon, 
  Package, 
  User, 
  Wifi, 
  Lock, 
  Clock,
  ArrowLeft,
  MessageCircle,
  Shield,
  CheckCircle
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

interface StorageSpace {
  id: string
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
  rules?: string
}

interface StorageDetailsProps {
  space: StorageSpace
  onBack: () => void
  onBook: (bookingData: any) => void
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

const amenityIcons = {
  climate_controlled: { icon: Wifi, label: 'Climate Controlled' },
  secure_access: { icon: Lock, label: 'Secure Access' },
  '24_7_access': { icon: Clock, label: '24/7 Access' },
  drive_up_access: { icon: Package, label: 'Drive-up Access' },
  secure_lock: { icon: Lock, label: 'Secure Lock' },
  covered: { icon: Package, label: 'Covered' },
  easy_access: { icon: Package, label: 'Easy Access' },
  dry_storage: { icon: Package, label: 'Dry Storage' },
  pest_control: { icon: Package, label: 'Pest Control' }
}

export function StorageDetails({ space, onBack, onBook }: StorageDetailsProps) {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>()
  const [selectedEndDate, setSelectedEndDate] = useState<Date>()
  const [totalPrice, setTotalPrice] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const days = differenceInDays(selectedEndDate, selectedStartDate)
      const months = Math.ceil(days / 30)
      setTotalPrice(months * space.pricePerMonth)
    }
  }, [selectedStartDate, selectedEndDate, space.pricePerMonth])

  const handleBooking = () => {
    if (!selectedStartDate || !selectedEndDate) return

    const bookingData = {
      storageSpaceId: space.id,
      startDate: format(selectedStartDate, 'yyyy-MM-dd'),
      endDate: format(selectedEndDate, 'yyyy-MM-dd'),
      totalPrice,
      specialRequests: ''
    }

    onBook(bookingData)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isBookingValid = selectedStartDate && selectedEndDate && totalPrice > 0

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search</span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src={space.images[currentImageIndex]}
                alt={space.title}
                className="w-full h-full object-cover"
              />
            </div>
            {space.images.length > 1 && (
              <div className="flex space-x-2 mt-4">
                {space.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Basic Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{space.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{space.campus}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{space.rating}</span>
                    <span>({space.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">${space.pricePerMonth}</div>
                <div className="text-gray-600">per month</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {storageTypeLabels[space.storageType as keyof typeof storageTypeLabels]}
              </Badge>
              <Badge variant="outline">
                {sizeLabels[space.sizeCategory as keyof typeof sizeLabels]}
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </Badge>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About this space</h2>
              <p className="text-gray-700 leading-relaxed">{space.description}</p>
              
              {space.capacityDescription && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Storage Capacity</span>
                  </div>
                  <p className="text-gray-700">{space.capacityDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {space.amenities.map((amenity) => {
                  const amenityInfo = amenityIcons[amenity as keyof typeof amenityIcons]
                  if (!amenityInfo) return null
                  
                  const IconComponent = amenityInfo.icon
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{amenityInfo.label}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{space.address}</span>
                </div>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p>Interactive map coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          {space.rules && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">House Rules</h2>
                <p className="text-gray-700 leading-relaxed">{space.rules}</p>
              </CardContent>
            </Card>
          )}

          {/* Host Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Meet your host</h2>
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {space.hostName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{space.hostName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{space.rating} rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span>Verified student</span>
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Host</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-gray-900">${space.pricePerMonth}</div>
                  <div className="text-gray-600">per month</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Storage Period
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {selectedStartDate ? format(selectedStartDate, 'MMM dd') : 'Start'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedStartDate}
                            onSelect={setSelectedStartDate}
                            disabled={(date) => 
                              date < new Date() || 
                              date < new Date(space.availableFrom) ||
                              date > new Date(space.availableUntil)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {selectedEndDate ? format(selectedEndDate, 'MMM dd') : 'End'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedEndDate}
                            onSelect={setSelectedEndDate}
                            disabled={(date) => 
                              date < (selectedStartDate || new Date()) ||
                              date > new Date(space.availableUntil)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center space-x-1 mb-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>Available: {formatDate(space.availableFrom)} - {formatDate(space.availableUntil)}</span>
                    </div>
                  </div>
                </div>

                {selectedStartDate && selectedEndDate && (
                  <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Storage period:</span>
                      <span>{differenceInDays(selectedEndDate, selectedStartDate)} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly rate:</span>
                      <span>${space.pricePerMonth}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={!isBookingValid}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isBookingValid ? 'Reserve Now' : 'Select Dates'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  You won't be charged yet. Review your booking details first.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}