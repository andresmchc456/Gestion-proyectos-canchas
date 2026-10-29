import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import Alert from '../components/Alert';
import {
  User,
  Shield,
  ShieldCheck,
  Calendar,
  Lock,
  Users,
  CheckCircle2,
  KeyRound,
  FileText,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin, isCliente } = useAuth();

  // Estados para pruebas interactivas de permisos
  const [testResult, setTestResult] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [usuariosList, setUsuariosList] = useState([]);

  // Estados para creación segura de administradores
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    password: '',
    bootstrapSecret: ''
  });
  const [adminModalMsg, setAdminModalMsg] = useState(null);
  const [adminModalLoading, setAdminModalLoading] = useState(false);

  // Probar endpoint administrativo /api/usuarios
  const handleTestAdminEndpoint = async () => {
    setLoadingTest(true);
    setTestResult(null);
    setUsuariosList([]);

    try {
      const data = await authApi.getUsuarios();
      setTestResult({
        success: true,
        message: `Acceso Autorizado (200 OK): Se obtuvieron ${data.length} usuarios registrados en el sistema.`
      });
      setUsuariosList(data);
    } catch (err) {
      setTestResult({
        success: false,
        status: err.status || 403,
        message: err.message || 'Acceso denegado (403 Forbidden)'
      });
    } finally {
      setLoadingTest(false);
    }
  };

  // Enviar creación de admin seguro
  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminModalMsg(null);
    setAdminModalLoading(true);

    try {
      const res = await authApi.createAdmin(adminFormData);
      setAdminModalMsg({
        type: 'success',
        text: `Administrador '${res.nombreCompleto}' (${res.email}) creado exitosamente con ROLE_ADMIN.`
      });
      setAdminFormData({
        nombreCompleto: '',
        email: '',
        telefono: '',
        password: '',
        bootstrapSecret: ''
      });
      // Refrescar listado si está visible
      if (isAdmin) {
        const data = await authApi.getUsuarios();
        setUsuariosList(data);
      }
    } catch (err) {
      setAdminModalMsg({
        type: 'danger',
        text: err.message || 'Error al crear administrador.'
      });
    } finally {
      setAdminModalLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner de Bienvenida */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-client'}`}>
              {isAdmin ? 'PERFIL ADMINISTRADOR' : 'PERFIL CLIENTE'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              ID Usuario: #{user?.id}
            </span>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            ¡Bienvenido, {user?.nombreCompleto}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '650px' }}>
            {isAdmin
              ? 'Panel de control administrativo para gestión del complejo deportivo, supervisión de canchas, usuarios y reservas.'
              : 'Gestiona tus reservas de canchas deportivas, revisa disponibilidad y mantén tus datos actualizados.'}
          </p>
        </div>
      </div>

      {/* Grid Principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Tarjeta de Información de Cuenta */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Mi Perfil de Usuario</h3>
              <p style={{ fontSize: '0.8rem' }}>Detalles de la sesión autenticada</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Nombre Completo:</span>
              <strong style={{ color: 'var(--text-main)' }}>{user?.nombreCompleto}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Correo Electrónico:</span>
              <strong style={{ color: 'var(--text-main)' }}>{user?.email}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Teléfono:</span>
              <strong style={{ color: 'var(--text-main)' }}>{user?.telefono || 'No registrado'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Rol Asignado:</span>
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-client'}`}>
                {user?.rol}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estado de Cuenta:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={16} /> Activo
              </span>
            </div>
          </div>
        </div>

        {/* Demostración Interactiva del Criterio de Aceptación */}
        <div className="card" style={{ border: '1.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Validación de Permisos y Roles</h3>
              <p style={{ fontSize: '0.8rem' }}>Criterios de Aceptación de la Historia</p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-alt)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            fontSize: '0.825rem',
            marginBottom: '1rem',
            lineHeight: 1.45,
            border: '1px solid var(--border)'
          }}>
            <p style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              <strong>Regla evaluada:</strong> "Un cliente puede acceder a sus reservas, pero no a funciones administrativas ni a información privada de otros usuarios."
            </p>
            <span style={{ color: 'var(--text-muted)' }}>
              Al pulsar el botón inferior, tu token JWT actual intentará consultar el endpoint protegido <code>GET /api/usuarios</code>.
            </span>
          </div>

          <button
            onClick={handleTestAdminEndpoint}
            disabled={loadingTest}
            className={`btn ${isAdmin ? 'btn-primary' : 'btn-dark'} btn-block`}
            style={{ marginBottom: '1rem' }}
          >
            <Lock size={16} />
            <span>
              {loadingTest ? 'Consultando backend...' : 'Probar Acceso a /api/usuarios'}
            </span>
          </button>

          {testResult && (
            <Alert
              type={testResult.success ? 'success' : 'danger'}
              message={
                <div>
                  <strong>{testResult.success ? 'Resultado: ÉXITO' : `Resultado: BLOQUEADO (${testResult.status})`}</strong>
                  <div style={{ marginTop: '0.25rem' }}>{testResult.message}</div>
                </div>
              }
              onClose={() => setTestResult(null)}
            />
          )}

          {/* Botón para abrir modal de creación de administradores */}
          <button
            onClick={() => setShowAdminModal(true)}
            className="btn btn-outline-primary btn-block"
            style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}
          >
            <KeyRound size={16} />
            <span>Procedimiento Seguro: Crear Nuevo Administrador</span>
          </button>
        </div>
      </div>

      {/* Si es Admin y listó los usuarios */}
      {usuariosList.length > 0 && (
        <div className="card animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary-dark)" />
              <h3 style={{ fontSize: '1.2rem' }}>Usuarios Registrados en el Sistema</h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: {usuariosList.length} cuentas
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Nombre</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Correo</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Teléfono</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Rol</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuariosList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>#{u.id}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{u.nombreCompleto}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{u.telefono || '-'}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${u.rol === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-client'}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: u.activo ? 'var(--success)' : 'var(--danger)' }}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Siguientes Módulos del Proyecto (Preparación para próximas historias) */}
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
          {isCliente ? 'Mis Módulos Deportivos' : 'Módulos de Gestión Deportiva'}
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Tarjeta Canchas */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                padding: '0.5rem',
                borderRadius: '8px'
              }}>
                <Calendar size={20} />
              </div>
              <h4 style={{ fontSize: '1rem' }}>Canchas Deportivas</h4>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Fútbol 5, Sintética, Tenis y Baloncesto con horarios y tarifas por hora.
            </p>
            <span className="badge badge-client" style={{ fontSize: '0.7rem' }}>
              Próximo Módulo
            </span>
          </div>

          {/* Tarjeta Reservas */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                padding: '0.5rem',
                borderRadius: '8px'
              }}>
                <Clock size={20} />
              </div>
              <h4 style={{ fontSize: '1rem' }}>Gestión de Reservas</h4>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Creación, validación de disponibilidad horaria, modificación y cancelación.
            </p>
            <span className="badge badge-client" style={{ fontSize: '0.7rem' }}>
              Próximo Módulo
            </span>
          </div>

          {/* Tarjeta Reportes */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                padding: '0.5rem',
                borderRadius: '8px'
              }}>
                <FileText size={20} />
              </div>
              <h4 style={{ fontSize: '1rem' }}>Reportes y Facturación</h4>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Métricas de uso por cancha, recaudación financiera y estadísticas.
            </p>
            <span className="badge badge-admin" style={{ fontSize: '0.7rem' }}>
              Solo Administrador
            </span>
          </div>
        </div>
      </div>

      {/* Modal / Formulario Desplegable: Procedimiento Seguro de Creación de Administradores */}
      {showAdminModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={22} color="var(--primary-dark)" />
                <h3 style={{ fontSize: '1.25rem' }}>Creación Segura de Administrador</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', marginBottom: '1.25rem' }}>
              Esta función está protegida por la clave maestra de inicialización del servidor (<code>AdminSecretKey2026!</code>) o sesión de administrador activa.
            </p>

            {adminModalMsg && (
              <Alert type={adminModalMsg.type} message={adminModalMsg.text} onClose={() => setAdminModalMsg(null)} />
            )}

            <form onSubmit={handleCreateAdminSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={adminFormData.nombreCompleto}
                  onChange={(e) => setAdminFormData({ ...adminFormData, nombreCompleto: e.target.value })}
                  placeholder="Ej. Roberto Admin"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  placeholder="nuevo.admin@canchas.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-input"
                  value={adminFormData.telefono}
                  onChange={(e) => setAdminFormData({ ...adminFormData, telefono: e.target.value })}
                  placeholder="300 000 0000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="form-input"
                  value={adminFormData.password}
                  onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Clave Maestra Secreta (Bootstrap Secret) *
                </label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={adminFormData.bootstrapSecret}
                  onChange={(e) => setAdminFormData({ ...adminFormData, bootstrapSecret: e.target.value })}
                  placeholder="Clave secreta configurada en el servidor"
                />
                <span className="form-hint">Clave predeterminada: <code>AdminSecretKey2026!</code></span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={adminModalLoading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {adminModalLoading ? 'Creando...' : 'Crear Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

