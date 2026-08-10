import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <section className='my-16 py-12 px-6 sm:px-10 bg-gradient-to-b from-zinc-50/80 to-white rounded-3xl border border-gray-100/90 shadow-sm'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center'>
        
        {/* Policy 1 */}
        <div className='flex flex-col items-center p-8 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group'>
          <div className='w-14 h-14 rounded-2xl bg-gray-900 group-hover:bg-black text-white flex items-center justify-center mb-5 shadow-md transition-colors'>
            <img src={assets.exchange_icon} className='w-6 h-6 filter invert brightness-200' alt="Exchange" />
          </div>
          <h3 className='font-bold text-sm tracking-widest font-heading uppercase text-gray-900 mb-2'>
            Hassle-Free Exchange
          </h3>
          <p className='text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-xs'>
            We offer a seamless 7-day exchange policy for complete peace of mind.
          </p>
        </div>

        {/* Policy 2 */}
        <div className='flex flex-col items-center p-8 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group'>
          <div className='w-14 h-14 rounded-2xl bg-gray-900 group-hover:bg-black text-white flex items-center justify-center mb-5 shadow-md transition-colors'>
            <img src={assets.quality_icon} className='w-6 h-6 filter invert brightness-200' alt="Return" />
          </div>
          <h3 className='font-bold text-sm tracking-widest font-heading uppercase text-gray-900 mb-2'>
            7 Days Return Policy
          </h3>
          <p className='text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-xs'>
            Not fully satisfied? Return unused items within 7 days for a quick refund.
          </p>
        </div>

        {/* Policy 3 */}
        <div className='flex flex-col items-center p-8 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group'>
          <div className='w-14 h-14 rounded-2xl bg-gray-900 group-hover:bg-black text-white flex items-center justify-center mb-5 shadow-md transition-colors'>
            <img src={assets.support_img} className='w-6 h-6 filter invert brightness-200' alt="Support" />
          </div>
          <h3 className='font-bold text-sm tracking-widest font-heading uppercase text-gray-900 mb-2'>
            24/7 Dedicated Support
          </h3>
          <p className='text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-xs'>
            Our customer care and Smarty AI Assistant are available around the clock.
          </p>
        </div>

      </div>
    </section>
  )
}

export default OurPolicy
