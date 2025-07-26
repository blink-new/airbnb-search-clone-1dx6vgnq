import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { MapPin, Shield, Clock, DollarSign, Users, Star, ArrowRight, CheckCircle } from 'lucide-react'

interface HomepageProps {
  onListSpace: () => void
  onBookSpace: () => void
  onManageListings: () => void
  onManageReservations: () => void
}

export function Homepage({ onListSpace, onBookSpace, onManageListings, onManageReservations }: HomepageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Student Storage,
              <span className="text-primary block">Simplified</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Connect with fellow students to find secure, affordable storage space on campus. 
              Perfect for semester breaks, moves, and everything in between.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg shadow-lg"
                onClick={onBookSpace}
              >
                Find Storage Space
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary hover:text-white shadow-lg"
                onClick={onListSpace}
              >
                List Your Space
              </Button>
            </div>

            {/* Quick Access Links */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-primary"
                onClick={onManageReservations}
              >
                View My Reservations
              </Button>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-primary"
                onClick={onManageListings}
              >
                Manage My Listings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-amber-50/30 to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How StowBnb Works
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Simple, secure, and student-friendly storage solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="text-center p-8 glass-card border-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Search & Browse</h3>
                <p className="text-gray-700">
                  Find storage spaces near your campus. Filter by size, price, and amenities to find the perfect match.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center p-8 glass-card border-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Connect & Book</h3>
                <p className="text-gray-700">
                  Message verified student hosts, ask questions, and book your storage space with confidence.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center p-8 glass-card border-white/30">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Store & Relax</h3>
                <p className="text-gray-700">
                  Drop off your items and enjoy peace of mind knowing your belongings are safe with fellow students.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose StowBnb?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Built by students, for students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Affordable Rates</h3>
              <p className="text-gray-700 text-sm">
                Student-friendly pricing that won't break the bank
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Students</h3>
              <p className="text-gray-700 text-sm">
                All hosts are verified university students
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Terms</h3>
              <p className="text-gray-700 text-sm">
                Short-term and long-term storage options available
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Campus Locations</h3>
              <p className="text-gray-700 text-sm">
                Storage spaces right on or near your campus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-amber-50/30 to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-700">Storage Spaces</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-700">Universities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9</div>
              <div className="text-gray-700 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary mr-1 fill-current" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-100/50 to-orange-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of students who trust StowBnb for their storage needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg shadow-lg"
              onClick={onBookSpace}
            >
              Find Storage Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary hover:text-white shadow-lg"
              onClick={onListSpace}
            >
              Earn Money Hosting
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}