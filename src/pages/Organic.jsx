import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { Search, Filter, Store, Star, MapPin, MessageSquare } from 'lucide-react'
import Negotiation from '../components/Bargain/Negotiation'
import ReviewSystem from '../components/Rating/ReviewSystem'
import { productDatabase } from '../data/userDatabase'

// Filter only organic products and transform to match the expected format - but set to empty for manual addition
const mockProducts = []

const Organic = () => {
  const { addToCart } = useCart()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [selectedProductForReview, setSelectedProductForReview] = useState(null)
  const [showReviews, setShowReviews] = useState(false)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(200)
  const [minRating, setMinRating] = useState(0)
  const [organicOnly, setOrganicOnly] = useState(false)
  const [fssaiOnly, setFssaiOnly] = useState(false)

  const filteredProducts = mockProducts.filter(product => {
    const nameMatches = product.name.toLowerCase().includes(search.toLowerCase()) ||
                       product.supplier.toLowerCase().includes(search.toLowerCase())
    const priceMatches = product.price >= minPrice && product.price <= maxPrice
    const ratingMatches = product.rating >= minRating
    const organicMatches = !organicOnly || product.certifications.includes('Organic')
    const fssaiMatches = !fssaiOnly || product.certifications.includes('FSSAI')
    
    return nameMatches && priceMatches && ratingMatches && organicMatches && fssaiMatches
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })



  const startBargain = (product) => {
    setSelectedProduct(product)
    setShowNegotiation(true)
  }

  const buyNow = (product) => {
    // Add product to cart instead of direct purchase
    const cartItem = {
      id: product.id,
      name: product.name,
      price: `₹${product.price}`,
      image: product.image,
      supplier: product.supplier,
      quantity: 1
    }
    addToCart(cartItem)
    alert(`${product.name} added to cart!`)
    // Add a rating when user buys a product
    // addRating(4.5) // This would normally be based on user's actual rating
  }

  const handleReviewSubmit = (review) => {
    // Here you would typically save the review to a database
    console.log('New review submitted:', review)
  }

  const totalFarmers = new Set(mockProducts.map(p => p.supplier)).size
  const organicProducts = mockProducts.filter(p => p.certifications.includes('Organic')).length
  const avgRating = (mockProducts.reduce((sum, p) => sum + p.rating, 0) / mockProducts.length).toFixed(1)

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Store className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-primary-600">Organic Products Marketplace</h1>
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Organic Products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₹/kg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={minPrice}
                  onChange={e => setMinPrice(Number(e.target.value))}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₹/kg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="input-field"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Rating
                </label>
                <select
                  value={minRating}
                  onChange={e => setMinRating(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{product.price}/kg</div>
                      <div className="text-sm text-gray-600">{product.quantity} available</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      by {product.supplier}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.certifications.map(cert => (
                      <span key={cert} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      className="flex-1 btn-primary"
                      onClick={() => buyNow(product)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="btn-secondary flex items-center gap-1"
                      onClick={() => startBargain(product)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Bargain
                    </button>

                    <button 
                      className="btn-secondary flex items-center gap-1"
                      onClick={() => setSelectedProductForReview(product)}
                    >
                      <Star className="w-4 h-4" />
                      Reviews
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Negotiation Panel */}
          {showNegotiation && selectedProduct && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Bargain with {selectedProduct.supplier}
              </h3>
              <Negotiation 
                initialOffer={selectedProduct.price} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Review System Modal */}
      {selectedProductForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reviews for {selectedProductForReview.name}</h3>
              <button
                onClick={() => setSelectedProductForReview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ReviewSystem
              itemId={selectedProductForReview.id}
              itemName={selectedProductForReview.name}
              currentRating={0}
              currentReviews={[]}
              onReviewSubmit={handleReviewSubmit}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Organic 