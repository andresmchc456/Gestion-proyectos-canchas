import React, { useState, useEffect } from 'react';
import { canchaApi } from '../api/canchaApi';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Power,
  Layers,
  Clock,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Umbrella,
  Zap,
  Image,
  RefreshCw
} from 'lucide-react';

const IMAGENES_SUGERIDAS = {
  FUTBOL_5: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  FUTBOL_7: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
  FUTBOL_11: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  TENIS: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
  PADEL: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
  BALONCESTO: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
  VOLEIBOL: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80'
};

export default function AdminCanchas() {
  const { user, isAdmin } = useAuth();

  const [canchas, setCanchas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerta, setAlerta] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODAS'); // TODAS, ACTIVAS, INACTIVAS

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const initialForm = {
    nombre: '',
    tipo: 'FUTBOL_5',
    superficie: '',
    descripcion: '',
    tarifaPorHora: '',
    horaApertura: '06:00',
    horaCierre: '23:00',
    duracionTurnoMinutos: 60,
    activa: true,
    techada: false,
    iluminacion: true,
    imagenUrl: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // Cargar todas las canchas para administración
  const cargarCanchas = async () => {
    setLoading(true);
    try {
      const [canchasData, tiposData] = await Promise.all([
        canchaApi.getAllCanchasAdmin(),
        canchaApi.getTiposCancha().catch(() => [])
      ]);
      setCanchas(canchasData);
      if (tiposData && tiposData.length > 0) {
        setTipos(tiposData);
      }
    } catch (err) {
      setAlerta({ type: 'danger', message: err.message || 'Error al cargar canchas administrativas.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCanchas();
  }, []);

  // Abrir modal para Crear
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      ...initialForm,
      imagenUrl: IMAGENES_SUGERIDAS.FUTBOL_5
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Abrir modal para Editar
  const handleOpenEdit = (cancha) => {
    setIsEditing(true);
    setEditingId(cancha.id);
    setFormData({
      nombre: cancha.nombre,
      tipo: cancha.tipo,
      superficie: cancha.superficie,
      descripcion: cancha.descripcion || '',
      tarifaPorHora: cancha.tarifaPorHora,
      horaApertura: cancha.horaApertura ? cancha.horaApertura.substring(0, 5) : '06:00',
      horaCierre: cancha.horaCierre ? cancha.horaCierre.substring(0, 5) : '23:00',
      duracionTurnoMinutos: cancha.duracionTurnoMinutos || 60,
      activa: cancha.activa,
      techada: cancha.techada,
      iluminacion: cancha.iluminacion,
      imagenUrl: cancha.imagenUrl || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Sugerir imagen basada en deporte
  const handleSugerirImagen = (tipo) => {
    const sugerida = IMAGENES_SUGERIDAS[tipo] || IMAGENES_SUGERIDAS.FUTBOL_5;
    setFormData((prev) => ({ ...prev, tipo, imagenUrl: sugerida }));
  };

  // Validaciones del formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre de la cancha es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener mínimo 3 caracteres';
    }

    if (!formData.superficie.trim()) {
      errors.superficie = 'La superficie es obligatoria';
    }

    if (!formData.tarifaPorHora || Number(formData.tarifaPorHora) <= 0) {
      errors.tarifaPorHora = 'La tarifa por hora debe ser mayor a 0';
    }

    if (!formData.horaApertura) {
      errors.horaApertura = 'La hora de apertura es requerida';
    }

    if (!formData.horaCierre) {
      errors.horaCierre = 'La hora de cierre es requerida';
    }

    if (formData.horaApertura && formData.horaCierre && formData.horaApertura >= formData.horaCierre) {
      errors.horaCierre = 'La hora de cierre debe ser posterior a la de apertura';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar formulario (Crear o Editar)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tarifaPorHora: parseFloat(formData.tarifaPorHora),
        duracionTurnoMinutos: parseInt(formData.duracionTurnoMinutos, 10)
      };

      if (isEditing) {
        await canchaApi.updateCancha(editingId, payload);
        setAlerta({ type: 'success', message: `Cancha '${formData.nombre}' actualizada exitosamente.` });
      } else {
        await canchaApi.createCancha(payload);
        setAlerta({ type: 'success', message: `Cancha '${formData.nombre}' creada y registrada en el sistema.` });
      }

      setShowModal(false);
      await cargarCanchas();
    } catch (err) {
      setAlerta({ type: 'danger', message: err.message || 'Error al guardar la cancha.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle rápido de activación / desactivación
  const handleToggleEstado = async (cancha) => {
    try {
      const updated = await canchaApi.toggleEstadoCancha(cancha.id);
      const nuevoEstado = updated.activa ? 'habilitada para reservas al público' : 'deshabilitada / puesta en mantenimiento';
      setAlerta({
        type: updated.activa ? 'success' : 'info',
        message: `Estado de '${cancha.nombre}' actualizado: ahora está ${nuevoEstado}.`
      });
      await cargarCanchas();
    } catch (err) {
      setAlerta({ type: 'danger', message: err.message || 'Error al cambiar estado de la cancha.' });
    }
  };

  // Métricas
  const totalCanchas = canchas.length;
  const canchasHabilitadas = canchas.filter((c) => c.activa).length;
  const canchasEnMantenimiento = canchas.filter((c) => !c.activa).length;
  const tarifaPromedio = totalCanchas > 0
    ? Math.round(canchas.reduce((acc, c) => acc + Number(c.tarifaPorHora), 0) / totalCanchas)
    : 0;

  // Filtrado de la tabla
  const canchasFiltradas = canchas.filter((c) => {
    if (filtroEstado === 'ACTIVAS' && !c.activa) return false;
    if (filtroEstado === 'INACTIVAS' && c.activa) return false;

    if (filtroTexto.trim()) {
      const term = filtroTexto.toLowerCase();
      const matchNom = c.nombre.toLowerCase().includes(term);
      const matchDep = c.tipoNombreLegible.toLowerCase().includes(term);
      const matchSup = c.superficie.toLowerCase().includes(term);
      return matchNom || matchDep || matchSup;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-admin">
              <ShieldCheck size={14} /> Módulo Administrativo
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Historia de Usuario 03 (HU03)
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem' }}>Administración de Canchas y Horarios</h1>
          <p style={{ fontSize: '0.875rem' }}>
            Configura las canchas del complejo, sus precios, superficies y horarios para publicar una oferta actualizada.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={cargarCanchas} className="btn btn-secondary" title="Refrescar datos">
            <RefreshCw size={16} />
            <span>Actualizar</span>
          </button>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={18} />
            <span>Nueva Cancha Deportiva</span>
          </button>
        </div>
      </div>

      {/* Alertas */}
      {alerta && (
        <Alert type={alerta.type} message={alerta.message} onClose={() => setAlerta(null)} />
      )}

      {/* Tarjetas de Métricas KPI */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Canchas
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>
            {totalCanchas}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            Registradas en el complejo
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Canchas Habilitadas
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {canchasHabilitadas}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Visibles para reservas de clientes
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            En Mantenimiento
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#b45309', marginTop: '0.25rem' }}>
            {canchasEnMantenimiento}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ocultas a clientes (Criterio HU03)
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Tarifa Promedio / Hora
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '0.25rem' }}>
            ${tarifaPromedio.toLocaleString('es-CO')}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            Precio promedio por turno
          </span>
        </div>
      </div>

      {/* Barra de Filtros de la Tabla */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="form-input-wrapper" style={{ maxWidth: '360px', width: '100%' }}>
            <Search size={18} className="form-input-icon" />
            <input
              type="text"
              className="form-input has-icon"
              placeholder="Buscar por nombre, deporte o superficie..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFiltroEstado('TODAS')}
              className={`btn ${filtroEstado === 'TODAS' ? 'btn-dark' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              Todas ({totalCanchas})
            </button>
            <button
              onClick={() => setFiltroEstado('ACTIVAS')}
              className={`btn ${filtroEstado === 'ACTIVAS' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              Habilitadas ({canchasHabilitadas})
            </button>
            <button
              onClick={() => setFiltroEstado('INACTIVAS')}
              className={`btn ${filtroEstado === 'INACTIVAS' ? 'btn-dark' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              Mantenimiento ({canchasEnMantenimiento})
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Gestión */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Cargando listado de canchas...
          </div>
        ) : canchasFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No se encontraron canchas registradas con los filtros actuales.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Cancha / Deporte</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Superficie</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Horario de Atención</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Tarifa / Hora</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Características</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Estado</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {canchasFiltradas.map((cancha) => (
                  <tr
                    key={cancha.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: cancha.activa ? 'transparent' : '#fffbeb',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    {/* Cancha / Deporte */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={cancha.imagenUrl}
                          alt={cancha.nombre}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid var(--border)'
                          }}
                          onError={(e) => {
                            e.target.src = IMAGENES_SUGERIDAS.FUTBOL_5;
                          }}
                        />
                        <div>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'block' }}>
                            {cancha.nombre}
                          </strong>
                          <span className="badge" style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)', padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>
                            {cancha.tipoNombreLegible}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Superficie */}
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Layers size={14} color="var(--primary-dark)" />
                        <span>{cancha.superficie}</span>
                      </div>
                    </td>

                    {/* Horario */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                        <Clock size={14} color="var(--text-light)" />
                        <span>{cancha.horarioAtencion}</span>
                      </div>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Turnos de {cancha.duracionTurnoMinutos} min
                      </span>
                    </td>

                    {/* Tarifa */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: 'var(--primary-dark)', fontSize: '1rem' }}>
                        {cancha.tarifaFormateada}
                      </strong>
                    </td>

                    {/* Características */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {cancha.techada && (
                          <span className="badge badge-client" style={{ fontSize: '0.65rem' }}>
                            <Umbrella size={10} /> Techada
                          </span>
                        )}
                        {cancha.iluminacion && (
                          <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: '#fef3c7', color: '#92400e' }}>
                            <Zap size={10} /> Luz
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {cancha.activa ? (
                        <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
                          <CheckCircle2 size={12} /> Habilitada
                        </span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                          <AlertTriangle size={12} /> En Mantenimiento
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {/* Botón rápido de Activar / Desactivar */}
                        <button
                          onClick={() => handleToggleEstado(cancha)}
                          className={`btn ${cancha.activa ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                          title={cancha.activa ? 'Desactivar y poner en mantenimiento' : 'Habilitar para reservas'}
                        >
                          <Power size={14} />
                          <span>{cancha.activa ? 'Desactivar' : 'Habilitar'}</span>
                        </button>

                        {/* Botón Editar */}
                        <button
                          onClick={() => handleOpenEdit(cancha)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                          title="Editar detalles y horarios"
                        >
                          <Edit2 size={14} />
                          <span>Editar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación / Edición de Cancha */}
      {showModal && (
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
            maxWidth: '680px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>
                    {isEditing ? 'Editar Cancha Deportiva' : 'Nueva Cancha Deportiva'}
                  </h3>
                  <p style={{ fontSize: '0.8rem' }}>
                    {isEditing ? 'Modifica los precios, horarios y disponibilidad' : 'Registra una nueva cancha para publicarla en el catálogo'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitForm} noValidate>
              {/* Nombre y Tipo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nombre de la Cancha *</label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.nombre ? 'is-invalid' : ''}`}
                    placeholder="Ej. Cancha Sintética 3 - Anfield"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  {formErrors.nombre && <span className="form-error">{formErrors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Deporte *</label>
                  <select
                    className="form-input"
                    value={formData.tipo}
                    onChange={(e) => handleSugerirImagen(e.target.value)}
                  >
                    {tipos.length > 0 ? (
                      tipos.map((t) => (
                        <option key={t.codigo} value={t.codigo}>{t.nombre}</option>
                      ))
                    ) : (
                      <>
                        <option value="FUTBOL_5">Fútbol 5</option>
                        <option value="FUTBOL_7">Fútbol 7</option>
                        <option value="FUTBOL_11">Fútbol 11</option>
                        <option value="TENIS">Tenis</option>
                        <option value="PADEL">Pádel</option>
                        <option value="BALONCESTO">Baloncesto</option>
                        <option value="VOLEIBOL">Voleibol</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Superficie y Tarifa */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tipo de Superficie *</label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.superficie ? 'is-invalid' : ''}`}
                    placeholder="Ej. Césped Sintético 50mm, Polvo de Ladrillo, Parquet..."
                    value={formData.superficie}
                    onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                  />
                  {formErrors.superficie && <span className="form-error">{formErrors.superficie}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Tarifa por Hora ($) *</label>
                  <input
                    type="number"
                    step="1000"
                    min="1"
                    className={`form-input ${formErrors.tarifaPorHora ? 'is-invalid' : ''}`}
                    placeholder="Ej. 85000"
                    value={formData.tarifaPorHora}
                    onChange={(e) => setFormData({ ...formData, tarifaPorHora: e.target.value })}
                  />
                  {formErrors.tarifaPorHora && <span className="form-error">{formErrors.tarifaPorHora}</span>}
                </div>
              </div>

              {/* Horarios de Atención y Duración */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Hora Apertura *</label>
                  <input
                    type="time"
                    className={`form-input ${formErrors.horaApertura ? 'is-invalid' : ''}`}
                    value={formData.horaApertura}
                    onChange={(e) => setFormData({ ...formData, horaApertura: e.target.value })}
                  />
                  {formErrors.horaApertura && <span className="form-error">{formErrors.horaApertura}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Hora Cierre *</label>
                  <input
                    type="time"
                    className={`form-input ${formErrors.horaCierre ? 'is-invalid' : ''}`}
                    value={formData.horaCierre}
                    onChange={(e) => setFormData({ ...formData, horaCierre: e.target.value })}
                  />
                  {formErrors.horaCierre && <span className="form-error">{formErrors.horaCierre}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Duración Turno</label>
                  <select
                    className="form-input"
                    value={formData.duracionTurnoMinutos}
                    onChange={(e) => setFormData({ ...formData, duracionTurnoMinutos: parseInt(e.target.value, 10) })}
                  >
                    <option value={30}>30 minutos</option>
                    <option value={60}>60 minutos (1 hora)</option>
                    <option value={90}>90 minutos (1h 30m)</option>
                    <option value={120}>120 minutos (2 horas)</option>
                  </select>
                </div>
              </div>

              {/* Imagen URL */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>URL de la Imagen</label>
                  <button
                    type="button"
                    onClick={() => handleSugerirImagen(formData.tipo)}
                    className="btn btn-secondary"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    <Image size={12} />
                    <span>Usar foto predeterminada</span>
                  </button>
                </div>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.imagenUrl}
                  onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                />
              </div>

              {/* Descripción */}
              <div className="form-group">
                <label className="form-label">Descripción / Equipamiento</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Detalles de iluminación, vestuarios, graderías, reglamento..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              {/* Checkboxes de Estado y Características */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                backgroundColor: 'var(--surface-alt)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border)'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.activa}
                    onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '17px', height: '17px' }}
                  />
                  <span>
                    <strong>Cancha Habilitada</strong>
                    <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      Visible al público en el catálogo
                    </span>
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.techada}
                    onChange={(e) => setFormData({ ...formData, techada: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '17px', height: '17px' }}
                  />
                  <span>
                    <strong>Techada / Cubierta</strong>
                    <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      Protegida de lluvia y sol
                    </span>
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.iluminacion}
                    onChange={(e) => setFormData({ ...formData, iluminacion: e.target.checked })}
                    style={{ accentColor: 'var(--primary)', width: '17px', height: '17px' }}
                  />
                  <span>
                    <strong>Iluminación Nocturna</strong>
                    <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      Focos LED para partidos de noche
                    </span>
                  </span>
                </label>
              </div>

              {/* Botones de acción del Modal */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Cancha')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

