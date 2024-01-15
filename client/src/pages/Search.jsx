import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

export default function Search() {
    const [searchParams, setSearchParams] = useState({
        searchTerm: "",
        rent: true,
        sell: true,
        offer: false,
        parking: false,
        furnished: false,
        sort: "createdAt",
        order: "desc"
    });
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const newSearchParams = {};
        for (const key in searchParams) {
            let value;
            switch (urlParams.get(key)) {
                case "true":
                    value = true;
                    break;
                case "false":
                    value = false;
                    break;
                case null:
                case undefined:
                    value = searchParams[key];
                    break;
                default:
                    value = urlParams.get(key);
            }
            // const vaalue = urlParams.get(key) === "false" ? false : urlParams.get(key);
            newSearchParams[key] = value;
        }
        setSearchParams(newSearchParams);

        const fetchListings = async () => {
            const searchQuery = urlParams.toString();
            const res = await fetch("/api/listings?" + searchQuery);
            const data = await res.json();
            setListings(data);
        }
        fetchListings();

    }, [window.location.search])

    const handleChange = (e) => {
        if (["parking", "furnished", "offer", "rent", "sell"].includes(e.target.id)) {
			setSearchParams({
				...searchParams,
				[e.target.id]: e.target.checked
			});
		} else {
			setSearchParams({
				...searchParams,
				[e.target.id]: e.target.value
			});
		}
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        for (const key in searchParams) {
            urlParams.set(key, searchParams[key]);
        }
        const searchQuery = urlParams.toString();
        navigate("/search?" + searchQuery);
    }

    const onShowMore = async (e) => {
        const listingsAmount = listings.length;
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("skip", listingsAmount);
        const searchQuery = urlParams.toString();
        const res = await fetch("/api/listings?" + searchQuery);
        const data = await res.json();
        setListings([...listings, ...data]);
    }

    const listingsDivs = listings.map(listing => 
        <ListingCard key={listing._id} listing={listing}/>
    );

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 min-w-96'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold' htmlFor="searchTerm">Search term:</label>
                        <input
                            onChange={handleChange}
                            value={searchParams.searchTerm}
                            type="text"
                            id="searchTerm"
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'/>
                    </div>
                    <div className='flex gap-5 flex-wrap items-center'>
                        <label className='font-semibold'>Type:</label>
                        <div className='flex gap-2'>
                            <input onChange={handleChange} checked={searchParams.rent} type="checkbox" id="rent" className='w-5' />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex gap-2'>
                            <input onChange={handleChange} checked={searchParams.sell} type="checkbox" id="sell" className='w-5' />
                            <label htmlFor="sell">Sell</label>
                        </div>
                        <div className='flex gap-2'>
                            <input onChange={handleChange} checked={searchParams.offer} type="checkbox" id="offer" className='w-5' />
                            <label htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className='flex gap-5 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input onChange={handleChange} checked={searchParams.parking} type="checkbox" id="parking" className='w-5' />
                            <label htmlFor="parking">Parking</label>
                        </div>
                        <div className='flex gap-2'>
                            <input onChange={handleChange} checked={searchParams.furnished} type="checkbox" id="furnished" className='w-5' />
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="sort" className='font-semibold'>Sort:</label>
                        <select id="sort" className='p-3 border rounded-lg' onChange={handleChange} value={searchParams.sort}>
                            <option value="createdAt">Date posted</option>
                            <option value="price">Price</option>
                        </select>
                        <select id="order" className='p-3 border rounded-lg' onChange={handleChange} value={searchParams.order}>
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
                </form>
            </div>
            <div className='flex flex-col'>
                <h1 className='text-3xl font-semibold p-3 text-slate-700'>Listing results:</h1>
                <div className='p-3 flex flex-wrap gap-8'>
                    {listings.length > 0 ? listingsDivs : "No listings found!"}
                </div>
                <button onClick={onShowMore} className='text-green-700 hover:underline p-7'>Show more</button>
            </div>
            
        </div>
    )
}
