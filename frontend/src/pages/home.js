import { useEffect, useState } from 'react';
import http from '../http';
import '../App.css';
import React from 'react';
import {FiCreditCard} from 'react-icons/fi';
import { FiCheck, FiX } from 'react-icons/fi';
import '../print-only.css';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

// -------------- function ItemMenu
function ItemMenu({ item, onDoubleClick }) {
    
  return (
    <div className='col-md-3 mb-3'>
        <div className='card card-shadow border-0 rounded-3 shadow mb-5 bg-dark'
        
        onDoubleClick={() => {
            onDoubleClick({ idmenu: item.id, namamenu: item.namamenu, harga: item.harga, qty: 1})}}>
            <div className='d-flex flex-column justify-content-between h-100'>
                <img
                src={`http://localhost:8000/images/${item.gambar}`}
                alt={item.namamenu}
                className='w-100 rounded-3'
                />
            </div>
            <h5 className='card-title align-self-center text-center p-1 text-white'>{item.namamenu}</h5>
        </div>        
    </div>
  );
}

// -------------- function InvoiceInfo
function InvoiceInfo({ invoices }) {
    const besarpajak = 0.0001;

    const subtotal = invoices.reduce((acc, item) => acc + item.harga * item.qty, 0);
    const pajak = subtotal * besarpajak;
    const total = subtotal + pajak;
    return (
      <>
      <h5 className='card-title mb-4  text-center'>Dine In</h5>
      <hr className='text-black'/>
      <ul className='list-group'>
        {invoices.map((item, index) => (
      
          <li key={index} className='list-group-item d-flex justify-content-between align-items-center'>
            <div className='me-auto'>
              <span>{item.namamenu}</span>
            </div>
            <div className='flex-shrink-0'>
              <span className='badge bg-primary rounded-pill me-4'>x {item.qty}</span>
            </div>
            <div className='flex-shrink-0'>
              <span>{formatCurrency(item.harga * item.qty)}</span>
            </div>
          </li>
        
        ))}
        <div className='mt-3'>
            <li className='list-group-item d-flex justify-content-between align-items-center'>
                <div className='me-auto'>
                    <span>Subtotal</span>
                </div>
                <div className='flex-shrink-0'>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
            </li>
            <li className='list-group-item d-flex justify-content-between align-items-center'>
                <div className='me-auto'>
                    <span>Pajak</span>
                </div>
                <div className='flex-shrink-0'>
                    <span>{formatCurrency(pajak)}</span>
                </div>
            </li>
            <li className='list-group-item d-flex justify-content-between align-items-center'>
                <div className='me-auto'>
                    <span>Total</span>
                </div>
                <div className='flex-shrink-0'>
                    <span>{formatCurrency(total)}</span>
                </div>
            </li>
        </div>
      </ul>
      </>
    );
  }
 
  // ------------- function charge
  function Charge({ onCharge, totalHarga }){
    const [chargeModal, setChargeModal] = useState(false);
    const [uang, setUang] = useState(0);

    const handleClose = () => {
      setChargeModal(false);
      setUang(0);
    }

    const handleCharge = () => {

      if(uang >= totalHarga){
        onCharge(uang);
        setUang(0);
        setChargeModal(false);
      }else{
        alert('Uang kurang!');
      }

    }

    return(
      <>
        <button type='button' className='btn btn-primary rounded-2 w-100' onClick={() => setChargeModal(true)}>
          <span className='me-2'><FiCreditCard/></span><span className='me-2'>Charge {formatCurrency(totalHarga)}</span>
        </button>

        <div className={`modal fade ${chargeModal ? 'show' : ''}`} style={{ display: chargeModal ? 'block' : 'none' }} 
        tabIndex='-1' role='dialog' aria-hidden={!chargeModal} id="chargeModal" aria-labelledby="chargeModalLabel">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title" id="chargeModalLabel">Charge</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="modal-body mt-2 mb-2">
                <div className='row mb-3'>
                <p className='fs-5 fw-bold'>Total Harga: {formatCurrency(totalHarga)}</p>
                </div>
                <div className='row justify-content-center mb-3'>
                    <div className='col-2 align-self-center'>
                        <p className='text-center'>Uang</p>
                    </div>
                    <div className='col-auto'>
                      <input type="number" min="0" onWheel={(e) => e.target.blur()} className="form-control" 
                      value={uang} onChange={(e) => setUang(parseFloat(e.target.value))} />
                    </div>
                </div>
                <div className='row justify-content-center'>
                  <div className='col align-self-center'>
                    <p className='text-end'>Kembalian: </p>
                  </div>
                  <div className='col align-self-center'>
                    <p className='text-start fw-bold'>{
                    uang >= totalHarga ? formatCurrency(uang - totalHarga) : '-'}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleCharge}>Ok</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  };

