import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Add from './pages/add';
import View from './pages/view';
import Edit from './pages/edit';
import './Sidebar.css';

function App() {

  return (
    <div className='app'>

      <div className="sidebar">
        <Link className='text-white fw-bold text-center fs-4 d-block mb-3' style={{ textDecoration: 'none'}} to={"/"}>Restaurant</Link>
        <hr className='text-white '/>
        <Link className='text-white text-center d-block mb-3' style={{ textDecoration: 'none' }} to={"/Add"}>Tambah Menu </Link>
        <Link className='text-white text-center d-block' style={{ textDecoration: 'none' }} to={"/View"}>Lihat Menu</Link>
      </div>


      <div className='container mt-3'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Add" element={<Add />} />
          <Route path="/View" element={<View />} />
          <Route path="/Edit/:id" element={<Edit />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
