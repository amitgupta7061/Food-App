import { useEffect, useState } from 'react';
import { assets, imageGallary } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cycle images every 2 seconds (2000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % imageGallary.length
      );
    }, 3000); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const currentImage = imageGallary[currentImageIndex].image;

  return (
    <div
      className='h-[34vw] mt-5 rounded-3xl relative transition-all duration-1000 ease-in-out'
      style={{
        backgroundImage: `url(${currentImage? currentImage : assets.header_6})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col items-start absolute bottom-[10%] gap-1.5 max-w-[50%] left-[6vw]">
        <h2 className='md:font-semibold text-white md:text-[20px]'>Order your favourite food here</h2>
        <p className='text-white text-[1vw] hidden md:block'>
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your craving and elevate your dining experience, one delicious meal at a time.
        </p>
        <button
          className='px-4 py-1 bg-white text-black rounded-full mt-2 hover:bg-orange-500 transition-all duration-300'
          onClick={() => {
            navigate('/menu');
            scrollTo(0, 0);
          }}
        >
          View Menu
        </button>
      </div>
    </div>
  );
};

export default Banner;