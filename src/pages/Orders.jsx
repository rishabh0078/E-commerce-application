import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='pt-8 pb-16 min-h-screen animate-fade-in'>
      
      <div className='mb-8'>
        <Title text1={'MY'} text2={'ORDERS'} />
        <p className='text-xs text-gray-500 font-medium'>Track and view your recent purchases.</p>
      </div>

      {orderData.length > 0 ? (
        <div className='space-y-4'>
          {orderData.map((item, index) => {
            const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image;

            return (
              <div key={index} className='p-5 bg-white rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-200 transition'>
                
                {/* Item Details */}
                <div className='flex items-start gap-4 flex-1 min-w-0'>
                  <img className='w-20 h-24 object-cover object-top rounded-2xl bg-zinc-100 border border-gray-100 flex-shrink-0' src={imageUrl} alt={item.name} />
                  <div className='space-y-1 min-w-0 flex-1'>
                    <h3 className='text-sm font-bold text-gray-900 truncate'>{item.name}</h3>
                    <div className='flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-700'>
                      <span className='text-base font-extrabold text-gray-900 font-heading'>{currency}{item.price}</span>
                      <span className='px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200'>Qty: {item.quantity}</span>
                      <span className='px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200 uppercase'>Size: {item.size}</span>
                    </div>
                    <div className='pt-1 text-[11px] text-gray-400 font-medium flex flex-wrap gap-4'>
                      <span>Date: <strong className='text-gray-700'>{new Date(item.date).toDateString()}</strong></span>
                      <span>Payment: <strong className='text-gray-700 uppercase'>{item.paymentMethod}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Order Status & Track Action */}
                <div className='flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100'>
                  <div className='flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                    <span className='text-xs font-bold text-emerald-700 capitalize'>{item.status}</span>
                  </div>

                  <button 
                    onClick={loadOrderData} 
                    className='bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition shadow-sm hover:scale-105'
                  >
                    Track Order
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      ) : (
        <div className='py-24 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 max-w-xl mx-auto space-y-4'>
          <div className='w-16 h-16 rounded-full bg-gray-200/60 flex items-center justify-center mx-auto text-2xl'>
            📦
          </div>
          <h3 className='text-lg font-bold text-gray-900 font-heading'>No Past Orders Found</h3>
          <p className='text-xs text-gray-500 max-w-sm mx-auto'>
            You haven't placed any orders yet. Once you make a purchase, it will appear here.
          </p>
        </div>
      )}

    </div>
  )
}

export default Orders
