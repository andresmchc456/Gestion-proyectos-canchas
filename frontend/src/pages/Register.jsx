import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.nombreCompleto.trim()) {
      errs.nombreCompleto = 'El nombre completo es obligatorio';
    } else if (formData.nombreCompleto.trim().length < 3) {
      errs.nombreCompleto = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'El formato del correo electrónico no es válido';
    }

    if (formData.telefono && !/^[0-9+ -]{7,20}$/.test(formData.telefono.trim())) {
      errs.telefono = 'El teléfono sólo debe contener números, espacios o guiones (7 a 20 dígitos)';
    }

    if (!formData.password) {
      errs.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      errs.password = 'La contraseña debe tener mínimo 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        nombreCompleto: formData.nombreCompleto.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        password: formData.password
      });

      setSuccessMessage('¡Cuenta creada exitosamente con perfil de CLIENTE! Redirigiendo...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setServerError(err.message || 'Error al procesar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '520px',
      margin: '2rem auto',
      width: '100%'
    }}>
      <div className="card animate-fade-in">
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '1px solid var(--primary-border)'
          }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Crear Cuenta de Cliente</h2>
          <p style={{ fontSize: '0.875rem' }}>
            Regístrate para reservar canchas y consultar tus reservas disponibles
          </p>
        </div>

        {/* Notificación de seguridad (Criterio de Aceptación) */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 0.9rem',
          display: 'flex',
          gap: '0.65rem',
          fontSize: '0.775rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={16} color="var(--primary-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Seguridad del sistema:</strong> El registro público otorga únicamente permisos de <strong>CLIENTE</strong>. La creación de administradores se realiza mediante procedimiento seguro independiente.
          </span>
        </div>

        {/* Mensajes de Servidor */}
        {serverError && (
          <Alert type="danger" message={serverError} onClose={() => setServerError('')} />
        )}
        {successMessage && (
          <Alert type="success" message={successMessage} />
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Nombre Completo */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-nombre">
              Nombre Completo *
            </label>
            <div className="form-input-wrapper">
              <User size={18} className="form-input-icon" />
              <input
                id="reg-nombre"
                name="nombreCompleto"
                type="text"
                value={formData.nombreCompleto}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className={`form-input has-icon ${errors.nombreCompleto ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.nombreCompleto && <span className="form-error">{errors.nombreCompleto}</span>}
          </div>

          {/* Correo Electrónico */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Correo Electrónico *
            </label>
            <div className="form-input-wrapper">
              <Mail size={18} className="form-input-icon" />
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan.perez@gmail.com"
                className={`form-input has-icon ${errors.email ? 'is-invalid' : ''}`}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-telefono">
              Teléfono de Contacto
            </label>
            <div className="form-input-wrapper">
              <Phone size={18} className="form-input-icon" />
              <input
                id="reg-telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="300 123 4567"
                className={`form-input has-icon ${errors.telefono ? 'is-invalid' : ''}`}
              />
            </div>
            {errors.telefono && <span className="form-error">{errors.telefono}</span>}
            <span className="form-hint">Para notificaciones sobre tus reservas</span>
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Contraseña *
            </label>
            <div className="form-input-wrapper">
              <Lock size={18} className="form-input-icon" />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className={`form-input has-icon ${errors.password ? 'is-invalid' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">
              Confirmar Contraseña *
            </label>
            <div className="form-input-wrapper">
              <Lock size={18} className="form-input-icon" />
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className={`form-input has-icon ${errors.confirmPassword ? 'is-invalid' : ''}`}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.75rem', padding: '0.75rem' }}
          >
            {loading ? 'Creando cuenta...' : 'Completar Registro'}
          </button>
        </form>

        {/* Enlace al login */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>¿Ya tienes una cuenta registrada? </span>
          <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600, textDecoration: 'none' }}>
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

