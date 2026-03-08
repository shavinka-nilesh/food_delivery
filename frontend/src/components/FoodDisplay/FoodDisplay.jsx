import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/StoreContext'

const FoodDisplay = ({category}) => {

  const {food_list, searchTerm} = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {food_list.map((item)=>{
          const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.category.toLowerCase().includes(searchTerm.toLowerCase());
          
          if ((category==="All" || category===item.category) && searchMatch) {
            return <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id}/>
          }
          return null;
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
