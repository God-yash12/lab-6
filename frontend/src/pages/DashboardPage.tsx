import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Shield, Calendar, Building, Key } from 'lucide-react'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.username}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                  <p className="text-sm text-gray-500">Your account information</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Username:</span>
                  <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Access Level</h3>
                  <p className="text-sm text-gray-500">Your role and permissions</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user?.role || '')}`}>
                  {user?.role}
                </span>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {user?.permissions?.length || 0} permissions granted
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Department</h3>
                  <p className="text-sm text-gray-500">Your organizational unit</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-900">
                  {user?.department || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Your Permissions
            </h2>
          </div>
          <div className="p-6">
            {user?.permissions && user.permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {user.permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
                  >
                    {permission}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specific permissions assigned.</p>
            )}
          </div>
        </div>

        {/* Last Login */}
        {user?.lastLogin && (
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">
                  Last login: {new Date(user.lastLogin).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Access Control Model: Role-Based Access Control (RBAC)
          </h3>
          <p className="text-sm text-blue-700">
            This system implements Role-Based Access Control (RBAC) where users are assigned roles 
            (Admin, Manager, User) and permissions are granted based on these roles. This provides 
            a scalable and manageable approach to access control that aligns with organizational 
            hierarchies and job responsibilities.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage