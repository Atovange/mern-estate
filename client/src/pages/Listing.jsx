import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Fa500Px, FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [toContact, setToContact] = useState(false);
    const { currentUser } = useSelector(state => state.user);

    const params = useParams();

    SwiperCore.use([Navigation]);

    const handleClickShare = (e) => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    useEffect(() => {
		const fetchListing = async () => {
			const res = await fetch("/api/listing/" + params.listingId);
			const data = await res.json();
			if (data.success == false) {
				console.log(data.message);
                setError(data.message);
				return;
			}
			setListing(data);
		}
        
        fetchListing();
	}, []);

    return (
        <main>
            {!listing && !error && <h1 className='text-center my-7 text-2xl'>Loading...</h1>}
            {error && <h1 className='text-center my-7 text-2xl'>Something went wrong!</h1>}
            {listing && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map(url =>
                            <SwiperSlide key={url}>
                                <div
                                    className='h-[550px]'
                                    style={{background: "url(" + url + ") center no-repeat", backgroundSize: "cover"}}>

                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                    <div onClick={handleClickShare} className='fixed top-[10%] right-[5%] z-10 border rounded-full p-5 bg-slate-100 shadow-lg cursor-pointer'>
                        <FaShare className='text-slate-700'/>
                    </div>
                    <div>
                        {isCopied && <div className='fixed top-[17%] right-[3%] z-10 bg-slate-100 rounded-md p-3 shadow-lg'>Link copied!</div>}
                    </div>
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-5 mb-32'>
                        <p className='text-2xl font-semibold'>{listing.name} - <span className={listing.offer ? "line-through opacity-50" : ""}>{listing.regularPrice.toLocaleString("en-US", {style: "currency", currency: 'USD'})}{listing.type == "rent" && "/month"}</span> {listing.offer && listing.discountedPrice.toLocaleString("en-US", {style: "currency", currency: 'USD'}) + (listing.type == "rent" && "/month")}</p>
                        <p className='flex items-center mt-6 gap-2 text-slate-600'>
                            <FaMapMarkerAlt className='text-green-700'/>
                            {listing.address}
                        </p>
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md font-semibold h-9'>
                            {listing.type === "rent" ? "For Rent" : "For Sale"}
                        </p>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold flex flex-wrap gap-5'>
                            <li className='flex items-center gap-2 whitespace-nowrap'><FaBed className='text-lg'/> {listing.bedrooms} Bedroom{listing.bedrooms > 1 && "s"}</li>
                            <li className='flex items-center gap-2 whitespace-nowrap'><FaBath className='text-lg'/> {listing.bedrooms} Bathroom{listing.bedrooms > 1 && "s"}</li>
                            <li className='flex items-center gap-2 whitespace-nowrap'><FaParking className='text-lg'/> {listing.parking ? "Parking spot" : "No parking spot"}</li>
                            <li className='flex items-center gap-2 whitespace-nowrap'><FaChair className='text-lg'/> {listing.furnished ? "Furnished" : "Not furnished"}</li>
                        </ul>
                        {
                            currentUser && listing.userRef != currentUser._id && !toContact && (
                                <button
                                    onClick={() => setToContact(true)}
                                    className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90'>
                                    Contact Landlord
                                </button>
                            )
                        }
                        {toContact && <Contact listing={listing}/>}
                    </div>
                </div>    
            )}
        </main>
    )
}
