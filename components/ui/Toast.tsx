"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Typography } from "./Typography";
import { AnimatePresence, motion } from "framer-motion";
import {
  PiCheckCircleFill,
  PiInfoFill,
  PiX,
  PiWarningFill,
  PiWarningCircleFill,
} from "react-icons/pi";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextProps {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      setToast({ message, type, duration });

      if (duration > 0) {
        const timer = setTimeout(() => {
          setToast(null);
        }, duration);

        return () => clearTimeout(timer);
      }
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-safe fixed bottom-0 right-6 z-50 w-[calc(100vw-48px)] max-w-md transform"
          >
            <div
              className={`flex items-center justify-between rounded-xl px-4 py-3 shadow-lg ${
                toast.type === "error"
                  ? "border border-error-300 bg-error-100"
                  : "border border-gray-200 bg-gray-0"
              }`}
            >
              <div className="flex items-center">
                {toast.type === "success" ? (
                  <PiCheckCircleFill className="text-gray-600 mr-3 h-5 w-5" />
                ) : toast.type === "error" ? (
                  <PiWarningCircleFill className="text-error-700 mr-3 h-5 w-5" />
                ) : (
                  <PiInfoFill className="text-gray-600 mr-3 h-5 w-5" />
                )}
                <Typography
                  className={`font-sans text-sm ${
                    toast.type === "error" ? "text-error-700" : "text-gray-700"
                  }`}
                >
                  {toast.message}
                </Typography>
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-3 rounded-full p-1 hover:bg-gray-200"
              >
                <PiX className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
