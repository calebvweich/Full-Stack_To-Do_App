import "./Toast.css"

import { createContext, useContext, useState, useEffect } from "react";

let addToastFn = null;

function setToastFn(fn) {
  addToastFn = fn;
}

export const toast = {
  info: (msg) => addToastFn && addToastFn(msg, "info"),
  success: (msg) => addToastFn && addToastFn(msg, "success"),
  error: (msg) => addToastFn && addToastFn(msg, "error"),
};

const ToastContext = createContext();


export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  
  useEffect(() => {
    const stored = localStorage.getItem("toastMessage");
    if (stored) {
      addToast(stored, "error");
      localStorage.removeItem("toastMessage");
    }
    setToastFn(addToast);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function useToast() {
  return useContext(ToastContext);
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="toastContainer"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`${toast.type} toast`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
