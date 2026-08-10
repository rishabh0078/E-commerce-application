import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className='w-full bg-gray-50/80 p-6 rounded-3xl border border-gray-200/80 shadow-xs'>
      <div className='mb-4 border-b border-gray-200 pb-3'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='space-y-3 text-sm text-gray-700 font-medium'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-500'>Subtotal</span>
          <span className='font-bold text-gray-900 font-heading'>{currency}{subtotal}.00</span>
        </div>
        
        <div className='flex justify-between items-center'>
          <span className='text-gray-500'>Flat Shipping Fee</span>
          <span className='font-bold text-gray-900 font-heading'>{currency}{delivery_fee}.00</span>
        </div>
        
        <div className='pt-3 border-t border-gray-200 flex justify-between items-center text-base'>
          <span className='font-extrabold text-gray-900 uppercase tracking-wide font-heading'>Estimated Total</span>
          <span className='text-xl font-extrabold text-gray-900 font-heading'>{currency}{total}.00</span>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
