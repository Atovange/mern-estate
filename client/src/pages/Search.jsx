import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form action="" className='flex flex-col gap-5 min-w-96'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold' htmlFor="searchTerm">Search term:</label>
                    <input
                        type="text"
                        id="searchTerm"
                        placeholder='Search...'
                        className='border rounded-lg p-3 w-full'/>
                </div>
                <div className='flex gap-5 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5' />
                        <label htmlFor="rent">Rent</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sell" className='w-5' />
                        <label htmlFor="sell">Sell</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5' />
                        <label htmlFor="offer">Offer</label>
                    </div>
                </div>
                <div className='flex gap-5 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5' />
                        <label htmlFor="parking">Parking</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5' />
                        <label htmlFor="furnished">Furnished</label>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label htmlFor="sort" className='font-semibold'>Sort:</label>
                    <select id="sort" className='p-3 border rounded-lg'>
                        <option value="">Time posted</option>
                        <option value="">Price</option>
                    </select>
                    <select id="order" className='p-3 border rounded-lg'>
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
            </form>
        </div>
        <div className=''>
            <h1 className='text-3xl font-semibold p-3 text-slate-700'>Listing results:</h1>
        </div>
    </div>
  )
}
