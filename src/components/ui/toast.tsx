"use client"

import React, { useEffect, useCallback } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

export interface ToastProps {
  id: string
  title: string
  message?: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
  onCloseAction: (id: string) => void
}

export default function Toast({ id, title, message, type, duration = 4000, onCloseAction }: ToastProps) {
  const handleClose = useCallback(() => {
    onCloseAction(id)
  }, [id, onCloseAction])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  const getToastStyles = () => {
    const baseStyles = "relative flex items-start gap-3 p-4 pr-8 rounded-lg shadow-lg border max-w-md animate-in slide-in-from-right-full"
    
    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`
      case "error":
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`
      case "info":
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`
    }
  }

  const getIcon = () => {
    const iconClasses = "w-5 h-5 flex-shrink-0 mt-0.5"
    
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClasses} text-green-500`} />
      case "error":
        return <AlertCircle className={`${iconClasses} text-red-500`} />
      case "warning":
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />
      case "info":
        return <Info className={`${iconClasses} text-blue-500`} />
      default:
        return <Info className={`${iconClasses} text-gray-500`} />
    }
  }

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{title}</div>
        {message && (
          <div className="text-sm mt-1 opacity-90">{message}</div>
        )}
      </div>
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/5 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
} 