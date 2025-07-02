import React from 'react'
import { Check, X, AlertCircle } from 'lucide-react'

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

interface PasswordStrengthIndicatorProps {
  result: PasswordStrengthResult
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ result }) => {
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Strong': return 'text-green-600 bg-green-100'
      case 'Strong': return 'text-green-500 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Weak': return 'text-orange-600 bg-orange-100'
      case 'Very Weak': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-green-400'
    if (score >= 40) return 'bg-yellow-500'
    if (score >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const criteriaItems = [
    { key: 'length', label: 'At least 8 characters', met: result.criteria.length },
    { key: 'lowercase', label: 'Lowercase letters (a-z)', met: result.criteria.lowercase },
    { key: 'uppercase', label: 'Uppercase letters (A-Z)', met: result.criteria.uppercase },
    { key: 'numbers', label: 'Numbers (0-9)', met: result.criteria.numbers },
    { key: 'symbols', label: 'Special characters (!@#$%^&*)', met: result.criteria.symbols },
    { key: 'noSpaces', label: 'No spaces', met: result.criteria.noSpaces },
    { key: 'noCommonPatterns', label: 'No common patterns', met: result.criteria.noCommonPatterns },
  ]

  return (
    <div className="space-y-4">
      {/* Strength Score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-sm font-bold px-2 py-1 rounded-full ${getStrengthColor(result.strength)}`}>
            {result.strength}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(result.score)}`}
            style={{ width: `${result.score}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {result.score}/100
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Security Criteria</h4>
        <div className="grid grid-cols-1 gap-2">
          {criteriaItems.map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              {item.met ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${item.met ? 'text-green-700' : 'text-red-700'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {result.feedback.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Recommendations
          </h4>
          <ul className="space-y-1">
            {result.feedback.map((feedback, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="mr-2">•</span>
                <span>{feedback}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PasswordStrengthIndicator
