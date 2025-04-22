import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { Link } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext';
import { AppContext } from '../context/AppContext';
import Loader2 from './Loader2';

const TopDishes = () => {

  const {cartItems, addToCart, removeFromCart} = useContext(StoreContext);
  const {items, loader_2} = useContext(AppContext);

  return ( loader_2 ? <div className='h-[200px] w-full flex justify-center items-center'><Loader2 /></div> :
    <div className='w-full px-10 flex flex-col gap-5'>
      <h1 className='font-semibold text-[20px]'>Top Dishes</h1>
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-10'>
      {
        items.slice(0, 8).map((item, index) => (
            <div className='rounded-xl shadow-md' key={index}>
                <div className="relative">
                    <img className='rounded-t-xl h-40 w-full' src={item.image} alt="" />
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

      <div className='flex justify-center mt-5'><Link to={'/menu'} onClick={()=>scrollTo(0, 0)} className='px-7 py-1.5 rounded-full bg-orange-400 hover:bg-orange-600 duration-300'>View more</Link></div>
    </div>
  )
}

export default TopDishes
