
// import React, { useState, useEffect } from 'react';
// import mbeshop from './assets/mbeshop.png';
// import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
// import { useLocation, Link, useNavigate } from 'react-router-dom';
// import SearchComponent from './SearchComponent';
// import { useCart } from './CartContext';
// import axios from 'axios';

// function Header() {
//     const auth = localStorage.getItem('user');
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { cart } = useCart();
//     const [isOpen, setIsOpen] = useState(false);

//     const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

//     useEffect(() => {
//         setIsOpen(false);
//     }, [location]);

//     // const logout = () => {
//     //     localStorage.clear();
//     //     navigate('/signup');
//     // };
//     const logout = async () => {
//     // 1. LocalStorage se user ki ID nikaalo
//     const auth = localStorage.getItem('user');
    
//     if (auth) {
//         try {
//             const user = JSON.parse(auth);
            
//             // 2. Backend ko request bhejo taaki DB mein status 'false' ho jaye
//             // Apni sahi API URL check kar lena (localhost:5000/logout)
//             await axios.post('http://localhost:5000/logout', { userId: user._id });
            
//             console.log("Database updated: User logged out");
//         } catch (error) {
//             console.error("DB status update failed:", error);
//         }
//     }

//     // 3. Browser ka data clear karo aur redirect karo
//     localStorage.clear();
//     navigate('/signup');
// };

//     return (
//         <nav className='sticky z-50 top-0 bg-indigo-900 text-white shadow-md'>
//             <div className='max-w-[1400px] mx-auto px-4'>
//                 <div className='flex justify-between items-center h-16 lg:h-20'>

//                     {/* 1. Logo Section */}
//                     <div className='flex items-center gap-2 shrink-0'>
//                         <Link to="/" className="flex items-center gap-2">
//                             {/* <img src={mbeshop} className='h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-indigo-400' alt="logo" /> */}
//                             <span className="font-bold text-2xl tracking-tight text-white">
//                                 Global<span className="text-indigo-400"> Deen Store</span>
//                             </span>
//                         </Link>
//                     </div>

//                     {/* 2. Desktop/Tablet Menu (Large screens only) */}
//                     {/* Yahan 'xl:flex' kiya hai taaki menu sirf badi screen par dikhe, tab par hamburger aaye */}
//                     <div className='hidden xl:flex items-center space-x-1 lg:space-x-4 md:lg:space-x-2'>
//                         <Link to="/" className='px-3 py-2 hover:bg-white/10 text-base transition rounded-md'>Home</Link>

//                         {/* Holy Quran Dropdown */}
//                         <div className='relative group'>
//                             <button className='px-3 py-2 hover:bg-white/10 transition rounded-md flex items-center gap-1'>
//                                 Holy Quran &#9662;
//                             </button>
//                             <div className='absolute left-0 hidden group-hover:block w-64 bg-indigo-900 shadow-2xl border-t-2 border-white pt-2'>
//                                 <ul className='py-2 bg-indigo-800 rounded-b-lg overflow-hidden'>
//                                     <Link to='/allproducts/holyquran/color-coded-quran'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Color Coded Quran</li></Link>
//                                     <Link to='/allproducts/holyquran/quran-arabic-translations'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Arabic Text Only</li></Link>
//                                     <Link to='/allproducts/holyquran/quran-english-translations'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran English Translation</li></Link>
//                                     <Link to='/allproducts/holyquran/quran-urdu-hindi-translations'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Urdu-Hindi Translations</li></Link>
//                                     <Link to='/allproducts/holyquran/quran-other-language'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Other Languages</li></Link>
//                                     <Link to='/allproducts/holyquran/quran-seprate-parts'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Separate Parts / Para</li></Link>
//                                     <Link to='/allproducts/holyquran/quran-in-zipper-case'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran in Zipper Case</li></Link>
//                                 </ul>
//                             </div>
//                         </div>

//                         <Link to='/allproducts/childrenbook' className='px-3 py-2 hover:bg-white/10 transition rounded-md'>Children Books</Link>

//                         {/* Islamic Books Dropdown */}
//                         <div className='relative group'>
//                             <button className='px-3 py-2 hover:bg-white/10 transition rounded-md flex items-center gap-1'>
//                                 Islamic Books &#9662;
//                             </button>
//                             <div className='absolute left-0 hidden group-hover:block w-48 bg-indigo-900 shadow-2xl border-t-2 border-white pt-2'>
//                                 <ul className='py-2 bg-indigo-800 rounded-b-lg overflow-hidden'>
//                                     <Link to='/allproducts/arabic'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Arabic Books</li></Link>
//                                     <Link to='/allproducts/englishbook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>English Books</li></Link>
//                                     <Link to='/allproducts/hindibook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Hindi Books</li></Link>
//                                     <Link to='/allproducts/urdubook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Urdu Books</li></Link>
//                                     <Link to='/allproducts/frenchbook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>French Books</li></Link>
//                                     <Link to='/allproducts/quida'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Qaida</li></Link>
//                                 </ul>
//                             </div>
//                         </div>

