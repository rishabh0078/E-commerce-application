import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className='pt-8 pb-16 min-h-screen animate-fade-in'>
      
      <div className='text-center mb-12'>
        <Title text1={'CONTACT'} text2={'AURA'} />
        <p className='text-xs text-gray-500 font-medium max-w-md mx-auto'>
          We are here to assist you. Reach out to our store team or explore career opportunities.
        </p>
      </div>

      <div className='my-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto'>
        <div className='md:col-span-6 rounded-3xl overflow-hidden shadow-xl bg-zinc-100 border border-gray-100'>
          <img className='w-full h-auto object-cover object-center hover:scale-105 transition-transform duration-700' src={assets.contact_img} alt="Contact AURA" />
        </div>

        <div className='md:col-span-6 space-y-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-xs'>
          <div className='space-y-2 border-b border-gray-100 pb-6'>
            <h3 className='font-extrabold text-gray-900 text-sm uppercase tracking-widest font-heading flex items-center gap-2'>
              <span>📍</span> Our Headquarters & Store
            </h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              54709 Willms Station, Suite 350<br />
              Washington, DC 20001, USA
            </p>
            <p className='text-xs text-gray-600 pt-2'>
              <strong>Tel:</strong> (415) 555-0132<br />
              <strong>Email:</strong> support@aurafashion.com
            </p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-extrabold text-gray-900 text-sm uppercase tracking-widest font-heading flex items-center gap-2'>
              <span>💼</span> Careers at AURA
            </h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Learn more about our design philosophy, tailoring culture, and open positions worldwide.
            </p>
            <button className='bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:scale-105'>
              Explore Openings
            </button>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact
