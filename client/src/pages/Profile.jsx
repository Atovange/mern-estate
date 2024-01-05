import { React, useState } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';

export default function Profile() {
  const [formData, setFormData] = useState({});
  const { currentUser, isLoading, error } = useSelector(state => state.user);

  const handleChange = (e) => {

  }

  const handleSubmit = (e) => {
    
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <img className="rounded-full w-24 h-24 object-cover cursor-pointer self-center" src={currentUser.profilePicture} alt="Profile" />
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="text" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button
          disabled={isLoading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70 '>
            {isLoading ? "Loading..." : "Update"}
        </button>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      <div className='flex justify-between mt-5'>
        <span className='text-red-700'>Delete Account</span>
        <span className='text-red-700'>Sign Out</span>
      </div>
    </div>
  )
}
