import React, { useState, useEffect } from 'react'
import { useCart } from '../contexts/CartContext'
import { Search, Filter, Package, Star, MapPin, MessageSquare, ShoppingCart, AlertTriangle } from 'lucide-react'
import Negotiation from '../components/Bargain/Negotiation'
import ReviewSystem from '../components/Rating/ReviewSystem'
import FlashSalesDisplay from '../components/FlashSales/FlashSalesDisplay'
import { productDatabase, reviewsDatabase, bargainsDatabase, deliveriesDatabase } from '../data/userDatabase'
import { getAllSupplierProducts } from '../data/suppliersDatabase'
import realTimeSync from '../utils/realTimeSync'

const FindItems = () => {
  const { addToCart } = useCart()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [selectedItemForReview, setSelectedItemForReview] = useState(null)
  const [showReviews, setShowReviews] = useState(false)
  const [items, setItems] = useState([])
  const [bargainModal, setBargainModal] = useState({ open: false, bargain: null, item: null })
  const [bargainMessage, setBargainMessage] = useState('')
  const [bargainOffer, setBargainOffer] = useState('')
  const [filterOrganic, setFilterOrganic] = useState('all')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterSupplier, setFilterSupplier] = useState('')
  const [purchaseQuantities, setPurchaseQuantities] = useState({})
  const [stockLevels, setStockLevels] = useState({})

  // Load products from supplier database
  useEffect(() => {
    const loadProducts = () => {
      try {
        const supplierProducts = getAllSupplierProducts()
        console.log('Loaded supplier products:', supplierProducts)
        
        if (supplierProducts && supplierProducts.length > 0) {
          const transformedItems = supplierProducts.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            supplier: product.supplierName,
            supplierId: product.supplierId,
            category: product.category ? product.category.toLowerCase() : 'general',
            description: `Fresh ${product.name} from ${product.supplierName}`,
            rating: product.supplierRating || 4.5,
            reviews: Math.floor(Math.random() * 50) + 10,
            quantity: `${product.stock} ${product.unit}`,
            availableStock: product.stock || 0,
            unit: product.unit || 'kg',
            isOrganic: product.organic || false,
            isVerified: product.fssaiVerified || true,
            location: product.supplierLocation,
            deliveryTime: product.deliveryTime || '2-4 hours',
            minimumOrder: product.minimumOrder || 100
          }))
          console.log('Transformed items:', transformedItems)
          setItems(transformedItems)
          
          // Initialize stock levels and purchase quantities
          const initialStock = {}
          const initialQuantities = {}
          transformedItems.forEach(item => {
            initialStock[item.id] = item.availableStock
            initialQuantities[item.id] = 1
          })
          setStockLevels(initialStock)
          setPurchaseQuantities(initialQuantities)
        } else {
          console.log('No supplier products found')
          setItems([])
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setItems([])
      }
    }

    loadProducts()

    // Subscribe to real-time product updates
    const unsubscribeProduct = realTimeSync.subscribe('product_update', (data) => {
      console.log('Product update received:', data)
      if (data && data.action) {
        loadProducts() // Reload all products when any product changes
      }
    })

    // Subscribe to real-time bargain updates  
    const unsubscribeBargain = realTimeSync.subscribe('bargain_update', (data) => {
      console.log('Bargain update received:', data)
      if (data && data.bargain && bargainModal.open && bargainModal.bargain && bargainModal.bargain.id === data.bargain.id) {
        setBargainModal(prev => ({ ...prev, bargain: data.bargain }))
      }
    })

    return () => {
      unsubscribeProduct()
      unsubscribeBargain()
    }
  }, [])

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  // Get unique categories and suppliers
  const categories = Array.from(new Set(items.map(i => i.category)))
  const suppliers = Array.from(new Set(items.map(i => i.supplier)))

  // Apply filters including search
  const filteredItems = sortedItems.filter(item => {
    // Search filter
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && 
        !item.supplier.toLowerCase().includes(search.toLowerCase()) &&
        !item.description.toLowerCase().includes(search.toLowerCase())) return false
    
    if (filterOrganic === 'organic' && !item.isOrganic) return false
    if (filterOrganic === 'inorganic' && item.isOrganic) return false
    if (filterPriceMin && item.price < parseFloat(filterPriceMin)) return false
    if (filterPriceMax && item.price > parseFloat(filterPriceMax)) return false
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    if (filterSupplier && item.supplier !== filterSupplier) return false
    return true
  })
  
  const handleQuantityChange = (itemId, newQuantity) => {
    const availableStock = stockLevels[itemId] || 0
    const quantity = Math.max(1, parseInt(newQuantity) || 1)
    
    if (quantity > availableStock) {
      alert(`Only ${availableStock} units are available`)
      setPurchaseQuantities(prev => ({
        ...prev,
        [itemId]: availableStock
      }))
      return
    }
    
    setPurchaseQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }))
  }

  const openBargainModal = (item) => {
    // Try to find an existing bargain for this vendor/product
    const vendorId = 1 // Manya (for demo)
    let bargain = bargainsDatabase.getAllBargains().find(b => b.productId === item.id && b.vendorId === vendorId)
    if (!bargain) {
      // Create new bargain
      bargain = bargainsDatabase.addBargain({
        productId: item.id,
        productName: item.name,
        supplierId: item.supplierId || 2,
        supplierName: item.supplier,
        vendorId,
        vendorName: 'Manya',
        messages: []
      })
    }
    setBargainModal({ open: true, bargain, item })
  }

  const sendBargainMessage = () => {
    if (!bargainOffer && !bargainMessage) return
    bargainsDatabase.addMessage(bargainModal.bargain.id, {
      sender: 'vendor',
      offer: bargainOffer ? parseFloat(bargainOffer) : undefined,
      message: bargainMessage
    })
    // Refresh bargain from DB
    const updated = bargainsDatabase.getBargainById(bargainModal.bargain.id)
    setBargainModal({ ...bargainModal, bargain: updated })
    setBargainMessage('')
    setBargainOffer('')
  }

  const handleAddToCart = (item) => {
    const quantity = purchaseQuantities[item.id] || 1
    const availableStock = stockLevels[item.id] || 0
    
    if (availableStock <= 0) {
      alert('This item is out of stock!')
      return
    }
    
    if (quantity > availableStock) {
      alert(`Only ${availableStock} units are available`)
      return
    }
    
    const cartItem = {
      id: item.id,
      name: item.name,
      price: `₹${item.price}`,
      image: item.image,
      supplier: item.supplier,
      supplierId: item.supplierId,
      quantity: quantity
    }
    addToCart(cartItem)
    alert(`${quantity} ${item.unit} of ${item.name} added to cart!`)
  }

  const handleBuyNow = (item) => {
    const quantity = purchaseQuantities[item.id] || 1
    const availableStock = stockLevels[item.id] || 0
    
    if (availableStock <= 0) {
      alert('This item is out of stock!')
      return
    }
    
    if (quantity > availableStock) {
      alert(`Only ${availableStock} units are available`)
      return
    }
    
    // Decrease stock level
    const newStock = availableStock - quantity
    setStockLevels(prev => ({
      ...prev,
      [item.id]: newStock
    }))
    
    // Update the item's available stock in the items array
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { ...i, availableStock: newStock, quantity: `${newStock} ${i.unit}` }
        : i
    ))
    
    // Reset purchase quantity to 1 if stock is still available
    if (newStock > 0) {
      setPurchaseQuantities(prev => ({
        ...prev,
        [item.id]: Math.min(1, newStock)
      }))
    }
    
    // Simulate delivery creation
    deliveriesDatabase.addDelivery({
      customer: 'Manya',
      customerId: 1,
      supplier: item.supplier,
      supplierId: item.supplierId,
      products: [`${quantity} ${item.unit} of ${item.name}`],
      totalAmount: item.price * quantity,
      status: 'in-transit',
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
    
    // Emit real-time sync for stock update
    realTimeSync.emit('stock_update', {
      action: 'purchase',
      productId: item.id,
      newStock: newStock,
      quantity: quantity
    })
    
    alert(`Order placed for ${quantity} ${item.unit} of ${item.name}! Total: ₹${item.price * quantity}`)
  }

  const handleReviewSubmit = (review) => {
    alert('Handler called!');
    const reviewData = {
      productId: selectedItemForReview.id,
      productName: selectedItemForReview.name,
      supplierId: selectedItemForReview.supplierId,
      supplierName: selectedItemForReview.supplier,
      vendorId: 1, // Manya (for demo)
      vendorName: 'Manya',
      rating: review.rating,
      comment: review.comment
    }
    console.log('Submitting review:', reviewData)
    reviewsDatabase.addReview(reviewData)
    alert('Review submitted successfully!')
    setSelectedItemForReview(null)
  }

  const totalItems = filteredItems.length

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-primary-600">Find Items</h1>
      </div>

      {/* Flash Sales Display */}
      <FlashSalesDisplay onAddToCart={handleAddToCart} />

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for items, suppliers, or descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          {/* Quantity of Items beside Filter button */}
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-md px-4 py-2">
            <span className="text-sm font-medium text-gray-700">Quantity of Items:</span>
            <span className="text-lg font-bold text-blue-600">{totalItems}</span>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <select value={filterOrganic} onChange={e => setFilterOrganic(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">All Types</option>
              <option value="organic">Organic</option>
              <option value="inorganic">Inorganic</option>
            </select>
            <input type="number" placeholder="Min Price" value={filterPriceMin} onChange={e => setFilterPriceMin(e.target.value)} className="border rounded px-2 py-1 w-24" />
            <input type="number" placeholder="Max Price" value={filterPriceMax} onChange={e => setFilterPriceMax(e.target.value)} className="border rounded px-2 py-1 w-24" />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="oils">Oils</option>
              <option value="grains">Grains</option>
              <option value="grams">Grams</option>
              <option value="flours">Flours</option>
              <option value="nuts">Nuts</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">₹{item.price}/{item.unit}</div>
                        <div className={`text-sm font-medium ${
                          (stockLevels[item.id] || 0) <= 0 
                            ? 'text-red-600' 
                            : (stockLevels[item.id] || 0) < 10 
                              ? 'text-orange-600' 
                              : 'text-gray-600'
                        }`}>
                          {(stockLevels[item.id] || 0) <= 0 
                            ? 'Out of Stock' 
                            : `${stockLevels[item.id]} ${item.unit} available`
                          }
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{item.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{item.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({item.reviews})</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        by {item.supplier}
                      </div>
                    </div>



                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.isOrganic && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Organic
                        </span>
                      )}
                      {/* Only show FSSAI Verified for non-organic products */}
                      {!item.isOrganic && item.isVerified && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          FSSAI Verified
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mb-4">
                      <label className="text-sm font-medium text-gray-700">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, (purchaseQuantities[item.id] || 1) - 1)}
                          disabled={(stockLevels[item.id] || 0) <= 0 || (purchaseQuantities[item.id] || 1) <= 1}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={stockLevels[item.id] || 0}
                          value={purchaseQuantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          disabled={(stockLevels[item.id] || 0) <= 0}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1 disabled:bg-gray-100"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, (purchaseQuantities[item.id] || 1) + 1)}
                          disabled={(stockLevels[item.id] || 0) <= 0 || (purchaseQuantities[item.id] || 1) >= (stockLevels[item.id] || 0)}
                          className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                        <span className="text-sm text-gray-600">{item.unit}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                          (stockLevels[item.id] || 0) <= 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        onClick={() => handleAddToCart(item)}
                        disabled={(stockLevels[item.id] || 0) <= 0}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {(stockLevels[item.id] || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <button 
                        className="btn-secondary flex items-center gap-1"
                        onClick={() => openBargainModal(item)}
                        disabled={(stockLevels[item.id] || 0) <= 0}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Bargain
                      </button>

                      <button 
                        className="btn-secondary flex items-center gap-1"
                        onClick={() => setSelectedItemForReview(item)}
                      >
                        <Star className="w-4 h-4" />
                        Reviews
                      </button>
                    </div>
                    
                    <button 
                      className={`w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                        (stockLevels[item.id] || 0) <= 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      onClick={() => handleBuyNow(item)}
                      disabled={(stockLevels[item.id] || 0) <= 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {(stockLevels[item.id] || 0) <= 0 ? 'Out of Stock' : `Buy Now - ₹${item.price * (purchaseQuantities[item.id] || 1)}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Negotiation Panel */}
          {showNegotiation && selectedItem && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Bargain with {selectedItem.supplier}
              </h3>
              <Negotiation 
                initialOffer={selectedItem.price} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Review System Modal */}
      {selectedItemForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reviews for {selectedItemForReview.name}</h3>
              <button
                onClick={() => setSelectedItemForReview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ReviewSystem
              itemId={selectedItemForReview.id}
              itemName={selectedItemForReview.name}
              currentRating={0}
              currentReviews={[]}
              onReviewSubmit={handleReviewSubmit}
            />
          </div>
        </div>
      )}

      {bargainModal.open && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bargain Chat for {bargainModal.item.name}</h3>
              <button onClick={() => setBargainModal({ open: false, bargain: null, item: null })} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="mb-4 h-64 overflow-y-auto border rounded p-2 bg-gray-50">
              {bargainModal.bargain.messages.length === 0 ? (
                <div className="text-gray-400 text-center">No messages yet. Start the bargain!</div>
              ) : (
                bargainModal.bargain.messages.map((msg, idx) => (
                  <div key={idx} className={`mb-2 ${msg.sender === 'vendor' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'vendor' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      <div className="text-xs text-gray-500 mb-1">{msg.sender === 'vendor' ? 'You' : bargainModal.bargain.supplierName}</div>
                      {msg.offer !== undefined && <div className="font-bold">Offer: ₹{msg.offer}</div>}
                      {msg.message && <div>{msg.message}</div>}
                      <div className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <input type="number" placeholder="Offer (₹)" value={bargainOffer} onChange={e => setBargainOffer(e.target.value)} className="flex-1 border rounded p-2" />
              <input type="text" placeholder="Message" value={bargainMessage} onChange={e => setBargainMessage(e.target.value)} className="flex-1 border rounded p-2" />
              <button onClick={sendBargainMessage} className="btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindItems