import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { BiSolidCategory } from "react-icons/bi";
import { CiShoppingCart } from "react-icons/ci";
import { StoreContext } from '../context/StoreContext';

const Navbar = () => {

    const {token, setToken, userData} = useContext(AppContext);
    const location = useLocation();
    const {getTotalCartAmount} = useContext(StoreContext);

    const navigate = useNavigate();
    const [sider, setSider] = useState(false);

    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const logout = () =>{
      setToken('');
      localStorage.removeItem('token');
      toast.success('Logout successfully');
      if(sider) setSider(false);
      
    }


  return (
    <div className='flex justify-between items-center border-b-[1px]'>
      <Link to={'/'}><img className='h-14' src={assets.logo} alt="" /></Link>
      <ul className='gap-5 hidden md:flex'>
        <Link to={'/'} className={`${location.pathname == '/'? 'border-b-[2px] border-b-[#e39830]' : ''}`}>Home</Link>
        <Link to={'/menu'} className={`${location.pathname.startsWith('/menu')? 'border-b-[2px] border-b-[#e39830]' : ''}`}>Menu</Link>
        <Link to={'/about'} className={`${location.pathname == '/about'? 'border-b-[2px] border-b-[#e39830]' : ''}`}>About</Link>
        <Link to={'/contact'} className={`${location.pathname == '/contact'? 'border-b-[2px] border-b-[#e39830]' : ''}`}>Contact</Link>
      </ul>
      <div className='flex items-center gap-4'>
      <div className='relative'>
  <img 
    className=' w-5 cursor-pointer hidden md:block' 
    src={assets.search_icon} 
    alt="search" 
    onClick={() => setShowSearch(prev => !prev)} 
  />
  {
    showSearch && (
      <input 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder='Search...'
        className='absolute hidden lg:block right-10 -top-2 p-2 border outline-none rounded-md w-60 text-sm z-50'
      />
    )
  }
</div>

        { 
        token? 
        <>
            <div className='relative'>
                <Link to={'/cart'} className='text-2xl '><CiShoppingCart /></Link>
                { getTotalCartAmount() !== 0 &&
                  <div className='h-2 w-2 rounded-full absolute bg-orange-400 top-[-3px] right-1'></div>
                }
            </div>
            <div className='flex items-center gap-2 cursor-pointer group relative'>
                <img className='hidden md:flex w-8 h-8 rounded-full px-1 py-1' src={userData?.image?userData.image :assets.profile_icon} alt="" />

                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                        <Link to={'/profile'} className='hover:text-black cursor-pointer duration-300'>My Profile</Link>
                        <Link to={'/orders'} className='hover:text-black cursor-pointer duration-300'>My Orders</Link>
                        <p onClick={logout} className='hover:text-black cursor-pointer duration-300'>Logout</p>
                    </div>
                </div>
            </div>
        </>:
            <button onClick={()=>navigate('/auth')} className='px-4 py-1 bg-orange-400 rounded-full hover:bg-orange-600 duration-300'>Sign in</button>
        }

        <div className='relative group'>
          <p onClick={() =>setSider(prev=>!prev)} className='text-3xl mr-2 flex md:hidden'><BiSolidCategory /></p>
          {
            sider &&
            <div className='absolute hidden group-hover:flex flex-col gap-6 py-9 top-[30vh] right-0 px-10
            w-[40vw] bg-orange-400 text-white z-50 rounded-l-md'>
              <Link onClick={()=>setSider(false)} to={'/'}  className={`border-[1px] flex items-center justify-center ${location.pathname == '/'? 'border-b-[2px] border-b-[#e6e5e4]' : ''}`}>Home</Link>
              <Link to={'/menu'} onClick={()=>setSider(false)} className={`border-[1px] flex items-center justify-center ${location.pathname.startsWith('/menu')? 'border-b-[2px] border-b-[#e6e5e4]' : ''}`}>Menu</Link>
              <Link to={'/about'} onClick={()=>setSider(false)} className={`border-[1px] flex items-center justify-center ${location.pathname == '/about'? 'border-b-[2px] border-b-[#e6e5e4]' : ''}`}>About</Link>
              <Link to={'/contact'} onClick={()=>setSider(false)} className={`border-[1px] flex items-center justify-center ${location.pathname == '/contact'? 'border-b-[2px] border-b-[#e6e5e4]' : ''}`}>Contact</Link>
              {token && <>
                <Link to={'/profile'} onClick={()=>setSider(false)} className={`border-[1px] flex items-center justify-center`}>Profile</Link>
                <Link to={'/orders'} onClick={()=>setSider(false)} className={`border-[1px] flex items-center justify-center`}>Orders</Link>
                <Link onClick={logout} className={`border-[1px] flex items-center justify-center`}>Logout</Link></>
                }     
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar
