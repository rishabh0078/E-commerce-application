import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, bestseller }) => {
    const { currency } = useContext(ShopContext);

    const imageUrl = Array.isArray(image) ? image[0] : image;

    return (
        <Link 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            to={`/product/${id}`}
            className='group flex flex-col bg-white rounded-2xl border border-gray-100/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
        >
            {/* Image Frame */}
            <div className='relative w-full aspect-[4/5] bg-zinc-100 overflow-hidden'>
                <img 
                    className='w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out' 
                    src={imageUrl} 
                    alt={name} 
                />
                
                {/* Ultra-Sleek Minimal Bestseller Tag */}
                {bestseller && (
                    <span className='absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white text-[8.5px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border border-white/20 shadow-xs'>
                        Bestseller
                    </span>
                )}

                {/* Quick View Overlay Bar */}
                <div className='absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <span className='text-[11px] font-semibold text-white bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/30 tracking-wider uppercase'>
                        View Product
                    </span>
                </div>
            </div>

            {/* Product Meta Info */}
            <div className='p-3.5 flex flex-col flex-1 justify-between bg-white'>
                <h3 className='text-xs sm:text-sm font-semibold text-gray-900 truncate group-hover:text-gray-600 transition-colors'>
                    {name}
                </h3>
                <div className='flex items-center justify-between mt-2 pt-2 border-t border-gray-100'>
                    <p className='text-sm sm:text-base font-extrabold text-gray-900 font-heading'>
                        {currency}{price}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default ProductItem
