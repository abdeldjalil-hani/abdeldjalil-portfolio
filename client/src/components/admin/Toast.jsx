import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = ++idSeq;
    setToasts((list) => [...list, { id, type, message }]);
    setTimeout(() => remove(id), 4200);
  }, [remove]);

  const toast = useCallback(
    (message, type = 'ok') => {
      if (type === 'error') push('err', message);
      else push(type === 'loading' ? 'ok' : type, message);
    },
    [push]
  );

  toast.error = useCallback((m) => push('err', m), [push]);
  toast.success = useCallback((m) => push('ok', m), [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === 'err' ? 'err' : 'ok'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}