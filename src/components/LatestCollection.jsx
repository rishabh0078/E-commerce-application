import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products])

  return (
    <section className='my-16'>
      <div className='flex flex-col items-center text-center mb-10'>
        <Title text1={'LATEST'} text2={'COLLECTION'} />
        <p className='max-w-xl text-sm sm:text-base text-gray-500 font-normal leading-relaxed'>
          Explore our newest seasonal drops crafted with precision tailoring, premium fabrics, and modern silhouettes.
        </p>
      </div>

      {/* Grid Rendering */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
        {latestProducts.map((item) => (
          <ProductItem 
            key={item._id} 
            id={item._id} 
            image={item.image} 
            name={item.name} 
            price={item.price} 
            bestseller={item.bestseller}
          />
        ))}
      </div>
    </section>
  )
}

export default LatestCollection
