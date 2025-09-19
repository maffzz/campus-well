/**
 * Servicio de API para CampusWell
 * Este archivo contiene todas las funciones para comunicarse con el backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Realiza una petición HTTP
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise} - Respuesta de la API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene la vista general del bienestar de un estudiante
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<Object>} - Datos del bienestar
   */
  async getWellbeingOverview(studentId) {
    return this.request(`/wellbeing/${studentId}/overview`);
  }

  /**
   * Obtiene recomendaciones para un estudiante
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<Object>} - Recomendaciones
   */
  async getRecommendations(studentId) {
    return this.request(`/wellbeing/recommendation?student_id=${studentId}`, {
      method: 'POST',
    });
  }

  /**
   * Verifica el estado de salud de la API
   * @returns {Promise<Object>} - Estado de salud
   */
  async getHealth() {
    return this.request('/health');
  }
}

// Instancia singleton del servicio
const apiService = new ApiService();

export default apiService;
