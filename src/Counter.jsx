// import React, { useState } from 'react'


// function Counter() {
//     const[count,setCount]=useState(1)
//   return (
//     <div className="inline-flex items-center border border-gray-300 rounded-md px-3 py-2 space-x-4">
//   <button className="text-gray-500 text-xl hover:text-black" onClick={()=> count>1&&setCount(count-1)}>
//     −
//   </button>

//   <span className="text-gray-800 text-lg font-medium">
//     {count}
//   </span>

//   <button className="text-gray-600 text-xl hover:text-slate-950 hover:text-xl" onClick={()=>setCount(count+1)}>
//     +
//   </button>
// </div>
//   )
// }

// export default Counter
import React from 'react'

// Yahan props (count aur setCount) receive karenge
function Counter({ count, setCount }) {
  return (
    <div className="inline-flex items-center border border-gray-300 rounded-md px-3 py-2 space-x-4 bg-white">
      <button 
        className="text-gray-500 text-xl hover:text-black" 
        onClick={() => count > 1 && setCount(count - 1)}
      >
        −
      </button>

      <span className="text-gray-800 text-lg font-medium">
        {count}
      </span>

      <button 
        className="text-gray-600 text-xl hover:text-slate-950" 
        onClick={() => setCount(count + 1)}
      >
        +
      </button>
    </div>
  )
}

export default Counter;
