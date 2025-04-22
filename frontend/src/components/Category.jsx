import React from 'react'
import { menu_list } from '../assets/assets'
import { Link } from 'react-router-dom'

const Category = () => {
  return (
    <div className='flex flex-col gap-4 mt-5'>
      <h1 className='font-semibold text-[#262626]'>Explore our menu</h1>
      <p className='w-full lg:max-w-[60%] text-[#808080]'>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      <div className="flex justify-between items-center mx-2 md:mx-8 mt-4 overflow-x-scroll gap-8">
        {menu_list.map((item, index)=>{
            return (
               <div key={index} className='flex flex-col items-center gap-2'>
                <Link to={`/menu/${item.menu_name}`} onClick={()=>scrollTo(0, 0)} ><img className='w-[7.5vw] min-w-[80px] cursor-pointer hover:scale-95 duration-500 transition-all hover:border-[5px] rounded-full border-orange-200' src={item.menu_image} alt="" /></Link>
                <p>{item.menu_name}</p>
               </div> 
            )
        })}
      </div>
      <hr className='m-6' />
    </div>
  )
}

export default Category
