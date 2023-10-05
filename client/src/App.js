import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import ContactApp from './ContactApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/contact-app" element={<ContactApp />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
