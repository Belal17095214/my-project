
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


// 🛠️ Cart.jsx की तरह Encoding helper यहाँ भी लगा दिया ताकि टेक्स्ट साफ दिखे
const L = (text) => {
    if (!text) return "";
    try { return decodeURIComponent(escape(text)); } catch { return text; }
};

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            console.log(">>> [FRONTEND] MyOrdersPage Loaded.");
            const auth = localStorage.getItem('user');

            if (!auth) {
                console.error(">>> [FRONTEND ERROR] User data missing in localStorage.");
                setError('Please login to view your orders.');
                setLoading(false);
                return;
            }

            try {
                const user = JSON.parse(auth);
                console.log(">>> [FRONTEND] LocalStorage User Data:", user);

                // डायनेमिक बैकअप: ईमेल या आईडी डिटेक्ट करना
                const searchParam = user.email || user._id || user.id;

                if (!searchParam) {
                    setError('User identification data missing.');
                    setLoading(false);
                    return;
                }

                console.log(`>>> [FRONTEND] Sending API call with param: ${searchParam}`);
                // const response = await axios.get(`/api/orders/user/${searchParam}`);
                const response = await axios.get(`http://localhost:5000/api/orders/user/${searchParam}`);

                console.log(">>> [FRONTEND] Orders response data:", response.data);

                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    setOrders([]);
                }

                setLoading(false);
            } catch (err) {
                console.error(">>> [FRONTEND ERROR] Axios fetch failed!", err);
                setError(`Orders fetch karne mein dikkat aayi: ${err.response?.data?.message || err.message}`);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-2">
                    📦 My Orders <span className="text-sm font-normal text-slate-500">({orders.length} orders)</span>
                </h1>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
                        <p className="text-sm text-red-700 font-semibold">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Aapne abhi tak koi order nahi kiya hai</h3>
                        <p className="text-slate-500 mb-6">Hamare store par behtareen Islamic books aur Qur'an available hain.</p>
                        <Link to="/" className="inline-block bg-indigo-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-800 transition">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
                                {/* Order Main Info Header */}
                                <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 text-sm text-slate-600">
                                    <div>
                                        <p className="text-xs uppercase font-bold text-slate-400">Order ID</p>
                                        <p className="font-mono text-xs text-slate-800 font-bold">{order.orderId || order._id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-bold text-slate-400">Total Amount</p>
                                        <p className="font-extrabold text-indigo-900 text-base">${order.totalAmount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-bold text-slate-400">Status</p>
                                        <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${order.status === 'Paid' || order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            ● {order.status || 'Placed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items Loop */}
                                <div className="p-4 sm:p-6 divide-y divide-slate-100">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                            <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">

                                                    {/* 📷 🛠️ फिक्स: बिल्कुल Cart.jsx वाला इमेज कंटेनर और लॉजिक */}
                                                    <div className="w-16 h-22 sm:w-20 sm:h-26 overflow-hidden rounded-lg bg-gray-50 shadow-inner flex items-center justify-center shrink-0 border border-slate-100">
                                                        {/* <img
                                                            src={item.image2?.split("\n")[0]}
                                                            className="w-full h-full object-contain mix-blend-multiply"
                                                            alt={L(item?.title || item?.bookName || item?.productTitle)}
                                                            onError={(e) => {
                                                                // अगर कभी इमेज पाथ न मिले तो बैकअप के लिए इमोजी आ जाए
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'block';
                                                            }}
                                                        /> */}
                                                        <div className="w-16 h-22 sm:w-20 sm:h-26 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-900 to-indigo-950 flex flex-col items-center justify-between p-2 shrink-0 border border-indigo-800 shadow-md text-center group">
                                                            {/* ऊपर एक छोटा सा सुंदर बुक आइकॉन */}
                                                            <span className="text-xl sm:text-2xl text-amber-400 animate-pulse">📖</span>

                                                            {/* बीच में बुक का नाम जो डेटाबेस से आ रहा है (अधिकतम 2 लाइन में दिखेगा) */}
                                                            <p className="text-[9px] sm:text-[10px] font-bold text-white/90 leading-tight line-clamp-2 uppercase tracking-wide">
                                                                {L(item.title || item.bookName || item.productTitle || "Deen Book")}
                                                            </p>

                                                            {/* नीचे एक छोटा सा प्रीमियम टैग */}
                                                            <span className="text-[7px] font-extrabold text-amber-500 tracking-widest uppercase">
                                                                Global Deen
                                                            </span>
                                                        </div>
                                                        <span className="text-2xl hidden">📖</span>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                                                            {L(item.title || item.bookName || item.productTitle || "Islamic Book")}
                                                        </h4>
                                                        <p className="text-xs sm:text-sm text-slate-400">
                                                            Quantity: <span className="font-semibold text-slate-600">{item.quantity}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-slate-800 text-sm sm:text-base">
                                                        ${(parseFloat(item.price) || order.totalAmount) * (item.quantity || 1)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-2 text-slate-500 text-sm flex justify-between items-center">
                                            <span>Standard Book Order Item</span>
                                            <span className="font-bold text-slate-800">${order.totalAmount}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Address Footer */}
                                <div className="bg-slate-50/50 px-4 py-3 sm:px-6 border-t border-slate-100 text-xs text-slate-500">
                                    <strong>Shipping Address:</strong> {order.address}, {order.city} - {order.pincode}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrdersPage;


