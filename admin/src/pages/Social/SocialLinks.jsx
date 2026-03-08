import React, { useState, useEffect } from 'react'
import './SocialLinks.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const SocialLinks = ({ url }) => {
    
    const [data, setData] = useState({
        facebook: "",
        twitter: "",
        linkedin: ""
    });

    const fetchSocialLinks = async () => {
        try {
            const response = await axios.get(`${url}/api/social/get`);
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch social links", error);
        }
    }

    useEffect(() => {
        fetchSocialLinks();
    }, [])

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/social/update`, data);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error("Failed to update social links");
            }
        } catch (error) {
            toast.error("Error updating social links");
        }
    }

    return (
        <div className='social-links-admin'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="social-links-title">
                    <p>Manage Social Media Links</p>
                    <small>These links will map directly to the footer icons on the frontend.</small>
                </div>

                <div className="social-input-group flex-col">
                    <p>Facebook URL</p>
                    <input 
                        onChange={onChangeHandler} 
                        value={data.facebook} 
                        type="url" 
                        name='facebook' 
                        placeholder='https://facebook.com/yourpage' 
                    />
                </div>

                <div className="social-input-group flex-col">
                    <p>Twitter (X) URL</p>
                    <input 
                        onChange={onChangeHandler} 
                        value={data.twitter} 
                        type="url" 
                        name='twitter' 
                        placeholder='https://twitter.com/yourhandle' 
                    />
                </div>

                <div className="social-input-group flex-col">
                    <p>LinkedIn URL</p>
                    <input 
                        onChange={onChangeHandler} 
                        value={data.linkedin} 
                        type="url" 
                        name='linkedin' 
                        placeholder='https://linkedin.com/company/yourcompany' 
                    />
                </div>

                <button type='submit' className='add-btn'>SAVE LINKS</button>
            </form>
        </div>
    )
}

export default SocialLinks
