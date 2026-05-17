import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import image from './assets/image.avif'

// const main=async ()=>{
//   let data=await dbConnect();
//   data=await login.find().toArray();
//   console.log(data)
// }
// main();
const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  // console.log(formData);

  const navigate = useNavigate();

 
    const auth = localStorage.getItem('user');
    if (auth) {
    return <Navigate to="/" />; 
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Password Match Check
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match! / پاسورڈ مطابقت نہیں رکھتے");
    }

    try {
      // const result = await axios.post('/api/register', formData);
      const result = await axios.post('http://localhost:5000/register', formData);
      // const result = await axios.post('https://q8cmhd59-5000.inc1.devtunnels.ms/register', formData);
      
      localStorage.setItem("user", JSON.stringify(result.data));

      alert("Account Created!");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || "Error occurred");
    }
   

      alert(res.data.msg);
     
   
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SIDE: IMAGE */}
        <div className="hidden md:block relative">
          <img
           src={image}
            alt="Islamic Books"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Image ke upar halka sa overlay text agar chahiye ho */}
          <div className="absolute inset-0 bg-indigo-900/20 flex items-end p-8">
            <p className="text-white text-xl font-medium italic">
              "Ilm ki roshni har ghar tak..."
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">Humari community ka hissa banein.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Aapka Naam"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button className="w-full bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-800 transform active:scale-95 transition-all shadow-lg shadow-indigo-200">
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Pehle se account hai? <Link to="/login" className="text-indigo-700 font-bold hover:underline">Login karein</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;