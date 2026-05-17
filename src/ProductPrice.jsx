import React, { useState, useEffect } from 'react';

const ProductPrice = ({ product }) => {
  const [rates, setRates] = useState({});
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  // 1. Live Exchange Rates Fetch करना (Standard Practice)
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        setRates(data.rates);
        setLoading(false);
      });
  }, []);

  // 2. Built-in 'Intl' API से देश का नाम निकालना
  const getCountryName = (currencyCode) => {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      // यहाँ हम करेंसी कोड के पहले 2 अक्षरों को Country Code मान रहे हैं (जैसे US, IN)
      return regionNames.of(currencyCode.slice(0, 2));
    } catch {
      return currencyCode;
    }
  };

  const basePrice = parseFloat(product?.data1?.replace(/[$,]/g, '') || 0);

  if (loading) return <div>Loading Live Rates...</div>;

  return (
    <div className="p-5 border rounded-2xl shadow-sm bg-white max-w-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Currency:</label>
      
      {/* 3. Built-in Rates Object से Dropdown बनाना */}
      <select 
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500"
      >
        {/* हम यहाँ मुख्य करेंसी दिखा रहे हैं, आप Object.keys(rates) भी कर सकते हैं */}
        {['USD', 'INR', 'EUR', 'GBP', 'AED', 'SAR', 'CAD', 'JPY'].map(cur => (
          <option key={cur} value={cur}>
            {cur} - {getCountryName(cur)}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <h3 className="text-gray-500 text-sm">Converted Price</h3>
        <p className="text-4xl font-black text-indigo-700">
          {/* Built-in Intl.NumberFormat for Perfect Formatting */}
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
          }).format(basePrice * (rates[currency] || 1))}
        </p>
      </div>
    </div>
  );
};

export default ProductPrice;