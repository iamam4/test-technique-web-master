// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EquipmentList from './components/EquipmentList';
import EquipmentDetail from './components/EquipmentDetails';

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<EquipmentList />} />
      <Route path="/equipments/:id" element={<EquipmentDetail />} />
    </Routes>
  </>
);

export default App;
