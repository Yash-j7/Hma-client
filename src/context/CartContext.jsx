import React, { useEffect, useState, createContext, useContext } from "react";

// Create the cart context
const cartContext = createContext();

// CartProvider component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let prevCart = localStorage.getItem("cart");
    if (prevCart) setCart(JSON.parse(prevCart));
  }, []);

  // Save cart to local storage whenever it updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        // Update quantity if product already exists
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product with quantity = 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  return (
    <cartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

// Custom hook to use the cart context
const useCart = () => {
  return useContext(cartContext);
};

// Export the provider and custom hook
export { useCart, CartProvider };
