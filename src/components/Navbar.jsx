import React, { useContext, useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        setProfileOpen(false);
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    const handleProfileClick = () => {
        if (token) {
            setProfileOpen((prev) => !prev);
        } else {
            navigate('/login');
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const cartCount = getCartCount();

    return (
        <header className='sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100/80 transition-all duration-300'>
            <div className='flex items-center justify-between py-4 max-w-7xl mx-auto'>
                {/* Brand Logo */}
                <Link 
                    to='/' 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='flex items-center gap-2 group'
                >
                    <span className='font-heading text-2xl sm:text-3xl font-black tracking-[0.2em] text-gray-900 uppercase group-hover:text-black transition-colors'>
                        AURA
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className='hidden sm:flex items-center gap-8 text-xs font-semibold tracking-widest text-gray-700 uppercase'>
                    <NavLink to='/' className='relative group py-1'>
                        {({ isActive }) => (
                            <>
                                <span className={`transition-colors duration-200 ${isActive ? 'text-black font-bold' : 'hover:text-black'}`}>HOME</span>
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </>
                        )}
                    </NavLink>
                    <NavLink to='/collection' className='relative group py-1'>
                        {({ isActive }) => (
                            <>
                                <span className={`transition-colors duration-200 ${isActive ? 'text-black font-bold' : 'hover:text-black'}`}>COLLECTION</span>
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </>
                        )}
                    </NavLink>
                    <NavLink to='/about' className='relative group py-1'>
                        {({ isActive }) => (
                            <>
                                <span className={`transition-colors duration-200 ${isActive ? 'text-black font-bold' : 'hover:text-black'}`}>ABOUT</span>
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </>
                        )}
                    </NavLink>
                    <NavLink to='/contact' className='relative group py-1'>
                        {({ isActive }) => (
                            <>
                                <span className={`transition-colors duration-200 ${isActive ? 'text-black font-bold' : 'hover:text-black'}`}>CONTACT</span>
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </>
                        )}
                    </NavLink>
                </nav>

                {/* Right Action Icons */}
                <div className='flex items-center gap-5'>
                    {/* Search Trigger */}
                    <button
                        onClick={() => { setShowSearch(true); navigate('/collection'); }}
                        className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-700 hover:text-black'
                        aria-label="Search"
                    >
                        <img src={assets.search_icon} className='w-4 h-4' alt="Search" />
                    </button>

                    {/* Profile Dropdown */}
                    <div ref={dropdownRef} className='relative'>
                        <button
                            onClick={handleProfileClick}
                            className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center relative'
                            aria-label="User Account"
                        >
                            <img className='w-4 h-4' src={assets.profile_icon} alt="Account" />
                            {token && (
                                <span className='absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white'></span>
                            )}
                        </button>

                        {token && (
                            <div className={`${profileOpen ? 'block' : 'hidden'} absolute right-0 pt-2 z-50 animate-fade-in`}>
                                <div className='flex flex-col gap-1 w-44 p-2 bg-white border border-gray-100 shadow-xl rounded-xl text-xs font-medium text-gray-700'>
                                    <button
                                        onClick={() => { setProfileOpen(false); navigate('/orders'); }}
                                        className='text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-800 hover:text-black font-semibold flex items-center justify-between'
                                    >
                                        My Orders
                                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                                    </button>
                                    <button
                                        onClick={logout}
                                        className='text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors font-semibold'
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Shopping Cart Pill */}
                    <Link to='/cart' className='relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'>
                        <img src={assets.cart_icon} className='w-4 h-4' alt="Cart" />
                        {cartCount > 0 && (
                            <span className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-gray-900 text-white rounded-full text-[10px] font-bold px-1 animate-pulse border-2 border-white shadow-sm'>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Drawer Trigger */}
                    <button onClick={() => setVisible(true)} className='p-2 hover:bg-gray-100 rounded-full sm:hidden' aria-label="Menu">
                        <img src={assets.menu_icon} className='w-5 h-5' alt="Menu" />
                    </button>
                </div>

                {/* Mobile Drawer Menu */}
                <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 sm:hidden ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setVisible(false)}>
                    <div
                        className={`absolute top-0 right-0 bottom-0 w-[280px] bg-white p-6 transition-transform duration-300 flex flex-col shadow-2xl ${visible ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-center justify-between pb-6 border-b border-gray-100'>
                            <img src={assets.logo} className='w-28' alt="Logo" />
                            <button onClick={() => setVisible(false)} className='p-2 hover:bg-gray-100 rounded-full'>
                                <img className='h-4 w-4' src={assets.cross_icon} alt="Close" />
                            </button>
                        </div>

                        <div className='flex flex-col gap-4 mt-6 text-sm font-semibold tracking-wider uppercase text-gray-800'>
                            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 px-3 rounded-lg transition ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} to='/'>
                                HOME
                            </NavLink>
                            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 px-3 rounded-lg transition ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} to='/collection'>
                                COLLECTION
                            </NavLink>
                            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 px-3 rounded-lg transition ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} to='/about'>
                                ABOUT
                            </NavLink>
                            <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 px-3 rounded-lg transition ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} to='/contact'>
                                CONTACT
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
