const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000/api';

// Recuperar token desde localStorage
const getToken = () => localStorage.getItem('token');

// Headers base
const getHeaders = (auth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Función genérica con control de errores y timeout opcional
async function request(
  endpoint,
  { method = 'GET', body = null, auth = false, timeout = 10000 } = {}
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: getHeaders(auth),
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });

    clearTimeout(id);

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || 'Error en la solicitud');
      error.status = res.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. Intenta nuevamente.');
    }

    console.error('API Error:', error.message);
    throw error;
  }
}

// API endpoints organizados
export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) =>
    request('/auth/register', { method: 'POST', body: userData }),

  // Productos
  getProducts: () => request('/products'),
  getProductById: (id) => request(`/products/${id}`),

  // Carrito
  getCart: () => request('/cart', { auth: true }),
  addToCart: (item) =>
    request('/cart/add', { method: 'POST', body: item, auth: true }),
  removeFromCart: (id) =>
    request(`/cart/${id}`, { method: 'DELETE', auth: true }),
  clearCart: () => request('/cart/clear', { method: 'DELETE', auth: true }),

  // Órdenes
  createOrder: (orderData) =>
    request('/orders', { method: 'POST', body: orderData, auth: true }),
  getOrders: () => request('/orders', { auth: true }),

  // Categorías
  getCategories: () => request('/categories'),
  getCategoryById: (id) => request(`/categories/${id}`),

  // Usuario
  getProfile: () => request('/users/profile', { auth: true }),
  updateProfile: (data) =>
    request('/users/profile', { method: 'PUT', body: data, auth: true }),
};
