"use client";

import { useState, useCallback } from "react";
import { ToastProps } from "./toast";

interface ToastOptions {
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

let toastCounter = 0;

const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCounter}`;
    const newToast: ToastProps = {
      id,
      ...options,
      onClose: () => removeToast(id),
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, [addToast]);

  return {
    toast,
    toasts,
    removeToast,
  };
};

export { useToast };
export type { ToastOptions }; 