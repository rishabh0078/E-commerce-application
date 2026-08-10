import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='relative overflow-hidden bg-gradient-to-r from-zinc-50 via-gray-50 to-zinc-100 rounded-3xl border border-gray-100 shadow-sm my-6'>
      <div className='flex flex-col sm:flex-row items-center min-h-[480px] lg:min-h-[540px]'>
        
        {/* Hero Left Content */}
        <div className='w-full sm:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start space-y-6 z-10'>
          
          {/* Eyebrow Pill Tag */}
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 text-gray-800 text-xs font-bold tracking-widest uppercase'>
            <span className='w-2 h-2 rounded-full bg-gray-900 animate-pulse'></span>
            <span>Men's Luxury Collection 2026</span>
          </div>

          {/* Main Title */}
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] font-heading'>
            Redefine Your <br />
            <span className='bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-600 bg-clip-text text-transparent'>
              Menswear Style.
            </span>
          </h1>

          {/* Description */}
          <p className='text-sm sm:text-base text-gray-600 max-w-md font-normal leading-relaxed'>
            Discover handpicked luxury menswear tailored for timeless elegance, premium cotton comfort, and modern sophistication.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-wrap items-center gap-4 pt-2'>
            <Link 
              to='/collection' 
              className='inline-flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-7 py-3.5 rounded-full font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]'
            >
              <span>Explore Collection</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link 
              to='/collection?bestseller=true' 
              className='inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 px-6 py-3.5 rounded-full font-semibold text-xs tracking-widest uppercase transition-all duration-200 shadow-sm'
            >
              <span>Bestsellers</span>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className='pt-6 border-t border-gray-200/80 grid grid-cols-3 gap-6 w-full max-w-md'>
            <div>
              <p className='text-xl font-bold text-gray-900 font-heading'>100%</p>
              <p className='text-[11px] text-gray-500 font-medium'>Premium Cotton</p>
            </div>
            <div>
              <p className='text-xl font-bold text-gray-900 font-heading'>7 Days</p>
              <p className='text-[11px] text-gray-500 font-medium'>Easy Returns</p>
            </div>
            <div>
              <p className='text-xl font-bold text-gray-900 font-heading'>Express</p>
              <p className='text-[11px] text-gray-500 font-medium'>Global Shipping</p>
            </div>
          </div>
        </div>

        {/* Hero Right Image Frame */}
        <div className='w-full sm:w-1/2 h-full min-h-[350px] sm:min-h-[480px] lg:min-h-[540px] relative overflow-hidden flex items-center justify-center p-4 sm:p-6'>
          <div className='w-full h-full relative rounded-2xl overflow-hidden shadow-2xl group'>
            <img 
              className='w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105' 
              src={assets.mens_fashion_hero} 
              alt="Latest Menswear Fashion Hero Showcase" 
            />
            {/* Subtle Overlay Gradient */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60'></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero
