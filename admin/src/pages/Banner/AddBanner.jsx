import React, { useState, useCallback } from 'react'
import './AddBanner.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'

const AddBanner = ({url}) => {

    const [image, setImage] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setShowCropper(true);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!image) {
             toast.error("Please provide an image.");
             return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/banner/add`, formData);
            if (response.data.success) {
                setImage(false);
                setImageSrc(null);
                setShowCropper(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
             toast.error("Error adding banner");
        }
    }

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            
            // Create a File object from Blob
            const file = new File([croppedImageBlob], "banner.jpeg", { type: "image/jpeg" });
            setImage(file);
            setShowCropper(false);
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels]);


    return (
        <div className='add-banner'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Banner Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" className={image ? "preview-banner" : ""} />
                    </label>
                    <input onChange={onFileChange} type="file" id="image" hidden required />
                </div>
                {showCropper && (
                    <div className="cropper-container">
                        <div className="crop-area">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={3} // E.g. width is 3 x height for a wide banner
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="crop-controls">
                            <button type="button" onClick={showCroppedImage} className='crop-btn'>Crop Image</button>
                            <button type="button" onClick={() => { setShowCropper(false); setImageSrc(null); document.getElementById("image").value = ""; }} className='cancel-btn'>Cancel</button>
                        </div>
                    </div>
                )}
                <button type='submit' className='add-btn' disabled={showCropper}>ADD BANNER</button>
            </form>
        </div>
    )
}

// Helper functions for cropping
function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    // Set canvas dimensions
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image onto the canvas
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    // Return as Blob
    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            resolve(file)
        }, 'image/jpeg')
    })
}

export default AddBanner
