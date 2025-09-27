import React from 'react';
import { Lightbulb, Calendar, MapPin, Clock, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const RecommendationsCard = ({ recommendations, onRegisterForEvent }) => {
  if (!recommendations) {
    return (
      <div className="card">
        <div className="text-center py-6">
          <Lightbulb className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Cargando recomendaciones...</h3>
        </div>
      </div>
    );
  }

  const { avg_mood, suggested_event } = recommendations;

  const getMoodColor = (mood) => {
    if (mood >= 4.5) return 'text-green-600 bg-green-100';
    if (mood >= 3.5) return 'text-blue-600 bg-blue-100';
    if (mood >= 2.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMoodText = (mood) => {
    if (mood >= 4.5) return 'Excelente';
    if (mood >= 3.5) return 'Bueno';
    if (mood >= 2.5) return 'Neutral';
    return 'Necesita atención';
  };

  const getMoodStars = (mood) => {
    const stars = Math.round(mood);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          Recomendaciones
        </h3>
      </div>

      <div className="space-y-6">
        {/* Estado de Ánimo */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tu Estado de Ánimo</h4>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-2xl font-bold text-gray-900">{avg_mood.toFixed(1)}/5.0</p>
              <p className="text-sm text-gray-600">{getMoodText(avg_mood)}</p>
            </div>
            <div className="flex space-x-1">
              {getMoodStars(avg_mood)}
            </div>
          </div>
        </div>

        {/* Evento Sugerido */}
        {suggested_event ? (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Evento Recomendado</h4>
            <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    {suggested_event.name}
                  </h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(parseISO(suggested_event.date), 'dd MMMM yyyy, HH:mm', { locale: es })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {suggested_event.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {suggested_event.type === 'sport' ? 'Deportivo' : 
                       suggested_event.type === 'wellness' ? 'Bienestar' : 
                       suggested_event.type === 'social' ? 'Social' : suggested_event.type}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="badge-info">
                    {suggested_event.type === 'sport' ? 'Deportivo' : 
                     suggested_event.type === 'wellness' ? 'Bienestar' : 
                     suggested_event.type === 'social' ? 'Social' : suggested_event.type}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  className="w-full btn-primary"
                  onClick={() => onRegisterForEvent && onRegisterForEvent(suggested_event.id)}
                >
                  Participar en el Evento
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Calendar className="mx-auto h-8 w-8 text-gray-400" />
            <h4 className="mt-2 text-sm font-medium text-gray-900">No hay eventos disponibles</h4>
            <p className="mt-1 text-sm text-gray-500">
              Revisa más tarde para nuevas actividades.
            </p>
          </div>
        )}

        {/* Consejos Generales */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Consejos de Bienestar</h4>
          <div className="space-y-3">
            {avg_mood < 3 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Consejo:</strong> Considera programar una cita con un psicólogo para hablar sobre tu bienestar.
                </p>
              </div>
            )}
            
            {suggested_event && suggested_event.type === 'sport' && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  🏃 <strong>Actividad:</strong> La actividad física regular puede mejorar tu estado de ánimo y energía.
                </p>
              </div>
            )}
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                🌙 <strong>Recuerda:</strong> Mantén un horario de sueño regular para un mejor bienestar general.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsCard;
