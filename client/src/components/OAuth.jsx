import React from 'react'
import {useNavigate} from "react-router-dom"

import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess } from '../redux/user/userSlice';

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        dispatch(signInStart());
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            });
            
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/profile");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button
            type="button"
            className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70'
            onClick={handleGoogleClick}>
            Continue with Google
        </button>
    )
}
