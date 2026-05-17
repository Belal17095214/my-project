// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from "react-router";
// import './index.css'
// import App from './App.jsx'
// import Header from './Header.jsx';
// import Footer from './Footer.jsx';
// import { CartProvider } from './CartContext';

// createRoot(document.getElementById('root')).render(
//   <CartProvider>
//   <BrowserRouter>
   
//       <Header />
//       <App />
//       <Footer/>
    

//   </BrowserRouter>
//   </CartProvider>
//   ,
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.jsx'
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { CartProvider } from './CartContext';
// 1. PayPal Provider को इम्पोर्ट करें
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// 2. PayPal की सेटिंग्स (इसे आप .env से भी ले सकते हैं)
const initialOptions = {
  "client-id": "AU3e0TKzrbEhmgfjSLI1LNh9zFjQUmgImltPW3k7Ng7pv1Rcdc4mZoEp66rh69DkXoC4XDIemO3v0-V8", 
  currency: "USD",
  intent: "capture",
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. पूरे ऐप को PayPalScriptProvider के अंदर रैप करें */}
    <PayPalScriptProvider options={initialOptions}>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <App />
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </PayPalScriptProvider>
  </StrictMode>
)