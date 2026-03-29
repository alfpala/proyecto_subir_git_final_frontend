import { useState } from 'react';
import { registerUser } from '../services/userService';

export function useRegister(loginContext) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '', terms: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'password') updateStrength(value);
  };

  const handleTogglePwd = () => setShowPwd(v => !v);

  const updateStrength = val => {
    let s = 0;
    if (val.length >= 6)  s++;
    if (val.length >= 10) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
    const levels = ['', 'Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    setStrengthLabel(levels[s] || '');
    setStrengthColor(colors[s] || '');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name || !form.email || !form.password) {
      setError('Completa todos los campos.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!form.terms) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      setSuccess('¡Cuenta creada con éxito! Redirigiendo a inicio de sesión...');
      setForm({ name: '', email: '', password: '', password2: '', terms: false });
      setTimeout(() => {
        window.location.href = '/login';
      }, 2500);
    } catch {
      setError('Error al registrar usuario.');
    }
    setLoading(false);
  };

  return {
    form,
    showPwd,
    loading,
    error,
    success,
    strength,
    strengthLabel,
    strengthColor,
    handleChange,
    handleTogglePwd,
    handleSubmit
  };
}
