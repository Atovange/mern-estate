import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            const res = await fetch("/api/user/" + listing.userRef);
            const data = await res.json();
            if (data.success == false) {
                console.log(data.message);
                return;
            }
            setLandlord(data);
        }

        fetchLandlord();
    }, []);

    if (landlord)
        return (
            <div className='flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold lowercase'>{listing.name}</span></p>
                <textarea
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Enter your message here'
                    className='w-full border p-3 rounded-lg'>
                </textarea>
                <Link
                    to={"mailto:" + landlord.email + "?subject=Regarding " + listing.name + "&body=" + message}
                    className='bg-slate-700 p-3 text-white text-center uppercase rounded-lg hover:opacity-90'>
                    Send Message
                </Link>
            </div>
        )
}
