import React from 'react';
import { BookOpen, Users, Award, ShieldCheck } from 'lucide-react'; // Icons ke liye
import image from './assets/image.avif'



const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-900 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Our Story / ہماری کہانی</h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
          Providing authentic Islamic literature to seekers of knowledge since 2010. 
          Hamara maqsad sahi aur mustanad islami kitabein aap tak pahunchana hai.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hamara Maqsad (Our Mission)</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Humne is safar ki shuruat isliye ki taaki duniya bhar mein log asani se deeni maloomat hasil kar sakein. 
              Chahe wo Quran ho, Hadith ki kitabein hon ya bacchon ke liye islami kahaniyan, hum har cheez ko bhetar quality mein faraham karte hain.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Hamari koshish hai ki har ghar mein ilm ki roshni pahuche aur har shakhs sahi deen se waqif ho.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={image}
              alt="Islamic Library" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Features / Why Choose Us */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-indigo-50 rounded-xl">
            <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Wide Collection</h3>
            <p className="text-sm text-gray-600 mt-2">10,000+ se zyada kitabon ka majmua.</p>
          </div>

          <div className="text-center p-6 bg-indigo-50 rounded-xl">
            <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Authentic Content</h3>
            <p className="text-sm text-gray-600 mt-2">Sirf mustanad aur sahi deeni maloomat.</p>
          </div>

          <div className="text-center p-6 bg-indigo-50 rounded-xl">
            <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Expert Team</h3>
            <p className="text-sm text-gray-600 mt-2">Ilmi mahireen ki nigrani mein chuna gaya data.</p>
          </div>

          <div className="text-center p-6 bg-indigo-50 rounded-xl">
            <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-white w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900">Fast Delivery</h3>
            <p className="text-sm text-gray-600 mt-2">Poore mulk mein sabse tez delivery.</p>
          </div>
        </div>

        {/* Language Values Section */}
        <div className="mt-20 border-t pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <h4 className="text-xl font-bold text-indigo-800">Knowledge</h4>
                    <p className="text-gray-500 mt-2">Knowledge is the light that guides us.</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-indigo-800">Ilm (علم)</h4>
                    <p className="text-gray-500 mt-2">علم وہ روشنی ہے جو ہمیں راستہ دکھاتی ہے۔</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-indigo-800">Gyan (ज्ञान)</h4>
                    <p className="text-gray-500 mt-2">ज्ञान वह प्रकाश है जो हमें मार्ग दिखाता है।</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;