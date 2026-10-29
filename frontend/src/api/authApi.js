const API_BASE = 'http://localhost:8080/api';

/**
 * Función helper para peticiones HTTP autenticadas con JWT
 */
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
    let errorMsg = 'Ocurrió un error en la solicitud';
    if (data) {
      if (data.mensaje) {
        errorMsg = data.mensaje;
      } else if (data.mensajes) {
        // Errores de validación de campos
        errorMsg = Object.values(data.mensajes).join('. ');
      } else if (data.error) {
        errorMsg = data.error;
      }
    } else if (response.status === 403) {
      errorMsg = 'Acceso denegado: No tienes permisos para acceder a este recurso administrativo.';
    } else if (response.status === 401) {
      errorMsg = 'No autorizado: Sesión expirada o credenciales incorrectas.';
    }
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  // Registro público (siempre ROLE_CLIENTE)
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Inicio de sesión
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Perfil del usuario autenticado
  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  // Cierre de sesión informativo
  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Si falla logout en backend, igual borramos token local
    }
  },

  // Procedimiento seguro para dar de alta administradores
  createAdmin: async (adminData) => {
    return apiRequest('/auth/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  },

  // Listar usuarios (exclusivo ROLE_ADMIN)
  getUsuarios: async () => {
    return apiRequest('/usuarios', {
      method: 'GET'
    });
  },

  // Consultar usuario por ID (respeta privacidad de datos)
  getUsuarioById: async (id) => {
    return apiRequest(`/usuarios/${id}`, {
      method: 'GET'
    });
  }
};

