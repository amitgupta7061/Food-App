import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import toast from 'react-hot-toast'

const Menu = () => {

  const {items, getAllItems, aToken, backendUrl} = useContext(AppContext);

  const removeItemHandler = async (itemId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/admin/remove-item', {itemId}, {headers:{aToken}});

      if(data.success){
        toast.success(data.message);
        getAllItems();
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again.");
    }
  }

  const changeAvailability = async (itemId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/admin/change-availability', {itemId}, {headers:{aToken}});

      if(data.success){
        toast.success(data.message);
        getAllItems();
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again.");
    }
  }

  useEffect(() => {
    if(aToken) getAllItems();
  }, [aToken]);

  return items && (
    <div className='m-5 w-full h-screen overflow-y-scroll'>
      <p className='text-xl font-semibold'>All Items</p>

      <div className='grid md:grid-cols-2  lg:grid-cols-4 gap-8'>
        {items.map((item, index) => (
          <div key={index} className='flex flex-col rounded-md border-[1px]'>
            <img className='h-44 rounded-t-md' src={item.image} alt="" />
            <div className='px-2 py-4 flex flex-col gap-2'>
              <div className='flex justify-between pr-4'>
                <p className='font-semibold text-[18px]'>{item.name}</p>
                <p>₹{item.price}</p>
              </div>
              <p>{item.desc.length > 50 ? item.desc.slice(0, 50) + "..." : item.desc}</p>
              <div className='flex justify-between'>
                <button onClick={()=>removeItemHandler(item._id)} className='px-4 py-1.5 rounded-full bg-orange-400'>Remove</button>
                {item.available?<button onClick={()=>changeAvailability(item._id)} className='px-4 py-1.5 rounded-full bg-orange-400'>Un-available</button> : <button onClick={()=>changeAvailability(item._id)} className='px-4 py-1.5 rounded-full bg-orange-400'>available</button>}
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
