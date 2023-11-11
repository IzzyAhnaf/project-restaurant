import { useEffect, useState } from 'react';
import http from '../http';
import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';

function ItemMenu({ item }) {
    
  return (
    <Link to ={{pathname: `/edit/${item.id}`}} className='text-decoration-none col-md-3 mb-3'>
        <div className='card card-shadow border-0 rounded-3 shadow mb-5 bg-dark'>
            <div className='d-flex flex-column justify-content-between h-100'>
                <img
                src={`http://localhost:8000/images/${item.gambar}`}
                alt={item.namamenu}
                className='w-100 rounded-3'
                />
            </div>
            <h5 className='card-title align-self-center p-1 text-white'>{item.namamenu}</h5>
        </div>        
    </Link>
  );
}

function View() {
    const [items, setItems] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const [itemsResp ] = await Promise.all([
          http.get('/GetItems'),
        ]);
    
        itemsResp.status === 200 ? setItems(itemsResp.data) : console.error('Failed to fetch items');
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  


  

  
    return (
      <div>
        <div className='d-flex justify-content-center py-5'>
          <div className='w-100 d-flex flex-wrap me-2'>
            <div className='row'>
              {items.map((item) => (
                <ItemMenu key={item.id} item={item}  />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    
  }
  
  export default View;
  