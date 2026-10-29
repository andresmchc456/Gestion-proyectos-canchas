import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, Shield, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'El formato del correo es inválido';
    }

    if (!password) {
      errs.password = 'La contraseña es requerida';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Ayudante para autocompletar credenciales en demostración
  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
    setServerError('');
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '2rem auto',
      width: '100%'
    }}>
      <div className="card animate-fade-in">
        {/* Cabecera del formulario */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Iniciar Sesión</h2>
          <p style={{ fontSize: '0.875rem' }}>
            Accede a tu cuenta para gestionar tus reservas o administrar canchas
          </p>
        </div>

        {/* Mensaje de error general */}
        {serverError && (
          <Alert type="danger" message={serverError} onClose={() => setServerError('')} />
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Correo Electrónico */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Correo Electrónico
            </label>
            <div className="form-input-wrapper">
              <Mail size={18} className="form-input-icon" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@canchas.com"
                className={`form-input has-icon ${errors.email ? 'is-invalid' : ''}`}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Contraseña
            </label>
            <div className="form-input-wrapper">
              <Lock size={18} className="form-input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña secreta"
                className={`form-input has-icon ${errors.password ? 'is-invalid' : ''}`}
                autoComplete="current-password"
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
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? 'Validando credenciales...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Demo rápida de roles */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px dashed var(--border)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            letterSpacing: '0.04em'
          }}>
            <Sparkles size={14} color="var(--accent)" />
            <span>Acceso rápido de prueba:</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.5rem' }}
              onClick={() => handleQuickFill('admin@canchas.com', 'Admin123*')}
            >
              <Shield size={14} color="#b45309" />
              <span>Admin Inicial</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.5rem' }}
              onClick={() => handleQuickFill('carlos.cliente@canchas.com', 'Cliente123*')}
            >
              <User size={14} color="var(--primary)" />
              <span>Cliente Demo</span>
            </button>
          </div>
        </div>

        {/* Enlace al registro */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>¿No tienes una cuenta aún? </span>
          <Link to="/registro" style={{ color: 'var(--primary-dark)', fontWeight: 600, textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

