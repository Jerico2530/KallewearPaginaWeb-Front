// src/components/UI/ToastProvider.jsx
"use client"; // si estás en Next.js app dir

import { Toaster } from "sonner";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          padding: "12px 16px",
          fontSize: "14px",
        },
      }}
    />
  );
};

export default ToastProvider;
