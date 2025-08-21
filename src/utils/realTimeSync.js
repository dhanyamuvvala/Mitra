// Real-time synchronization utility using localStorage events
// This provides cross-tab communication for real-time updates

class RealTimeSync {
  constructor() {
    this.listeners = new Map()
    this.setupStorageListener()
  }

  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('vendorMitra_sync_')) {
        const eventType = e.key.replace('vendorMitra_sync_', '')
        const data = e.newValue ? JSON.parse(e.newValue) : null
        
        if (this.listeners.has(eventType)) {
          this.listeners.get(eventType).forEach(callback => callback(data))
        }
      }
    })
  }

  // Subscribe to real-time updates
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType).add(callback)

    // Return unsubscribe function
    return () => {
      if (this.listeners.has(eventType)) {
        this.listeners.get(eventType).delete(callback)
      }
    }
  }

  // Emit real-time update
  emit(eventType, data) {
    const key = `vendorMitra_sync_${eventType}`
    const value = JSON.stringify({
      ...data,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    })
    
    localStorage.setItem(key, value)
    
    // Clean up after a short delay to prevent localStorage bloat
    setTimeout(() => {
      localStorage.removeItem(key)
    }, 1000)
  }

  // Emit product updates
  emitProductUpdate(action, product) {
    this.emit('product_update', {
      action, // 'add', 'update', 'delete'
      product,
      supplierId: product.supplierId
    })
  }

  // Emit bargain updates
  emitBargainUpdate(action, bargain) {
    this.emit('bargain_update', {
      action, // 'create', 'message', 'status_change'
      bargain,
      supplierId: bargain.supplierId,
      vendorId: bargain.vendorId
    })
  }

  // Emit flash sale updates
  emitFlashSaleUpdate(action, flashSale) {
    this.emit('flash_sale_update', {
      action, // 'create', 'update', 'delete', 'purchase'
      flashSale,
      supplierId: flashSale.supplierId
    })
  }

  // Emit review updates
  emitReviewUpdate(action, review) {
    this.emit('review_update', {
      action, // 'add', 'update'
      review,
      supplierId: review.supplierId,
      vendorId: review.vendorId
    })
  }

  // Emit delivery updates
  emitDeliveryUpdate(action, delivery) {
    this.emit('delivery_update', {
      action, // 'create', 'update', 'status_change'
      delivery,
      supplierId: delivery.supplierId,
      vendorId: delivery.customerId
    })
  }

  // Emit stock updates
  emitStockUpdate(action, stockData) {
    this.emit('stock_update', {
      action, // 'purchase', 'restock', 'update'
      ...stockData
    })
  }
}

// Create singleton instance
const realTimeSync = new RealTimeSync()

export default realTimeSync
