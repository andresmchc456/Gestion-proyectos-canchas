import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { canchaApi } from '../api/canchaApi';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Sun,
  Umbrella,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function CanchasCatalog() {
  const { user, isAdmin } = useAuth();

  const [canchas, setCanchas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros de búsqueda
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [precioMaximo, setPrecioMaximo] = useState('');
  const [soloTechadas, setSoloTechadas] = useState(false);
  const [soloIluminadas, setSoloIluminadas] = useState(false);

  // Cargar tipos y oferta habilitada
  const cargarCanchas = async () => {
    setLoading(true);
    setError('');
    try {
      const [canchasData, tiposData] = await Promise.all([
        canchaApi.getCanchasHabilitadas({
          tipo: tipoSeleccionado || undefined,
          buscar: busqueda || undefined,
          maxTarifa: precioMaximo || undefined
        }),
        canchaApi.getTiposCancha().catch(() => [])
      ]);

      setCanchas(canchasData);
      if (tiposData && tiposData.length > 0) {
        setTipos(tiposData);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar la oferta de canchas disponibles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCanchas();
  }, [tipoSeleccionado]);

  const handleBuscarSubmit = (e) => {
    e.preventDefault();
    cargarCanchas();
  };

  const handleLimpiarFiltros = () => {
    setTipoSeleccionado('');
    setBusqueda('');
    setPrecioMaximo('');
    setSoloTechadas(false);
    setSoloIluminadas(false);
  };

  // Filtrado adicional en memoria para checkboxes
  const canchasFiltradas = useMemo(() => {
    return canchas.filter((cancha) => {
      if (soloTechadas && !cancha.techada) return false;
      if (soloIluminadas && !cancha.iluminacion) return false;
      return true;
    });
  }, [canchas, soloTechadas, soloIluminadas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Banner de Cabecera con Criterio de Aceptación */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f172a 100%)',
        color: '#ffffff',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: '#a7f3d0', color: '#064e3b', fontWeight: 800 }}>
              <CheckCircle2 size={13} /> OFERTA HABILITADA
            </span>
            <span style={{ fontSize: '0.8rem', color: '#d1fae5' }}>
              Horarios y Tarifas Oficiales Actualizadas
            </span>
          </div>

          <h1 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>
            Canchas Deportivas Disponibles
          </h1>
          <p style={{ color: '#ecfdf5', fontSize: '0.95rem', maxWidth: '720px', lineHeight: 1.5 }}>
            Explora nuestra oferta de canchas habilitadas para fútbol, tenis, pádel y más. Consulta horarios de apertura y tarifas por hora para planificar tus partidos.
          </p>

          {/* Garantía del criterio de aceptación */}
          <div style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.775rem',
            color: '#f0fdf4'
          }}>
            <Sparkles size={14} color="#fde047" />
            <span>
              <strong>Criterio HU03:</strong> Los clientes consultan exclusivamente la oferta habilitada (las canchas en mantenimiento se omiten automáticamente).
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros Rápidos */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleBuscarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Fila 1: Buscador de texto y botón buscar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="form-input-wrapper" style={{ flex: '1 1 280px' }}>
              <Search size={18} className="form-input-icon" />
              <input
                type="text"
                className="form-input has-icon"
                placeholder="Buscar por nombre, superficie (ej. sintético, ladrillo) o detalles..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div style={{ width: '180px', flex: '0 0 auto' }}>
              <input
                type="number"
                className="form-input"
                placeholder="Tarifa máxima ($)"
                value={precioMaximo}
                onChange={(e) => setPrecioMaximo(e.target.value)}
                min="0"
                step="5000"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Search size={16} />
              <span>Filtrar</span>
            </button>

            {(busqueda || precioMaximo || tipoSeleccionado || soloTechadas || soloIluminadas) && (
              <button
                type="button"
                onClick={handleLimpiarFiltros}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1rem' }}
              >
                Limpiar
              </button>
            )}

            {isAdmin && (
              <Link
                to="/admin/canchas"
                className="btn btn-dark"
                style={{ marginLeft: 'auto', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
              >
                <span>Administrar Canchas</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {/* Fila 2: Píldoras de Deporte / Tipo */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
              Deporte:
            </span>
            <button
              type="button"
              onClick={() => setTipoSeleccionado('')}
              className={`btn ${tipoSeleccionado === '' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            >
              Todos
            </button>
            {tipos.map((t) => (
              <button
                key={t.codigo}
                type="button"
                onClick={() => setTipoSeleccionado(t.codigo === tipoSeleccionado ? '' : t.codigo)}
                className={`btn ${tipoSeleccionado === t.codigo ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
              >
                {t.nombre}
              </button>
            ))}
          </div>

          {/* Fila 3: Características adicionales (Techada, Iluminación) */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.85rem',
            color: 'var(--text-main)',
            flexWrap: 'wrap'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={soloTechadas}
                onChange={(e) => setSoloTechadas(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              <Umbrella size={16} color="var(--primary-dark)" />
              <span>Solo canchas techadas</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={soloIluminadas}
                onChange={(e) => setSoloIluminadas(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
              />
              <Zap size={16} color="#d97706" />
              <span>Con iluminación nocturna LED</span>
            </label>

            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center' }}>
              Mostrando <strong>{canchasFiltradas.length}</strong> canchas habilitadas
            </span>
          </div>
        </form>
      </div>

      {/* Alertas */}
      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Lista de Canchas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Consultando oferta habilitada...
          </div>
          <p style={{ fontSize: '0.875rem' }}>Conectando con el servidor en tiempo real</p>
        </div>
      ) : canchasFiltradas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-alt)',
            color: 'var(--text-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Filter size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No se encontraron canchas con los filtros aplicados</h3>
          <p style={{ fontSize: '0.875rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Prueba ajustando la tarifa máxima, seleccionando otro deporte o limpiando los filtros de búsqueda.
          </p>
          <button onClick={handleLimpiarFiltros} className="btn btn-outline-primary">
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {canchasFiltradas.map((cancha) => (
            <div
              key={cancha.id}
              className="card animate-fade-in"
              style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {/* Imagen con badge flotante */}
              <div style={{ position: 'relative', height: '190px', backgroundColor: '#0f172a' }}>
                <img
                  src={cancha.imagenUrl}
                  alt={cancha.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Fallback visual
                    e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)'
                }} />

                {/* Badges superiores */}
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '0.75rem',
                  display: 'flex',
                  gap: '0.4rem',
                  flexWrap: 'wrap'
                }}>
                  <span className="badge" style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#ffffff' }}>
                    {cancha.tipoNombreLegible}
                  </span>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem'
                }}>
                  <span className="badge" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
                    Habilitada
                  </span>
                </div>

                {/* Título sobre imagen */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '1rem',
                  right: '1rem'
                }}>
                  <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                    {cancha.nombre}
                  </h3>
                </div>
              </div>

              {/* Cuerpo de la tarjeta */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Superficie */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <Layers size={16} color="var(--primary-dark)" />
                  <span>Superficie: <strong>{cancha.superficie}</strong></span>
                </div>

                {/* Descripción */}
                <p style={{
                  fontSize: '0.825rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.45,
                  minHeight: '2.9em',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {cancha.descripcion || 'Cancha en óptimas condiciones para la práctica deportiva.'}
                </p>

                {/* Características destacadas */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {cancha.techada && (
                    <span className="badge badge-client" style={{ fontSize: '0.7rem' }}>
                      <Umbrella size={12} /> Techada
                    </span>
                  )}
                  {cancha.iluminacion && (
                    <span className="badge" style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#92400e' }}>
                      <Zap size={12} /> Luz Nocturna
                    </span>
                  )}
                  <span className="badge" style={{ fontSize: '0.7rem', backgroundColor: 'var(--surface-alt)', color: 'var(--text-muted)' }}>
                    Turnos de {cancha.duracionTurnoMinutos}m
                  </span>
                </div>

                {/* Horarios y Precios */}
                <div style={{
                  backgroundColor: 'var(--surface-alt)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.9rem',
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Clock size={14} />
                      <span>Horario</span>
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {cancha.horarioAtencion}
                    </strong>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Tarifa por hora
                    </div>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', fontWeight: 800 }}>
                      {cancha.tarifaFormateada}
                    </strong>
                  </div>
                </div>

                {/* Botón de acción */}
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '0.25rem', padding: '0.65rem' }}
                  onClick={() => alert(`¡Listo para reservar turno en ${cancha.nombre}!\nTarifa: ${cancha.tarifaFormateada}/hora.\nHorario: ${cancha.horarioAtencion}.\n(La funcionalidad completa de reservas se desarrollará en el siguiente módulo).`)}
                >
                  <Calendar size={16} />
                  <span>Ver Disponibilidad / Reservar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

