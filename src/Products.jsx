// import { useEffect, useState } from 'react';
// import { Link, useParams } from "react-router-dom";
// import data from "./assets/data.json";
// import Counter from './Counter';
// import { useCart } from './CartContext';

// // Function ke andar

// function Products() {
//     const { category, subcategories, id } = useParams();
//     const currentCategory = data?.find(cat => cat.category === category);

//     const { addToCart } = useCart();
//     const [quantity, setQuantity] = useState(1); // Quantity state yahan rakhi
//     const handleAddToCart = () => {
//         // Debugging ke liye: console mein check karo kya quantity sahi hai?
//         console.log("Adding to cart with quantity:", quantity);

//         // Cart mein bhejo
//         addToCart({ ...product, quantity: quantity });

//         // Ek sweet sa alert
//         alert(`${quantity} books added to your cart!`);
//     };
//     // 1. Sahi Product dhoondna (Subcategory ke hisab se)

//     const product = currentCategory?.subcategories
//         ? (currentCategory.subcategories.find(s => s.name === subcategories)?.books.find(p => p.id === Number(id))
//             || currentCategory.subcategories.flatMap(s => s.books).find(p => p.id === Number(id)))
//         : currentCategory?.books?.find(p => p.id === Number(id));

//     // 2. Related Products ke liye sari books ko ek list mein lana
//     const allFlattenedBooks = currentCategory?.subcategories
//         ? currentCategory.subcategories.flatMap(sub =>
//             sub.books.map(book => ({ ...book, subName: sub.name }))
//         )
//         : currentCategory?.books?.map(book => ({ ...book, subName: 'general' })) || [];

//     const [activeImg, setActiveImg] = useState("");
//     const [display, setDisplay] = useState(true);

//     // 3. Jab bhi ID ya Product badle, details update karein
//     useEffect(() => {
//         if (product) {
//             setActiveImg(product.image2?.split("\n")[0] || product.image);
//             window.scrollTo(0, 0);
//         }
//     }, [id]);

//     // Helper to get details
//     const getDetail = (key) => product?.details?.split(`${key}:`)[1]?.split("\n")[0]?.trim() || "N/A";

//     if (!product) return <div className="p-20 text-center text-2xl">Product Not Found...</div>;

//     const booksToRender = display ? allFlattenedBooks.slice(0, 6) : allFlattenedBooks;

//     return (
//         <>
//             <div className='bg-indigo-50 min-h-screen p-10'>
//                 <div className='grid grid-cols-1 md:grid-cols-2 gap-10 items-start'>

//                     {/* LEFT SIDE: Image Section */}
//                     <div className="sticky top-10 h-fit flex flex-col items-center">
//                         <img src={activeImg} className='w-1/2 max-w-md rounded-lg shadow-2xl transition duration-300' alt={product.title} />
//                         <div className="flex gap-4 mt-6 justify-center flex-wrap">
//                             {product?.image2?.split("\n").filter(Boolean).map((img, index) => (
//                                 <img
//                                     key={index} src={img}
//                                     onClick={() => setActiveImg(img)}
//                                     className={`w-20 h-24 object-cover rounded shadow-md cursor-pointer border-2 transition ${activeImg === img ? 'border-indigo-600' : 'border-transparent'}`}
//                                     alt="thumbnail"
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     {/* RIGHT SIDE: Details Section */}
//                     <div className="space-y-6">
//                         <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
//                         <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
//                             {product.description?.length > 450 ? product.description.substring(0, 450) + "..." : product.description}
//                         </div>
//                         <p className="text-3xl font-bold text-indigo-700">{product.data2}</p>

//                         <div className="py-4"><Counter count={quantity} setCount={setQuantity} /></div>


//                         <div className='flex gap-4'>
//                             <button onClick={handleAddToCart} className='bg-indigo-700 text-white rounded-lg px-8 py-3 font-semibold hover:bg-indigo-800 transition'>Add to cart</button>
//                             {/* <button className='bg-indigo-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-indigo-700 transition'>Buy now</button> */}
//                         </div>

//                         {/* Specifications Table */}
//                         <div className="border-t border-gray-200 pt-6 space-y-3">
//                             <p className="text-lg font-medium">Author: <span className='text-gray-600 font-normal ml-2'>{product.author || "N/A"}</span></p>
//                             <p className="text-lg font-medium">Publisher: <span className='text-gray-600 font-normal ml-2'>{getDetail("Publisher")}</span></p>
//                             <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm">
//                                 <p>Pages: <span className="font-semibold">{getDetail("Pages")}</span></p>
//                                 <p>Weight: <span className="font-semibold">{getDetail("Weight")}</span></p>
//                                 <p>Dimensions: <span className="font-semibold">{getDetail("Dimensions")}</span></p>
//                                 <p>Language: <span className="font-semibold">{getDetail("Language")}</span></p>
//                                 <p className="col-span-2">ISBN: <span className="font-semibold">{getDetail("ISBN")}</span></p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* RELATED PRODUCTS */}
//             <div className='text-4xl flex justify-center mt-10 font-bold'>Related Products</div>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 p-10 px-20">
//                 {booksToRender.map((item) => (
//                     <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
//                         <Link to={`/products/${category}/${item.subName || 'general'}/${item.id}`}>
//                             <div className="relative w-full h-64 overflow-hidden">
//                                 <img src={item?.image2?.split("\n")[0] || item.image} alt={item.title} className="w-full h-full hover:scale-110 transition duration-500 object-contain p-2" />
//                             </div>
//                             <div className="p-3">
//                                 <h3 className="text-xs font-semibold line-clamp-2">{item.title}</h3>
//                                 <p className="text-indigo-600 font-bold mt-1">{item.data2}</p>
//                             </div>
//                         </Link>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// }

// export default Products;
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import data from "./assets/data.json";
import Counter from './Counter';
import { useCart } from './CartContext';
import ProductPrice from './ProductPrice';

// Helper for encoding errors
const L = (text) => {
    if (!text) return "";
    try { return decodeURIComponent(escape(text)); } catch { return text; }
};

function Products() {
    const { category, subcategories, id } = useParams();
    const currentCategory = data?.find(cat => cat.category === category);
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState("");

    // 1. Sahi Product dhoondna
    const product = currentCategory?.subcategories
        ? (currentCategory.subcategories.find(s => s.name === subcategories)?.books.find(p => p.id === Number(id))
            || currentCategory.subcategories.flatMap(s => s.books).find(p => p.id === Number(id)))
        : currentCategory?.books?.find(p => p.id === Number(id));

    // 2. Related Products Logic
    const allFlattenedBooks = currentCategory?.subcategories
        ? currentCategory.subcategories.flatMap(sub =>
            sub.books.map(book => ({ ...book, subName: sub.name }))
        )
        : currentCategory?.books?.map(book => ({ ...book, subName: 'general' })) || [];

    // Filter current product out of related products
    const relatedProducts = allFlattenedBooks.filter(b => b.id !== Number(id)).slice(0, 6);

    useEffect(() => {
        if (product) {
            setActiveImg(product.image2?.split("\n")[0] || product.image);
            setQuantity(1); // Reset quantity on product change
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [id, product]);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity: quantity });
        alert(`${quantity} ${quantity > 1 ? 'books' : 'book'} added to cart!`);
    };

    const getDetail = (key) => product?.details?.split(`${key}:`)[1]?.split("\n")[0]?.trim() || "N/A";

    if (!product) return <div className="p-20 text-center text-2xl font-bold text-indigo-900">Product Not Found...</div>;

    return (
        <div className="bg-white select-none">
            <div className='bg-indigo-50/50 min-h-screen p-4 sm:p-10'>
                <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start'>

                    {/* LEFT SIDE: Image Section (Mobile: Normal, Laptop: Sticky) */}
                    <div className="md:sticky md:top-24 h-fit flex flex-col items-center">
                        <div className="w-full aspect-[3/4] max-w-[400px] overflow-hidden rounded-2xl shadow-2xl bg-white flex items-center justify-center p-4">
                            <img
                                src={activeImg}
                                className='w-full h-full object-contain transition-all duration-500 hover:scale-105'
                                alt={L(product.title)}
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 mt-6 justify-center flex-wrap overflow-x-auto no-scrollbar pb-2">
                            {product?.image2?.split("\n").filter(Boolean).map((img, index) => (
                                <img
                                    key={index} src={img}
                                    onClick={() => setActiveImg(img)}
                                    className={`w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg shadow-md cursor-pointer border-2 transition-all ${activeImg === img ? 'border-indigo-600 scale-105 shadow-indigo-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    alt="thumbnail"
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Details Section */}
                    <div className="space-y-6 pt-4 md:pt-0 text-center md:text-left">
                        <nav className="text-xs text-gray-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                            <Link to="/" className="hover:text-indigo-600">Home</Link>
                            <span>/</span>
                            <span className="text-indigo-600 font-bold">{category}</span>
                        </nav>

                        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                            {L(product.title)}
                        </h1>

                        <div className="text-gray-600 text-sm sm:text-lg leading-relaxed whitespace-pre-line max-w-xl mx-auto md:mx-0">
                            {product.description?.length > 450 ? product.description.substring(0, 450) + "..." : product.description}
                        </div>

                        <div className="flex flex-col items-center md:items-start gap-2">

                            <p className="text-3xl sm:text-4xl font-black text-indigo-700">{product.data1}</p>
                            
                            

                            <p className="text-sm text-green-600 font-bold">In Stock • Fast Shipping</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 py-4 border-y border-indigo-100">
                            <Counter count={quantity} setCount={setQuantity} />
                            <button
                                onClick={handleAddToCart}
                                className='bg-white rounded text-center p-2 mx-4 mb-4 hover:text-white focus:bg-indigo-950 hover:bg-indigo-900 text-indigo-900 border border-indigo-900 transition text-sm font-semibold'>

                                Add to Cart
                            </button>
                        </div>

                        {/* Specifications Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Book Specifications</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400">Author</p>
                                    <p className="font-semibold text-gray-800">{product.author || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Publisher</p>
                                    <p className="font-semibold text-gray-800">{getDetail("Publisher")}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Pages</p>
                                    <p className="font-semibold text-gray-800">{getDetail("Pages")}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Language</p>
                                    <p className="font-semibold text-gray-800">{getDetail("Language")}</p>
                                </div>
                                <div className="col-span-2 pt-2 border-t">
                                    <p className="text-gray-400">ISBN</p>
                                    <p className="font-mono font-medium text-gray-800">{getDetail("ISBN")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className='text-2xl sm:text-3xl font-black text-gray-900 mb-8 flex items-center gap-4'>
                    <span className="h-8 w-2 bg-indigo-700 rounded-full"></span>
                    Related Products
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8">
                    {relatedProducts.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <Link to={`/products/${category}/${item.subName || 'general'}/${item.id}`}>
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 p-3">
                                    <img
                                        src={item?.image2?.split("\n")[0] || item.image}
                                        alt={L(item.title)}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px]">
                                        {L(item.title)}
                                    </h3>
                                    <p className="text-indigo-600 font-black mt-2">{item.data1}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products;