// ------------- function Home
function Home() {
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [SuccessSaveBillModal, setShowSSBModal] = useState(false);
  const [SuccessTransactionModal, setShowSTModal] = useState(false);
  const [FailedPrintBillModal, setShowFPBModal] = useState(false);
  const [FailedSaveBillModal, setShowFSBModal] = useState(false);
  const [stockEmptyModal, setStockEmptyModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsResp, invoicesResp] = await Promise.all([
        http.get('/GetItems'),
        http.get('/GetInvoices')
      ]);
  
      itemsResp.status === 200 ? setItems(itemsResp.data) : console.error('Failed to fetch items');
      invoicesResp.status === 200 ? setInvoices(invoicesResp.data) : console.error('Failed to fetch invoices');
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const addToInvoice = (item) => {
    const existingItemIndex = invoices.findIndex(
      (invoiceItem) => invoiceItem.namamenu === item.namamenu
    );

    if (existingItemIndex !== -1) {
      const updatedInvoices = [...invoices];
      const newQty = updatedInvoices[existingItemIndex].qty ;
      const maxQty = item.qty;

      if(newQty <= maxQty){
        updatedInvoices[existingItemIndex].qty += 1;
        setInvoices(updatedInvoices);
      }else{
        setStockEmptyModal(true);
        setModalOpen(true);

        const CloseModal = async () => {
          setStockEmptyModal(false);
          setModalOpen(false);
        }

        setTimeout(CloseModal, 1500);
      }
    } else {
      const updatedInvoices = [...invoices, { ...item }];
      setInvoices(updatedInvoices);
    }

  };

  const saveBill = async () => {
    if(invoices.length === 0){
      setShowFSBModal(true);
      setModalOpen(true);

      const CloseModal = async () => {
        setShowFSBModal(false);
        setModalOpen(false);  
      }

      setTimeout(CloseModal, 1500);
    }else{
      try {
        const invoicesData = [...invoices];

        const resp = await http.post('/AddInvoices', { invoicesData });
        if (resp.status === 200) {
          setModalOpen(true);
          setShowSSBModal(true);

          const closeModal = async () => {
            setModalOpen(false);
            setShowSSBModal(false);
            await fetchData();
          };

          setTimeout(closeModal, 1500);
        } else {
          console.error('Failed to save bill');
        }
      } catch (error) {
        console.error('Error saving bill:', error.message);
      }
    }
  };

  const printBill = () => {

    if (invoices.length === 0) {
      setShowFPBModal(true);
      setModalOpen(true);

      const CloseModal = async () => {
        setShowFPBModal(false);
        setModalOpen(false);  
      }

      setTimeout(CloseModal, 1500);
    }else{
    const printWindow = window.open('', '_blank');
    const besarpajak = 0.0001;

    const subtotal = invoices.reduce((acc, item) => acc + item.harga * item.qty, 0);
    const pajak = subtotal * besarpajak;
    const total = subtotal + pajak;
  
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Bill</title>
        <link cssText="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"/>
      </head>
      <body class='p-4'>
        <h5 class='card-title mb-4 text-center fs-2'>Bill</h5>
        <hr class='text-black'/>

          ${invoices.map((item, index) => (
            `<li key=${index} class='list-group-item d-flex justify-content-between align-items-center'>
              <div class='me-auto'>
                <span>${item.namamenu}</span>
              </div>
              <div class='flex-shrink-0'>
                <span class='badge bg-primary rounded-pill me-4'>x ${item.qty}</span>
              </div>
              <div class='flex-shrink-0'>
                <span>${formatCurrency(item.harga * item.qty)}</span>
              </div>
            </li>`
          ))}

          <hr>

          <div class='mt-3 d-flex flex-column'>
          <div class='list-group-item d-flex justify-content-between align-items-center'>
            <div class='me-auto'>
              <span>Subtotal</span>
            </div>
            <div class='flex-shrink-0'>
              <span>${formatCurrency(subtotal)}</span>
            </div>
          </div>
          <div class='list-group-item d-flex justify-content-between align-items-center'>
            <div class='me-auto'>
              <span>Pajak</span>
            </div>
            <div class='flex-shrink-0'>
              <span>${formatCurrency(pajak)}</span>
            </div>
          </div>
          <div class='list-group-item d-flex justify-content-between align-items-center mt-auto'>
            <div class='me-auto'>
              <span>Total</span>
            </div>
            <div class='flex-shrink-0'>
              <span>${formatCurrency(total)}</span>
            </div>
          </div>
        </div>
        
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script> 
      </body>
      </html>
    `);
  
    printWindow.document.close();
    }
  };
  

  const handleCharge = async (uang) => {
    try{
      const receiptData = [...invoices];
      const subtotal = subtotalHarga;
      const pajak = PajakHarga;
      const total = totalHarga;
      const UangConfirm = uang;

      const resp = await http.post('/Transaction', { receiptData: receiptData, subtotal: subtotal, pajak: pajak, total: total, uang: UangConfirm });
      if(resp.status === 200){
        setModalOpen(true);
        setShowSTModal(true);

        const closeModal = async () => {
          setModalOpen(false);
          setShowSTModal(false);
          await fetchData();
          printBill();
        };

        setTimeout(closeModal, 1500);
      }else{
        console.error('Failed to save bill');
      }
    }catch(error){
      console.error('Error saving bill:', error.message);
    }
  }

  const subtotalHarga = invoices.reduce(
    (total, item) => total + item.harga * item.qty,
    0
  );
  const PajakHarga = subtotalHarga * 0.0001;
  const totalHarga = subtotalHarga + PajakHarga;

  return (
    <>
      {/* ----- */}
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }} 
      tabIndex='-1' role='dialog' aria-hidden={!isModalOpen} id="successModal" aria-labelledby="successModalLabel">
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content shadow'>
            <div className='modal-body'>
              {SuccessSaveBillModal &&(
              <p className='text-center fs-3 fw-bold'>Berhasil Disimpan <FiCheck size={40} className='text-success'/></p>              
              )}
              {SuccessTransactionModal &&(
              <p className='text-center fs-3 fw-bold'>Transaksi Berhasil <FiCheck size={40} className='text-success'/></p>              
              )}
              {FailedPrintBillModal && (
              <p className='text-center fs-3 fw-bold'>Cetak Bill Gagal (Data Tidak Boleh Kosong) <FiX size={40} className='text-danger'/></p>
              )}
              {FailedSaveBillModal && (
              <p className='text-center fs-3 fw-bold'>Gagal Disimpan (Data Kosong) <FiX size={40} className='text-danger'/></p>
              )}
              {stockEmptyModal && (
              <p className='text-center fs-3 fw-bold'>Stok Habis <FiX size={40} className='text-danger'/></p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ----- */}
      <div className='d-flex justify-content-center py-5'>
        <div className='w-75 d-flex flex-wrap me-2'>
          <div className='row'>
            {items.map((item) => (
              <ItemMenu key={item.id} item={item} onDoubleClick={addToInvoice} />
            ))}
          </div>
        </div>
        <div className='w-25 ms-4'>
          <div className='card border-1 rounded-2 shadow'>
            <div className='card-header bg-primary'>
              <div className='row'>
                <div className='col-2 align-self-center'>
                  <img className='w-100 rounded' src="/images/6324964.png" alt='Logo 1'/>
                </div>
                <div className='col text-center text-white align-self-center'>
                  <h5 className='card-title'>New Customer</h5>
                </div>
                <div className='col-2 align-self-center'>
                  <img className='w-100 rounded' src="/images/shopping_list.png" alt='Logo 1'/>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className='invoice-info print-only'>
                <InvoiceInfo invoices={invoices} />
              </div>
            </div>
            <div className='card-footer'>
              <div className='d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-2'>
                <button type='button' className='btn btn-secondary w-100' onClick={saveBill}>Save Bill</button>
                <button type='button' className='btn btn-secondary w-100' onClick={printBill}>Print Bill</button>
              </div>
              <div className='d-flex my-2 my-lg-0'> 
                <Charge onCharge={handleCharge} totalHarga={totalHarga} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
  
}

export default Home;
