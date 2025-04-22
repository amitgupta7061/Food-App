import React, { useContext, useState } from 'react'
import { assets, menu_list } from '../assets/assets'
import { Link, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { AppContext } from '../context/AppContext';
import Loader2 from '../components/Loader2';

const Menu = () => {

  const location = useLocation();
  const currCategory = location.pathname.split("/")[2]; 

  const {cartItems, addToCart, removeFromCart} = useContext(StoreContext);
  const {items, loader_2} = useContext(AppContext);

  return (
    <div className='mt-5 flex flex-col'>
      <div className='flex flex-wrap gap-x-10 gap-y-3 justify-evenly'>
        {menu_list.map((item, index)=>{
            return (
              <Link key={index} to={`/menu/${item.menu_name}`} className={`flex items-center ${currCategory === item.menu_name ? 'border-b-[2px] border-orange-500' : ''} cursor-pointer`}>
                <p className={`${currCategory === item.menu_name ? 'font-medium text-orange-400' : 'font-light'}`}>{item.menu_name}</p>
              </Link> 
            )
        })}
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-4 mt-10 gap-10 px-10'>
      { loader_2 ? <div className='h-[200px] w-full md:w-[83vw] flex justify-center items-center'><Loader2 /></div> :
        items.filter((item) => item.category == currCategory || !currCategory).map((item, index) => (
            <div className='rounded-xl shadow-md' key={index}>
                <div className="relative">
                    <img className='rounded-t-xl h-44 w-full' src={item.image} alt="" />
                    {item.available && (!cartItems[item.id]
                        ?<img className='w-10 absolute bottom-3 right-1 cursor-pointer' onClick={()=>addToCart(item.id)} src={assets.add_icon_white} alt="" />
                        :<div className='flex absolute bottom-3 right-1 items-center gap-1.5 bg-white rounded-full'>
                            <img className='w-8 cursor-pointer' onClick={()=>removeFromCart(item.id)} src={assets.remove_icon_red} alt="" />
                            <p className='text-orange-400 font-semibold'>{cartItems[item.id]}</p>
                            <img className='w-8 cursor-pointer' onClick={()=>addToCart(item.id)} src={assets.add_icon_green} alt="" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-1 px-3 py-5">
                    <div className="flex justify-between items-center py-1">
                        <p className='font-medium text-[20px]'>{item.name}</p>
                        <img className='h-4' src={assets.rating_starts} alt="" />
                    </div>
                    <p className="text-[12px] text-[#676767]">{item.desc}</p>
                    <div className='flex justify-between items-center'>
                      <p className="text-orange-500 text-[22px]">₹{item.price}</p>
                      {item.available? <p className='text-green-500 text-[15px] font-medium'>Available</p> : <p className='text-red-500 text-[15px] font-medium'>Un-Available</p>}
                    </div>
                </div>
            </div>
        ))
      }
      </div>
    </div>
  )
}

export default Menu
