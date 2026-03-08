import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Navbar = ({setToken, url}) => {

  const [adminImage, setAdminImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get(`${url}/api/user/admin-profile`);
        if(response.data.success && response.data.data.image) {
            setAdminImage(response.data.data.image);
        }
      } catch (error) {
        console.error("Failed to fetch admin image", error);
      }
    }
    // Only attempt fetch if we actually have a token indicating we are logged in
    if(localStorage.getItem("token")) {
        fetchAdminProfile();
    }
  }, [url])

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" onClick={()=>navigate('/dashboard')} style={{cursor: 'pointer'}} />
      <div className="navbar-right">
        
        <div className="navbar-profile">
            <img 
                className='profile' 
                src={adminImage ? `${url}/images/${adminImage}` : assets.profile_image} 
                alt="Admin Profile" 
            />
            <ul className="nav-profile-dropdown">
                <li onClick={() => navigate('/admin-profile')}>
                    <img src={assets.bag_icon} alt="" /> {/* Reusing bag icon as a generic settings marker for now */}
                    <p>Profile</p>
                </li>
                <hr />
                <li onClick={logout}>
                    <img src={assets.logout_icon} alt="" />
                    <p>Logout</p>
                </li>
            </ul>
        </div>

      </div>
    </div>
  )
}

export default Navbar
