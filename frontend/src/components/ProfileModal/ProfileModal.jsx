import React, { useContext, useEffect, useState } from 'react'
import './ProfileModal.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ProfileModal = ({ setShowProfile }) => {

    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState({
        name: "",
        email: ""
    })

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(url + "/api/user/profile", { headers: { token } });
            if (response.data.success) {
                setData({
                    name: response.data.data.name,
                    email: response.data.data.email
                });
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error fetching profile")
        }
    }

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token])

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onUpdateProfile = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(url + "/api/user/update", { name: data.name }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message)
                setShowProfile(false)
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error updating profile")
        }
    }

    return (
        <div className='profile-modal'>
            <form onSubmit={onUpdateProfile} className="profile-modal-container">
                <div className="profile-modal-title">
                    <h2>My Profile</h2>
                    <img onClick={() => setShowProfile(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="profile-modal-inputs">
                    <p className='profile-label'>Name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                    
                    <p className='profile-label'>Email (Read-only)</p>
                    <input name='email' value={data.email} type="email" placeholder='Your email' readOnly className='read-only-input' />
                    <p className='profile-info'>To change your email address, please contact support.</p>
                </div>
                <button type='submit'>Update Profile</button>
            </form>
        </div>
    )
}

export default ProfileModal
