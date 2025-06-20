"use client";

import { useState, useCallback } from "react";

export interface ToastOptions {
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString();
    const newToast = { id, ...options };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, [addToast]);

  return { toast, removeToast, toasts };
};

export default useToast; 