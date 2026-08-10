import React from 'react'

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  }

  return (
    <section className='my-16 py-12 px-6 sm:px-12 bg-gradient-to-b from-zinc-50/90 to-white text-gray-900 rounded-3xl text-center border border-gray-100/90 shadow-sm relative overflow-hidden'>
      <div className='max-w-2xl mx-auto space-y-4 relative z-10'>
        <span className='inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1 bg-black/5 text-gray-800 rounded-full border border-black/10'>
          VIP Insider Access
        </span>
        <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-gray-900'>
          Subscribe Now & Get 20% Off
        </h2>
        <p className='text-sm text-gray-500 font-normal leading-relaxed max-w-lg mx-auto'>
          Join our exclusive insider list for early drop access, private sales, and curated fashion inspiration.
        </p>

        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-4'>
          <input 
            className='w-full bg-white text-gray-900 text-sm px-5 py-3.5 rounded-full border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition shadow-xs' 
            type="email" 
            placeholder='Enter your email address...' 
            required
          />
          <button 
            type='submit' 
            className='w-full sm:w-auto bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:scale-105 whitespace-nowrap'
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterBox
