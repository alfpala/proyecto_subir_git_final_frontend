import React from 'react';

const Footer = () => (
  <footer className="footer py-5 mt-auto bg-dark text-white">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4">
          <h5 className="text-white fw-bold">Market<span className="text-warning">Tech</span></h5>
          <p className="small mt-2">Tu marketplace de confianza para tecnología, moda, hogar y más. Compra y vende de forma segura.</p>
        </div>
        <div className="col-md-3">
          <h6 className="text-white">Navegación</h6>
          <ul className="list-unstyled small mt-2">
            <li><a href="/" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Inicio</a></li>
            <li><a href="/products" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Productos</a></li>
            <li><a href="/cart" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Carrito</a></li>
            <li><a href="/orders" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Mis  órdenes</a></li>
          </ul>
        </div>
        <div className="col-md-3">
          <h6 className="text-white">Cuenta</h6>
          <ul className="list-unstyled small mt-2">
            <li><a href="/login" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Iniciar sesión</a></li>
            <li><a href="/register" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Registrarse</a></li>
            <li><a href="/favorites" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Favoritos</a></li>
            {/* Mostrar solo si el usuario está logueado y no es rol 'user' */}
            {window.localStorage.getItem('user') && JSON.parse(window.localStorage.getItem('user')).role !== 'user' && (
              <li><a href="/my-products" className="text-white-50"><i className="bi bi-chevron-right me-1"></i>Mis Productos</a></li>
            )}
          </ul>
        </div>
        <div className="col-md-2">
          <h6 className="text-white">Síguenos</h6>
          <div className="d-flex gap-2 mt-2 flex-wrap">
            <a href="https://facebook.com"  target="_blank" className="social-icon" title="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="https://instagram.com" target="_blank" className="social-icon" title="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="https://twitter.com"   target="_blank" className="social-icon" title="Twitter/X"><i className="bi bi-twitter-x"></i></a>
            <a href="https://wa.me/1234567890?text=Hola%2C%20necesito%20ayuda%20con%20MarketTech"
               target="_blank" className="social-icon" title="WhatsApp" style={{background:'#25d366'}}>
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
          <p className="small mt-3"><i className="bi bi-envelope me-1"></i>alfpala@gmail.com</p>
        </div>
      </div>
      <hr className="border-secondary mt-4"/>
      <p className="text-center small mb-0">&copy; {new Date().getFullYear()} MarketTech. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
