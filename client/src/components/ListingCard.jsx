import React from 'react'
import { Link } from 'react-router-dom'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";

export default function ListingCard({listing}) {
  return (
    <Link
        to={"/listing/" + listing._id}
        className='overflow-hidden bg-white flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300
        w-full sm:w-[330px] rounded-lg'>
        <img src={listing.imageUrls[0]} alt="listing image" className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'/>
        <div className='p-5 flex flex-col gap-3'>
            <p className='text-xl font-semibold text-slate-700 truncate'>
                {listing.name}
            </p>
            <div className='flex items-center gap-2'>
                <FaMapMarkerAlt className='w-4 h-4 text-green-700'/>
                <span className='text-green-700 truncate text-sm'>{listing.address}</span>
            </div>
            <p className='line-clamp-2 text-gray-600'>
                {listing.description}
            </p>
            <ul className='text-green-900 font-semibold flex flex-wrap gap-5'>
                <li className='flex items-center gap-2 whitespace-nowrap'><FaBed/> {listing.bedrooms} Bedroom{listing.bedrooms > 1 && "s"}</li>
                <li className='flex items-center gap-2 whitespace-nowrap'><FaBath/> {listing.bathrooms} Bathroom{listing.bathrooms > 1 && "s"}</li>
            </ul>
            <p className='text-slate-500 font-semibold text-lg'>
                {listing.offer ? listing.discountedPrice.toLocaleString("en-US", {style: "currency", currency: 'USD'}) : listing.regularPrice.toLocaleString("en-US", {style: "currency", currency: 'USD'})}{listing.type === "rent" && " / month"}
            </p>
        </div>
    </Link>
  )
}
