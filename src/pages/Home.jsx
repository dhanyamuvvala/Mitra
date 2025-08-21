import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useStats } from '../contexts/StatsContext'
import { 
  Shield, 
  Star, 
  MessageSquare, 
  MapPin, 
  Search, 
  Zap,
  Store,
  Truck,
  Users,
  Award,
  CheckCircle,
  DollarSign,
  Clock,
  Leaf,
  TrendingUp,
  Globe
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const { stats } = useStats()

  const features = [
    {
      icon: CheckCircle,
      title: '✅ Verified Suppliers',
      description: 'All suppliers are FSSAI verified and background checked for quality assurance'
    },
    {
      icon: DollarSign,
      title: '💰 Best Prices',
      description: 'Competitive pricing with smart bargaining tools to get the best deals'
    },
    {
      icon: Truck,
      title: '🚚 Quick Delivery',
      description: 'Fast and reliable delivery with real-time tracking across India'
    },
    {
      icon: Leaf,
      title: '🌱 Organic Options',
      description: 'Wide selection of certified organic produce directly from farmers'
    }
  ]

  const statsData = [
    { number: stats.verifiedSuppliers, label: 'Verified Suppliers' },
    { number: stats.activeVendors, label: 'Active Vendors' },
    { number: stats.citiesCovered, label: 'Cities Covered' },
    { number: stats.averageRating.toFixed(1), label: 'Average Rating' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-red-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-yellow-400 text-green-900 rounded-full text-sm font-semibold mb-4">
                🌱 Farm to Table Excellence
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Connect with <span className="text-yellow-300">Trusted</span><br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Food Suppliers
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              🥬 Find verified suppliers, negotiate prices, and streamline your food supply chain with fresh, quality produce
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/find-items" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    🛒 Browse Items
                  </Link>
                  <Link to="/suppliers" className="bg-white text-green-700 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    🔍 Find Suppliers
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    🚀 Get Started
                  </Link>
                  <Link to="/login" className="bg-white text-green-700 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    👤 Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Vendor Mitra?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your food supply chain operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const colors = [
                'from-green-500 to-emerald-600',
                'from-yellow-500 to-orange-500', 
                'from-blue-500 to-indigo-600',
                'from-purple-500 to-pink-600'
              ]
              return (
                <div key={index} className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-20 h-20 bg-gradient-to-r ${colors[index]} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏆 Trusted by Thousands Across India
            </h2>
            <p className="text-xl text-gray-600">
              Join our growing community of successful food suppliers and vendors
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Active Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Happy Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-gray-600 font-medium">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">4.8⭐</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="text-center">
            <p className="text-gray-500 mb-6 font-medium">Trusted Partners & Suppliers</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-bold text-green-600">🥬 Fresh Farms</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-bold text-orange-600">🍅 Organic Valley</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-bold text-blue-600">🐟 Sea Fresh</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-bold text-purple-600">🌾 Grain Masters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-gray-600">
              Choose your path and start connecting with the food supply chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <Link to="/find-items" className="group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
  {/* Add your icon content here */}
</div>
                <h3 className="text-2xl font-bold mb-2">Find Items</h3>
                <p className="text-purple-100">
                  Search for supplies and items across all categories
                </p>
              </div>
            </Link>

            <Link to="/suppliers" className="group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {/* Add your icon content here */}
                </div>
                <h3 className="text-2xl font-bold mb-2">Find Nearby Suppliers</h3>
                <p className="text-blue-100">
                  Discover verified suppliers in your area with advanced filtering
                </p>
              </div>
            </Link>

            <Link to="/flash-sales" className="group">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-8 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
                <Zap className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold mb-2">Flash Sales</h3>
                <p className="text-yellow-100">
                  Grab time-limited offers and special deals from suppliers
                </p>
              </div>
            </Link>

            <Link to="/organic" className="group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
                <Store className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold mb-2">Organic Marketplace</h3>
                <p className="text-green-100">
                  Connect directly with farmers for organic produce
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>


      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest events and opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-yellow-500 text-white p-4">
                <div className="text-sm font-medium">Flash Sale Ending</div>
                <div className="text-2xl font-bold">2 hours left</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Organic Tomatoes Sale</h3>
                <p className="text-gray-600 mb-4">Get fresh organic tomatoes at 30% discount from Farmer Priya</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location: Mumbai</span>
                  <Link to="/flash-sales" className="btn-primary text-sm">
                    View Sale
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-green-500 text-white p-4">
                <div className="text-sm font-medium">New Supplier</div>
                <div className="text-2xl font-bold">Available</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Fresh Farms Partnership</h3>
                <p className="text-gray-600 mb-4">New organic supplier joined - 5km away from your location</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location: Pune</span>
                  <Link to="/suppliers" className="btn-primary text-sm">
                    Find Suppliers
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-purple-500 text-white p-4">
                <div className="text-sm font-medium">Special Event</div>
                <div className="text-2xl font-bold">This Week</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Farmer's Market Day</h3>
                <p className="text-gray-600 mb-4">Direct from farmers event - fresh produce at wholesale prices</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location: Nashik</span>
                  <Link to="/organic" className="btn-primary text-sm">
                    Join Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of vendors and suppliers who trust Vendor Mitra for their food supply needs
          </p>
          {!user && (
            <Link to="/register" className="btn-secondary text-lg px-8 py-3">
              Start Your Journey
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home 