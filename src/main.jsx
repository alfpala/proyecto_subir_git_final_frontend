// El CSS global debe ser referenciado en public/index.html con <link href="/css/styles.css" rel="stylesheet" />
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/Toast.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
