import React, { useContext } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const Footer = () => {
  const { socialLinks } = useContext(StoreContext);

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>At Tomato, we bring quality dining to your doorstep. From local favorites to trending cuisines, enjoy quick delivery, secure checkout, and exceptional service every time you order.</p>
            <div className="footer-social-icons">
                {socialLinks?.facebook ? (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <img src={assets.facebook_icon} alt="Facebook" />
                    </a>
                ) : <img src={assets.facebook_icon} alt="Facebook" />}
                
                {socialLinks?.twitter ? (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <img src={assets.twitter_icon} alt="Twitter" />
                    </a>
                ) : <img src={assets.twitter_icon} alt="Twitter" />}
                
                {socialLinks?.linkedin ? (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <img src={assets.linkedin_icon} alt="LinkedIn" />
                    </a>
                ) : <img src={assets.linkedin_icon} alt="LinkedIn" />}
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li><a href='/'>Home</a></li>
                <li><a href='/#explore-menu'>About us</a></li>
                <li><a href='/#app-download'>Delivery</a></li>
                <li><a href='/#footer'>Privacy policy</a></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+94 771919388</li>
                <li>contact@tomato.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Tomato.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
