import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react'
import { app } from '../firebase';

export default function CreateListing() {
    const [formData, setFormData] = useState({
		imageUrls: []
	});
	const [files, setFiles] = useState([]);
	const [imageUploadError, setImageUploadError] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleImageUpload = (e) => {
		if (files.length <= 0 || files.length + formData.imageUrls.length >= 7) {
			setImageUploadError("Maximum 6 images");
			return;
		}
		
		setImageUploadError(null);

		const promises = [];
		for (let file of files) {
			promises.push(storeImage(file));
		}

		setIsUploading(true);

		Promise.all(promises).then(urls => {
			setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
			setIsUploading(false);
		}).catch(error => {
			setImageUploadError("Image upload failed");
			setIsUploading(false);
		});
	}

	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on("state_changed", {
				error: (error) => {
					reject(error);
				},
				complete: () => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
						resolve(downloadUrl);
					});
				}
			});
		});
	}

	const handleRemoveImage = (index) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index)
		})
	}

	const imageDivs = formData.imageUrls.map((url, index) =>
		<div key={url} className='flex justify-between p-3 border items-center'>
			<img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
			<button onClick={() => handleRemoveImage(index)} type="button" className='p-3 h-full uppercase text-red-700 border border-red-700 rounded uppercaase hover:shadow-lg disabled:opacity-80'>Remove</button>
		</div>
	);

	return (
		<main className='p-3 max-w-4xl mx-auto'>
			<h1 className='text-3xl text-center font-semibold my-7'>Create a Listing</h1>
			<form className='flex flex-col sm:flex-row gap-5'>
				<div className='flex flex-col gap-4 flex-1'>
					<input
						type="text"
						placeholder='Name'
						className='border p-3 rounded-lg'
						id="name"
						maxLength={62}
						minLength={10}
						required 
					/>
					<textarea
						placeholder='Description'
						className='border p-3 rounded-lg'
						id="description"
						required 
					/>
					<input
						type="text"
						placeholder='Address'
						className='border p-3 rounded-lg'
						id="address"
						required 
					/>
					<div className='flex gap-5 flex-wrap'>
						<div className='flex gap-2'>
							<input type="checkbox" id="sell" className='w-5' />
							<label htmlFor="sell">Sell</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="rent" className='w-5' />
							<label htmlFor="rent">Rent</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="parkingSpot" className='w-5' />
							<label htmlFor="parkingSpot">Parking Spot</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="furnished" className='w-5' />
							<label htmlFor="furnished">Furnished</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="offer" className='w-5' />
							<label htmlFor="offer">Offer</label>
						</div>
					</div>
					<div className='flex flex-wrap gap-5'>
						<div className='flex items-center gap-2'>
							<input
								type="number"
								id="bedrooms"
								min="1"
								max="10"
								className='p-3 border border-gray-300 rounded-lg w-20'
								required
							/>
							<label htmlFor="bedrooms">Bedrooms</label>
						</div>
						<div className='flex items-center gap-2'>
							<input
								type="number"
								id="bathrooms"
								min="1"
								max="10"
								className='p-3 border border-gray-300 rounded-lg w-20'
								required
							/>
							<label htmlFor="bathrooms">Bathrooms</label>
						</div>
						<div className='flex items-center gap-2'>
							<input
								type="number"
								id="regularPrice"
								min="1"
								max="10"
								className='p-3 border border-gray-300 rounded-lg w-32'
								required
							/>
							<div className='flex flex-col items-center'>
								<label htmlFor="regularPrice">Regular price</label>
								<span className='text-xs'>( $ / month )</span>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<input
								type="number"
								id="discountedPrice"
								min="1"
								max="10"
								className='p-3 border border-gray-300 rounded-lg w-32'
								required
							/>
							<div className='flex flex-col items-center'>
								<label htmlFor="discountedPrice">Discounted price</label>
								<span className='text-xs'>( $ / month )</span>
							</div>
						</div>
					</div>
				</div>
				<div className='flex flex-col gap-4 flex-1'>
					<p className='font-semibold'>
						Images:
						<span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
					</p>
					<div className='flex gap-4'>
						<input
							className='p-3 border border-gray-300 rounded w-full'
							type="file"
							id="images"
							accept="image/*"
							multiple
							onChange={(e) => setFiles(e.target.files)}
						/>
						<button
							type='button'
							onClick={handleImageUpload}
							className='p-3 uppercase text-green-700 border border-green-700 rounded uppercaase hover:shadow-lg disabled:opacity-80'>
							{isUploading ? "Uploading..." : "Upload"}
							</button>
					</div>
					<span className='text-red-700 text-center'>{imageUploadError && imageUploadError}</span>
					{imageDivs}
					<button
						className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70 text-center'>
						Create Listing
					</button>
				</div>
				
			</form>
		</main>
	)
}