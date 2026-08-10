import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent')

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct();
  }, [sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-8 pt-8 min-h-screen'>
      
      {/* Filter Sidebar */}
      <aside className='min-w-64 space-y-6'>
        
        {/* Mobile Filter Toggle Header */}
        <div 
          onClick={() => setShowFilter(!showFilter)} 
          className='flex items-center justify-between py-3 px-4 bg-zinc-100 rounded-xl cursor-pointer sm:cursor-default border border-gray-200/80 sm:bg-transparent sm:border-0 sm:p-0'
        >
          <div className='flex items-center gap-2'>
            <h3 className='font-bold text-sm tracking-wider uppercase font-heading text-gray-900'>Filters</h3>
            {(category.length > 0 || subCategory.length > 0) && (
              <span className='bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full'>
                {category.length + subCategory.length}
              </span>
            )}
          </div>
          <img className={`h-3 w-3 transition-transform sm:hidden ${showFilter ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="Toggle" />
        </div>

        {/* Clear Filters Button */}
        {(category.length > 0 || subCategory.length > 0) && (
          <button 
            onClick={clearAllFilters}
            className='text-xs font-semibold text-red-600 hover:text-red-800 transition flex items-center gap-1'
          >
            ✕ Clear All Filters
          </button>
        )}

        {/* Filter Container */}
        <div className={`space-y-6 ${showFilter ? 'block' : 'hidden'} sm:block`}>
          
          {/* Categories Card */}
          <div className='p-5 bg-white rounded-2xl border border-gray-100 shadow-xs'>
            <h4 className='mb-4 text-xs font-bold text-gray-900 uppercase tracking-widest font-heading border-b border-gray-100 pb-2'>
              Categories
            </h4>
            <div className='space-y-3 text-sm text-gray-700 font-medium'>
              {['Men', 'Women', 'Kids'].map((cat) => (
                <label key={cat} className='flex items-center gap-3 cursor-pointer group hover:text-black'>
                  <input 
                    type="checkbox" 
                    value={cat} 
                    checked={category.includes(cat)}
                    onChange={toggleCategory}
                    className='w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 transition cursor-pointer'
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SubCategories Card */}
          <div className='p-5 bg-white rounded-2xl border border-gray-100 shadow-xs'>
            <h4 className='mb-4 text-xs font-bold text-gray-900 uppercase tracking-widest font-heading border-b border-gray-100 pb-2'>
              Apparel Type
            </h4>
            <div className='space-y-3 text-sm text-gray-700 font-medium'>
              {['Topwear', 'Bottomwear', 'Winterwear'].map((subCat) => (
                <label key={subCat} className='flex items-center gap-3 cursor-pointer group hover:text-black'>
                  <input 
                    type="checkbox" 
                    value={subCat} 
                    checked={subCategory.includes(subCat)}
                    onChange={toggleSubCategory}
                    className='w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 transition cursor-pointer'
                  />
                  <span>{subCat}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className='flex-1'>

        {/* Top Header & Sort Toolbar */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100'>
          <div>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            <p className='text-xs text-gray-500 font-medium mt-1'>
              Showing <span className='font-bold text-gray-900'>{filterProducts.length}</span> items
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className='flex items-center gap-2'>
            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline'>Sort By:</span>
            <select 
              onChange={(e) => setSortType(e.target.value)} 
              className='bg-white border border-gray-200 text-gray-800 font-semibold text-xs rounded-xl px-4 py-2.5 outline-none focus:border-gray-900 transition shadow-xs cursor-pointer'
            >
              <option value="relavent">Relevant Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filterProducts.length > 0 ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
            {filterProducts.map((item) => (
              <ProductItem 
                key={item._id} 
                name={item.name} 
                id={item._id} 
                price={item.price} 
                image={item.image} 
                bestseller={item.bestseller}
              />
            ))}
          </div>
        ) : (
          <div className='py-20 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200'>
            <p className='text-gray-400 text-base font-semibold'>No products matched your selected filters.</p>
            <button 
              onClick={clearAllFilters}
              className='mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition'
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

    </div>
  )
}

export default Collection
