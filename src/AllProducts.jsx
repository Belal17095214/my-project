// import  { useState } from 'react'
// import data from "./assets/data.json";
// import { Link, useParams } from "react-router-dom";
// import React from 'react';
// import { useCart } from './CartContext';

// function AllProducts() {
//     const { addToCart } = useCart();
//   const { category, subcategories } = useParams();
//   const [display, setDisplay] = useState(true);

//   // 1. Sahi category dhoondo
//   const Category = data?.find(cat => cat.category === category);
  
//   let booksToDisplay = [];
//   const handleAddToCart = (book) => {
//   console.log("Adding this book to cart:", book); // Ab yahan 'title' dikhayega console mein

//   addToCart({
//     ...book, // Isme id, title, data2 sab hai
//     quantity: 1
//   });

//   alert(`${book.title} added to cart!`);

//   };

//   // 2. Filter Logic (Category & Subcategory)
//   if (Category?.subcategories) {
//     if (subcategories) {
//       // Agar URL mein subcategory hai (e.g., color-coded-quran)
//       const sub = Category.subcategories.find(s => s.name === subcategories);
//       // Har book ke saath uska subName save karein taaki Link sahi bane
//       booksToDisplay = sub ? sub.books.map(b => ({ ...b, subName: sub.name })) : [];
//     } else {
//       // Agar subcategory nahi hai, toh saari subcategories ki books dikhao
//       booksToDisplay = Category.subcategories.flatMap(sub => 
//         sub.books.map(b => ({ ...b, subName: sub.name }))
//       );
//     }
//   } else {
//     // Simple category (Urdu, Arabic etc.) ke liye
//     booksToDisplay = Category?.books?.map(b => ({ ...b, subName: '' })) || [];
//   }

//   // Heading Logic
//   const getCategoryHeading = () => {
//     if (subcategories) return subcategories.replace(/-/g, ' '); // Subcategory name as heading
    
//     switch (category?.toLowerCase()) {
//       case 'holyquran': return "Holy Quran & Mushaf";
//       case 'arabic': return "Arabic Collection ";
//       case 'urdubook': return "Urdu Collection";
//       case 'frenchbook': return "French Collection "
//       case 'hindibook': return "Hindi Collection "
//       case 'englishbook': return "English Collection "
//       case 'quida': return "Quida Collection "
//       case 'childrenbook': return "Children Book Collection "
//       default: return category ? `${category} Collection` : "Islamic Library";
//     }
//   };

//   return (
//     <>
//       <div   className="text-indigo-900 mt-15 mb-8 text-2xl sm:text-5xl font-bold text-center">
//         {getCategoryHeading()}
//       </div>

//       <div  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-4 lg:px-30 overflow-auto no-scrollbar ">
//         {booksToDisplay.map((book) => (
//           <div key={book.id}  className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between">
            
//             {/* Image & Link */}
//             {/* Agar subName hai toh wahi use karega, warna params wala subcategories, warna empty */}
//             <Link to={`/products/${category}/${book.subName || subcategories}/${book.id}`}>
//               <div className="relative w-full h-64 overflow-hidden">
//                 <img
//                   src={book?.image2?.split("\n")[0]}
//                   alt={book?.title}
//                   className="w-full h-full hover:scale-105 transition object-cover"
//                 />
//               </div>
//             </Link>

//             {/* Text details */}
//             <div className="p-3 text-center">
//               <h3 className="text-sm font-medium line-clamp-2 h-10">
//                 {book.title}
//               </h3>
//               <p className="text-sm text-gray-600 font-bold mt-2">{book.data2}</p>
//             </div>

//             <button  onClick={() => handleAddToCart(book)} className='bg-white rounded text-center p-2 mx-4 mb-4 hover:text-white focus:bg-indigo-950 focus:text-white hover:bg-indigo-900 text-indigo-900 border border-indigo-900 transition'>
//               Add to cart <span className='font-extrabold'>→</span>
//             </button>
//           </div>
//         ))}
//       </div>

//       {booksToDisplay.length === 0 && (
//         <div className="text-center p-20 text-gray-500">No products found in this section.</div>
//       )}
//     </>
//   );
// }

// export default AllProducts;
import { useState, useEffect } from 'react' // useEffect add kiya
import data from "./assets/data.json";
import { Link, useParams } from "react-router-dom";
import React from 'react';
import { useCart } from './CartContext';

// Helper function Encoding errors theek karne ke liye
const L = (text) => {
  if (!text) return "";
  try { return decodeURIComponent(escape(text)); } catch { return text; }
};

