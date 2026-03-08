import React, { useContext, useEffect, useState } from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Header = () => {
    const navigate = useNavigate();
    const { banners, url } = useContext(StoreContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto slideshow logic
    useEffect(() => {
        if (banners && banners.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
            }, 5000); // 5 seconds rotation

            return () => clearInterval(intervalId); // Cleanup
        }
    }, [banners]);

    // Determine the background image style
    const headerStyle = {};
    if (banners && banners.length > 0) {
        headerStyle.backgroundImage = `url(${url}/images/${banners[currentIndex].image})`;
    } // else, it will fall back to css background if we want, or we just leave it so CSS background takes over

    const handleBannerClick = () => {
        if (banners && banners.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }
    };

    return (
        <div className={`header ${banners && banners.length > 1 ? 'clickable' : ''}`} style={headerStyle} onClick={handleBannerClick}>
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <button onClick={(e) => { e.stopPropagation(); navigate('/menu'); }}>View Menu</button>
            </div>
        </div>
    )
}

export default Header
