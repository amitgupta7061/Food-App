import React from 'react'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const AppDownload = () => {

  const msgFunction = () => {
    toast.error('We are working on it!!')
  }

  return (
    <div className='m-auto mt-24 text-center font-semibold'>
      <p>For Better Experience Download <br />Biterush App</p>
      <div className="flex justify-center items-center gap-2 mt-4">
        <img onClick={msgFunction} className='h-12 cursor-pointer hover:scale-105 transition-all duration-500' src={assets.play_store} alt="" />
        <img onClick={msgFunction} className='h-12 cursor-pointer hover:scale-105 transition-all duration-500' src={assets.app_store} alt="" />
      </div>
    </div>
  )
}

export default AppDownload
