import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import '../App.css'

function Add(){
    const navigate = useNavigate();
    const [items, setItems] = useState({menu: '', harga: '', qty: '', gambar: '', previewGambar: null});
  

    const handleChange = (e) => {
        const { name, value, type } = e.target;
    
        if (type === 'file') {
          const file = e.target.files && e.target.files[0];


          if (file) {
            setItems((prevItems) => ({
                ...prevItems,
                [name]: file,
                previewGambar: URL.createObjectURL(file),
            }));
          } else{
            setItems((prevItems) => ({
                ...prevItems,
                [name]: null,
                previewGambar: null,
            }));
          }

        } else {
          const newValue = name === 'harga' || name === 'qty' ? Math.max(0, parseFloat(value)) : value;
    
          setItems((prevItems) => ({
            ...prevItems,
            [name]: newValue,
          }));
        }
        console.log(items);
      };
  
    const submitForm = async () => {
        try{
        const formData = new FormData();
        formData.append('menu', items.menu);
        formData.append('harga', items.harga);
        formData.append('qty', items.qty);
        formData.append('gambar', items.gambar);

        const resp = await http.post('/AddItems', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        if(resp.status === 200){
            navigate('/');
        }else{
            console.error('Failed')
        }
    }catch(error){
        console.error("Error")
    }
        console.log(items);
    }

    return(
        <div>
            <h1 className='text-center mt-5 mb-4'>
                Tambah Menu
            </h1>
            <div className='d-flex justify-content-center align-self-center h-100'>
                <div className='col-md-2 col-lg-6'>
                    <div className='card rounded-3 mb-2'>
                        <div className='card-body'>
                            <div className='container mb-4'>
                                <div className='row'>
                                    <div className='col'>
                                        <p className='text'>Nama Menu</p>
                                        <input type='text' name='menu' className='form-control mb-2'
                                        value={items.menu || ''}
                                        onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <p className='text'>Harga Menu</p>
                                        <input type='number' name='harga' className='form-control mb-2' onWheel={e=>e.target.blur()}
                                        value={items.harga || ''}
                                        onChange={handleChange}
                                        />
                                    </div>
                                    <div className='col'>
                                        <p className='text'>Jumlah</p>
                                        <input type='text' name='qty' className='form-control mb-2'
                                        value={items.qty || ''}
                                        onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <p className='text'>Gambar</p>
                                        <input type='file' name='gambar' className='form-control mb-2'
                                        accept='image/*'
                                        onChange={handleChange}
                                        />
                                        {items.previewGambar && (
                                            <p className='text'>Preview</p>
                                            &&
                                            <img
                                            src={items.previewGambar}
                                            alt='Preview'
                                            className='w-50 h-auto mt-2'
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className='d-grid gap-2 justify-content-end'>
                                    <button className='btn btn-primary' onClick={submitForm}>Tambah</button>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Add;
