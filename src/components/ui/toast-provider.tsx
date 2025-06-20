"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "./toast-container";
import { ToastProps } from "./toast";

interface ToastOptions {
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  toast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCounter}`;
    const newToast: ToastProps = {
      id,
      ...options,
      onClose: removeToast,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, [removeToast]);

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
} 