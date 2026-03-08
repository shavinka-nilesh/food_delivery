import React, { useState, useEffect } from 'react'
import './AdminProfile.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AdminProfile = ({ url, setToken }) => {

    const navigate = useNavigate();
    const [image, setImage] = useState(false);
    const [serverImage, setServerImage] = useState("");
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const fetchAdminData = async () => {
        try {
            const response = await axios.get(`${url}/api/user/admin-profile`);
            if (response.data.success) {
                setData(prev => ({ ...prev, email: response.data.data.email }));
                if (response.data.data.image) {
                    setServerImage(response.data.data.image);
                }
            }
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        }
    }

    useEffect(() => {
        fetchAdminData();
    }, [])

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("email", data.email);
        
        // Only append password if they typed a new one
        if (data.password.trim() !== "") {
            formData.append("password", data.password);
        }

        // Append image if a new one was uploaded
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post(`${url}/api/user/admin-update`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                
                // If they changed their password, force them to relogin for security.
                if (data.password.trim() !== "") {
                    localStorage.removeItem("token");
                    setToken("");
                    navigate("/");
                    toast.info("Password changed. Please log in again.");
                } else {
                    // Just clear the password field visually
                    setData(prev => ({...prev, password: ""}));
                    // Reload to reflect new image in Navbar if applicable
                    if(image) window.location.reload();
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error updating profile");
        }
    }

    return (
        <div className='admin-profile'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="admin-profile-title">
                    <p>Admin Profile Settings</p>
                </div>

                <div className="admin-profile-img-upload flex-col">
                    <p>Upload New Avatar</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : (serverImage ? `${url}/images/${serverImage}` : assets.upload_area)} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </div>
                
                <div className="admin-profile-email flex-col">
                    <p>Login Email Address</p>
                    <input onChange={onChangeHandler} value={data.email} type="email" name='email' placeholder='admin@fooddel.com' required />
                </div>

                <div className="admin-profile-password flex-col">
                    <p>Change Password (Leave blank to keep current)</p>
                    <input onChange={onChangeHandler} value={data.password} type="password" name='password' placeholder='Enter new password' />
                </div>

                <button type='submit' className='add-btn'>SAVE SETTINGS</button>
            </form>
        </div>
    )
}

export default AdminProfile
