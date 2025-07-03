import React, { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartitems, setcartitems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartitems));
  }, [cartitems]);

  const addtocart = (course) => {
    if (!cartitems.find((item) => item._id === course._id)) {
      setcartitems((prev) => [...prev, course]);
    }
  };

  const removecart = (courseId) => {
    setcartitems((prev) => prev.filter((item) => item._id !== courseId));
  };

  const clearCart = () => setcartitems([]);

  return (
    <CartContext.Provider value={{ cartitems, addtocart, removecart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
