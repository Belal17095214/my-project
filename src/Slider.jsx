// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const images = [
  
//   "/imgi_112_maariful_hadeeth_urdu-600x930.jpg",
//   "/imgi_114_Fazail_e_Dua_Urdu-600x930.jpg",
//   "/imgi_119_kalime_ki_dawat_urdu-600x930.webp",
//   "/imgi_129_hadith_text_book_IFT_arabic-600x930.webp",
//   "/imgi_131_Manzarul_Maut_wama_Badal_Maut_Arabic-600x930.jpg",
//   "/imgi_84_Similarities_Between_Islam_Christianity-600x930.jpg",
//   "/imgi_90_Zakhira_Maloomat_Part-1_Hindi-600x930.jpg",
//   "/imgi_92_Hayatus_Sahabah_Hindi_Vol-1-600x930.jpg",
//   "/imgi_98_Namaz_ki_Pabandi_Hindi-600x930.jpg",
//   "/imgi_102_Taqwiyaatul_Imaan_Hindi-600x930.jpg",
//   "/imgi_104_Seerat_Imam_Abu_Yusuf_Urdu-600x930.jpg",
//   "/imgi_106_urdu_sharh_arbaeen_nawawi_usaymi-600x930.jpg",
//   "/imgi_108_Marne_Ke_Baad_Kiya_Hoga_Urdu-2-600x930.jpg",
//   "/imgi_80_Salat_for_children_Boys_New-600x930.jpg",
// ];
// export default function ImageSlider() {
//   return (
//     <div>



//       <Swiper
//         modules={[Autoplay, Pagination , Navigation]} spaceBetween={20} slidesPerView={12}  navigation={{ nextEl: ".custom-next",
//     prevEl: ".custom-prev",}}
//         pagination={{  dynamicBullets: true}}
//         loop={true}
//         autoplay={{ delay: 3000, disableOnInteraction: false,pauseOnMouseEnter: true, }}
//         className="w-full h-full mt-5 m-2 justify-between shadow-2xs">
//         {images.map((img, i) => (
//           <SwiperSlide key={i}>
//             <img
//               src={img}
//               className="w-full h-full m-4 object-cover shadow-2xs rounded-xl"
//             />
//           </SwiperSlide>
//         ))}
//         <div className="custom-prev">◀</div>
//   <div className="custom-next">▶</div>
//       </Swiper>
// <hr/>
//     </div>
//   );
// }
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom"; // Link import karna mat bhoolna

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const sliderData = [
  { img: "/40_istigfaar_hindi.jpg", link: "/products/hindibook/11" },
  { img: "/100_durood_hindi.jpg", link: "/products/hindibook/1" },
  { img: "/Momin_ka_Hatiyar_Hindi.jpg", link: "/products/hindibook/3" },
  { img: "/Salah_The_Muslim_Prayer.jpg", link: "/products/englishbook/1" },
  { img: "/Surah_yaseen_ARABIC_Big.jpg", link: "/products/holyquran/3" },
  { img: "/Hazrat_Ali_Urdu.jpg", link: "/products/urdubook/general/5" },
  { img: "/Islamic_Months.jpg", link: "/products/englishbook/general/5" },
  { img: "/Noorani_Qaaidah_English_NEW_CC.jpg", link: "/products/childrenbook/1" },
  { img: "/Part_Thirty_of_Holy_Quran_Colour_PKT.jpg", link: "/products/englishbook/general/10" },
  { img: "/tareekh_ul_ambiya_urdu_FBD.webp", link: "/products/urdubook/general/7" },
];

export default function ImageSlider() {
  return (
    <div className="relative group px-10"> {/* Padding di hai taaki buttons side mein na chipke */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        // Responsive settings: Mobile par kam, Laptop par zyada slides
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
            {/* Image ko Link ke andar dala hai */}
            <Link to={item.link} className="block w-full h-full transform transition hover:scale-105">
              <img
                src={item.img}
                alt="book-banner"
                className="w-full h-auto object-cover shadow-md rounded-xl border border-gray-100"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons with Styling */}
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