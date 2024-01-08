import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const { isLoading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    const res = await fetch("/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    );
    const data = await res.json();
    if(data.success === false) {
      dispatch(signInFailure(data.message));
      return;
    }
    const resSignIn = await fetch("/api/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    );
    const dataSignIn = await resSignIn.json();
    if(dataSignIn.success === false) {
      dispatch(signInFailure(data.message));
      return;
    }
    dispatch(signInSuccess(dataSignIn));
    navigate("/profile");
    console.log(data);
    console.log(dataSignIn);
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="text" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button
          disabled={isLoading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70 '>
            {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
