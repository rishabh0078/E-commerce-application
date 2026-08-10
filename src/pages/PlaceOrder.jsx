import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                case 'razorpay':
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order)
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='pt-8 pb-16 min-h-screen animate-fade-in'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
                
                {/* Left Side: Delivery Info */}
                <div className='lg:col-span-7 space-y-6'>
                    <div className='mb-6'>
                        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                        <p className='text-xs text-gray-500 font-medium'>Please enter your accurate shipping details.</p>
                    </div>

                    <div className='space-y-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs'>
                        <div className='grid grid-cols-2 gap-4'>
                            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='First name' />
                            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='Last name' />
                        </div>
                        
                        <input required onChange={onChangeHandler} name='email' value={formData.email} className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="email" placeholder='Email address' />
                        <input required onChange={onChangeHandler} name='street' value={formData.street} className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='Street address' />
                        
                        <div className='grid grid-cols-2 gap-4'>
                            <input required onChange={onChangeHandler} name='city' value={formData.city} className='bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='City' />
                            <input onChange={onChangeHandler} name='state' value={formData.state} className='bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='State' />
                        </div>
                        
                        <div className='grid grid-cols-2 gap-4'>
                            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='Zip code' />
                            <input required onChange={onChangeHandler} name='country' value={formData.country} className='bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='Country' />
                        </div>
                        
                        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' type="text" placeholder='Phone number' />
                    </div>
                </div>

                {/* Right Side: Order Summary & Payment Selection */}
                <div className='lg:col-span-5 space-y-6'>
                    <CartTotal />

                    <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                        
                        <div className='space-y-3 pt-2'>
                            {/* Stripe Option (Greyed Out - Coming Soon) */}
                            <div 
                                className='flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed select-none'
                            >
                                <div className='flex items-center gap-3'>
                                    <span className='w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center bg-gray-200'></span>
                                    <img className='h-5 grayscale opacity-70' src={assets.stripe_logo} alt="Stripe" />
                                </div>
                                <span className='text-[10px] font-bold text-gray-600 bg-gray-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider'>
                                    Coming Soon
                                </span>
                            </div>

                            {/* COD Option (Active) */}
                            <div 
                                onClick={() => setMethod('cod')} 
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${method === 'cod' ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className='flex items-center gap-3'>
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === 'cod' ? 'border-gray-900' : 'border-gray-300'}`}>
                                        {method === 'cod' && <span className='w-2 h-2 rounded-full bg-gray-900'></span>}
                                    </span>
                                    <span className='text-sm font-bold text-gray-900 font-heading uppercase'>Cash On Delivery</span>
                                </div>
                                <span className='text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60'>
                                    Pay at Doorstep
                                </span>
                            </div>
                        </div>

                        <button 
                            type='submit' 
                            className='w-full mt-6 bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-widest py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]'
                        >
                            Place Order Now
                        </button>
                    </div>
                </div>

            </div>
        </form>
    )
}

export default PlaceOrder
