import React from 'react';
import { useCart } from './CartContext';
import { FaTrash, FaShoppingBag, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// Encoding helper
const L = (text) => {
  if (!text) return "";
  try { return decodeURIComponent(escape(text)); } catch { return text; }
};

const Cart = () => {
  const navigate = useNavigate();
  // addToCart ko quantity update karne ke liye use karenge
  const { cart, removeFromCart, addToCart } = useCart();

  const total = cart.reduce((acc, item) => {
    const price = parseFloat(item?.data1?.replace(/[^0-9.]/g, '')) || 0;
    return acc + (price * item.quantity);
  }, 0);

  // Quantity update function
  const updateQuantity = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty > 0) {
      addToCart({ ...item, quantity: delta }); // Context handles delta logic
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <FaShoppingBag className="text-indigo-100 text-8xl sm:text-9xl mb-6 animate-bounce" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Your cart is feeling lonely!</h2>
        <p className="text-gray-500 mt-2">Add some amazing books to make it happy.</p>
        <Link to="/" className="mt-8 bg-indigo-600 text-white px-10 py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg active:scale-95">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6 sm:mb-10">
          <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:text-indigo-600 transition">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="group relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">

                {/* Book Image */}
                <div className="w-20 h-28 sm:w-24 sm:h-32  overflow-hidden rounded-lg bg-gray-50 shadow-inner">
                  <img
                    src={item.image2?.split("\n")[0]}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                    alt={L(item?.title)}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{L(item.title)}</h3>
                  <p className="text-indigo-600 font-medium text-sm mb-3">{item.data1} per unit</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                    <button
                      onClick={() => updateQuantity(item, -1)}
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="text-gray-900 font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item, 1)}
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="inline-flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-wider hover:text-red-700 transition"
                  >
                    <FaTrash size={10} /> Remove Item
                  </button>
                </div>

                {/* Price (Right Side on Laptop, Bottom on Mobile) */}
                <div className="sm:text-right border-t sm:border-0 w-full sm:w-auto pt-3 sm:pt-0">
                  <p className="text-lg sm:text-xl font-black text-gray-900">
                    ${(parseFloat(item?.data1?.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 lg:sticky lg:top-24">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-gray-800">${total.toFixed(2)}</span>
                </div>
              
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold tracking-wide">FREE</span>
                  </div>
                
                

                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Grand Total</span>
                  <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-indigo-100 shadow-lg active:scale-[0.98] transition-all"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-widest text-center">
                  100% Secure SSL Checkout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