function AllProducts() {
  const { addToCart } = useCart();
  const { category, subcategories } = useParams();
  
  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Ek page par 12 books

  // Jab bhi category ya subcategory badle, page 1 par wapas jao
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategories]);

  const Category = data?.find(cat => cat.category === category);
  let booksToDisplay = [];

  const handleAddToCart = (book) => {
    addToCart({ ...book, quantity: 1 });
    alert(`${L(book.title)} added to cart!`);
  };

  // Filter Logic
  if (Category?.subcategories) {
    if (subcategories) {
      const sub = Category.subcategories.find(s => s.name === subcategories);
      booksToDisplay = sub ? sub.books.map(b => ({ ...b, subName: sub.name })) : [];
    } else {
      booksToDisplay = Category.subcategories.flatMap(sub => 
        sub.books.map(b => ({ ...b, subName: sub.name }))
      );
    }
  } else {
    booksToDisplay = Category?.books?.map(b => ({ ...b, subName: '' })) || [];
  }

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = booksToDisplay.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(booksToDisplay.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryHeading = () => {
    if (subcategories) return L(subcategories.replace(/-/g, ' '));
    const headings = {
      'holyquran': "Holy Quran & Mushaf",
      'arabic': "Arabic Collection",
      'urdubook': "Urdu Collection",
      'frenchbook': "French Collection",
      'hindibook': "Hindi Collection",
      'englishbook': "English Collection",
      'quida': "Quida Collection",
      'childrenbook': "Children Book Collection"
    };
    return headings[category?.toLowerCase()] || (category ? `${category} Collection` : "Islamic Library");
  };

  return (
    <div className="select-none"> {/* Blinking cursor hatane ke liye */}
      <div className="text-indigo-900 mt-15 mb-8 text-2xl sm:text-5xl font-bold text-center uppercase">
        {getCategoryHeading()}
      </div>

      {/* Grid: Ab currentItems use karenge booksToDisplay ki jagah */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-4 lg:px-30">
        {currentItems.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between hover:shadow-indigo-200 transition">
            <Link to={`/products/${category}/${book.subName || subcategories}/${book.id}`}>
              <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                <img
                  src={book?.image2?.split("\n")[0]}
                  alt={L(book?.title)}
                  className="w-full h-full hover:scale-105 transition object-cover"
                />
              </div>
            </Link>

            <div className="p-3 text-center">
              {/* L(book.title) se kachra saaf ho jayega */}
              <h3 className="text-sm font-medium line-clamp-2 h-10 text-gray-800">
                {L(book.title)}
              </h3>
              <p className="text-sm text-indigo-700 font-bold mt-2">{book.data1}</p>
              {/* <p className="text-sm text-indigo-700 font-bold mt-2">{book.data1}</p> */}
            </div>

            <button onClick={() => handleAddToCart(book)} className='bg-white rounded text-center p-2 mx-4 mb-4 hover:text-white focus:bg-indigo-950 hover:bg-indigo-900 text-indigo-900 border border-indigo-900 transition text-sm font-semibold'>
              Add to cart <span className='font-extrabold'>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* --- Pagination UI --- */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 mb-20 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-100 transition"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded-md border transition ${
                currentPage === i + 1 ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-50 text-indigo-900'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      )} */}
      {totalPages > 1 && (
  <div className="flex flex-col items-center mt-12 mb-20 gap-4">
    
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* Prev Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border rounded-md disabled:opacity-30 bg-white text-indigo-900 hover:bg-gray-100 transition text-sm font-semibold"
      >
        Prev
      </button>

      {/* Dynamic Page Numbers */}
      {[...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1;

        // Logic for Responsive Dots
        // Laptop (lg) par hum zyada pages dikhayenge
        // Mobile (sm) par hum sirf Current aur uske agal-bagal wale dikhayenge
        const isMobile = window.innerWidth < 640;
        const showThreshold = isMobile ? 1 : 2; // Mobile pe 1 page gap, Laptop pe 2

        if (
          pageNum !== 1 && 
          pageNum !== totalPages && 
          Math.abs(pageNum - currentPage) > showThreshold
        ) {
          if (pageNum === currentPage - showThreshold - 1 || pageNum === currentPage + showThreshold + 1) {
            return <span key={pageNum} className="px-1 text-gray-400">...</span>;
          }
          return null;
        }

        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md border transition flex items-center justify-center text-sm font-bold ${
              currentPage === pageNum 
              ? 'bg-indigo-900 text-white border-indigo-900 shadow-lg scale-110' 
              : 'bg-white text-indigo-900 hover:bg-indigo-50 border-gray-300'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border rounded-md disabled:opacity-30 bg-white text-indigo-900 hover:bg-gray-100 transition text-sm font-semibold"
      >
        Next
      </button>
    </div>

    {/* Current Status for clarity on small screens */}
    <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
      Page {currentPage} of {totalPages}
    </div>
  </div>
)}

      {booksToDisplay.length === 0 && (
        <div className="text-center p-20 text-gray-500 italic">No products found in this section.</div>
      )}
    </div>
  );
}

export default AllProducts;