

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../hooks/useFavorites';
import { addFavorite, removeFavorite } from '../services/favoriteService';

import { useToast } from './Toast.jsx';
import { addToCart } from '../services/cartService';
import { useCart } from '../hooks/useCart';


const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { favorites, loading, error, reload } = useFavorites();
  const [favLoading, setFavLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const { showToast } = useToast();
  const { cart, loading: cartLoading, error: cartError, auth, reloadCart } = useCart();
  const [cartBtnLoading, setCartBtnLoading] = useState(false);

  React.useEffect(() => {
    if (!favorites) return setIsFav(false);
    const favObj = favorites.find(fav => fav.product_id === product.id || fav.id === product.id);
    setIsFav(!!favObj);
  }, [favorites, product.id]);

  const handleFavorite = async () => {
    if (!user || favLoading) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(product.id);
        showToast('Quitado de favoritos', 'info');
      } else {
        await addFavorite(product.id);
        showToast('Agregado a favoritos', 'success');
      }
      reload(); // Recarga la lista de favoritos global
    } catch (e) {
      showToast('Error al actualizar favorito', 'error');
    }
    setFavLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para agregar al carrito', 'error');
      return;
    }
    setCartBtnLoading(true);
    try {
      await addToCart(product.id, 1);
      showToast('Producto agregado al carrito', 'success');
      reloadCart && reloadCart();
    } catch (e) {
      showToast(e.message || 'Error al agregar al carrito', 'error');
    }
    setCartBtnLoading(false);
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 d-flex align-items-stretch mb-4">
      <div className="card product-card w-100 h-100 p-2" style={{borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,.10)'}}>
        <img
          src={product.image_url || ''}
          alt={product.name}
          className="card-img-top mb-2"
          style={{height:'200px',objectFit:'cover',borderRadius:'12px'}} 
          onError={e => e.target.style.display='none'}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold mb-1" style={{minHeight:'2.5rem'}}>{product.name}</h5>
          <p className="card-text text-muted mb-1 small">{product.category_name}</p>
          <p className="card-text mb-2" style={{minHeight:'2.5rem'}}>{(product.description||"").substring(0,80)}{(product.description||"").length>80 ? '⯦' : ''}</p>
          <div className="d-flex align-items-center gap-2 mt-auto">
            <span className="fw-bold fs-5 text-primary price-tag mb-0">${parseFloat(product.price).toFixed(2)}</span>
            <a href={`/product-detail?id=${product.id}`} className="btn btn-outline-primary btn-sm ms-auto">Ver Producto</a>
            {/* Favoritos button */}
            {user && !loading && (
              <button
                className="btn btn-link p-0 ms-2"
                title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                onClick={handleFavorite}
                disabled={favLoading}
                style={{color: isFav ? '#e63946' : '#adb5bd', fontSize: '1.5rem'}}
              >
                <i className={isFav ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
              </button>
            )}
            {/* Agregar al carrito */}
            {user && !loading && (
              <button
                className="btn btn-outline-primary btn-sm ms-2"
                title="Agregar al carrito"
                onClick={handleAddToCart}
                disabled={cartBtnLoading}
              >
                <i className="bi bi-cart-plus"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
