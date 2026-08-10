import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPasword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className='py-16 flex items-center justify-center min-h-[70vh] animate-fade-in'>
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6'
      >
        <div className='text-center space-y-2'>
          <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight font-heading'>
            {currentState === 'Login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className='text-xs text-gray-500 font-medium'>
            {currentState === 'Login' ? 'Sign in to access your orders and account settings' : 'Join AURA for exclusive rewards and seamless shopping'}
          </p>
        </div>

        <div className='space-y-4 pt-2'>
          {currentState !== 'Login' && (
            <div>
              <label className='block text-xs font-bold text-gray-900 uppercase tracking-widest mb-1.5 font-heading'>
                Full Name
              </label>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                type="text" 
                className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' 
                placeholder='John Doe' 
                required
              />
            </div>
          )}

          <div>
            <label className='block text-xs font-bold text-gray-900 uppercase tracking-widest mb-1.5 font-heading'>
              Email Address
            </label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' 
              placeholder='your.email@example.com' 
              required
            />
          </div>

          <div>
            <label className='block text-xs font-bold text-gray-900 uppercase tracking-widest mb-1.5 font-heading'>
              Password
            </label>
            <input 
              onChange={(e) => setPasword(e.target.value)} 
              value={password} 
              type="password" 
              className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-900 focus:bg-white transition' 
              placeholder='••••••••' 
              required
            />
          </div>
        </div>

        <div className='flex items-center justify-between text-xs font-semibold text-gray-600 pt-1'>
          <span className='hover:text-black cursor-pointer'>Forgot password?</span>
          {currentState === 'Login' ? (
            <span onClick={() => setCurrentState('Sign Up')} className='text-gray-900 font-bold hover:underline cursor-pointer'>
              Create an Account →
            </span>
          ) : (
            <span onClick={() => setCurrentState('Login')} className='text-gray-900 font-bold hover:underline cursor-pointer'>
              Already have an account? Sign In →
            </span>
          )}
        </div>

        <button 
          type='submit' 
          className='w-full bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-widest py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]'
        >
          {currentState === 'Login' ? 'Sign In to AURA' : 'Create AURA Account'}
        </button>
      </form>
    </div>
  )
}

export default Login
