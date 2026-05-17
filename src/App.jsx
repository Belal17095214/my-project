import { Routes, Route, useNavigate } from "react-router-dom";
import { ProductContext } from "./Context/CreateContext";
import data from "./assets/data.json";
import Slider from './Slider'
import Arabicbook from "./Books/Arabicbook";
import Urdubook from "./Books/Urdubook";
import Hindibook from "./Books/Hindibook";
import Englishbook from "./Books/Englishbook";
import Holyquran from "./Books/Holyquran";
import Childrenbook from "./Books/Childrenbook";
import Quida from "./Books/Quida";
import Frenchbook from "./Books/Frenchbook";
import Banglabook from "./Books/Banglabook";
import Products from "./Products";
import Home from "./Home";
import AllProducts from "./AllProducts";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";
import { LogIn } from "lucide-react";
import Login from './Login'
import Signup from './Signup'
import Privatecomponent from "./PrivateComponent";
import { useEffect } from "react";
import { CartProvider } from './CartContext';
import Cart from "./Cart";
import Checkout from "./Checkout";
import ProductPrice from "./ProductPrice";
import MyOrdersPage from './MyOrdersPage';

function App() {
  // console.log(data);


  return (
    <>



      <Routes>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path='/' element={<Home />} />
        {/* <Route element={<Privatecomponent />}> */}

        <Route path="/urdu" element={<Urdubook />} />
        <Route path="arabic" element={<Arabicbook />} />

        <Route path="/hindi" element={<Hindibook />} />
        <Route path="/english" element={<Englishbook />} />
        <Route path="/holyquran" element={<Holyquran />} />
        <Route path="/children" element={<Childrenbook />} />
        <Route path="/quida" element={<Quida />} />
        <Route path="/french" element={<Frenchbook />} />

        <Route path="/products/:category/:subcategories?/:id" element={<Products />} />
        <Route path="/allproducts/:category/:subcategories?" element={<AllProducts />} />
        {/* </Route> */}
        <Route path="/login" element={<Login />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="*" element={<Home />} />

        {/* <Route path=':id' element={<Products />} /> */}
      </Routes>



    </>

  );
}

export default App;
