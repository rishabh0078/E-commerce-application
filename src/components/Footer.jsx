import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='mt-24 pt-16 pb-8 border-t border-gray-100 bg-white'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 pb-12'>

        {/* Brand Column */}
        <div className='space-y-4'>
          <span className='font-heading text-2xl font-black tracking-[0.2em] text-gray-900 uppercase'>
            AURA
          </span>
          <p className='text-sm text-gray-500 font-normal leading-relaxed max-w-sm'>
            AURA is an elite luxury menswear brand dedicated to modern silhouettes, precision tailoring, and timeless contemporary apparel.
          </p>
          <div className='flex items-center gap-3 pt-2 text-gray-400 text-xs font-medium'>
            <span>© 2026 AURA Menswear Ltd. All rights reserved.</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className='space-y-4'>
          <h4 className='text-xs font-bold uppercase tracking-widest text-gray-900 font-heading'>
            Navigation
          </h4>
          <ul className='space-y-2.5 text-sm text-gray-600 font-medium'>
            <li><Link to='/' className='hover:text-black transition-colors'>Home</Link></li>
            <li><Link to='/collection' className='hover:text-black transition-colors'>Collections</Link></li>
            <li><Link to='/about' className='hover:text-black transition-colors'>About AURA</Link></li>
            <li><Link to='/contact' className='hover:text-black transition-colors'>Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className='space-y-4'>
          <h4 className='text-xs font-bold uppercase tracking-widest text-gray-900 font-heading'>
            Get In Touch
          </h4>
          <ul className='space-y-2.5 text-sm text-gray-600 font-medium'>
            <li className='flex items-center gap-2'>
              <span>📞</span> +1 (800) 555-0199
            </li>
            <li className='flex items-center gap-2'>
              <span>✉️</span> support@aurafashion.com
            </li>
            <li className='flex items-center gap-2 text-xs text-gray-400 pt-1'>
              Mon - Fri, 9am - 6pm EST
            </li>
          </ul>
        </div>

      </div>

      <div className='pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 max-w-7xl mx-auto'>
        <p>Crafted with modern fashion aesthetics.</p>
        <p className='mt-2 sm:mt-0'>Privacy Policy • Terms of Service</p>
      </div>
    </footer>
  )
}

export default Footer
