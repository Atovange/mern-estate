import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [error, setError] = useState(null);

    const params = useParams();

    SwiperCore.use([Navigation]);

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
                </div>    
            )}
        </main>
    )
}
