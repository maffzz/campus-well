import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

/**
 * Componente principal del dashboard del estudiante
 * Muestra la información consolidada del bienestar estudiantil
 */
function StudentDashboard({ studentId }) {
  const [wellbeing, setWellbeing] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar datos en paralelo
        const [wellbeingData, recData] = await Promise.all([
          apiService.getWellbeingOverview(studentId),
          apiService.getRecommendations(studentId)
        ]);

        setWellbeing(wellbeingData);
        setRecommendations(recData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos del estudiante');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      loadData();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando información del estudiante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!wellbeing) {
    return (
      <div className="no-data">
        <h3>📭 Sin datos</h3>
        <p>No se encontró información para el estudiante {studentId}</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>🏫 CampusWell - Bienestar Estudiantil</h1>
        <h2>👤 {wellbeing.student.name}</h2>
        <p className="student-info">
          📧 {wellbeing.student.email} | 
          🎓 {wellbeing.student.career} | 
          📅 Cohorte {wellbeing.student.cohort}
        </p>
      </header>

      <div className="dashboard-content">
        {/* Información de Hábitos */}
        <section className="habits-section">
          <h3>📊 Hábitos Recientes</h3>
          {wellbeing.habits && wellbeing.habits.length > 0 ? (
            <div className="habits-list">
              {wellbeing.habits.slice(0, 5).map((habit, index) => (
                <div key={index} className="habit-card">
                  <div className="habit-date">
                    {new Date(habit.date).toLocaleDateString()}
                  </div>
                  <div className="habit-details">
                    <span>😴 {habit.sleepHours}h sueño</span>
                    <span>🏃 {habit.exerciseMinutes}min ejercicio</span>
                    <span className={`mood mood-${habit.mood}`}>
                      {getMoodEmoji(habit.mood)} {habit.mood}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay hábitos registrados</p>
          )}
        </section>

        {/* Citas Psicológicas */}
        <section className="appointments-section">
          <h3>🧠 Citas Psicológicas</h3>
          {wellbeing.appointments && wellbeing.appointments.length > 0 ? (
            <div className="appointments-list">
              {wellbeing.appointments.map((appointment, index) => (
                <div key={index} className="appointment-card">
                  <div className="appointment-info">
                    <strong>👨‍⚕️ {appointment.psychologist}</strong>
                    <span className={`status status-${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="appointment-date">
                    📅 {new Date(appointment.date).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay citas programadas</p>
          )}
        </section>

        {/* Recomendaciones */}
        {recommendations && (
          <section className="recommendations-section">
            <h3>💡 Recomendaciones</h3>
            <div className="recommendation-card">
              <div className="mood-score">
                <h4>Estado de Ánimo Promedio</h4>
                <div className="score">
                  {recommendations.avg_mood.toFixed(1)}/5.0
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${(recommendations.avg_mood / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {recommendations.suggested_event && (
                <div className="suggested-event">
                  <h4>🎯 Evento Recomendado</h4>
                  <div className="event-card">
                    <h5>{recommendations.suggested_event.name}</h5>
                    <p>📅 {new Date(recommendations.suggested_event.date).toLocaleString()}</p>
                    <p>📍 {recommendations.suggested_event.location}</p>
                    <span className="event-type">
                      {recommendations.suggested_event.type}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Obtiene el emoji correspondiente al estado de ánimo
 * @param {string} mood - Estado de ánimo
 * @returns {string} - Emoji
 */
function getMoodEmoji(mood) {
  const moodEmojis = {
    'excellent': '😄',
    'good': '😊',
    'neutral': '😐',
    'bad': '😔',
    'terrible': '😢'
  };
  return moodEmojis[mood] || '😐';
}

export default StudentDashboard;
