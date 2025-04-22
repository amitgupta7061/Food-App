import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdDashboard } from "react-icons/md";
import { FaOpencart } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import { FiMessageSquare } from "react-icons/fi";


const Sidebar = () => {
  return (
    <div className='min-h-screen bg-white border-r'>
        <ul className='text-[#515151] mt-5 py-10 flex flex-col gap-5'>

            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 lg:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-orange-500' : ''}`} to={'/'}>
                <MdDashboard/>
                <p className='hidden lg:block'>Dashboard</p>
            </NavLink>

            <NavLink to={'/orders'} className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 lg:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-orange-500' : ''}`}>
                <FaOpencart />
                <p className='hidden lg:block'>Orders</p>
            </NavLink>

            <NavLink to={'/add-item'} className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 lg:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-orange-500' : ''}`}>
                <MdOutlineAddCircle />
                <p className='hidden lg:block'>Add Item</p>
            </NavLink>

            <NavLink to={'see-items'} className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 lg:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-orange-500' : ''}`}>
                <MdOutlineRestaurantMenu />
                <p className='hidden lg:block'>See Items</p>
            </NavLink>

            <NavLink to={'/see-users'} className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 lg:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-orange-500' : ''}`}>
                <PiUsersThreeFill />
                <p className='hidden lg:block'>See Users</p>
            </NavLink>

            <NavLink to={'/message'} className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 lg:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-orange-500' : ''}`}>
                <FiMessageSquare />
                <p className='hidden lg:block'>All Messages</p>
            </NavLink>
        </ul>
    </div>
  )
}

export default Sidebar
