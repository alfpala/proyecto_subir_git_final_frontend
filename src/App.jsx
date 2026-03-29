import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import EditProfile from './pages/EditProfile';
import Orders from './pages/Orders';
import MyProducts from './pages/MyProducts';
import Register from './pages/Register';
import Login from './pages/Login';

// Admin
import AdminDashboard from './admin/pages/Dashboard';
import AdminLogin from './admin/pages/Login';
import AdminUsers from './admin/pages/Users';
import AdminCategories from './admin/pages/Categories';
import AdminFavorites from './admin/pages/Favorites';
import AdminOrders from './admin/pages/Orders';

import AdminProducts from './admin/pages/Products';
import { Navigate } from 'react-router-dom';

import RequireAdmin from './admin/components/RequireAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/admin/categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
          <Route path="/admin/favorites" element={<RequireAdmin><AdminFavorites /></RequireAdmin>} />
          <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
          <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
