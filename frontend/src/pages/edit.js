import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from "../http"
import { FiArrowLeft } from 'react-icons/fi';

function DeleteModal({ onDelete }) {
    const [showModal, setShowModal] = useState(false);
  
    const handleDelete = () => {
      onDelete(); 
      setShowModal(false);
    };
  
    return (
      <>
        <button className='btn btn-danger' onClick={() => setShowModal(true)} data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
  
         
          <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} 
           id="deleteModal" tabIndex='-1' aria-labelledby="deleteModalLabel" role='dialog' aria-hidden={!showModal}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">Hapus Menu</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Yakin Mau Hapus Menu Ini?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Hapus</button>
                </div>
              </div>
            </div>
          </div>
      </>
    );
  }

  function Merubahjumlahstok({ stok, onUpdate }){
    const [showModal, setShowModal] = useState(false);
    const [Jumlah, setJumlah] = useState(0);

    const handleUpdate = () => {
      onUpdate(Jumlah);
      setShowModal(false);  
      setJumlah(0);
    };

    return(
        <>
        <button className='btn btn-success' onClick={() => setShowModal(true)} data-bs-toggle="modal" data-bs-target="#UbahStokModal">Ubah Stok</button>
  
         
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} 
        id="UbahStokModal" tabIndex='-1' aria-labelledby="UbahStokModalLabel" role='dialog' aria-hidden={!showModal}>
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
                <div className="modal-header">
                    <h5 className="modal-title" id="UbahStokModalLabel">Mengatur Jumlah Stok</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                <div className='row mb-3'>
                <p className='fs-5 fw-bold'>Stok Awal: {stok}</p>
                </div>
                <div className='row justify-content-center mb-3'>
                    <div className='col-2 align-self-center'>
                        <p className='text-center'>Uang</p>
                    </div>
                    <div className='col-auto'>
                        <div className="input-group">
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setJumlah(Jumlah - 1)}>-</button>
                            <input type="number" className="form-control" 
                            value={Jumlah} onChange={(e) => setJumlah(parseFloat(e.target.value))} disabled/>
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setJumlah(Jumlah + 1)}>+</button>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-center'>
                  <div className='col align-self-center'>
                    <p className='text-end'>Kembalian: </p>
                  </div>
                  <div className='col align-self-center'>
                    <p className='text-start fw-bold'>{
                    Jumlah !== '' ? stok + Jumlah : '-'}</p>
                  </div>
                </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleUpdate}>Ubah</button>
                </div>
            </div>
            </div>
        </div>
        </>
    );
  }

function Edit(props) {
    const navigate = useNavigate();
    const [items, setItems] = useState({namamenu: '', harga: '', jumlah: '', gambar: '', previewGambar: null});

    const {id} = useParams();

    useEffect(() => {
        fetchData();

    }, []);


    const fetchData = async () => {
        try {
            const [itemsResp] = await Promise.all([
                http.get(`/GetItems/${id}/edit`),
            ]);

            itemsResp.status === 200 ? setItems({
                namamenu: itemsResp.data.namamenu, 
                harga: itemsResp.data.harga, 
                jumlah: itemsResp.data.jumlah, 
                gambar: itemsResp.data.gambar,
                previewGambar: `http://localhost:8000/images/${itemsResp.data.gambar}`}) 
            : navigate('/View');
            

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }

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
          const newValue = name === 'harga' ? Math.max(0, parseFloat(value)) : value;
    
          setItems((prevItems) => ({
            ...prevItems,
            [name]: newValue,
          }));
        }

      };

      const submitForm = async () => {
        try{
            const formData = new FormData();
            formData.append('namamenu', items.namamenu);
            formData.append('harga', items.harga);
            formData.append('jumlah', items.jumlah);
            formData.append('gambar', items.gambar);            

        console.log(formData);

        const resp = await http.post(`/UpdateItems/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        if(resp.status === 200){
            alert('Menu Berhasil diubah!');
            navigate('/View');

            console.log('Update items', items);
        }else{
            console.error('Failed')
        }
    }catch(error){
        console.error("Error")
    }
        console.log(items);
    }

    const handleDelete = async () => {
        try{
            const resp = await http.delete(`/DeleteItems/${id}`);

            if(resp.status === 200){
                alert('Menu Berhasil dihapus!');
                navigate('/View');
            }else{
                console.error('Failed');
            }
        }catch(error){
            console.error('Error');
        }
    };

    const handleUpdate = async (Jumlah) => {
        try{
            const formData = new FormData();
            formData.append('id', id);
            formData.append('qty', Jumlah);
            const resp = await http.post('/UpdateItemsStock', formData);
            
            if(resp.status === 200){
                alert('Menu Berhasil diubah!');
                await fetchData();
            }else{
                console.error('Failed');
            }
        }catch(error){
            console.error('Error');
        }
    };


    return (
    <div>
        <h1 className='text-center mt-5 mb-4'>
            Ubah Menu
        </h1>
        <div className='d-flex justify-content-center align-self-center h-100'>
            <div className='col-md-2 col-lg-6'>
                <div className='card rounded-3 mb-2'>
                    <div className='card-body'>
                        <div className='container mb-4'>
                            <span className='me-2'><FiArrowLeft className='mb-3' onClick={() => navigate('/View')} size={30} style={{cursor: 'pointer'}}/></span>
                            <div className='row'>
                                <div className='col'>
                                    <input type='text' name='namamenu' className='form-control mb-2'
                                    value={items.namamenu || ''}
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
                                    <input type='text' name='jumlah' className='form-control mb-2' disabled
                                    value={items.jumlah || ''}
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
                            <div className='d-grid gap-2 d-md-flex justify-content-md-end mt-3'>
                                <Merubahjumlahstok stok={items.jumlah} onUpdate={handleUpdate} />
                                <DeleteModal onDelete={handleDelete} />
                                <button className='btn btn-primary' onClick={submitForm}>Ubah</button>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Edit;