//                         <Link to='/aboutus' className='px-3 py-2 hover:bg-white/10 transition rounded-md'>About Us</Link>
//                         <Link to='/contactus' className='px-3 py-2 hover:bg-white/10 transition rounded-md'>Contact Us</Link>
//                     </div>

//                     {/* 3. Action Icons (Search, Cart, User) */}
//                     <div className='flex items-center gap-1 sm:gap-4'>
//                         {/* Search Bar - Hidden on Tablet/Mobile, Visible on Large Laptop */}
//                         <div className='hidden lg:block'>
//                             <SearchComponent />
//                         </div>

//                         {/* Auth Buttons */}
//                         <div className='hidden xl:flex items-center gap-1'>
//                             {auth ? (
//                                 <button onClick={logout} className='bg-red-500 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition'>Logout</button>
//                             ) : (
//                                 <div className='flex items-center gap-3 text-sm font-bold'>
//                                     <Link to='/login' className='hover:text-indigo-300 transition'>Login</Link>
//                                     <Link to='/signup' className='bg-white text-indigo-900 px-4 py-1.5 rounded-lg hover:bg-indigo-100 transition'>Signup</Link>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Cart Icon - Hamesha Dikhega */}
//                         <Link to="/cart" className="relative p-2.5 bg-indigo-800 hover:bg-indigo-900 rounded-full transition border border-indigo-700">
//                             <FaShoppingCart className="text-xl" />
//                             {totalItems > 0 && (
//                                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-indigo-900 animate-pulse">
//                                     {totalItems}
//                                 </span>
//                             )}
//                         </Link>

//                         {/* 4. Hamburger Menu (Visible on all screens below XL / 1280px) */}
//                         <button
//                             onClick={() => setIsOpen(!isOpen)}
//                             className='xl:hidden text-2xl p-2 rounded-lg hover:bg-indigo-800 transition'
//                         >
//                             {isOpen ? <FaTimes /> : <FaBars />}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* 5. Mobile & Tablet Sidebar Menu */}
//             <div className={`fixed inset-y-0 right-0 w-[280px] sm:w-[350px] bg-indigo-950 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//                 <div className='flex flex-col h-full p-6'>
//                     <div className='flex justify-between items-center border-b border-indigo-800 pb-4 mb-4'>
//                         <span className='font-bold text-xl'>Navigation</span>
//                         <FaTimes onClick={() => setIsOpen(false)} className="text-2xl cursor-pointer" />
//                     </div>

//                     <div className='lg:hidden mb-6'>
//                         <SearchComponent />
//                     </div>

//                     <div className='flex-1 overflow-y-auto space-y-1 custom-scrollbar'>
//                         <Link to="/" className='block p-3 rounded-xl hover:bg-indigo-800'>Home</Link>

//                         <div className="py-2 px-3 text-indigo-400 text-xs font-bold uppercase tracking-widest mt-2">Categories</div>
//                         <Link to="/allproducts/holyquran" className='block p-3 rounded-xl hover:bg-indigo-800 border-l-4 border-yellow-500 bg-indigo-900/50'>Holy Quran</Link>
//                         <Link to="/allproducts/childrenbook" className='block p-3 rounded-xl hover:bg-indigo-800'>Children Books</Link>
//                         <Link to="/allproducts/urdubook" className='block p-3 rounded-xl hover:bg-indigo-800'>Islamic Books</Link>

//                         <div className="py-2 px-3 text-indigo-400 text-xs font-bold uppercase tracking-widest mt-4">Support</div>
//                         <Link to="/aboutus" className='block p-3 rounded-xl hover:bg-indigo-800'>About Us</Link>
//                         <Link to="/contactus" className='block p-3 rounded-xl hover:bg-indigo-800'>Contact Us</Link>
//                     </div>

//                     {/* <div className='mt-auto pt-6 border-t border-indigo-800'>
//                         {auth ? (
//                             <button onClick={logout} className='w-full bg-red-500 py-3 rounded-xl font-bold'>Logout Account</button>
//                         ) : (
//                             <div className='grid grid-cols-2 gap-3'>
//                                 <Link to='/login' className='bg-white text-indigo-950 text-center py-3 rounded-xl font-bold'>Login</Link>
//                                 <Link to='/signup' className='bg-indigo-900 text-white text-center py-3 rounded-xl font-bold'>Signup</Link>
//                             </div>
//                         )}
//                     </div> */}
//                 </div>
//             </div>

