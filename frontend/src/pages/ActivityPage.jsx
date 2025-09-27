import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  Filter,
  RefreshCw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateEventModal from '../components/CreateEventModal';
import config from '../config.js';

const ActivityPage = () => {
  const { studentId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      setError(null);
      
      // Intentar primero con el aggregator
      try {
        const eventsData = await apiService.getEvents(filter === 'all' ? null : filter);
        setEvents(eventsData || []);
      } catch (aggError) {
        console.warn('Aggregator no disponible, usando método directo:', aggError);
        // Si el aggregator falla, usar método directo
        const eventsData = await apiService.sportsListEvents(filter === 'all' ? null : filter);
        setEvents(eventsData || []);
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Error al cargar los eventos');
      toast.error('Error al cargar los eventos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    toast.success('Eventos actualizados correctamente');
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

  useEffect(() => {
    loadEvents();
  }, [filter]);

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
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar los eventos</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <button
            onClick={handleRefresh}
            className="btn-primary"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-3 h-8 w-8 text-green-500" />
            Actividades y Deportes
          </h1>
          <p className="text-gray-600">
            Participa en eventos deportivos, de bienestar y sociales
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={() => setShowEventModal(true)}
            className="btn-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Evento
          </button>
          <a
            href={`${config.SPORTS_URL}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            API Docs
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
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

      {/* Events Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Eventos Disponibles</h3>
          <p className="text-sm text-gray-600">
            {events.length} evento{events.length !== 1 ? 's' : ''} disponible{events.length !== 1 ? 's' : ''}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay eventos disponibles</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'No hay eventos programados en este momento.'
                : `No hay eventos de tipo "${filters.find(f => f.value === filter)?.label}" disponibles.`
              }
            </p>
            <button
              onClick={() => setShowEventModal(true)}
              className="mt-4 btn-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Evento
            </button>
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
                    <span className={`badge ${getEventTypeColor(event.type)}`}>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Eventos</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Deportivos</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.type === 'sport').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sociales</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.type === 'social').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bienestar</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.type === 'wellness').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSuccess={() => {
          loadEvents();
          toast.success('Evento creado exitosamente');
        }}
      />
    </div>
  );
};

export default ActivityPage;
