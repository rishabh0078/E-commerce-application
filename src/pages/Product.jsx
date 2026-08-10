import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('M')
  const [activeTab, setActiveTab] = useState('description')
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    const selectedSize = size || (productData?.sizes?.includes('M') ? 'M' : productData?.sizes?.[0] || 'M');
    addToCart(productData._id, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        if (item.sizes && item.sizes.length > 0) {
          const defaultSize = item.sizes.includes('M') ? 'M' : item.sizes[0];
          setSize(defaultSize);
        }
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  return productData ? (
    <div className='pt-8 pb-16 animate-fade-in'>
      
      {/* Category Breadcrumbs */}
      <div className='text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2'>
        <span>Home</span>
        <span>/</span>
        <span>{productData.category}</span>
        <span>/</span>
        <span className='text-gray-900 font-bold'>{productData.subCategory}</span>
      </div>

      {/* Main Product Container */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start'>

        {/* Product Images Gallery */}
        <div className='lg:col-span-7 flex flex-col-reverse md:flex-row gap-4'>
          {/* Thumbnails */}
          <div className='flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 flex-shrink-0'>
            {productData.image.map((item, index) => (
              <button 
                key={index} 
                onClick={() => setImage(item)} 
                className={`relative aspect-square w-20 md:w-full rounded-xl overflow-hidden bg-zinc-100 border-2 transition-all duration-200 ${item === image ? 'border-gray-900 shadow-md scale-102' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={item} alt="" className='w-full h-full object-cover object-top' />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className='flex-1 aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative group'>
            <img className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500' src={image} alt={productData.name} />
            {productData.bestseller && (
              <span className='absolute top-4 left-4 bg-gray-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg'>
                ★ Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Product Purchase Info */}
        <div className='lg:col-span-5 flex flex-col justify-between space-y-6'>
          
          <div>
            <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading leading-tight'>
              {productData.name}
            </h1>

            {/* Rating Stars */}
            <div className='flex items-center gap-1.5 mt-3'>
              <div className='flex items-center text-amber-400 text-sm'>
                <span>★</span><span>★</span><span>★</span><span>★</span><span className='text-gray-300'>★</span>
              </div>
              <span className='text-xs font-bold text-gray-700 ml-1'>4.8</span>
              <span className='text-xs text-gray-400'>(128 reviews)</span>
            </div>

            {/* Price Display */}
            <div className='mt-5 flex items-baseline gap-3'>
              <span className='text-3xl font-extrabold text-gray-900 font-heading'>
                {currency}{productData.price}
              </span>
              <span className='text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 uppercase tracking-wider'>
                In Stock & Ready to Ship
              </span>
            </div>

            <p className='mt-4 text-sm text-gray-600 font-normal leading-relaxed border-t border-gray-100 pt-4'>
              {productData.description}
            </p>
          </div>

          {/* Size Selector */}
          <div className='space-y-3 pt-2'>
            <div className='flex items-center justify-between'>
              <label className='text-xs font-bold text-gray-900 uppercase tracking-widest font-heading'>
                Select Size: <span className='text-gray-500 font-normal ml-1'>{size || 'Required'}</span>
              </label>
              <span className='text-xs text-gray-400 underline cursor-pointer hover:text-black'>Size Guide</span>
            </div>
            
            <div className='flex flex-wrap gap-2.5'>
              {productData.sizes.map((item, index) => (
                <button 
                  key={index}
                  onClick={() => setSize(item)} 
                  className={`min-w-[48px] h-12 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border-2 ${item === size ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105' : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-400'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button 
            onClick={handleAddToCart} 
            className={`w-full font-extrabold text-xs uppercase tracking-widest py-4 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${isAdded ? 'bg-emerald-600 text-white scale-[1.02]' : 'bg-gray-900 hover:bg-black text-white hover:scale-[1.01] active:scale-[0.99]'}`}
          >
            {isAdded ? (
              <>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Luxury Brand Trust & Guarantees */}
          <div className='pt-6 border-t border-gray-100 space-y-4'>
            <div className='flex items-start gap-3.5'>
              <div className='p-2 rounded-xl bg-gray-100/80 border border-gray-200/60 text-gray-900 flex-shrink-0 mt-0.5'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className='text-xs font-bold text-gray-900 uppercase tracking-wider font-heading'>100% Authentic Quality</h4>
                <p className='text-[11px] text-gray-500 font-normal leading-relaxed mt-0.5'>Handpicked premium cotton & quality inspected.</p>
              </div>
            </div>

            <div className='flex items-start gap-3.5'>
              <div className='p-2 rounded-xl bg-gray-100/80 border border-gray-200/60 text-gray-900 flex-shrink-0 mt-0.5'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className='text-xs font-bold text-gray-900 uppercase tracking-wider font-heading'>Cash on Delivery</h4>
                <p className='text-[11px] text-gray-500 font-normal leading-relaxed mt-0.5'>Pay easily at your doorstep upon arrival.</p>
              </div>
            </div>

            <div className='flex items-start gap-3.5'>
              <div className='p-2 rounded-xl bg-gray-100/80 border border-gray-200/60 text-gray-900 flex-shrink-0 mt-0.5'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h4 className='text-xs font-bold text-gray-900 uppercase tracking-wider font-heading'>7-Day Easy Exchange</h4>
                <p className='text-[11px] text-gray-500 font-normal leading-relaxed mt-0.5'>Hassle-free size replacement & return policy.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Description & Review Tabs */}
      <div className='mt-20 border border-gray-200/80 rounded-3xl overflow-hidden bg-white shadow-xs'>
        <div className='flex border-b border-gray-200 bg-gray-50/50'>
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-8 py-4 font-bold text-xs uppercase tracking-widest border-b-2 transition ${activeTab === 'description' ? 'border-gray-900 text-gray-900 bg-white' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            Product Description
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-8 py-4 font-bold text-xs uppercase tracking-widest border-b-2 transition ${activeTab === 'reviews' ? 'border-gray-900 text-gray-900 bg-white' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            Customer Reviews (128)
          </button>
        </div>

        <div className='p-8 text-sm text-gray-600 leading-relaxed font-normal space-y-4'>
          {activeTab === 'description' ? (
            <>
              <p>
                Crafted with precision engineering and high-grade materials, this product embodies modern apparel excellence. Each piece is designed to maintain structural integrity and color vibrancy through countless wears and washes.
              </p>
              <p>
                Features reinforced seam stitching, premium fabric weight, and a tailored silhouette suited for versatile everyday wear.
              </p>
            </>
          ) : (
            <div className='space-y-4'>
              <div className='p-4 bg-gray-50 rounded-2xl border border-gray-100'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='font-bold text-gray-900 text-xs'>Alex R. — Verified Buyer</span>
                  <span className='text-amber-400 text-xs'>★★★★★</span>
                </div>
                <p className='text-xs text-gray-600'>Exceptional quality! The fit is perfect and the material feels extremely soft and durable.</p>
              </div>
              <div className='p-4 bg-gray-50 rounded-2xl border border-gray-100'>
                <div className='flex items-center justify-between mb-1'>
                  <span className='font-bold text-gray-900 text-xs'>Sarah M. — Verified Buyer</span>
                  <span className='text-amber-400 text-xs'>★★★★★</span>
                </div>
                <p className='text-xs text-gray-600'>Super fast delivery! Looks even better in person than in the photos.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className='mt-20'>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>

    </div>
  ) : <div className='min-h-screen'></div>
}

export default Product
