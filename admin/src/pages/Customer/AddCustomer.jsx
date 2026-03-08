import React, { useState } from 'react'
import './AddCustomer.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddCustomer = ({ url }) => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/user/add`, data);
            if (response.data.success) {
                setData({
                    name: "",
                    email: "",
                    password: ""
                })
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error adding customer")
        }
    }

    return (
        <div className='add-customer'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-customer-title">
                    <p>Add New Customer</p>
                </div>

                <div className="add-customer-name flex-col">
                    <p>Full Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
                </div>
                
                <div className="add-customer-email flex-col">
                    <p>Email Address</p>
                    <input onChange={onChangeHandler} value={data.email} type="email" name='email' placeholder='customer@email.com' required />
                </div>

                <div className="add-customer-password flex-col">
                    <p>Initial Password (Min 8 Characters)</p>
                    <input onChange={onChangeHandler} value={data.password} type="text" name='password' placeholder='SecurePassword123' required minLength="8" />
                </div>

                <button type='submit' className='add-btn'>ADD CUSTOMER</button>
            </form>
        </div>
    )
}

export default AddCustomer
