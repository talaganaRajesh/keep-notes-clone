import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './HomePage';
import Login from './Login';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App