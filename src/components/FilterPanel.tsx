import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Slider } from './ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { X } from 'lucide-react'

interface FilterPanelProps {
  filters: {
    campus: string
    startDate: string
    endDate: string
    storageType: string
    priceRange: number[]
    sizeCategory: string
  }
  onFiltersChange: (filters: any) => void
}

const storageTypes = [
  { value: 'dorm_room', label: 'Dorm Room' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'garage', label: 'Garage' },
  { value: 'closet', label: 'Closet' },
  { value: 'basement', label: 'Basement' }
]

const sizeCategories = [
  { value: 'small', label: 'Small (1-3 boxes)' },
  { value: 'medium', label: 'Medium (4-8 boxes)' },
  { value: 'large', label: 'Large (9+ boxes)' },
  { value: 'extra_large', label: 'Extra Large (Furniture)' }
]

const amenities = [
  { id: 'climate_controlled', label: 'Climate Controlled' },
  { id: 'secure_access', label: 'Secure Access' },
  { id: '24_7_access', label: '24/7 Access' },
  { id: 'drive_up_access', label: 'Drive-up Access' },
  { id: 'covered', label: 'Covered Storage' },
  { id: 'easy_access', label: 'Easy Access' }
]

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      campus: '',
      startDate: '',
      endDate: '',
      storageType: 'any',
      priceRange: [0, 200],
      sizeCategory: 'any'
    })
  }

  const hasActiveFilters = (filters.storageType && filters.storageType !== 'any') || 
    (filters.sizeCategory && filters.sizeCategory !== 'any') || 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 200

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={200}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+ per month</span>
          </div>
        </CardContent>
      </Card>

      {/* Storage Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Storage Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={filters.storageType} 
            onValueChange={(value) => updateFilter('storageType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any type</SelectItem>
              {storageTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Size Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Storage Size</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={filters.sizeCategory} 
            onValueChange={(value) => updateFilter('sizeCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any size</SelectItem>
              {sizeCategories.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox 
                id={amenity.id}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label 
                htmlFor={amenity.id} 
                className="text-sm text-gray-700 cursor-pointer"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Instant Book */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Booking Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="instant_book"
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label 
              htmlFor="instant_book" 
              className="text-sm text-gray-700 cursor-pointer"
            >
              Instant Book Available
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified_host"
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label 
              htmlFor="verified_host" 
              className="text-sm text-gray-700 cursor-pointer"
            >
              Verified Student Host
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}