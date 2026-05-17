import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const auth = localStorage.getItem('user');
  if (auth) {
    return <Navigate to="/" />;
  }
// const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   try {
//     // 1. Request bhej rahe hain
//     const result = await axios.post('http://localhost:5000/login', formData);

//     // Debugging ke liye: Console mein check karein backend kya bhej raha hai
//     console.log("Backend response:", result.data);

//     // 2. Token check (Aapne backend mein ise 'auth' naam diya tha)
//     if (result.data.auth||result.data.token) {
//       // Yahan hum 'result.data.auth' use kar rahe hain, isliye error nahi aayegi
//       localStorage.setItem("token", result.data.auth); 
//       localStorage.setItem('user', JSON.stringify(result.data.user));
      
//       alert("Welcome Back!");
//       navigate('/');
//     } else {
//       alert("Server se token nahi mila!");
//     }

//   } catch (err) {
//     console.error("Login Error:", err);
//     alert(err.response?.data?.msg || "Login failed");
//   }
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // const result = await axios.post('/api/login', formData);
    const result = await axios.post('http://localhost:5000/login', formData);
    // const result = await axios.post('https://q8cmhd59-5000.inc1.devtunnels.ms/login', formData);

    // 1. Check karein ki auth (token) aur user data dono mil rahe hain
    if (result.data.auth && result.data.user) {
      
      // Data ko variables mein nikal lo (Asaani ke liye)
      const token = result.data.auth;
      const user = result.data.user; // Isme name, email sab hai

      // 2. LocalStorage mein save karein
      localStorage.setItem("token", token); 
      localStorage.setItem('user', JSON.stringify(user));
      
      // 3. USER KA NAAM ALERT MEIN DIKHAYEIN
      alert(`Welcome Back, ${user.name}!`); // 🔥 Yahan naam dikhega
      
      navigate('/');
    } else {
      alert("Login details incomplete from server");
    }

  } catch (err) {
    console.error("Login Error:", err);
    alert(err.response?.data?.msg || "Login failed");
  }
};  
return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Grid container: 1 column for mobile, 2 for desktop */}
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE: IMAGE */}
        <div className="hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop"
            alt="Islamic Art"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <p className="text-white text-lg font-semibold text-center leading-tight">
                "Ilm ki talash har Musalman par farz hai."
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Login / لاگ ان</h2>
            <p className="text-gray-500 mt-2">Apne account mein wapas aayein.</p>
          </div>

          <form onSubmit={handleSubmit} type="submit" className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-indigo-600 hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button className="w-full bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-800 transform active:scale-95 transition-all shadow-lg shadow-indigo-100">
              Login
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Naya account chahiye? <Link to="/signup" className="text-indigo-700 font-bold hover:underline">Register karein</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;