import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='pt-8 pb-16 min-h-screen animate-fade-in'>

      <div className='mb-8'>
        <Title text1={'YOUR'} text2={'SHOPPING CART'} />
        <p className='text-xs text-gray-500 font-medium'>
          Review your items before proceeding to checkout.
        </p>
      </div>

      {cartData.length > 0 ? (
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
          
          {/* Cart Item Cards List */}
          <div className='lg:col-span-7 space-y-4'>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;

              const imageUrl = Array.isArray(productData.image) ? productData.image[0] : productData.image;

              return (
                <div key={index} className='p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4 group hover:border-gray-300 transition'>
                  
                  {/* Image & Product Info */}
                  <div className='flex items-center gap-4 flex-1 min-w-0'>
                    <img className='w-20 h-24 object-cover object-top rounded-xl bg-zinc-100 border border-gray-100 flex-shrink-0' src={imageUrl} alt={productData.name} />
                    <div className='space-y-1 min-w-0 flex-1'>
                      <h3 className='text-sm font-bold text-gray-900 truncate group-hover:text-black'>
                        {productData.name}
                      </h3>
                      <div className='flex items-center gap-3 text-xs'>
                        <span className='font-extrabold text-gray-900 font-heading text-sm'>{currency}{productData.price}</span>
                        <span className='px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-md font-bold uppercase tracking-wider border border-gray-200'>
                          Size: {item.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className='flex items-center gap-4'>
                    <input 
                      onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} 
                      className='w-14 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-center text-xs font-bold text-gray-900 outline-none focus:border-gray-900 transition' 
                      type="number" 
                      min={1} 
                      defaultValue={item.quantity} 
                    />
                    
                    <button 
                      onClick={() => updateQuantity(item._id, item.size, 0)} 
                      className='p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition'
                      title="Remove Item"
                    >
                      <img className='w-4 h-4' src={assets.bin_icon} alt="Remove" />
                    </button>
                  </div>

                </div>
              )
            })}
          </div>

          {/* Cart Summary Side Panel */}
          <div className='lg:col-span-5 space-y-6'>
            <CartTotal />
            <button 
              onClick={() => navigate('/place-order')} 
              className='w-full bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-widest py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3'
            >
              <span>Proceed to Checkout</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>
      ) : (
        <div className='py-24 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto space-y-4'>
          <div className='w-16 h-16 rounded-full bg-gray-200/60 flex items-center justify-center mx-auto text-2xl'>
            🛒
          </div>
          <h3 className='text-lg font-bold text-gray-900 font-heading'>Your Shopping Cart is Empty</h3>
          <p className='text-xs text-gray-500 max-w-sm mx-auto'>
            Looks like you haven't added any items to your cart yet. Explore our latest fashion drops!
          </p>
          <Link 
            to='/collection'
            className='inline-block bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-widest px-8 py-3.5 rounded-full transition shadow-md'
          >
            Start Shopping
          </Link>
        </div>
      )}

    </div>
  )
}

export default Cart
