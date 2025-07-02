import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api'
import { passwordCheckSchema, type PasswordCheckFormData } from '../schemas/validation'
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator'
import { Key, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface PasswordStrengthResult {
  score: number
  strength: string
  feedback: string[]
  criteria: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    numbers: boolean
    symbols: boolean
    noSpaces: boolean
    noCommonPatterns: boolean
  }
}

const PasswordCheckerPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [result, setResult] = useState<PasswordStrengthResult | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordCheckFormData>({
    resolver: zodResolver(passwordCheckSchema),
  })

  const password = watch('password', '')

  const checkPasswordMutation = useMutation({
    mutationFn: async (data: PasswordCheckFormData) => {
      const response = await api.post('/password/check-strength', data)
      return response.data
    },
    onSuccess: (data) => {
      setResult(data)
    },
  })

  const onSubmit = (data: PasswordCheckFormData) => {
    checkPasswordMutation.mutate(data)
  }

  // Real-time password checking
  React.useEffect(() => {
    if (password && password.length > 0) {
      const timeoutId = setTimeout(() => {
        checkPasswordMutation.mutate({ password })
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setResult(null)
    }
  }, [password])

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Key className="h-8 w-8 mr-3 text-blue-600" />
            Password Strength Checker
          </h1>
          <p className="mt-2 text-gray-600">
            Test the strength of your password and get recommendations for improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Password Input Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Password</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a password to check its strength"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={checkPasswordMutation.isPending || !password}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkPasswordMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check Password Strength
                  </>
                )}
              </button>
            </form>

            {/* Password Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Password Best Practices:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use at least 12 characters for better security</li>
                <li>• Mix uppercase and lowercase letters</li>
                <li>• Include numbers and special characters</li>
                <li>• Avoid common words and patterns</li>
                <li>• Don't use personal information</li>
                <li>• Consider using a passphrase</li>
              </ul>
            </div>
          </div>

          {/* Password Strength Results */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Strength Analysis</h2>
            
            {result ? (
              <PasswordStrengthIndicator result={result} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Key className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    Enter a password to check its strength
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordCheckerPage