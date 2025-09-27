import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const EventsList = ({ studentId, onCreateEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Intentar primero con el aggregator
      try {
        const eventsData = await apiService.getEvents(filter === 'all' ? null : filter);
        setEvents(eventsData);
      } catch (aggError) {
        console.warn('Aggregator no disponible, usando método directo:', aggError);
        // Si el aggregator falla, usar método directo
        const eventsData = await apiService.sportsListEvents(filter === 'all' ? null : filter);
        setEvents(eventsData);
      }
    } catch (error) {
      toast.error('Error al cargar eventos');
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      // Intentar primero con el aggregator
      try {
        await apiService.registerForEvent(studentId, eventId);
        toast.success('Te has registrado exitosamente en el evento');
      } catch (aggError) {
        console.warn('Aggregator no disponible, usando método directo:', aggError);
        // Si el aggregator falla, usar método directo
        await apiService.sportsRegisterForEvent(studentId, eventId);
        toast.success('Te has registrado exitosamente en el evento');
      }
      loadEvents(); // Recargar eventos
    } catch (error) {
      toast.error('Error al registrarse en el evento');
      console.error('Error registering for event:', error);
    }
  };

  const getEventTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'sport':
        return 'badge-success';
      case 'wellness':
        return 'badge-info';
      case 'social':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  const getEventTypeText = (type) => {
    switch (type?.toLowerCase()) {
      case 'sport':
        return 'Deportivo';
      case 'wellness':
        return 'Bienestar';
      case 'social':
        return 'Social';
      default:
        return type;
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'sport':
        return '🏃';
      case 'wellness':
        return '🧘';
      case 'social':
        return '👥';
      default:
        return '📅';
    }
  };

  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'sport', label: 'Deportivos' },
    { value: 'wellness', label: 'Bienestar' },
    { value: 'social', label: 'Sociales' }
  ];

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Eventos Disponibles
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {events.length} evento{events.length !== 1 ? 's' : ''} disponible{events.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button 
            className="btn-primary"
            onClick={onCreateEvent}
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Evento
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          <div className="flex space-x-2">
            {filters.map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  filter === filterOption.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay eventos disponibles</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'No hay eventos programados en este momento.'
              : `No hay eventos de tipo "${getEventTypeText(filter)}" disponibles.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id || event.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">
                    {getEventTypeIcon(event.type)}
                  </span>
                  <span className={getEventTypeColor(event.type)}>
                    {getEventTypeText(event.type)}
                  </span>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">
                {event.name}
              </h4>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {format(parseISO(event.date), 'dd MMM yyyy, HH:mm', { locale: es })}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => handleRegister(event.id)}
                  className="w-full btn-primary text-sm"
                >
                  Participar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
