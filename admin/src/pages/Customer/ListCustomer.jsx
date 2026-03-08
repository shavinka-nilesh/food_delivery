import React, { useEffect, useState } from 'react'
import './ListCustomer.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const ListCustomer = ({ url }) => {

  const [list, setList] = useState([]);
  
  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ id: "", name: "", email: "" });

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/user/list`)
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error fetching customers")
    }
  }

  const removeCustomer = async (customerId) => {
    // Confirm before delete
    if(!window.confirm("Are you sure you want to delete this customer?")) return;

    const response = await axios.post(`${url}/api/user/remove`, { id: customerId })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error")
    }
  }

  // --- Edit Logic ---
  const startEdit = (customer) => {
    setEditData({ id: customer._id, name: customer.name, email: customer.email });
    setIsEditing(true);
  }

  const onEditChange = (event) => {
    const {name, value} = event.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  const saveEdit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post(`${url}/api/user/update-admin`, editData);
        if (response.data.success) {
            toast.success(response.data.message);
            setIsEditing(false);
            fetchList();
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Failed to update customer");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list-customer add flex-col'>
      <p>All Customers Directory</p>
      
      <div className='list-customer-table'>
        <div className="list-customer-table-format title">
          <b>Name</b>
          <b>Email</b>
          <b>Cart Items</b>
          <b>Actions</b>
        </div>
        
        {list.map((item, index) => {
          // Count distinct items in the user's cart object
          const cartItemCount = item.cartData ? Object.keys(item.cartData).filter(k => item.cartData[k] > 0).length : 0;
          
          return (
            <div key={index} className='list-customer-table-format'>
              <p>{item.name}</p>
              <p>{item.email}</p>
              <p>{cartItemCount} item(s)</p>
              <div className="customer-actions">
                  <span className='edit-btn' onClick={() => startEdit(item)}>Edit</span>
                  <span className='cursor delete-icon' onClick={() => removeCustomer(item._id)}>x</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Very Simple Edit Modal Overlay */}
      {isEditing && (
          <div className="edit-modal-overlay">
              <div className="edit-modal">
                  <h3>Edit Customer</h3>
                  <form onSubmit={saveEdit} className="flex-col">
                      <div className="flex-col">
                          <label>Name</label>
                          <input type="text" name="name" value={editData.name} onChange={onEditChange} required />
                      </div>
                      <div className="flex-col">
                          <label>Email</label>
                          <input type="email" name="email" value={editData.email} onChange={onEditChange} required />
                      </div>
                      <div className="modal-buttons">
                          <button type="submit" className="save-btn">Save</button>
                          <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  )
}

export default ListCustomer
