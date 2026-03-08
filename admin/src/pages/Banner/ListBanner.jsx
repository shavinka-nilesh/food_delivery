import React, { useEffect, useState } from 'react'
import './ListBanner.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const ListBanner = ({url}) => {

  const [list,setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/banner/list`);
    if (response.data.success) {
      setList(response.data.data)
    } else {
      toast.error("Error fetching banners")
    }
  }

  const removeBanner = async (bannerId) => {
    const response = await axios.post(`${url}/api/banner/remove`, {id: bannerId});
    if (response.data.success) {
      toast.success(response.data.message)
      await fetchList();
    } else {
        toast.error("Error removing banner")
    }
  }

  useEffect(()=> {
    fetchList();
  }, [])

  return (
    <div className='list-banner add-banner flex-col'>
      <p>All Banners</p>
      <div className="list-banner-table">
        <div className="list-banner-table-format title">
          <b>Image</b>
          <b>Action</b>
        </div>
        {list.map((item, index)=> {
            return (
              <div key={index} className='list-banner-table-format'>
                 <img src={`${url}/images/`+item.image} alt="" />
                 <p onClick={()=>removeBanner(item._id)} className='cursor'>x</p>
              </div>
            )
        })}
      </div>
    </div>
  )
}

export default ListBanner
