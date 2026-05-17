import React from 'react'
import Slider from './Slider'
import data from "./assets/data.json";
import Arabicbook from "./Books/Arabicbook";
import Urdubook from "./Books/Urdubook";
import Hindibook from "./Books/Hindibook";
import Englishbook from "./Books/Englishbook";
import Holyquran from "./Books/Holyquran";
import Childrenbook from "./Books/Childrenbook";
import Quida from "./Books/Quida";
import Frenchbook from "./Books/Frenchbook";
import Banglabook from "./Books/Banglabook";

function Home() {
  return (
    <>
      <Slider />
      <Urdubook />
      <Holyquran />
      <Hindibook />
      <Englishbook />
      <Childrenbook />
      <Quida />
      <Arabicbook />

      <Frenchbook />
    </>
  )
}

export default Home
