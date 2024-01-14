import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
    const [formData, setFormData] = useState({
		name: "",
		description: "",
		address: "",
		type: "rent",
		bedrooms: 1,
		bathrooms: 1,
		regularPrice: 50,
		discountedPrice: 0,
		offer: false,
		parking: false,
		furnished: false,
		imageUrls: []
	});
	const [files, setFiles] = useState([]);
	const [imageUploadError, setImageUploadError] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isFetchingListing, setIsFetchingListing] = useState(false);

	const {currentUser} = useSelector(state => state.user);

	const navigate = useNavigate();
	const params = useParams();

	const id = params.listingId;

	useEffect(() => {
		const fetchListing = async () => {
			setIsFetchingListing(true);
			const res = await fetch("/api/listing/" + id);
			const data = await res.json();
			setIsFetchingListing(false);
			if (data.success == false) {
				console.log(data.message);
				return;
			}
			setFormData(data);
		}

		if (id) fetchListing();
		
	}, []);

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

	const handleChange = (e) => {
		if(e.target.id === "sell" || e.target.id === "rent") {
			setFormData({
				...formData,
				type: e.target.id
			});
		} else if (["parking", "furnished", "offer"].includes(e.target.id)) {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked
			});
		} else {
			setFormData({
				...formData,
				[e.target.id]: e.target.value
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitError(null);
		
		console.log(formData);
		console.log(+formData.regularPrice);
		if (formData.imageUrls.length < 1) return setSubmitError("Please upload at least one image");
		if (+formData.regularPrice < +formData.discountedPrice) return setSubmitError("Discounted price must be less than regular price");
		
		setIsLoading(true);
		let res = null;
		if (id) {
			res = await fetch("/api/listing/update/" + id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id
				})
			});
		} else {
			res = await fetch("/api/listing/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id
				})
			});
		}
		

		const data = await res.json();
		setIsLoading(false);
		if (data.success === false) {
			setSubmitError(data.message);
			return;
		}
		navigate("/listing/" + data._id);
	}

	const imageDivs = formData.imageUrls.map((url, index) =>
		<div key={url} className='flex justify-between p-3 border items-center'>
			<img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
			<button onClick={() => handleRemoveImage(index)} type="button" className='p-3 h-full uppercase text-red-700 border border-red-700 rounded uppercaase hover:shadow-lg disabled:opacity-80'>Remove</button>
		</div>
	);

	return (
		<main className='p-3 max-w-4xl mx-auto'>
			<h1 className='text-3xl text-center font-semibold my-7'>
				{isFetchingListing ? "Loading..." : (id ? "Update listing" : "Create a Listing")}
			</h1>
			<form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-5'>
				<div className='flex flex-col gap-4 flex-1'>
					<input
						type="text"
						placeholder='Name'
						className='border p-3 rounded-lg'
						id="name"
						maxLength={62}
						minLength={10}
						required
						onChange={handleChange}
						value={formData.name}
					/>
					<textarea
						placeholder='Description'
						className='border p-3 rounded-lg'
						id="description"
						required
						onChange={handleChange}
						value={formData.description}
					/>
					<input
						type="text"
						placeholder='Address'
						className='border p-3 rounded-lg'
						id="address"
						required
						onChange={handleChange}
						value={formData.address}
					/>
					<div className='flex gap-5 flex-wrap'>
						<div className='flex gap-2'>
							<input type="checkbox" id="sell" className='w-5' onChange={handleChange} checked={formData.type == "sell"}/>
							<label htmlFor="sell">Sell</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="rent" className='w-5' onChange={handleChange} checked={formData.type == "rent"}/>
							<label htmlFor="rent">Rent</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={formData.parking}/>
							<label htmlFor="parking">Parking Spot</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={formData.furnished}/>
							<label htmlFor="furnished">Furnished</label>
						</div>
						<div className='flex gap-2'>
							<input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={formData.offer}/>
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
								onChange={handleChange}
								value={formData.bedrooms}
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
								onChange={handleChange}
								value={formData.bathrooms}
							/>
							<label htmlFor="bathrooms">Bathrooms</label>
						</div>
						<div className='flex items-center gap-2'>
							<input
								type="number"
								id="regularPrice"
								min="50"
								max="1_000_000"
								className='p-3 border border-gray-300 rounded-lg w-32'
								required
								onChange={handleChange}
								value={formData.regularPrice}
							/>
							<div className='flex flex-col items-center'>
								<label htmlFor="regularPrice">Regular price</label>
								<span className='text-xs'>( $ / month )</span>
							</div>
						</div>
						{formData.offer &&
							<div className='flex items-center gap-2'>
								<input
									type="number"
									id="discountedPrice"
									min="0"
									max="1_000_000"
									className='p-3 border border-gray-300 rounded-lg w-32'
									required
									onChange={handleChange}
									value={formData.discountedPrice}
								/>
								<div className='flex flex-col items-center'>
									<label htmlFor="discountedPrice">Discounted price</label>
									<span className='text-xs'>( $ / month )</span>
								</div>
							</div>
						}
						
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
						disabled={isLoading || isUploading}
						className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-70 text-center'>
						{isLoading ? "Loading..." : (id ? "Update listing" : "Create Listing")}
					</button>
					{submitError && <p className='text-red-700 text-sm'>{submitError}</p>}
				</div>
				
			</form>
		</main>
	)
}