/**
 * Servicio de API para CampusWell
 * Este archivo contiene todas las funciones para comunicarse con el backend
 */

import config from '../config.js';

const AGG_BASE = config.AGGREGATOR_URL;
const PSY_BASE = config.PSYCH_URL;
const SPO_BASE = config.SPORTS_URL;
const HAB_BASE = config.HABITS_URL;
const ANA_BASE = config.ANALYTICS_URL;

class ApiService {

  /**
   * Realiza una petición HTTP
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise} - Respuesta de la API
   */
  async requestAbs(url, options = {}) {
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
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      // Verificar si la respuesta tiene contenido
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return { message: 'Success', status: response.status };
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }


  // Helper para construir URL
  buildUrl(base, endpoint) {
    return `${base}${endpoint}`;
  }

  /**
   * Obtiene la vista general del bienestar de un estudiante
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<Object>} - Datos del bienestar
   */
  async getWellbeingOverview(studentId) {
    return this.requestAbs(this.buildUrl(AGG_BASE, `/wellbeing/${studentId}/overview`));
  }

  /**
   * Obtiene recomendaciones para un estudiante
   * @param {number} studentId - ID del estudiante
   * @returns {Promise<Object>} - Recomendaciones
   */
  async getRecommendations(studentId) {
    return this.requestAbs(this.buildUrl(AGG_BASE, `/wellbeing/recommendation`), {
      method: 'POST',
      body: JSON.stringify({ student_id: parseInt(studentId) }),
    });
  }

  /**
   * Verifica el estado de salud de la API
   * @returns {Promise<Object>} - Estado de salud
   */
  async getHealth() {
    return this.requestAbs(this.buildUrl(AGG_BASE, '/health'));
  }

  /**
   * Obtiene eventos deportivos
   * @param {string} type - Tipo de evento (opcional)
   * @returns {Promise<Array>} - Lista de eventos
   */
  async getEvents(type = null) {
    const params = type ? `?type=${type}` : '';
    return this.requestAbs(this.buildUrl(SPO_BASE, `/events${params}`));
  }

  /**
   * Crea un nuevo evento deportivo
   * @param {Object} eventData - Datos del evento
   * @returns {Promise<Object>} - Evento creado
   */
  async createEvent(eventData) {
    return this.requestAbs(this.buildUrl(SPO_BASE, '/events'), {
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
    return this.requestAbs(this.buildUrl(SPO_BASE, `/registrations?student_id=${studentId}&event_id=${eventId}`), {
      method: 'POST',
    });
  }

  /**
   * Crea una nueva cita psicológica
   * @param {Object} appointmentData - Datos de la cita
   * @returns {Promise<Object>} - Cita creada
   */
  async createAppointment(appointmentData) {
    return this.requestAbs(this.buildUrl(PSY_BASE, '/api/appointments'), {
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
    return this.requestAbs(this.buildUrl(HAB_BASE, '/habits'), {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  }

  // ==== Llamadas directas por microservicio (para cumplir rúbrica) ====
  // psych-svc (PostgreSQL) - CORREGIDO según Postman
  async getStudent(id) {
    return this.requestAbs(this.buildUrl(PSY_BASE, `/api/students/${id}`));
  }
  async createStudent(student) {
    return this.requestAbs(this.buildUrl(PSY_BASE, `/api/students`), {
      method: 'POST',
      body: JSON.stringify(student),
    });
  }
  async getAppointmentsByStudent(id) {
    return this.requestAbs(this.buildUrl(PSY_BASE, `/api/students/${id}/history`));
  }
  async createAppointmentDirect(appointmentData) {
    return this.requestAbs(this.buildUrl(PSY_BASE, `/api/appointments`), {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }
  async psychHealth() {
    return this.requestAbs(this.buildUrl(PSY_BASE, `/api/health`));
  }

  // sports-svc (MySQL) - CORREGIDO según Postman
  async sportsListEvents(type = null) {
    const params = type ? `?type=${type}` : '';
    return this.requestAbs(this.buildUrl(SPO_BASE, `/events${params}`));
  }
  async sportsCreateEvent(eventData) {
    return this.requestAbs(this.buildUrl(SPO_BASE, `/events`), {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }
  async sportsRegisterForEvent(studentId, eventId) {
    return this.requestAbs(this.buildUrl(SPO_BASE, `/registrations?student_id=${studentId}&event_id=${eventId}`), {
      method: 'POST',
    });
  }
  async sportsHealth() {
    return this.requestAbs(this.buildUrl(SPO_BASE, `/health`));
  }

  // habits-svc (MongoDB) - CORREGIDO según Postman
  async habitsList(studentId) {
    return this.requestAbs(this.buildUrl(HAB_BASE, `/habits/${studentId}`));
  }
  async habitsCreate(habit) {
    return this.requestAbs(this.buildUrl(HAB_BASE, `/habits`), {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  }
  async habitsHealth() {
    return this.requestAbs(this.buildUrl(HAB_BASE, `/health`));
  }

  // Métodos alternativos para cuando el aggregator no esté disponible
  async getHabitsDirect(studentId) {
    return this.requestAbs(this.buildUrl(HAB_BASE, `/habits/${studentId}`));
  }
  async createHabitDirect(habitData) {
    return this.requestAbs(this.buildUrl(HAB_BASE, `/habits`), {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  }

  // aggregator-svc (sin BD)
  async aggregatorHealth() {
    return this.requestAbs(this.buildUrl(AGG_BASE, `/health`));
  }
  async aggregatorOverview(id) {
    return this.requestAbs(this.buildUrl(AGG_BASE, `/wellbeing/${id}/overview`));
  }

  // analytics-svc (Athena)
  async analyticsStressTrends() {
    return this.requestAbs(this.buildUrl(ANA_BASE, `/analytics/stress-trends`));
  }
  async analyticsHealth() {
    return this.requestAbs(this.buildUrl(ANA_BASE, `/health`));
  }
}

// Instancia singleton del servicio
const apiService = new ApiService();

export default apiService;
