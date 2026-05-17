import { useState } from 'react'
import data from "../assets/data.json";

import { Link } from "react-router-dom";
import React from 'react';
import { useCart } from '../CartContext';

function Frenchbook() {
  const { addToCart } = useCart();


  const [display, setDisplay] = useState(true);
  const categoryData = data?.find(book => book.category === "frenchbook");
  const allBooks = categoryData?.books || [];
  const booksToRender = display ? allBooks.slice(0, 12) : allBooks;
  console.log(data);
  const handleAddToCart = (book) => {
    console.log("Adding this book to cart:", book); // Ab yahan 'title' dikhayega console mein

    addToCart({
      ...book, // Isme id, title, data1 sab hai
      quantity: 1
    });

    alert(`${book.title} added to cart!`);

  };

  const handleClick = () => {
    setDisplay(!display);
  };


  return (
    <>
      <div className="text-indigo-900  mt-15 mb-8 text-2xl sm:text-5xl font-bold text-center">
        French Books
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-4 lg:px-30">
        {booksToRender.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Image */}
            <Link to={`/products/frenchbook/${book.id}`}>
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={book?.image2?.split("\n")[0]}
                  alt={book?.title}
                  className="w-full h-full  hover:scale-105 transition object-cover"
                />



              </div>
            </Link>

            {/* Text bottom */}
            <div className="p-3 text-center">
              <h3 className="text-sm font-medium truncate">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">{book.data1}</p>

              <button onClick={() => handleAddToCart(book)} className='bg-white rounded text-center p-2 mx- mb-4 hover:text-white focus:bg-indigo-950 hover:bg-indigo-900 text-indigo-900 border border-indigo-900 transition text-sm font-semibold'>
                Add to cart<span className='font-extrabold'>→</span></button>
            </div>
          </div>
        ))}
      </div>
      <Link to={`/allproducts/frenchbook`}>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-indigo-700 hover:bg-indigo-900 text-white rounded"
          >
            {display ? "View All Books" : "Show Less"}
          </button>
        </div>
      </Link>


    </>
  )
};


export default Frenchbook