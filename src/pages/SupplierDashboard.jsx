import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSearchParams } from 'react-router-dom'
import { productDatabase, flashSalesDatabase, reviewsDatabase, bargainsDatabase, deliveriesDatabase } from '../data/userDatabase'
import { getProductImage } from '../utils/productImages'
import ImageUpload from '../components/ImageUpload'
import FlashSaleTimer from '../components/FlashSales/FlashSaleTimer'
import realTimeSync from '../utils/realTimeSync'
import { 
  Package, 
  Shield, 
  MessageSquare, 
  Zap, 
  Star, 
  Truck, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Save,
  X
} from 'lucide-react'

const SupplierDashboard = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState([])
  const [bargains, setBargains] = useState([])
  const [flashSales, setFlashSales] = useState([])
  const [reviews, setReviews] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [finalizingOrderId, setFinalizingOrderId] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddFlashSale, setShowAddFlashSale] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingFlashSale, setEditingFlashSale] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    image: '',
    isOrganic: false,
    licenseNumber: '',
    isVerified: false,
    category: 'vegetables'
  })


  const [newFlashSale, setNewFlashSale] = useState({
    product: '',
    oldPrice: '',
    newPrice: '',
    discount: '',
    totalQuantity: '',
    durationHours: '',
    durationMinutes: '',
    image: ''
  })

  const [selectedBargain, setSelectedBargain] = useState(null)
  const [bargainMessage, setBargainMessage] = useState('')
  const [bargainOffer, setBargainOffer] = useState('')

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'products', 'bargains', 'flashsales', 'reviews', 'deliveries'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])


  // Load data with real-time sync
  useEffect(() => {
    if (user && user.id) {
      const loadData = () => {
        try {
          const userBargains = bargainsDatabase.getBargainsBySupplier(user.id)
          setBargains(userBargains)
          
          const userReviews = reviewsDatabase.getReviewsBySupplier(user.id)
          setReviews(userReviews)
          
          const userDeliveries = deliveriesDatabase.getDeliveriesBySupplier(user.id)
          setDeliveries(userDeliveries)
          
          const userFlashSales = flashSalesDatabase.getFlashSalesBySupplier(user.id)
          setFlashSales(userFlashSales)
          
          const userProducts = productDatabase.getProductsBySupplier(user.id)
          setProducts(userProducts)
        } catch (error) {
          console.error('Error loading supplier data:', error)
        }
      }

      loadData()

      // Subscribe to real-time updates
      const unsubscribeBargain = realTimeSync.subscribe('bargain_update', (data) => {
        if (data && data.supplierId === user.id) {
          const userBargains = bargainsDatabase.getBargainsBySupplier(user.id)
          setBargains(userBargains)
          
          // Update selected bargain if it's currently open
          if (selectedBargain && data.bargain && selectedBargain.id === data.bargain.id) {
            setSelectedBargain(data.bargain)
          }
        }
      })

      const unsubscribeReview = realTimeSync.subscribe('review_update', (data) => {
        if (data && data.supplierId === user.id) {
          const userReviews = reviewsDatabase.getReviewsBySupplier(user.id)
          setReviews(userReviews)
        }
      })

      const unsubscribeFlashSale = realTimeSync.subscribe('flash_sale_update', (data) => {
        if (data && data.supplierId === user.id) {
          const userFlashSales = flashSalesDatabase.getFlashSalesBySupplier(user.id)
          setFlashSales(userFlashSales)
        }
      })

      const unsubscribeProduct = realTimeSync.subscribe('product_update', (data) => {
        if (data && data.supplierId === user.id) {
          const userProducts = productDatabase.getProductsBySupplier(user.id)
          setProducts(userProducts)
        }
      })

      return () => {
        unsubscribeBargain()
        unsubscribeReview()
        unsubscribeFlashSale()
        unsubscribeProduct()
      }
    }
  }, [user])

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: newProduct.quantity,
        unit: newProduct.unit,
        description: newProduct.description,
        image: newProduct.image,
        isOrganic: newProduct.isOrganic,
        licenseNumber: newProduct.isOrganic ? null : newProduct.licenseNumber,
        isVerified: newProduct.isOrganic ? true : newProduct.isVerified,
        supplier: user.name,
        supplierId: user.id,
        category: newProduct.category
      }

      const addedProduct = productDatabase.addProduct(productData)
      setProducts([...products, addedProduct])
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        quantity: '',
        description: '',
        image: '',
        isOrganic: false,
        licenseNumber: '',
        isVerified: false
      })
      setShowAddProduct(false)
    } else {
      alert('Please fill in all required fields (name and price)')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity,
      unit: product.unit || 'kg',
      description: product.description,
      image: product.image,
      isOrganic: product.isOrganic,
      licenseNumber: product.licenseNumber || '',
      isVerified: product.isVerified,
      category: product.category || 'vegetables'
    })
    setShowAddProduct(true)
  }

  const handleUpdateProduct = () => {
    if (newProduct.name && newProduct.price && editingProduct) {
      const updatedData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: newProduct.quantity,
        unit: newProduct.unit,
        description: newProduct.description,
        image: newProduct.image,
        isOrganic: newProduct.isOrganic,
        licenseNumber: newProduct.isOrganic ? null : newProduct.licenseNumber,
        isVerified: newProduct.isOrganic ? true : newProduct.isVerified,
        category: newProduct.category
      }

      const updatedProduct = productDatabase.updateProduct(editingProduct.id, updatedData)
      if (updatedProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
        setEditingProduct(null)
        setNewProduct({
          name: '',
          price: '',
          quantity: '',
          description: '',
          image: '',
          isOrganic: false,
          licenseNumber: '',
          isVerified: false,
          category: 'vegetables'
        })
        setShowAddProduct(false)
      }
    } else {
      alert('Please fill in all required fields')
    }
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = productDatabase.deleteProduct(productId)
      if (success) {
        setProducts(products.filter(p => p.id !== productId))
        alert('Product deleted successfully')
      } else {
        alert('Failed to delete product')
      }
    }
  }

  const verifyFSSAILicense = async (licenseNumber) => {
    // Simulate FSSAI license verification
    // In a real application, this would call the FSSAI API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock verification logic - in reality, this would validate against FSSAI database
        const isValid = licenseNumber.length >= 8 && licenseNumber.match(/^[A-Z0-9]+$/)
        resolve({
          isValid,
          message: isValid ? 'License verified successfully' : 'Invalid license number'
        })
      }, 1000)
    })
  }

  const handleProductNameChange = (name) => {
    setNewProduct({ ...newProduct, name })
  }

  const handleOrganicChange = (isOrganic) => {
    setNewProduct({ ...newProduct, isOrganic })
  }

  const handleVerifyLicense = async () => {
    if (!newProduct.licenseNumber.trim()) {
      alert('Please enter a license number')
      return
    }

    try {
      const result = await verifyFSSAILicense(newProduct.licenseNumber)
      if (result.isValid) {
        setNewProduct({ ...newProduct, isVerified: true })
        alert('✅ ' + result.message)
      } else {
        setNewProduct({ ...newProduct, isVerified: false })
        alert('❌ ' + result.message)
      }
    } catch (error) {
      alert('Error verifying license. Please try again.')
    }
  }

  const handleAddFlashSale = async () => {
    if (newFlashSale.product && newFlashSale.newPrice) {
      // Calculate endTime from duration
      const now = new Date()
      const hours = parseInt(newFlashSale.durationHours) || 0
      const minutes = parseInt(newFlashSale.durationMinutes) || 0
      const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000).toISOString()
      
      // Use uploaded image if available, otherwise generate one
      let imageUrl = newFlashSale.image
      if (!imageUrl) {
        try {
          imageUrl = await getProductImage(newFlashSale.product)
        } catch (error) {
          console.log('Failed to generate image for flash sale')
        }
      }
      
      const flashSaleData = {
        product: newFlashSale.product,
        oldPrice: parseFloat(newFlashSale.oldPrice),
        price: parseFloat(newFlashSale.newPrice),
        discount: parseFloat(newFlashSale.discount),
        total: parseInt(newFlashSale.totalQuantity),
        endTime,
        supplier: user.name,
        supplierId: user.id,
        image: imageUrl
      }
      const addedFlashSale = flashSalesDatabase.addFlashSale(flashSaleData)
      setFlashSales([...flashSales, addedFlashSale])
      setNewFlashSale({
        product: '',
        oldPrice: '',
        newPrice: '',
        discount: '',
        totalQuantity: '',
        durationHours: '',
        durationMinutes: '',
        image: ''
      })
      setShowAddFlashSale(false)
    } else {
      alert('Please fill in all required fields (product name and new price)')
    }
  }

  const handleEditFlashSale = (sale) => {
    setNewFlashSale({
      product: sale.product,
      oldPrice: sale.oldPrice.toString(),
      newPrice: sale.price.toString(),
      discount: sale.discount.toString(),
      totalQuantity: sale.total.toString(),
      durationHours: '',
      durationMinutes: '',
      image: sale.image || ''
    })
    setEditingFlashSale(sale)
    setShowAddFlashSale(true)
  }

  const handleUpdateFlashSale = async () => {
    if (newFlashSale.product && newFlashSale.newPrice && editingFlashSale) {
      // Calculate endTime from duration
      const now = new Date()
      const hours = parseInt(newFlashSale.durationHours) || 0
      const minutes = parseInt(newFlashSale.durationMinutes) || 0
      const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000).toISOString()
      
      // Use uploaded image if available, otherwise keep existing
      let imageUrl = newFlashSale.image || editingFlashSale.image
      if (!imageUrl) {
        try {
          imageUrl = await getProductImage(newFlashSale.product)
        } catch (error) {
          console.log('Failed to generate image for flash sale')
        }
      }
      
      const updatedData = {
        product: newFlashSale.product,
        oldPrice: parseFloat(newFlashSale.oldPrice),
        price: parseFloat(newFlashSale.newPrice),
        discount: parseFloat(newFlashSale.discount),
        total: parseInt(newFlashSale.totalQuantity),
        endTime,
        image: imageUrl
      }
      
      const updatedFlashSale = flashSalesDatabase.updateFlashSale(editingFlashSale.id, updatedData)
      if (updatedFlashSale) {
        setFlashSales(flashSales.map(fs => fs.id === editingFlashSale.id ? updatedFlashSale : fs))
        setEditingFlashSale(null)
        setNewFlashSale({
          product: '',
          oldPrice: '',
          newPrice: '',
          discount: '',
          totalQuantity: '',
          durationHours: '',
          durationMinutes: '',
          image: ''
        })
        setShowAddFlashSale(false)
      }
    } else {
      alert('Please fill in all required fields')
    }
  }

  const handleDeleteFlashSale = (saleId) => {
    if (window.confirm('Are you sure you want to delete this flash sale?')) {
      const success = flashSalesDatabase.deleteFlashSale(saleId)
      if (success) {
        setFlashSales(flashSales.filter(fs => fs.id !== saleId))
        alert('Flash sale deleted successfully')
      } else {
        alert('Failed to delete flash sale')
      }
    }
  }

  const openBargainChat = (bargain) => {
    setSelectedBargain(bargain)
    setBargainMessage('')
    setBargainOffer('')
  }

  const sendBargainMessage = () => {
    if (!bargainOffer && !bargainMessage) return
    bargainsDatabase.addMessage(selectedBargain.id, {
      sender: 'supplier',
      offer: bargainOffer ? parseFloat(bargainOffer) : undefined,
      message: bargainMessage
    })
    // Refresh bargain from DB
    const updated = bargainsDatabase.getBargainById(selectedBargain.id)
    setSelectedBargain(updated)
    setBargainMessage('')
    setBargainOffer('')
  }

  const handleBargainResponse = (bargainId, response) => {
    setBargains(bargains.map(bargain => 
      bargain.id === bargainId 
        ? { ...bargain, status: response }
        : bargain
    ))
  }

  const isFarmer = user?.userType === 'farmer' || user?.type === 'farmer'

  const stats = {
    totalProducts: products.length,
    activeBargains: bargains.filter(b => b.status === 'pending').length,
    activeFlashSales: flashSales.filter(f => f.status === 'active').length,
    totalRevenue: 25000,
    totalOrders: 45,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0,
    totalReviews: reviews.length
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageRating}</p>
              <p className="text-xs text-gray-500">{stats.totalReviews} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'products', name: 'Product Catalog', icon: Package },
              { id: 'bargains', name: 'Bargain Requests', icon: MessageSquare },
              { id: 'flashsales', name: 'Flash Sales', icon: Zap },
              { id: 'reviews', name: 'Reviews', icon: Star },
              { id: 'deliveries', name: 'Deliveries', icon: Truck },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Business Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">New bargain request from Restaurant ABC</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">5-star review received for Organic Tomatoes</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add New Product
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('flashsales')}
                    className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Create Flash Sale
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Catalog Tab */}
        {activeTab === 'products' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Product Catalog</h2>
              {!isFarmer && (
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setShowAddProduct(true)
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">₹{product.price}/{product.unit || 'kg'}</span>
                    <span className="text-sm text-blue-600 font-medium">{product.quantity} {product.unit || 'kg'}</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {/* Only show FSSAI Verified for non-organic products */}
                    {!product.isOrganic && product.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        FSSAI Verified
                      </span>
                    )}
                    {!product.isOrganic && product.licenseNumber && !product.isVerified && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        License Pending
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Organic
                      </span>
                    )}
                  </div>
                  {!isFarmer && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bargain Requests Tab */}
        {activeTab === 'bargains' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Bargain Requests</h2>
            {bargains.length === 0 ? (
              <div className="text-gray-400 text-center">No bargains yet.</div>
            ) : (
              <div className="space-y-4">
                {bargains.map((bargain) => (
                  <div key={bargain.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">{bargain.vendorName}</h3>
                        <p className="text-sm text-gray-600">{bargain.productName}</p>
                      </div>
                      <button onClick={() => openBargainChat(bargain)} className="btn-primary">Open Chat</button>
                    </div>
                    <div className="text-xs text-gray-500">Status: {bargain.status}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedBargain && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Bargain Chat for {selectedBargain.productName}</h3>
                    <button onClick={() => setSelectedBargain(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <div className="mb-4 h-64 overflow-y-auto border rounded p-2 bg-gray-50">
                    {selectedBargain.messages.length === 0 ? (
                      <div className="text-gray-400 text-center">No messages yet.</div>
                    ) : (
                      selectedBargain.messages.map((msg, idx) => (
                        <div key={idx} className={`mb-2 ${msg.sender === 'supplier' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'supplier' ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <div className="text-xs text-gray-500 mb-1">{msg.sender === 'supplier' ? 'You' : selectedBargain.vendorName}</div>
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
        )}

        {/* Flash Sales Tab */}
        {activeTab === 'flashsales' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Flash Sales</h2>
              <button
                onClick={() => setShowAddFlashSale(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Flash Sale
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashSales.map((sale) => (
                <div key={sale.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">{sale.product}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        {sale.discount}% OFF
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditFlashSale(sale)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFlashSale(sale.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Flash Sale Image */}
                  {sale.image && (
                    <div className="mb-3">
                      <img 
                        src={sale.image} 
                        alt={sale.product}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="line-through text-gray-500">₹{sale.oldPrice}</span>
                      <span className="font-medium text-green-600">₹{sale.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sold: {sale.sold}/{sale.total}</span>
                      <span className="text-yellow-600 font-medium">
                        <FlashSaleTimer endTime={sale.endTime} />
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(sale.sold / sale.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>
            <button onClick={() => {
              const userReviews = reviewsDatabase.getReviewsBySupplier(user.id)
              console.log('Manual refresh reviews for supplier', user.id, userReviews)
              setReviews(userReviews)
            }} className="mb-4 btn-secondary">Refresh Reviews</button>
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reviews yet.</p>
                <p className="text-gray-400 text-sm mt-2">Reviews from vendors will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{review.vendorName}</h3>
                        <p className="text-sm text-gray-600">{review.productName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{review.date}</span>
                      <span className="text-green-600">Published</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === 'deliveries' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Delivery Management</h2>
            {deliveries.length === 0 ? (
              <div className="text-gray-400 text-center">No deliveries yet.</div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">Order #{delivery.orderId}</h3>
                        <p className="text-sm text-gray-600">Customer: {delivery.customer}</p>
                        <p className="text-sm text-gray-500">Products: {delivery.products.join(', ')}</p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        delivery.status === 'in-transit' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {delivery.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Delivery Date: {delivery.deliveryDate}</span>
                      <span>Total: ₹{delivery.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowAddProduct(false)
                  setEditingProduct(null)
                  setNewProduct({
                    name: '',
                    price: '',
                    quantity: '',
                    unit: 'kg',
                    description: '',
                    image: '',
                    isOrganic: false,
                    licenseNumber: '',
                    isVerified: false,
                    category: 'vegetables'
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => handleProductNameChange(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Price per unit"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="flex-1 p-2 border rounded"
                />
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  className="w-32 p-2 border rounded"
                >
                  <option value="kg">Kg</option>
                  <option value="litre">Litre</option>
                  <option value="dozen">Dozen</option>
                  <option value="piece">Piece</option>
                  <option value="grams">Grams</option>
                  <option value="ml">ML</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                  <option value="box">Box</option>
                  <option value="bag">Bag</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Total quantity available"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full p-2 border rounded"
                rows="3"
              />
              
              {/* Product Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      value="organic"
                      checked={newProduct.isOrganic}
                      onChange={() => handleOrganicChange(true)}
                      className="mr-2"
                    />
                    Organic
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      value="non-organic"
                      checked={!newProduct.isOrganic}
                      onChange={() => handleOrganicChange(false)}
                      className="mr-2"
                    />
                    Non-Organic
                  </label>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy Products</option>
                  <option value="nuts">Nuts & Flours</option>
                  <option value="other">Other Materials</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <ImageUpload
                  onImageSelect={(imageData) => setNewProduct({...newProduct, image: imageData})}
                  currentImage={newProduct.image}
                  onRemoveImage={() => setNewProduct({...newProduct, image: ''})}
                />
                
                {/* Auto-generate image option */}
                {!newProduct.image && newProduct.name && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Don't have a photo? We can generate one for you:
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const imageUrl = await getProductImage(newProduct.name.trim())
                          setNewProduct(prev => ({...prev, image: imageUrl}))
                        } catch (error) {
                          alert('Unable to generate image. Please upload your own photo.')
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Generate image for "{newProduct.name}"
                    </button>
                  </div>
                )}
              </div>
              
              {/* FSSAI Verification - Only for Non-Organic Products */}
              {!newProduct.isOrganic && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      FSSAI License Number (Required for Non-Organic Products)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter FSSAI license number"
                        value={newProduct.licenseNumber}
                        onChange={(e) => setNewProduct({...newProduct, licenseNumber: e.target.value})}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyLicense}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                    {newProduct.isVerified && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        License verified successfully
                      </p>
                    )}
                    {newProduct.licenseNumber && !newProduct.isVerified && (
                      <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Please verify your license number
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Organic Products Info */}
              {newProduct.isOrganic && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Organic products do not require FSSAI verification
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct} 
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {editingProduct ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button 
                onClick={() => {
                  setShowAddProduct(false)
                  setEditingProduct(null)
                  setNewProduct({
                    name: '',
                    price: '',
                    quantity: '',
                    description: '',
                    image: '',
                    isOrganic: false,
                    licenseNumber: '',
                    isVerified: false
                  })
                }} 
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Flash Sale Modal */}
      {showAddFlashSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingFlashSale ? 'Edit Flash Sale' : 'Create Flash Sale'}
              </h3>
              <button
                onClick={() => {
                  setShowAddFlashSale(false)
                  setEditingFlashSale(null)
                  setNewFlashSale({
                    product: '',
                    oldPrice: '',
                    newPrice: '',
                    discount: '',
                    totalQuantity: '',
                    durationHours: '',
                    durationMinutes: '',
                    image: ''
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newFlashSale.product}
                onChange={(e) => setNewFlashSale({...newFlashSale, product: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Original Price"
                value={newFlashSale.oldPrice}
                onChange={(e) => setNewFlashSale({...newFlashSale, oldPrice: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Sale Price"
                value={newFlashSale.newPrice}
                onChange={(e) => setNewFlashSale({...newFlashSale, newPrice: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Discount %"
                value={newFlashSale.discount}
                onChange={(e) => setNewFlashSale({...newFlashSale, discount: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Total Quantity"
                value={newFlashSale.totalQuantity}
                onChange={(e) => setNewFlashSale({...newFlashSale, totalQuantity: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Duration (hours)"
                value={newFlashSale.durationHours}
                onChange={e => setNewFlashSale({ ...newFlashSale, durationHours: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newFlashSale.durationMinutes}
                onChange={e => setNewFlashSale({ ...newFlashSale, durationMinutes: e.target.value })}
                className="w-full p-2 border rounded"
              />
              
              {/* Flash Sale Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image (Optional)
                </label>
                <ImageUpload
                  onImageSelect={(imageData) => setNewFlashSale({...newFlashSale, image: imageData})}
                  currentImage={newFlashSale.image}
                  onRemoveImage={() => setNewFlashSale({...newFlashSale, image: ''})}
                />
                
                {/* Auto-generate image option */}
                {!newFlashSale.image && newFlashSale.product && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Don't have a photo? We can generate one for you:
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const imageUrl = await getProductImage(newFlashSale.product.trim())
                          setNewFlashSale(prev => ({...prev, image: imageUrl}))
                        } catch (error) {
                          alert('Unable to generate image. Please upload your own photo.')
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Generate image for "{newFlashSale.product}"
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={editingFlashSale ? handleUpdateFlashSale : handleAddFlashSale} 
                className="btn-primary flex-1"
              >
                {editingFlashSale ? 'Update Sale' : 'Create Sale'}
              </button>
              <button 
                onClick={() => {
                  setShowAddFlashSale(false)
                  setEditingFlashSale(null)
                  setNewFlashSale({
                    product: '',
                    oldPrice: '',
                    newPrice: '',
                    discount: '',
                    totalQuantity: '',
                    durationHours: '',
                    durationMinutes: '',
                    image: ''
                  })
                }} 
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierDashboard 