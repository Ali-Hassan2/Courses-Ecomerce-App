import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UserProvider } from '../Utils/userContext.jsx'
import { CartProvider } from '../Utils/cartContext.jsx'
import { AdminProvider } from '../Utils/adminContext.jsx'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import App from './App.jsx'
const stripePromise = loadStripe("pk_test_51QZbuG4MQkXNdmALtIwbo212f2QZzvw83RC27rHHa3bBaqXAZc2iL7l7LvGSbc1lxxWtw9AiH4zu8GK4lJflP0Br00f3VcQEMm");
import {
  QueryClient,
  QueryClientProvider,
}
  from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>


    <Elements stripe={stripePromise}>


      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <CartProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </CartProvider>
        </UserProvider>
      </QueryClientProvider>

    </Elements>
  </StrictMode>,
)
