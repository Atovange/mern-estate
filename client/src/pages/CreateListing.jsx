import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-5'>
            <div className='flex flex-col gap-4 flex-1'>
                <input
                    type="text"
                    placeholder='Name'
                    className='border p-3 rounded-lg'
                    id="name"
                    maxLength={62}
                    minLength={10}
                    required 
                />
                <textarea
                    placeholder='Description'
                    className='border p-3 rounded-lg'
                    id="description"
                    required 
                />
                <input
                    type="text"
                    placeholder='Address'
                    className='border p-3 rounded-lg'
                    id="address"
                    required 
                />
                <div className='flex gap-5 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sell" className='w-5' />
                        <label htmlFor="sell">Sell</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5' />
                        <label htmlFor="rent">Rent</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parkingSpot" className='w-5' />
                        <label htmlFor="parkingSpot">Parking Spot</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5' />
                        <label htmlFor="furnished">Furnished</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5' />
                        <label htmlFor="offer">Offer</label>
                    </div>
                </div>
                <div className='flex flex-wrap gap-5'>
                    <div className='flex items-center gap-2'>
                        <input
                            type="number"
                            id="bedrooms"
                            min="1"
                            max="10"
                            className='p-3 border border-gray-300 rounded-lg w-20'
                            required
                        />
                        <label htmlFor="bedrooms">Bedrooms</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type="number"
                            id="bathrooms"
                            min="1"
                            max="10"
                            className='p-3 border border-gray-300 rounded-lg w-20'
                            required
                        />
                        <label htmlFor="bathrooms">Bathrooms</label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type="number"
                            id="regularPrice"
                            min="1"
                            max="10"
                            className='p-3 border border-gray-300 rounded-lg w-32'
                            required
                        />
                        <div className='flex flex-col items-center'>
                            <label htmlFor="regularPrice">Regular price</label>
                            <span className='text-xs'>( $ / month )</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type="number"
                            id="discountedPrice"
                            min="1"
                            max="10"
                            className='p-3 border border-gray-300 rounded-lg w-32'
                            required
                        />
                        <div className='flex flex-col items-center'>
                            <label htmlFor="discountedPrice">Discounted price</label>
                            <span className='text-xs'>( $ / month )</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4 flex-1'>
                <p className='font-semibold'>
                    Images:
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input
                        className='p-3 border border-gray-300 rounded w-full'
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                    />
                    <button className='p-3 text-green-700 border border-green-700 rounded uppercaase hover:shadow-lg disabled:opacity-80'>Upload</button>
                </div>
                <button
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70 text-center'>
                    Create Listing
                </button>
            </div>
            
        </form>
    </main>
  )
}
