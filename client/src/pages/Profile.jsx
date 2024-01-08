import { React, useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutFailure, signOutSuccess } from '../redux/user/userSlice';
import { Link } from "react-router-dom";

export default function Profile() {
  const [formData, setFormData] = useState({});
  const { currentUser, isLoading, error } = useSelector(state => state.user);

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileError, setFileError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      console.log(file);
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setFileError(false);
    uploadTask.on("state_changed", {
      next: (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(Math.round(progress));
      },
      error: (error) => {
        console.log(error);
        setFileError(true);
      },
      complete: () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
          setFormData({
            ...formData,
            profilePicture: downloadUrl
          });
        });
      }
    });
  }

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
    dispatch(updateUserStart());
    const res = await fetch("/api/user/update/" + currentUser._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
  }

  const handleDeleteAccount = async (e) => {
    dispatch(deleteUserStart());
    const res = await fetch("/api/user/delete/" + currentUser._id, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess());
  }

  const handleSignOut = async (e) => {
    dispatch(signOutStart());
    const res = await fetch("/api/auth/signout/");
    const data = await res.json();
    if (data.success === false) {
      dispatch(signOutFailure(data.message));
      return;
    }
    dispatch(signOutSuccess());
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
          id="profilePicture"
          onChange={(e) => setFile(e.target.files[0])}  
        />
        <img
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center"
          src={formData.profilePicture || currentUser.profilePicture}
          alt="Profile"
          onClick={() => fileRef.current.click()}
        />
        <p className='text-center'>
          {fileError && <span className='text-red-700'>An error occurred!</span>}
          {!fileError && fileProgress > 0 && fileProgress < 100 && <span className='text-slate-700'>Upload progress: {fileProgress}%</span>}
          {!fileError && fileProgress == 100 && <span className='text-green-700'>Image successfully uploaded!</span>}
        </p>
        
        <input
          type="text"
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button
          disabled={isLoading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70'>
            {isLoading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70 text-center'>
          Create Listing
        </Link>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
    </div>
  )
}
