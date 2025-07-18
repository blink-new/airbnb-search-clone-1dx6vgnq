import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Package, 
  CreditCard,
  ArrowLeft,
  MessageCircle
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

interface BookingData {
  storageSpaceId: string
  startDate: string
  endDate: string
  totalPrice: number
  specialRequests: string
}

interface StorageSpace {
  id: string
  title: string
  description: string
  campus: string
  address: string
  storageType: string
  sizeCategory: string
  pricePerMonth: number
  images: string[]
  hostName: string
  rating: number
  reviewCount: number
}

interface BookingConfirmationProps {
  bookingData: BookingData
  space: StorageSpace
  onBack: () => void
  onConfirm: (finalBookingData: BookingData) => void
}

const storageTypeLabels = {
  dorm_room: 'Dorm Room',
  apartment: 'Apartment',
  garage: 'Garage',
  closet: 'Closet',
  basement: 'Basement',
  storage_unit: 'Storage Unit'
}

export function BookingConfirmation({ bookingData, space, onBack, onConfirm }: BookingConfirmationProps) {
  const [specialRequests, setSpecialRequests] = useState(bookingData.specialRequests)
  const [isProcessing, setIsProcessing] = useState(false)

  const startDate = new Date(bookingData.startDate)
  const endDate = new Date(bookingData.endDate)
  const days = differenceInDays(endDate, startDate)
  const months = Math.ceil(days / 30)

  const handleConfirm = async () => {
    setIsProcessing(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const finalBookingData = {
      ...bookingData,
      specialRequests
    }
    
    onConfirm(finalBookingData)
    setIsProcessing(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center space-x-2"
        disabled={isProcessing}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Details</span>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Booking</h1>
        <p className="text-gray-600">Review your booking details before confirming</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Storage Space Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Storage Space</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <img
                  src={space.images[0]}
                  alt={space.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{space.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{space.campus}</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {storageTypeLabels[space.storageType as keyof typeof storageTypeLabels]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Booking Period</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Check-in</div>
                  <div className="text-lg font-semibold">{format(startDate, 'EEEE, MMMM d, yyyy')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Check-out</div>
                  <div className="text-lg font-semibold">{format(endDate, 'EEEE, MMMM d, yyyy')}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total duration: <span className="font-medium">{days} days ({months} month{months > 1 ? 's' : ''})</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Host Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Host</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {space.hostName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{space.hostName}</h3>
                  <div className="text-sm text-gray-600">
                    {space.rating} ⭐ • {space.reviewCount} reviews
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special requests or notes for your host? (optional)"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="min-h-[100px]"
                disabled={isProcessing}
              />
              <p className="text-sm text-gray-500 mt-2">
                Let your host know about any specific needs or questions you have.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Monthly rate:</span>
                    <span>${space.pricePerMonth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>{months} month{months > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service fee:</span>
                    <span>$0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free cancellation for 48 hours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>24/7 customer support</span>
                  </div>
                </div>

                <Button 
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Confirm & Pay'
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By confirming, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}