"use client"

import { BiX } from "react-icons/bi"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'success' | 'warning' | 'error' | 'info'
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'info'
}: ConfirmationModalProps) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          iconColor: 'text-green-500',
          confirmBg: 'bg-green-500 hover:bg-green-600',
          borderColor: 'border-green-500'
        }
      case 'warning':
        return {
          icon: '⚠',
          iconColor: 'text-yellow-500',
          confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
          borderColor: 'border-yellow-500'
        }
      case 'error':
        return {
          icon: '✕',
          iconColor: 'text-red-500',
          confirmBg: 'bg-red-500 hover:bg-red-600',
          borderColor: 'border-red-500'
        }
      default:
        return {
          icon: 'ℹ',
          iconColor: 'text-blue-500',
          confirmBg: 'bg-blue-500 hover:bg-blue-600',
          borderColor: 'border-blue-500'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative bg-white rounded-lg shadow-xl border ${styles.borderColor} max-w-md w-full mx-4`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${styles.iconColor}`}>{styles.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white ${styles.confirmBg} rounded-md transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
