"use client"

import { useEffect } from "react"
import { BiX, BiCheckCircle, BiErrorCircle, BiInfoCircle } from "react-icons/bi"
import { BsTriangle } from "react-icons/bs"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  autoClose?: boolean
  duration?: number
}

export const NotificationModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  autoClose = true,
  duration = 3000
}: NotificationModalProps) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, duration, onClose])

  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <BiCheckCircle className="w-6 h-6 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        }
      case 'error':
        return {
          icon: <BiErrorCircle className="w-6 h-6 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        }
      case 'warning':
        return {
          icon: <BsTriangle className="w-6 h-6 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800'
        }
      default:
        return {
          icon: <BiInfoCircle className="w-6 h-6 text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start gap-3">
          {styles.icon}
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium ${styles.textColor}`}>{title}</h4>
            <p className={`text-sm mt-1 ${styles.textColor} opacity-90`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
          >
            <BiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
