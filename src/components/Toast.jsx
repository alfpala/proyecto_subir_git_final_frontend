import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 2500) => {
    const id = Date.now() + Math.random();
    setToasts(toasts => [...toasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(toasts => toasts.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container" style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`} style={{
            minWidth: 200,
            marginBottom: 10,
            padding: '12px 20px',
            borderRadius: 8,
            background: toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#2563eb' : '#334155',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            fontWeight: 500,
            fontSize: 16,
            opacity: 0.97,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {toast.type === 'success' && <i className="bi bi-check-circle-fill me-2"></i>}
            {toast.type === 'error' && <i className="bi bi-x-circle-fill me-2"></i>}
            {toast.type === 'info' && <i className="bi bi-info-circle-fill me-2"></i>}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
