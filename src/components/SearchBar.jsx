import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false)
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false)
        }
    }, [location])

    return showSearch && visible ? (
        <div className='bg-zinc-50 border-b border-gray-200/80 py-4 px-4 text-center transition-all animate-fade-in'>
            <div className='inline-flex items-center justify-between bg-white border border-gray-300 focus-within:border-gray-900 shadow-sm px-4 py-2.5 rounded-full w-full max-w-lg transition-all'>
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className='flex-1 outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent' 
                    type="text" 
                    placeholder='Search clothes, jackets, accessories...'
                    autoFocus
                />
                <img className='w-4 h-4 ml-2 opacity-60' src={assets.search_icon} alt="Search" />
            </div>
            <button 
                onClick={() => setShowSearch(false)} 
                className='inline-flex items-center justify-center p-2 ml-3 hover:bg-gray-200 rounded-full transition'
                title="Close Search"
            >
                <img className='w-3 h-3' src={assets.cross_icon} alt="Close" />
            </button>
        </div>
    ) : null
}

export default SearchBar
