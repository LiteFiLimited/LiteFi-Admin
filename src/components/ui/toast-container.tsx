"use client";

import React from "react";
import Toast, { ToastProps } from "./toast";

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToastAction: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemoveToastAction }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onCloseAction={onRemoveToastAction}
        />
      ))}
    </div>
  );
} 