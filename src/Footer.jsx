
import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-indigo-900 mt-10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-indigo-800 pb-8">
          
          {/* LEFT - Brand & Tagline */}
          <div className="text-center md:text-left">
            <span className="font-bold text-2xl tracking-tight text-white">
              MB E-<span className="text-indigo-400">shop</span>
            </span>
            <p className="text-indigo-200 text-sm mt-1">Your trusted gateway to Islamic literature.</p>
          </div>

          {/* RIGHT - Social Icons */}
          <div className="flex gap-4">
            {/* <a href="#" className="p-3 rounded-full bg-indigo-800 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="p-3 rounded-full bg-indigo-800 hover:bg-pink-500 hover:-translate-y-1 transition-all duration-300">
              <FaInstagram size={18} />
            </a> */}
            <a href="mailto:mbeshop.official@gmail.com" className="p-3 rounded-full bg-indigo-800 hover:bg-red-500 hover:-translate-y-1 transition-all duration-300">
              <MdEmail size={18} />
            </a>
            <a 
              href="https://wa.me/918969145241"
              target="_blank"
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-indigo-800 hover:bg-green-500 hover:-translate-y-1 transition-all duration-300"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>

        {/* BOTTOM - Copyright & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 text-sm text-indigo-300 gap-4">
          <p>© 2026 Mb Eshop t/a Mbeshop.com – All rights reserved.</p>
          
          {/* <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Shipping Info</a>
          </div> */}
        </div>

      </div>
    </footer>
  );
}

export default Footer;