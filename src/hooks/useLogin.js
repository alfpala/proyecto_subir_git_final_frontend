import { useState } from 'react';
import { loginUser } from '../services/userService';

export function useLogin(loginContext) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleTogglePwd = () => setShowPwd(v => !v);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.email || !form.password) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      if (loginContext) {
        loginContext(res.user, res.token);
        window.location.href = '/';
      }
      setSuccess('¡Bienvenido!');
      setForm({ email: '', password: '' });
    } catch (err) {
      setError('Error al iniciar sesión.');
    }
    setLoading(false);
  };

  return {
    form,
    showPwd,
    loading,
    error,
    success,
    handleChange,
    handleTogglePwd,
    handleSubmit
  };
}
