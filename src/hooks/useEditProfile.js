import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getProfile, updateProfile } from '../services/userService';
import { isLoggedIn, getUser } from '../services/userService';

export function useEditProfile() {
  const { user, login } = useAuth ? useAuth() : { user: null, login: () => {} };
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isLoggedIn() || !getUser()) {
      setAuth(false);
      setLoading(false);
      return;
    }
    setAuth(true);
    setLoading(true);
    getProfile()
      .then(data => {
        setProfile(data);
        setForm(f => ({ ...f, name: data.name || '', email: data.email || '', role: data.role || '' }));
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar tu perfil');
        setLoading(false);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleTogglePwd = () => setShowPwd(v => !v);
  const handleToggleConfirm = () => setShowConfirm(v => !v);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name || !form.email) {
      setError('Nombre y correo son obligatorios');
      return;
    }
    if (form.password && form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const updated = await updateProfile({
        name: form.name,
        email: form.email,
        password: form.password || undefined
      });
      // Actualiza el contexto de usuario con los nuevos datos
      if (user && login) {
        login({ ...user, name: updated.name, email: updated.email }, localStorage.getItem('token'));
      }
      setSuccess('Perfil actualizado correctamente');
      setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch {
      setError('Error al actualizar el perfil');
    }
  };

  return {
    profile,
    loading,
    auth,
    error,
    success,
    form,
    showPwd,
    showConfirm,
    handleChange,
    handleTogglePwd,
    handleToggleConfirm,
    handleSubmit
  };
}
