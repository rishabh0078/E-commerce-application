import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <div className='inline-flex items-center gap-3 mb-4'>
      <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight uppercase font-heading text-gray-900'>
        <span className='text-gray-400 font-light mr-2'>{text1}</span>
        <span className='text-gray-900 font-bold'>{text2}</span>
      </h2>
      <div className='w-12 sm:w-16 h-[2px] bg-gray-900 rounded-full'></div>
    </div>
  )
}

export default Title
