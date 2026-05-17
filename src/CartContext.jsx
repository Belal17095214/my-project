import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Initial State from LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('myCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('myCart', JSON.stringify(cart));
  }, [cart]);

  // 3. Functions
  const addToCart = (productWithQty) => {
    setCart((prev) => {
      const isExist = prev.find(item => item.id === productWithQty.id);
      if (isExist) {
        return prev.map(item =>
          item.id === productWithQty.id
            ? { ...item, quantity: item.quantity + productWithQty.quantity }
            : item
        );
      }
      return [...prev, productWithQty];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);