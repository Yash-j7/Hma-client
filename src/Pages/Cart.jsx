import React from "react";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center mb-4">
              <img
                src={`https://hma-backend.onrender.com/api/v1/product/product-photo/${item._id}`}
                alt={item.name}
                className="w-20 h-20 object-cover mr-4"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p>{item.price} years old</p>
                <div className="flex items-center">
                  <button
                    className="p-2 border rounded-l"
                    onClick={() => decreaseQuantity(item._id)}
                  >
                    -
                  </button>
                  <span className="px-4 border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    className="p-2 border rounded-r"
                    onClick={() => increaseQuantity(item._id)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="p-2 bg-red-500 text-white rounded ml-4"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
