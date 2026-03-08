import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const Dashboard = ({url}) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOrdersForMetrics = async () => {
      try {
        const response = await axios.get(`${url}/api/order/list`);
        if (response.data.success) {
          const orders = response.data.data;
          
          let foodProcessing = 0;
          let outForDelivery = 0;
          let delivered = 0;

          orders.forEach(order => {
             if (order.status === "Food Processing") foodProcessing++;
             else if (order.status === "Out for delivery") outForDelivery++;
             else if (order.status === "Delivered") delivered++;
          });

          setChartData([
            { name: 'Processing', count: foodProcessing, fill: '#FFA07A' }, // Light salmon
            { name: 'Out for Delivery', count: outForDelivery, fill: '#FF6347' }, // Tomato
            { name: 'Delivered', count: delivered, fill: '#32CD32' } // Lime Green
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard metrics", error);
      }
    };
    
    fetchOrdersForMetrics();
  }, [url]);
  return (
    <div className='dashboard'>
      <div className="dashboard-content">
        <h2>Welcome to the Admin Dashboard</h2>
        <p>Use the sidebar navigation to manage your food delivery platform's inventory, handle customer orders, update marketing banners, and organize categories.</p>
        
        <div className="dashboard-cards">
           <div className="dashboard-card" onClick={() => navigate('/orders')}>
              <img src={assets.order_icon} alt="" />
              <div>
                <h3>Orders</h3>
                <p>Manage active and completed customer orders.</p>
              </div>
           </div>
           
           <div className="dashboard-card" onClick={() => navigate('/list')}>
              <img src={assets.add_icon} alt="" />
              <div>
                <h3>Menu Info</h3>
                <p>Add new food items or update pricing instantly.</p>
              </div>
           </div>
        </div>

        <div className="dashboard-metrics">
          <h3>Order Status Overview</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" tick={{fill: '#666', fontSize: 14}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
