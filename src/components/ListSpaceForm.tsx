import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Badge } from './ui/badge'
import { Upload, Calendar as CalendarIcon, DollarSign, MapPin, Package, X, Info } from 'lucide-react'
import { format } from 'date-fns'

interface ListSpaceFormProps {
  onSubmit: (spaceData: any) => void
  onCancel: () => void
}

const storageTypes = [
  { value: 'dorm_room', label: 'Dorm Room', suggestedPrice: [30, 80] },
  { value: 'apartment', label: 'Apartment', suggestedPrice: [50, 150] },
  { value: 'garage', label: 'Garage', suggestedPrice: [80, 200] },
  { value: 'closet', label: 'Closet', suggestedPrice: [20, 60] },
  { value: 'basement', label: 'Basement', suggestedPrice: [60, 120] },
  { value: 'storage_unit', label: 'Storage Unit', suggestedPrice: [40, 100] }
]

const sizeCategories = [
  { value: 'small', label: 'Small', description: 'Few boxes, personal items' },
  { value: 'medium', label: 'Medium', description: 'Dorm room contents, furniture' },
  { value: 'large', label: 'Large', description: 'Apartment contents, large furniture' },
  { value: 'extra_large', label: 'Extra Large', description: 'Multiple rooms, vehicles' }
]

const amenityOptions = [
  { id: 'climate_controlled', label: 'Climate Controlled' },
  { id: 'secure_access', label: 'Secure Access' },
  { id: '24_7_access', label: '24/7 Access' },
  { id: 'drive_up_access', label: 'Drive-up Access' },
  { id: 'secure_lock', label: 'Secure Lock' },
  { id: 'covered', label: 'Covered' },
  { id: 'easy_access', label: 'Easy Access' },
  { id: 'dry_storage', label: 'Dry Storage' },
  { id: 'pest_control', label: 'Pest Control' }
]

const colleges = [
  'Baylor University',
  'University of Texas at Austin',
  'Texas A&M University',
  'Rice University',
  'Texas Tech University',
  'University of Houston',
  'Texas Christian University',
  'Southern Methodist University',
  'Texas State University',
  'University of North Texas'
]

export function ListSpaceForm({ onSubmit, onCancel }: ListSpaceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    storageType: '',
    sizeCategory: '',
    capacityDescription: '',
    pricePerMonth: '',
    locationAddress: '',
    campusArea: '',
    university: 'Baylor University',
    availableFrom: undefined as Date | undefined,
    availableUntil: undefined as Date | undefined,
    amenities: [] as string[],
    rules: '',
    images: [] as string[],
    canHelpMove: false,
    hasVehicle: false,
    vehicleType: '',
    moveInTime: '',
    moveOutTime: ''
  })

  const [suggestedPriceRange, setSuggestedPriceRange] = useState<[number, number] | null>(null)

  const handleStorageTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, storageType: value }))
    const selectedType = storageTypes.find(type => type.value === value)
    if (selectedType) {
      setSuggestedPriceRange(selectedType.suggestedPrice as [number, number])
    }
  }

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenityId]
        : prev.amenities.filter(id => id !== amenityId)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const spaceData = {
      ...formData,
      pricePerMonth: parseFloat(formData.pricePerMonth),
      availableFrom: formData.availableFrom ? format(formData.availableFrom, 'yyyy-MM-dd') : '',
      availableUntil: formData.availableUntil ? format(formData.availableUntil, 'yyyy-MM-dd') : '',
      images: formData.images.length > 0 ? formData.images : [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ]
    }
    
    onSubmit(spaceData)
  }

  const isFormValid = formData.title && formData.description && formData.storageType && 
                     formData.sizeCategory && formData.pricePerMonth && formData.locationAddress &&
                     formData.availableFrom && formData.availableUntil

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-amber-50/30 to-orange-50/30 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Storage Space</h1>
        <p className="text-gray-700">Share your extra space with fellow students and earn money</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Package className="w-5 h-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Spacious Dorm Room Storage"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your storage space, what can be stored, any special features..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Storage Type *</Label>
                <Select value={formData.storageType} onValueChange={handleStorageTypeChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select storage type" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Size Category *</Label>
                <Select value={formData.sizeCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, sizeCategory: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeCategories.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        <div>
                          <div className="font-medium">{size.label}</div>
                          <div className="text-sm text-gray-500">{size.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="capacity">Capacity Description</Label>
              <Input
                id="capacity"
                placeholder="e.g., Fits 10-15 boxes or small furniture"
                value={formData.capacityDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, capacityDescription: e.target.value }))}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <MapPin className="w-5 h-5" />
              <span>Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>University *</Label>
              <Select value={formData.university} onValueChange={(value) => setFormData(prev => ({ ...prev, university: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college} value={college}>
                      {college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="e.g., 123 University Dr, Waco, TX 76798"
                value={formData.locationAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, locationAddress: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="campus-area">Campus Area</Label>
              <Input
                id="campus-area"
                placeholder="e.g., North Campus, Greek Life Area"
                value={formData.campusArea}
                onChange={(e) => setFormData(prev => ({ ...prev, campusArea: e.target.value }))}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <DollarSign className="w-5 h-5" />
              <span>Pricing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="price">Price per Month *</Label>
              {suggestedPriceRange && (
                <div className="flex items-center space-x-2 mt-1 mb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-600">
                    Suggested range: ${suggestedPriceRange[0]} - ${suggestedPriceRange[1]} per month
                  </span>
                </div>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.pricePerMonth}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerMonth: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <CalendarIcon className="w-5 h-5" />
              <span>Availability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Available From *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      {formData.availableFrom ? format(formData.availableFrom, 'PPP') : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.availableFrom}
                      onSelect={(date) => setFormData(prev => ({ ...prev, availableFrom: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Available Until *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      {formData.availableUntil ? format(formData.availableUntil, 'PPP') : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.availableUntil}
                      onSelect={(date) => setFormData(prev => ({ ...prev, availableUntil: date }))}
                      disabled={(date) => date < (formData.availableFrom || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Move Assistance */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Package className="w-5 h-5" />
              <span>Move Assistance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="can-help-move"
                  checked={formData.canHelpMove}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, canHelpMove: checked as boolean }))}
                />
                <Label htmlFor="can-help-move">I can help with moving items</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-vehicle"
                  checked={formData.hasVehicle}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasVehicle: checked as boolean }))}
                />
                <Label htmlFor="has-vehicle">I have a vehicle available</Label>
              </div>

              {formData.hasVehicle && (
                <div>
                  <Label>Vehicle Type</Label>
                  <Select value={formData.vehicleType} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="pickup_truck">Pickup Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="moving_truck">Moving Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="move-out-time">Typical Move-Out Time</Label>
                <Input
                  id="move-out-time"
                  placeholder="e.g., End of Spring Semester (May)"
                  value={formData.moveOutTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, moveOutTime: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="move-in-time">Typical Move-In Time</Label>
                <Input
                  id="move-in-time"
                  placeholder="e.g., Start of Fall Semester (August)"
                  value={formData.moveInTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, moveInTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenityOptions.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={formData.amenities.includes(amenity.id)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                  />
                  <Label htmlFor={amenity.id} className="text-sm">
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900">Rules & Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any specific rules or guidelines for renters (e.g., no food items, access hours, etc.)"
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Upload className="w-5 h-5" />
              <span>Photos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload photos of your storage space</p>
              <p className="text-sm text-gray-500">For now, we'll use a default image. Photo upload coming soon!</p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            List My Space
          </Button>
        </div>
      </form>
    </div>
  )
}