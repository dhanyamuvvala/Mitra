import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { StatsProvider } from './contexts/StatsContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import SupplierLayout from './components/Layout/SupplierLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SupplierDashboard from './pages/SupplierDashboard'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import SupplierFinder from './pages/SupplierFinder'
import FlashSales from './pages/FlashSales'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'
import Organic from './pages/Organic'
import FindItems from './pages/FindItems'
import Cart from './pages/Cart'
import Bargains from './pages/Bargains'
import CollaborativeOrders from './pages/CollaborativeOrders'

function App() {
  return (
    <AuthProvider>
      <StatsProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Supplier Routes - Use SupplierLayout */}
              <Route path="/supplier-dashboard" element={
                <SupplierLayout>
                  <SupplierDashboard />
                </SupplierLayout>
              } />
              
              {/* Vendor Routes - Use Regular Layout */}
              <Route path="/*" element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/suppliers" element={<SupplierFinder />} />
                      <Route path="/find-items" element={<FindItems />} />
                      <Route path="/flash-sales" element={<FlashSales />} />
                      <Route path="/organic" element={<Organic />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/bargains" element={<Bargains />} />
                      <Route path="/collaborative-orders" element={<CollaborativeOrders />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </StatsProvider>
    </AuthProvider>
  )
}

export default App 