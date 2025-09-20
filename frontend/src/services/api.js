/**
 * Servicio de API para CampusWell
 * Este archivo contiene todas las funciones para comunicarse con el backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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

  /**
   * Obtiene eventos deportivos
   * @param {string} type - Tipo de evento (opcional)
   * @returns {Promise<Array>} - Lista de eventos
   */
  async getEvents(type = null) {
    const params = type ? `?type=${type}` : '';
    return this.request(`/events${params}`);
  }

  /**
   * Crea un nuevo evento deportivo
   * @param {Object} eventData - Datos del evento
   * @returns {Promise<Object>} - Evento creado
   */
  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  /**
   * Registra un estudiante en un evento
   * @param {number} studentId - ID del estudiante
   * @param {number} eventId - ID del evento
   * @returns {Promise<Object>} - Resultado del registro
   */
  async registerForEvent(studentId, eventId) {
    return this.request(`/registrations?student_id=${studentId}&event_id=${eventId}`, {
      method: 'POST',
    });
  }

  /**
   * Crea una nueva cita psicológica
   * @param {Object} appointmentData - Datos de la cita
   * @returns {Promise<Object>} - Cita creada
   */
  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  /**
   * Crea un nuevo hábito
   * @param {Object} habitData - Datos del hábito
   * @returns {Promise<Object>} - Hábito creado
   */
  async createHabit(habitData) {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  }
}

// Instancia singleton del servicio
const apiService = new ApiService();

export default apiService;
