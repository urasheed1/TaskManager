import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import { AuthProvider } from './AuthContext';

const App = () => {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </AuthProvider>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;