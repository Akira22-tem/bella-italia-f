import React from 'react';
import logo from './logo.svg';


import './App.css';
import { Roles } from './components/Roles';
import { Usuarios } from './components/Usuarios';
import { Mesas } from './components/Mesas';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Menu } from './components/Menu';
import { Pedidos } from './components/Pedidos';
import { Proveedores } from './components/Proveedores';
import {Transacciones} from './components/Transacciones';
import {Productos} from './components/Productos';



function App() {
  return (
    <div className="App">
      <Router>
      <Menu/>
      <Routes>
        <Route path='/usuarios' element={<Usuarios />} />
        <Route path='/roles' element={<Roles />} />
        <Route path='/mesas' element={<Mesas />} />
        <Route path='/pedidos' element={<Pedidos />} />
        <Route path='/proveedores' element={<Proveedores />} />
        <Route path='/transacciones' element={<Transacciones />} />
        <Route path='/Productos' element={<Productos />} />
      </Routes>
    </Router>

      
    </div>
  );
}

export default App;
