import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Star, MapPin, Calendar, Package, User, Wifi, Lock, Clock } from 'lucide-react'

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
}

interface StorageCardProps {
  space: StorageSpace
  onViewDetails?: () => void
}

const storageTypeLabels = {
  dorm_room: 'Dorm Room',
  apartment: 'Apartment',
  garage: 'Garage',
  closet: 'Closet',
  basement: 'Basement'
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

export function StorageCard({ space, onViewDetails }: StorageCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={space.images[0]}
          alt={space.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {storageTypeLabels[space.storageType as keyof typeof storageTypeLabels]}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-white">
            {sizeLabels[space.sizeCategory as keyof typeof sizeLabels]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{space.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">{space.campus}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{space.rating}</span>
            <span className="text-sm text-gray-500">({space.reviewCount})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{space.description}</p>

        {/* Capacity */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-3 h-3 mr-1" />
            <span>{space.capacityDescription}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              {formatDate(space.availableFrom)} - {formatDate(space.availableUntil)}
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {space.amenities.slice(0, 3).map((amenity) => {
              const amenityInfo = amenityIcons[amenity as keyof typeof amenityIcons]
              if (!amenityInfo) return null
              
              return (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenityInfo.label}
                </Badge>
              )
            })}
            {space.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{space.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Host */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">{space.hostName}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${space.pricePerMonth}</span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}