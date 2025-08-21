import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { deliveriesDatabase } from '../data/userDatabase'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [showCodModal, setShowCodModal] = useState(false)

  const handleBuyNow = () => {
    setShowCodModal(true)
  }

  const handleConfirmCod = () => {
    // Group cart items by supplierId
    const deliveriesBySupplier = {}
    cart.forEach(item => {
      if (!deliveriesBySupplier[item.supplierId]) {
        deliveriesBySupplier[item.supplierId] = {
          supplier: item.supplier,
          supplierId: item.supplierId,
          products: [],
          totalAmount: 0
        }
      }
      deliveriesBySupplier[item.supplierId].products.push(`${item.name} x${item.quantity}`)
      // Remove currency symbol for calculation
      const priceNum = typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price
      deliveriesBySupplier[item.supplierId].totalAmount += priceNum * item.quantity
    })
    // Create a delivery for each supplier
    const deliverySummaries = []
    console.log('Deliveries to be created:', deliveriesBySupplier)
    Object.values(deliveriesBySupplier).forEach(delivery => {
      const newDelivery = deliveriesDatabase.addDelivery({
        customer: 'Manya',
        customerId: 1,
        supplier: delivery.supplier,
        supplierId: delivery.supplierId,
        products: delivery.products,
        totalAmount: delivery.totalAmount,
        status: 'in-transit',
        paymentMethod: 'Cash on Delivery',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
      console.log('Created delivery:', newDelivery)
      deliverySummaries.push(`${delivery.supplier}: ${delivery.products.join(', ')} (₹${delivery.totalAmount})`)
    })
    alert(`Thank you for your purchase! Deliveries created for:\n${deliverySummaries.join('\n')}`)
    clearCart()
    setShowCodModal(false)
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Add some products from our suppliers to get started!</p>
          <Link 
            to="/supplier-finder" 
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Find Suppliers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Cash on Delivery Modal */}
      {showCodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
            <button
              className="w-full btn-primary py-3 text-lg mb-2"
              onClick={handleConfirmCod}
            >
              Cash on Delivery
            </button>
            <button
              className="w-full btn-secondary py-2"
              onClick={() => setShowCodModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link to="/supplier-finder" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary-600">Shopping Cart</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{cart.length} items</span>
          <button 
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Cart Items</h2>
            </div>
            <div className="divide-y">
              {cart.map((item, index) => (
                <div key={index} className="p-6 flex items-start gap-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.supplier && (
                          <p className="text-sm text-gray-500">from {item.supplier}</p>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{item.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total ({cart.length} items)</span>
                  <span>₹{getCartTotal()}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBuyNow}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-lg"
            >
              <CreditCard className="w-5 h-5" />
              Buy Now
            </button>

            <div className="mt-4 text-center">
              <Link 
                to="/supplier-finder" 
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart 