// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { Link } from "react-router-dom"; // Link import karna mat bhoolna


// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const sliderData = [
//   { img: window.location.origin +"/40_istigfaar_hindi.jpg", link: "/products/hindibook/11" },
//   { img: window.location.origin +"/100_durood_hindi.jpg", link: "/products/hindibook/1" },
//   { img: window.location.origin +"/Momin_ka_Hatiyar_Hindi.jpg", link: "/products/hindibook/3" },
//   { img: window.location.origin +"/Salah_The_Muslim_Prayer.jpg", link: "/products/englishbook/1" },
//   { img: window.location.origin +"/Surah_yaseen_ARABIC_Big.jpg", link: "/products/holyquran/3" },
//   { img: window.location.origin +"/Hazrat_Ali_Urdu.jpg", link: "/products/urdubook/general/5" },
//   { img: window.location.origin +"/Islamic_Months.jpg", link: "/products/englishbook/general/5" },
//   { img: window.location.origin +"/Noorani_Qaaidah_English_NEW_CC.jpg", link: "/products/childrenbook/1" },
//   { img: window.location.origin +"/Part_Thirty_of_Holy_Quran_Colour_PKT.jpg", link: "/products/englishbook/general/10" },
//   { img: window.location.origin +"/tareekh_ul_ambiya_urdu_FBD.webp", link: "/products/urdubook/general/7" },
// ];

// export default function ImageSlider() {
//   return (
//     <div className="relative group px-10"> {/* Padding di hai taaki buttons side mein na chipke */}
//       <Swiper
//         modules={[Autoplay, Pagination, Navigation]}
//         spaceBetween={20}
//         // Responsive settings: Mobile par kam, Laptop par zyada slides
//         breakpoints={{
//           320: { slidesPerView: 2 },
//           640: { slidesPerView: 4 },
//           1024: { slidesPerView: 6 },
//           1440: { slidesPerView: 8 },
//         }}
//         navigation={{
//           nextEl: ".custom-next",
//           prevEl: ".custom-prev",
//         }}
//         pagination={{ dynamicBullets: true, clickable: true }}
//         loop={true}
//         autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
//         className="w-full h-full mt-5 shadow-sm py-5"
//       >
//         {sliderData.map((item, i) => (
//           <SwiperSlide key={i} className="flex justify-center">
//             {/* Image ko Link ke andar dala hai */}
//             <Link to={item.link} className="block w-full h-full transform transition hover:scale-105">
//               <img
//                 src={item.img}
//                 alt="book-banner"
//                 className="w-full h-auto object-cover shadow-md rounded-xl border border-gray-100"
//               />
//             </Link>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* Custom Navigation Buttons with Styling */}
//       <button className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition cursor-pointer text-xl">
//         ◀
//       </button>
//       <button className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition cursor-pointer text-xl">
//         ▶
//       </button>
      
//       <hr className="mt-8 border-gray-200" />
//     </div>
//   );
// }


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

// Swiper CSS Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// 1. Full-Proof Tarika: Images ko src/assets se static import karna
import istigfaarHindi from "./assets/40_istigfaar_hindi.jpg";
import duroodHindi from "./assets/100_durood_hindi.jpg";
import mominHatiyar from "./assets/Momin_ka_Hatiyar_Hindi.jpg";
import salahPrayer from "./assets/Salah_The_Muslim_Prayer.jpg";
import surahYaseen from "./assets/Surah_yaseen_ARABIC_Big.jpg";
import hazratAliUrdu from "./assets/Hazrat_Ali_Urdu.jpg";
import islamicMonths from "./assets/Islamic_Months.jpg";
import nooraniQaaidah from "./assets/Noorani_Qaaidah_English_NEW_CC.jpg";
import quranPartThirty from "./assets/Part_Thirty_of_Holy_Quran_Colour_PKT.jpg";
import tareekhAmbiya from "./assets/tareekh_ul_ambiya_urdu_FBD.webp";

// 2. Ab array mein direct imported variables pass honge
const sliderData = [
  { img: istigfaarHindi, link: "/products/hindibook/11" },
  { img: duroodHindi, link: "/products/hindibook/1" },
  { img: mominHatiyar, link: "/products/hindibook/3" },
  { img: salahPrayer, link: "/products/englishbook/1" },
  { img: surahYaseen, link: "/products/holyquran/3" },
  { img: hazratAliUrdu, link: "/products/urdubook/general/5" },
  { img: islamicMonths, link: "/products/englishbook/general/5" },
  { img: nooraniQaaidah, link: "/products/childrenbook/1" },
  { img: quranPartThirty, link: "/products/englishbook/general/10" },
  { img: tareekhAmbiya, link: "/products/urdubook/general/7" },
];

export default function ImageSlider() {
  return (
    <div className="relative group px-10">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
          1440: { slidesPerView: 8 },
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ dynamicBullets: true, clickable: true }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        className="w-full h-full mt-5 shadow-sm py-5"
      >
        {sliderData.map((item, i) => (
          <SwiperSlide key={i} className="flex justify-center">
            <Link to={item.link} className="block w-full h-full transform transition hover:scale-105">
              <img
                src={item.img} // Vite khud is path ko sahi se build time par manage kar lega
                alt="book-banner"
                className="w-full h-auto object-cover shadow-md rounded-xl border border-gray-100"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition cursor-pointer text-xl">
        ◀
      </button>
      <button className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition cursor-pointer text-xl">
        ▶
      </button>
      
      <hr className="mt-8 border-gray-200" />
    </div>
  );
}