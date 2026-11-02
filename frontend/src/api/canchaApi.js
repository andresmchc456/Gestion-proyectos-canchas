const API_BASE = 'http://localhost:8080/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    let errorMsg = 'Error en la solicitud';
    if (data) {
      if (data.mensaje) {
        errorMsg = data.mensaje;
      } else if (data.mensajes) {
        errorMsg = Object.values(data.mensajes).join('. ');
      } else if (data.error) {
        errorMsg = data.error;
      }
    } else if (response.status === 403) {
      errorMsg = 'Acceso denegado: No tienes permisos para realizar esta operación.';
    } else if (response.status === 401) {
      errorMsg = 'No autorizado: Por favor inicia sesión nuevamente.';
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const canchaApi = {
  // Oferta disponible para clientes (solo habilitadas, con filtros opcionales)
  getCanchasHabilitadas: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.tipo) params.append('tipo', filters.tipo);
    if (filters.maxTarifa) params.append('maxTarifa', filters.maxTarifa);
    if (filters.buscar) params.append('buscar', filters.buscar);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/canchas${queryString}`, { method: 'GET' });
  },

  // Consulta individual de cancha habilitada
  getCanchaById: async (id) => {
    return apiRequest(`/canchas/${id}`, { method: 'GET' });
  },

  // Listado de tipos de deportes disponibles
  getTiposCancha: async () => {
    return apiRequest('/canchas/tipos', { method: 'GET' });
  },

  // Gestión de canchas para Administradores (todas, activas e inactivas)
  getAllCanchasAdmin: async () => {
    return apiRequest('/canchas/admin', { method: 'GET' });
  },

  // Obtener cancha para edición (Admin)
  getCanchaAdminById: async (id) => {
    return apiRequest(`/canchas/admin/${id}`, { method: 'GET' });
  },

  // Crear nueva cancha (Admin)
  createCancha: async (canchaData) => {
    return apiRequest('/canchas', {
      method: 'POST',
      body: JSON.stringify(canchaData)
    });
  },

  // Editar cancha existente (Admin)
  updateCancha: async (id, canchaData) => {
    return apiRequest(`/canchas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(canchaData)
    });
  },

  // Alternar estado activo/inactivo (Admin)
  toggleEstadoCancha: async (id) => {
    return apiRequest(`/canchas/${id}/toggle-estado`, {
      method: 'PATCH'
    });
  },

  // Desactivación suave de cancha (Admin)
  deleteCancha: async (id) => {
    return apiRequest(`/canchas/${id}`, {
      method: 'DELETE'
    });
  }
};

