import React, { useState, useRef, useEffect } from 'react';
import allData from './assets/data.json';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
  const [searchItem, setSearchItem] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // FIX: Data Flat karte waqt Category aur Subcategory ko book ke andar daalna zaroori hai
  const allBooks = allData?.flatMap(cat => {
    // Agar subcategories hain
    if (cat.subcategories) {
      return cat.subcategories.flatMap(sub => 
        sub.books.map(book => ({
          ...book,
          parentCategory: cat.category,
          parentSubcategory: sub.name
        }))
      );
    }
    // Agar direct books hain
    return (cat.books || []).map(book => ({
      ...book,
      parentCategory: cat.category,
      parentSubcategory: 'general'
    }));
  }) || [];

  const filteredResults = allBooks.filter((book) => {
    return book?.title?.toLowerCase().includes(searchItem.toLowerCase()) ||
      book?.author?.toLowerCase().includes(searchItem.toLowerCase())
  }).slice(0, 10);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchItem("")
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} style={{ padding: '5px', maxWidth: '500px', margin: '0', position: 'relative' }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchItem}
        onChange={(e) => {
          setSearchItem(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        className="w-80  p-2 bg-white border text-black rounded-lg shadow-sm focus:outline-none"
      />

      {showDropdown && searchItem && (
        <div 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
          className="mt-1 bg-white border absolute left-0 w-full rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 [&::-webkit-scrollbar]:hidden"
        >
          {filteredResults.length > 0 ? filteredResults.map((book, index) => (
            <div
              key={index}
              onClick={() => {
                // AB YE SAHI CHALEGA: Kyunki humne upar parentCategory inject kar di hai
                const cat = book.parentCategory;
                const sub = book.parentSubcategory;
                const id = book.id;

                navigate(`/products/${cat}/${sub}/${id}`);
                setShowDropdown(false);
                setSearchItem("");
              }}
              className="flex items-center gap-4 p-3 border-b hover:bg-gray-50 cursor-pointer"
            >
              <img src={book.image2?.split("\n")[0]} className="w-10 h-14 object-contain" />
              <div className="flex-1 text-left">
                <h4 className="text-sm font-bold text-gray-800">{book.title}</h4>
                <p className="text-xs text-gray-500">{book.author}</p>
              </div>
              <div className="text-blue-600 font-bold text-sm">{book.data1}</div>
            </div>
          )) : (
            <div className="p-4 text-center text-gray-400">No result found...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;