//             {/* Overlay for Mobile Sidebar */}
//             {isOpen && <div onClick={() => setIsOpen(false)} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden' />}
//         </nav>
//     );
// }

// export default Header;





import React, { useState, useEffect } from 'react';
import mbeshop from './assets/mbeshop.png';
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import { useCart } from './CartContext';
import axios from 'axios';

function Header() {
    const auth = localStorage.getItem('user');
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    
    // 🔥 ड्रॉपडाउन स्टेट: केवल लॉगिन यूजर के "My Account" के लिए
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        setIsOpen(false);
        setIsDropdownOpen(false); // रूट बदलने पर ड्रॉपडाउन बंद हो जाए
    }, [location]);

    const logout = async () => {
        const authData = localStorage.getItem('user');
        
        if (authData) {
            try {
                const user = JSON.parse(authData);
                // await axios.post('/api/logout', { userId: user._id });
                await axios.post('http://localhost:5000/logout', { userId: user._id });
                console.log("Database updated: User logged out");
            } catch (error) {
                console.error("DB status update failed:", error);
            }
        }

        localStorage.clear();
        navigate('/signup');
    };

    return (
        <nav className='sticky z-50 top-0 bg-indigo-900 text-white shadow-md'>
            <div className='max-w-[1400px] mx-auto px-4'>
                <div className='flex justify-between items-center h-16 lg:h-20'>

                    {/* 1. Logo Section */}
                    <div className='flex items-center gap-2 shrink-0'>
                        <Link to="/" className="flex items-center gap-2">
                            <span className="font-bold text-2xl tracking-tight text-white">
                                Global<span className="text-indigo-400"> Store</span>
                            </span>
                        </Link>
                    </div>

                    {/* 2. Desktop/Tablet Menu */}
                    <div className='hidden xl:flex items-center space-x-1 lg:space-x-4 md:lg:space-x-2'>
                        <Link to="/" className='px-3 py-2 hover:bg-white/10 text-base transition rounded-md'>Home</Link>

                        {/* Holy Quran Dropdown */}
                        <div className='relative group'>
                            <button className='px-3 py-2 hover:bg-white/10 transition rounded-md flex items-center gap-1'>
                                Holy Quran &#9662;
                            </button>
                            <div className='absolute left-0 hidden group-hover:block w-64 bg-indigo-900 shadow-2xl border-t-2 border-white pt-2'>
                                <ul className='py-2 bg-indigo-800 rounded-b-lg overflow-hidden'>
                                    <Link to='/allproducts/holyquran/color-coded-quran'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Color Coded Quran</li></Link>
                                    <Link to='/allproducts/holyquran/quran-arabic-translations'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Arabic Text Only</li></Link>
                                    <Link to='/allproducts/holyquran/quran-english-translations'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran English Translation</li></Link>
                                    <Link to='/allproducts/holyquran/quran-urdu-hindi-translations'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Urdu-Hindi Translations</li></Link>
                                    <Link to='/allproducts/holyquran/quran-other-language'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Other Languages</li></Link>
                                    <Link to='/allproducts/holyquran/quran-seprate-parts'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran Separate Parts / Para</li></Link>
                                    <Link to='/allproducts/holyquran/quran-in-zipper-case'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Quran in Zipper Case</li></Link>
                                </ul>
                            </div>
                        </div>

                        <Link to='/allproducts/childrenbook' className='px-3 py-2 hover:bg-white/10 transition rounded-md'>Children Books</Link>

                        {/* Islamic Books Dropdown */}
                        <div className='relative group'>
                            <button className='px-3 py-2 hover:bg-white/10 transition rounded-md flex items-center gap-1'>
                                Islamic Books &#9662;
                            </button>
                            <div className='absolute left-0 hidden group-hover:block w-48 bg-indigo-900 shadow-2xl border-t-2 border-white pt-2'>
                                <ul className='py-2 bg-indigo-800 rounded-b-lg overflow-hidden'>
                                    <Link to='/allproducts/arabic'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Arabic Books</li></Link>
                                    <Link to='/allproducts/englishbook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>English Books</li></Link>
                                    <Link to='/allproducts/hindibook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Hindi Books</li></Link>
                                    <Link to='/allproducts/urdubook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Urdu Books</li></Link>
                                    <Link to='/allproducts/frenchbook'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>French Books</li></Link>
                                    <Link to='/allproducts/quida'><li className='px-4 py-2 hover:bg-white hover:text-indigo-900'>Qaida</li></Link>
                                </ul>
                            </div>
                        </div>

                        <Link to='/aboutus' className='px-3 py-2 hover:bg-white/10 transition rounded-md'>About Us</Link>
                        <Link to='/contactus' className='px-3 py-2 hover:bg-white/10 transition rounded-md'>Contact Us</Link>
                    </div>

                    {/* 3. Action Icons (Search, Cart, User Dropdown) */}
                    <div className='flex items-center gap-1 sm:gap-4'>
                        <div className='hidden lg:block'>
                            <SearchComponent />
                        </div>

                        {/* 🔥 Auth Section: Logout बटन की जगह प्रीमियम ड्रॉपडाउन */}
                        <div className='hidden xl:flex items-center gap-1'>
                            {auth ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className='bg-indigo-800 border border-indigo-700 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition flex items-center gap-1'
                                    >
                                        My Account &#9662;
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-44 bg-white text-slate-800 rounded-lg shadow-2xl py-1 z-50 border border-slate-100 overflow-hidden">
                                            <Link 
                                                to='/my-orders' 
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="block px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 transition-colors border-b border-slate-100"
                                            >
                                                📦 My Orders
                                            </Link>
                                            <button 
                                                onClick={() => { setIsDropdownOpen(false); logout(); }} 
                                                className='w-full text-left block px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors'
                                            >
                                                🚪 Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='flex items-center gap-3 text-sm font-bold'>
                                    <Link to='/login' className='hover:text-indigo-300 transition'>Login</Link>
                                    <Link to='/signup' className='bg-white text-indigo-900 px-4 py-1.5 rounded-lg hover:bg-indigo-100 transition'>Signup</Link>
                                </div>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <Link to="/cart" className="relative p-2.5 bg-indigo-800 hover:bg-indigo-900 rounded-full transition border border-indigo-700">
                            <FaShoppingCart className="text-xl" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-indigo-900 animate-pulse">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='xl:hidden text-2xl p-2 rounded-lg hover:bg-indigo-800 transition'
                        >
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 5. Mobile & Tablet Sidebar Menu */}
            <div className={`fixed inset-y-0 right-0 w-[280px] sm:w-[350px] bg-indigo-950 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='flex flex-col h-full p-6'>
                    <div className='flex justify-between items-center border-b border-indigo-800 pb-4 mb-4'>
                        <span className='font-bold text-xl'>Navigation</span>
                        <FaTimes onClick={() => setIsOpen(false)} className="text-2xl cursor-pointer" />
                    </div>

                    <div className='lg:hidden mb-6'>
                        <SearchComponent />
                    </div>

                    <div className='flex-1 overflow-y-auto space-y-1 custom-scrollbar'>
                        <Link to="/" className='block p-3 rounded-xl hover:bg-indigo-800'>Home</Link>

                        <div className="py-2 px-3 text-indigo-400 text-xs font-bold uppercase tracking-widest mt-2">Categories</div>
                        <Link to="/allproducts/holyquran" className='block p-3 rounded-xl hover:bg-indigo-800 border-l-4 border-yellow-500 bg-indigo-900/50'>Holy Quran</Link>
                        <Link to="/allproducts/childrenbook" className='block p-3 rounded-xl hover:bg-indigo-800'>Children Books</Link>
                        <Link to="/allproducts/urdubook" className='block p-3 rounded-xl hover:bg-indigo-800'>Islamic Books</Link>

                        <div className="py-2 px-3 text-indigo-400 text-xs font-bold uppercase tracking-widest mt-4">Support</div>
                        <Link to="/aboutus" className='block p-3 rounded-xl hover:bg-indigo-800'>About Us</Link>
                        <Link to="/contactus" className='block p-3 rounded-xl hover:bg-indigo-800'>Contact Us</Link>
                    </div>

                    {/* 🔥 Mobile Sidebar Bottom Section - यहाँ भी My Orders को कंडीशनल कर दिया है */}
                    <div className='mt-auto pt-6 border-t border-indigo-800 space-y-3'>
                        {auth ? (
                            <>
                                <Link 
                                    to='/my-orders' 
                                    className='block w-full bg-indigo-800 text-center py-3 rounded-xl font-bold border border-indigo-700 hover:bg-indigo-700 transition'
                                >
                                    📦 My Orders (मेरे ऑर्डर्स)
                                </Link>
                                <button onClick={logout} className='w-full bg-red-500 py-3 rounded-xl font-bold hover:bg-red-600 transition'>
                                    Logout Account
                                </button>
                            </>
                        ) : (
                            <div className='grid grid-cols-2 gap-3'>
                                <Link to='/login' className='bg-white text-indigo-950 text-center py-3 rounded-xl font-bold'>Login</Link>
                                <Link to='/signup' className='bg-indigo-900 text-white text-center py-3 rounded-xl font-bold'>Signup</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for Mobile Sidebar */}
            {isOpen && <div onClick={() => setIsOpen(false)} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden' />}
        </nav>
    );
}

export default Header;