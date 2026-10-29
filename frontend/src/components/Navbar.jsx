import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
          color: 'var(--secondary)'
        }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
          }}>
            <Trophy size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Canchas<span style={{ color: 'var(--primary)' }}>Pro</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Club & Complejo Deportivo
            </span>
          </div>
        </Link>

        {/* Navigation links & User Session */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--surface-alt)',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isAdmin ? '#fef3c7' : 'var(--primary-light)',
                  color: isAdmin ? '#b45309' : 'var(--primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isAdmin ? <ShieldCheck size={18} /> : <User size={18} />}
                </div>

                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {user?.nombreCompleto}
                  </div>
                  <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-client'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                    {isAdmin ? 'ADMINISTRADOR' : 'CLIENTE'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                title="Cerrar Sesión"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.875rem' }}
              >
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

