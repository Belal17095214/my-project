
import React, { useState } from 'react';
import { useCart } from './CartContext';
import { FaLock, FaTruck, FaCreditCard, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = () => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for UX
  const [currentOrderId, setCurrentOrderId] = useState("");
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [formData, setFormData] = useState({
    customerFirstName: '', customerLastName: '', email: '', address: '', city: '', pincode: '',
  });

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.data1.replace(/[^0-9.]/g, '')) || 0;
    return acc + (price * item.quantity);
  }, 0);

  // 1. PayPal Logic - Improved Error Handling
  const createPayPalOrder = async () => {
    try {
      const orderData = { 
        ...formData, 
        totalAmount: cartTotal.toFixed(2), // Value must be string for PayPal
        method: 'ONLINE', 
        items: cart.map(item => ({ 
            bookName: item.title, 
            quantity: item.quantity, 
            price: parseFloat(item.data1.replace(/[^0-9.]/g, '')).toFixed(2) 
        })) 
      };
      
      const res = await axios.post('http://localhost:5000/create-order', orderData);
      // const res = await axios.post('/api/create-order', orderData);
      
      // Backend should return { id: "XXXXX" }
      if (res.data && res.data.id) {
        return res.data.id;
      } else {
        console.error("ID not found in backend response:", res.data);
        return null;
      }
    } catch (err) { 
      console.error("PayPal Order Start Error:", err);
      return null; 
    }
  };

  const onApprovePayPal = async (data) => {
    setLoading(true);
    try {
      // const result = await axios.post('/api/verify-payment', { orderId: data.orderID });
      const result = await axios.post('http://localhost:5000/verify-payment', { orderId: data.orderID });
      if (result.data.success) {
        setCurrentOrderId(data.orderID);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) { 
      alert("Verification Failed. Please contact support."); 
    } finally {
      setLoading(false);
    }
  };

  // 2. COD Logic - Fixed Validation
  const handleCODOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const orderData = { 
      ...formData, 
      totalAmount: cartTotal, 
      method: 'COD',
      items: cart.map(item => ({ 
        bookName: item.title, 
        quantity: item.quantity, 
        price: parseFloat(item.data1.replace(/[^0-9.]/g, '')) 
      }))
    };

    try {
      // const result = await axios.post('/api/orders', orderData);
      const result = await axios.post('http://localhost:5000/orders', orderData);
      if (result.status === 201 || result.status === 200) {
        setCurrentOrderId(result.data.orderId);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) { 
      alert("Error placing COD order. Is server running?"); 
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
        <FaCheckCircle className="text-green-500 text-8xl mb-6 animate-bounce" />
        <h2 className="text-4xl font-bold text-gray-800">Order Placed Successfully!</h2>
        <p className="text-gray-500 mt-2">Order ID: {currentOrderId}</p>
        {/* <a href={`http://localhost:5000/invoices/invoice_${currentOrderId}.pdf`} target="_blank" rel="noreferrer" className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-green-700 transition">📄 Download Invoice</a> */}
        <button onClick={() => window.location.href = '/'} className="mt-8 bg-indigo-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Shipping & Payment */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <FaTruck className="text-indigo-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
          </div>

          <form onSubmit={handleCODOrder} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" value={formData.customerFirstName} onChange={(e) => setFormData({ ...formData, customerFirstName: e.target.value })} required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="text" placeholder="Last Name" value={formData.customerLastName} onChange={(e) => setFormData({ ...formData, customerLastName: e.target.value })} required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Full Delivery Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="pt-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700"><FaCreditCard className="text-indigo-600" /> Choose Payment</h2>
              <div className="grid grid-cols-1 gap-3">
                {/* <div onClick={() => setPaymentMethod('COD')} className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <span className="font-bold">Cash on Delivery</span>
                    {paymentMethod === 'COD' && <FaCheckCircle className="text-indigo-600" />}
                </div> */}
                <div onClick={() => setPaymentMethod('ONLINE')} className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300'}`}>
                    <span className="font-bold">Pay Online (PayPal)</span>
                    {paymentMethod === 'ONLINE' && <FaCheckCircle className="text-indigo-600" />}
                </div>
              </div>

              <div className="mt-8">
                {paymentMethod === 'ONLINE' ? (
                  <div className="animate-fadeIn min-h-[150px]">
                    <PayPalButtons 
                      style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                      createOrder={createPayPalOrder}
                      onApprove={onApprovePayPal}
                    />
                  </div>
                ) : (
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <><FaLock size={18} /> Confirm Order</>}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 pb-3">
                    <img src={item.image2?.split("\n")[0]} className="w-14 h-20 object-contain rounded bg-gray-50 border" alt={item.title} />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-700 truncate w-40">{item.title}</h4>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-indigo-600 text-sm">${(parseFloat(item.data1.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}</span>
                </div>
                ))}
            </div>
            <div className="border-t-2 border-dashed pt-4 flex justify-between items-center text-2xl font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;