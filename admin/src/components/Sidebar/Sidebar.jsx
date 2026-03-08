import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        
        <p className="sidebar-group-title">Menu Management</p>
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>

        <p className="sidebar-group-title">Categories</p>
        <NavLink to='/add-category' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Category</p>
        </NavLink>
        <NavLink to='/list-category' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Categories</p>
        </NavLink>

        <p className="sidebar-group-title">Marketing</p>
        <NavLink to='/add-banner' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Banner</p>
        </NavLink>
        <NavLink to='/list-banner' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Banners</p>
        </NavLink>

        <p className="sidebar-group-title">Sales</p>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
