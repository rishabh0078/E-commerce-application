import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className='pt-8 pb-16 min-h-screen animate-fade-in'>

      <div className='text-center mb-12'>
        <Title text1={'ABOUT'} text2={'AURA'} />
        <p className='text-xs text-gray-500 font-medium max-w-md mx-auto'>
          Crafting luxury fashion, modern silhouettes, and effortless contemporary style.
        </p>
      </div>

      {/* Brand Story Showcase */}
      <div className='my-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center'>
        <div className='md:col-span-5 rounded-3xl overflow-hidden shadow-xl bg-zinc-100 border border-gray-100'>
          <img className='w-full h-auto object-cover object-top hover:scale-105 transition-transform duration-700' src={assets.about_img} alt="About AURA" />
        </div>
        
        <div className='md:col-span-7 space-y-6 text-sm text-gray-600 leading-relaxed font-normal'>
          <p>
            AURA was born out of a passion for sartorial innovation and a desire to elevate luxury menswear. Our journey began with a single vision: to create a curated destination where discerning gentlemen discover timeless apparel, uncompromised quality, and modern elegance.
          </p>
          <p>
            Every collection is meticulously designed and sourced from world-class textile artisans. From tailored outerwear to casual essentials, we merge contemporary aesthetics with long-lasting comfort.
          </p>
          
          <div className='p-6 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2'>
            <h3 className='font-extrabold text-gray-900 uppercase tracking-widest font-heading text-xs'>Our Core Mission</h3>
            <p className='text-xs text-gray-700 leading-relaxed'>
              To empower individuals through high-grade fashion, effortless digital shopping experiences, and sustainable production values that exceed expectations at every step.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Grid */}
      <div className='my-20'>
        <div className='mb-8 text-center sm:text-left'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='p-8 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 space-y-3'>
            <div className='w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg font-heading'>01</div>
            <h4 className='text-sm font-bold text-gray-900 uppercase tracking-wider font-heading'>Quality Assurance</h4>
            <p className='text-xs text-gray-500 leading-relaxed'>Each garment undergoes rigorous quality inspection for seam strength, fabric durability, and fit precision.</p>
          </div>

          <div className='p-8 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 space-y-3'>
            <div className='w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg font-heading'>02</div>
            <h4 className='text-sm font-bold text-gray-900 uppercase tracking-wider font-heading'>Seamless Experience</h4>
            <p className='text-xs text-gray-500 leading-relaxed'>Enjoy an ultra-fast website, smart AI assistant recommendations, and effortless 1-click checkout options.</p>
          </div>

          <div className='p-8 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 space-y-3'>
            <div className='w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg font-heading'>03</div>
            <h4 className='text-sm font-bold text-gray-900 uppercase tracking-wider font-heading'>Dedicated Support</h4>
            <p className='text-xs text-gray-500 leading-relaxed'>Our customer care team and Smarty AI Assistant are available 24/7 to answer fitting, shipping, or order queries.</p>
          </div>
        </div>
      </div>

      <NewsletterBox />
      
    </div>
  )
}

export default About
