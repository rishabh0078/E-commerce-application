import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 4))
  }, [products])

  return (
    <section className='my-16 py-12 px-6 sm:px-10 bg-gradient-to-b from-zinc-50/80 to-white rounded-3xl border border-gray-100'>
      <div className='flex flex-col items-center text-center mb-10'>
        <Title text1={'TOP'} text2={'BESTSELLERS'} />
        <p className='max-w-xl text-sm sm:text-base text-gray-500 font-normal leading-relaxed'>
          Our most coveted pieces loved by thousands. Exceptional quality, timeless appeal, and proven favorites.
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
        {bestSeller.map((item) => (
          <ProductItem 
            key={item._id} 
            id={item._id} 
            name={item.name} 
            image={item.image} 
            price={item.price} 
            bestseller={true}
          />
        ))}
      </div>
    </section>
  )
}

export default BestSeller
