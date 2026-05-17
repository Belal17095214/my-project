import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react'; // Icons ke liye

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const clearData = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  // const handleSubmit = async(e) => {
  //   e.preventDefault();
        // const result = await axios.post('http://localhost:5000/contactus', formData);

  //   // Yahan aap apna backend ya email logic add kar sakte hain
  //   console.log("Form Submitted:", result);
  //   alert("Shukriya! Hum jald hi aap se raabta karenge.");
  //   clearData();
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      // 1. API Call
      // const result = await axios.post('https://q8cmhd59-5000.inc1.devtunnels.ms/contactus', formData);
        // const result = await axios.post('/api/contactus', formData);
        const result = await axios.post('http://localhost:5000/contactus', formData);

      // 2. Success Logic
      console.log("Form Submitted Successfully:", result.data);
      alert("Shukriya! Hum jald hi aap se raabta karenge.");

      // Data tabhi clear karein jab request successful ho
      clearData();

    } catch (err) {
      // 3. Error Handling (Zaroori hai!)
      console.error("Submission Error:", err);
      alert(err.response?.data?.msg || "Maazrat! Form submit nahi ho saka.");
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-indigo-900 sm:text-5xl">
            Contact Us
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Have a question? Message us, we are here to help you.|| کیا آپ کا کوئی سوال ہے؟ ہمیں پیغام بھیجیں، ہم آپ کی مدد کے لیے حاضر ہیں۔
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Left Side: Contact Information */}
          <div className="bg-indigo-900 p-10 text-white">
            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-indigo-300 shrink-0" />
                <p className="text-lg">
                  MB Eshop, Khan House 102 Near Gita Mandal Hospital <br />
                  Anglo Kabristan KoirPurwa Buxer (802101) Bihar
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {/* Icon Wrapper */}
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-indigo-300 shrink-0" />
                  <p className="text-lg font-medium">+91 8969145241</p>
                </div>

                {/* Separator Pipe (Optional: Sirf laptop screen par dikhega) */}
                <span className="hidden sm:block text-indigo-300">|</span>

                {/* Second Number (Mobile par thoda margin left lega icon ke alignment ke liye) */}
                <div className="pl-10 sm:pl-0">
                  <p className="text-lg font-medium">+91 6201797659</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
  {/* Icon with hover effect */}
  <Mail className="w-6 h-6 text-indigo-300 shrink-0 group-hover:scale-110 transition-transform" />
  
  {/* Link to make it functional */}
  <a 
    href="mailto:mbeshop.official@gmail.com" 
    className="text-base sm:text-lg break-all sm:break-normal hover:text-indigo-200 transition-colors"
  >
    mbeshop.official@gmail.com
  </a>
</div>
            </div>

            {/* Simple Map Placeholder */}
            <div className="mt-12 w-full h-64 bg-gray-200 rounded-lg overflow-hidden border-2 border-indigo-400 shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d213.83350410739132!2d83.9569896650868!3d25.55725684077678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDMzJzI0LjgiTiA4M8KwNTcnMjYuOCJF!5e1!3m2!1sen!2sin!4v1768892181160!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 bg-gray-50"
                  placeholder="Aapka Naam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 bg-gray-50"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 bg-gray-50"
                  placeholder="Aapka Sawal..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold transition duration-200"
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;

