import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import AddCategory from './pages/Category/AddCategory'
import ListCategory from './pages/Category/ListCategory'
import AddBanner from './pages/Banner/AddBanner'
import ListBanner from './pages/Banner/ListBanner'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "http://localhost:4000";

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/add-category" element={<AddCategory url={url}/>} />
          <Route path="/list-category" element={<ListCategory url={url}/>} />
          <Route path="/add-banner" element={<AddBanner url={url}/>} />
          <Route path="/list-banner" element={<ListBanner url={url}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App