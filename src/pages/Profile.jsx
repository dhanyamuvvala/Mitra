import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Save, Edit, Camera, MapPin, Phone, Mail, User, Award, Star, Package, Clock } from 'lucide-react'
import LicenseVerification from '../components/FSSAI/LicenseVerification'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [showFssaiVerification, setShowFssaiVerification] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    fssaiLicense: user?.fssaiLicense || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    description: user?.description || ''
  })

  // Mock recent orders data
  const recentOrders = [
    {
      id: 1,
      product: 'Organic Carrots',
      supplier: 'Farmer Ramesh',
      price: 40,
      status: 'Delivered',
      date: '2024-01-15',
      quantity: '5kg'
    },
    {
      id: 2,
      product: 'Fresh Tomatoes',
      supplier: 'Fresh Farms Ltd',
      price: 45,
      status: 'In Transit',
      date: '2024-01-14',
      quantity: '3kg'
    },
    {
      id: 3,
      product: 'Basmati Rice',
      supplier: 'Grain Masters',
      price: 120,
      status: 'Delivered',
      date: '2024-01-12',
      quantity: '10kg'
    }
  ]

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    updateProfile(profileData)
    setEditing(false)
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="btn-secondary flex items-center gap-2"
        >
          {editing ? 'Cancel' : <Edit className="w-4 h-4" />}
          {editing ? '' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <div className="text-gray-900">{user.name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-gray-900">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <div className="text-gray-900">{user.phone || 'Not provided'}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {editing ? (
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="input-field"
                    rows="3"
                  />
                ) : (
                  <div className="text-gray-900">{user.address || 'Not provided'}</div>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          {user.type === 'supplier' && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="input-field"
                    />
                  ) : (
                    <div className="text-gray-900">{user.businessName || 'Not provided'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  {editing ? (
                    <select
                      value={profileData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select Type</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="distribution">Distribution</option>
                    </select>
                  ) : (
                    <div className="text-gray-900">{user.businessType || 'Not specified'}</div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description
                  </label>
                  {editing ? (
                    <textarea
                      value={profileData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="input-field"
                      rows="3"
                    />
                  ) : (
                    <div className="text-gray-900">{user.description || 'No description'}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FSSAI Verification removed as per request */}

          {editing && (
            <div className="flex gap-4">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Orders removed as per request */}
        </div>
      </div>

      {/* FSSAI Verification Modal */}
      {showFssaiVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">FSSAI License Verification</h3>
            <LicenseVerification 
              onVerify={(license) => {
                updateProfile({ fssaiLicense: license, fssaiVerified: true })
                setShowFssaiVerification(false)
              }}
            />
            <button
              onClick={() => setShowFssaiVerification(false)}
              className="w-full btn-secondary mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile 