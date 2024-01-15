import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [offersListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const res1 = await fetch("/api/listings?limit=4&offer=true");
      const data1 = await res1.json();
      setOfferListings(data1);
      const res2 = await fetch("/api/listings?limit=4&sell=true");
      const data2 = await res2.json();
      setSaleListings(data2);
      const res3 = await fetch("/api/listings?limit=4&rent=true");
      const data3 = await res3.json();
      setRentListings(data3);
    }
    fetchListings();
  }, []);

  const offersListingsCards = offersListings.map(listing => 
    <ListingCard key={listing._id} listing={listing}/>
  );
  const saleListingsCards = saleListings.map(listing => 
    <ListingCard key={listing._id} listing={listing}/>
  );
  const rentListingsCards = rentListings.map(listing => 
    <ListingCard key={listing._id} listing={listing}/>
  );

  return (
    <div>
      <div className='flex flex-col gap-5 p-28 px-5 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Discover you next <span className='text-slate-500'>perfect</span><br/>
          home with ease
        </h1>
        <p className='text-gray-500 text-xl sm:text-lg'>
          Explore a curated collection of premium estates, from luxurious condos to cozy family homes.<br/>
          Find the perfect blend of comfort and style with our meticulously crafted listings.<br/>
          Your dream home is just a click away - start your journey to unparalleled living today!
        </p>
        <Link to={"/search"}>
          <button className='p-4 bg-slate-700 text-white rounded-lg font-semibold'>Start now!</button>
        </Link>
      </div>
      <div className='p-5 flex flex-col max-w-7xl mx-auto'>
        <div className='p-5 flex flex-col'>
          <h3 className='text-slate-700 text-3xl font-semibold'>Recent offers</h3>
          <Link to={"/search?offer=true"} className=''>Show more offers</Link>
          <div className='flex flex-col sm:flex-row gap-5 mt-5'>
            {offersListingsCards}
          </div>
        </div>
        <div className='p-5 flex flex-col'>
          <h3 className='text-slate-700 text-3xl font-semibold'>Recent for rent</h3>
          <Link to={"/search?rent=true"} className=''>Show more for rent</Link>
          <div className='flex flex-col sm:flex-row gap-5 mt-5'>
            {rentListingsCards}
          </div>
        </div>
        <div className='p-5 flex flex-col'>
          <h3 className='text-slate-700 text-3xl font-semibold'>Recent for sale</h3>
          <Link to={"/search?sell=true"} className=''>Show more for sale</Link>
          <div className='flex flex-col sm:flex-row gap-5 mt-5'>
            {saleListingsCards}
          </div>
        </div>
      </div>
      
    </div>
  )
}
