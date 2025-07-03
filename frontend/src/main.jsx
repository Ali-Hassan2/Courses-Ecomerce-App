import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UserProvider } from '../Utils/userContext.jsx'
import {  CartProvider } from '../Utils/cartContext.jsx'
import { AdminProvider } from '../Utils/adminContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <AdminProvider>
      <App />
        </AdminProvider>
      </CartProvider>
    </UserProvider>
  </StrictMode>,
)
