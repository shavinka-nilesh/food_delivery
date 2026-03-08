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
import AddCustomer from './pages/Customer/AddCustomer'
import ListCustomer from './pages/Customer/ListCustomer'
import AdminProfile from './pages/Profile/AdminProfile'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import { Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "http://localhost:4000";
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [])

  return (
    <div className='app'>
      <ToastContainer />
      {token === "" ? <Login url={url} setToken={setToken} /> :
        <>
          <Navbar setToken={setToken} url={url} />
          <hr />
          <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/add-category" element={<AddCategory url={url}/>} />
          <Route path="/list-category" element={<ListCategory url={url}/>} />
          <Route path="/add-banner" element={<AddBanner url={url}/>} />
          <Route path="/list-banner" element={<ListBanner url={url}/>} />
          <Route path="/add-customer" element={<AddCustomer url={url}/>} />
          <Route path="/list-customer" element={<ListCustomer url={url}/>} />
          <Route path="/admin-profile" element={<AdminProfile url={url} setToken={setToken}/>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
          </div>
        </>
      }
    </div>
  )
}

export default App