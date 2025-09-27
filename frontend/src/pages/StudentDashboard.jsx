import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Activity, 
  Heart, 
  TrendingUp,
  Clock,
  MapPin,
  Plus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import WellbeingCard from '../components/WellbeingCard';
import AppointmentsList from '../components/AppointmentsList';
import HabitsChart from '../components/HabitsChart';
import RecommendationsCard from '../components/RecommendationsCard';
import CreateAppointmentModal from '../components/CreateAppointmentModal';
import CreateHabitModal from '../components/CreateHabitModal';
import CreateEventModal from '../components/CreateEventModal';
import EventsList from '../components/EventsList';

const StudentDashboard = () => {
  const { studentId } = useParams();
  const [wellbeing, setWellbeing] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      
      // Intentar primero con el aggregator
      try {
        const [wellbeingData, recommendationsData] = await Promise.all([
          apiService.getWellbeingOverview(studentId),
          apiService.getRecommendations(studentId)
        ]);
        
        setWellbeing(wellbeingData);
        setRecommendations(recommendationsData);
      } catch (aggError) {
        console.warn('Aggregator no disponible, usando métodos directos:', aggError);
        
        // Si el aggregator falla, usar métodos directos
        const [studentData, appointmentsData, habitsData] = await Promise.all([
          apiService.getStudent(studentId).catch(() => null),
          apiService.getAppointmentsByStudent(studentId).catch(() => []),
          apiService.getHabitsDirect(studentId).catch(() => [])
        ]);
        
        // Construir datos de bienestar manualmente
        const wellbeingData = {
          student: studentData,
          appointments: appointmentsData || [],
          habits: habitsData || []
        };
        
        setWellbeing(wellbeingData);
        setRecommendations(null); // No hay recomendaciones sin aggregator
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    toast.success('Datos actualizados correctamente');
  };

  const handleRegisterForEvent = async (eventId) => {
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
      await loadData(); // Recargar datos para actualizar recomendaciones
    } catch (error) {
      toast.error('Error al registrarse en el evento');
      console.error('Error registering for event:', error);
    }
  };

  const handleCreateEvent = () => {
    setShowEventModal(true);
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  // Debug: Log modal states
  useEffect(() => {
    console.log('Modal states:', {
      showAppointmentModal,
      showHabitModal,
      showEventModal
    });
  }, [showAppointmentModal, showHabitModal, showEventModal]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar los datos</h3>
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

  const student = wellbeing?.student;
  const appointments = wellbeing?.appointments || [];
  const habits = wellbeing?.habits || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Bienestar
          </h1>
          <p className="text-gray-600">
            Bienvenido, {student?.name || 'Estudiante'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Student Info Card */}
      {student && (
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
              <p className="text-sm text-gray-500">{student.email}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Activity className="mr-1 h-4 w-4" />
                  {student.career}
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Cohorte {student.cohort}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wellbeing Overview */}
          <WellbeingCard habits={habits} />

          {/* Habits Chart */}
          {habits.length > 0 && (
            <HabitsChart habits={habits} />
          )}

          {/* Appointments */}
          <AppointmentsList appointments={appointments} />

          {/* Events */}
          <EventsList 
            studentId={studentId}
            onCreateEvent={handleCreateEvent}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Recommendations */}
          {recommendations && (
            <RecommendationsCard 
              recommendations={recommendations}
              onRegisterForEvent={handleRegisterForEvent}
            />
          )}

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  console.log('Clicking appointment button');
                  setShowAppointmentModal(true);
                }}
                type="button"
              >
                <Plus className="mr-2 h-4 w-4 inline" />
                Nueva Cita
              </button>
              <button 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  console.log('Clicking habit button');
                  setShowHabitModal(true);
                }}
                type="button"
              >
                <Activity className="mr-2 h-4 w-4 inline" />
                Registrar Hábito
              </button>
              <button 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  console.log('Clicking event button');
                  setShowEventModal(true);
                }}
                type="button"
              >
                <Calendar className="mr-2 h-4 w-4 inline" />
                Crear Evento
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Servicios</span>
                <span className="badge-success">Operativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última actualización</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(), 'HH:mm', { locale: es })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <EventsList 
        studentId={studentId}
        onCreateEvent={handleCreateEvent}
      />

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
          <div>Modals: A:{showAppointmentModal ? '1' : '0'} H:{showHabitModal ? '1' : '0'} E:{showEventModal ? '1' : '0'}</div>
          <button 
            onClick={() => setShowAppointmentModal(true)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs mt-1"
          >
            Test Modal
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => {
          console.log('Closing appointment modal');
          setShowAppointmentModal(false);
        }}
        studentId={studentId}
        onSuccess={() => {
          loadData();
          toast.success('Cita creada exitosamente');
        }}
      />
      
      <CreateHabitModal
        isOpen={showHabitModal}
        onClose={() => {
          console.log('Closing habit modal');
          setShowHabitModal(false);
        }}
        studentId={studentId}
        onSuccess={() => {
          loadData();
          toast.success('Hábito registrado exitosamente');
        }}
      />
      
      <CreateEventModal
        isOpen={showEventModal}
        onClose={() => {
          console.log('Closing event modal');
          setShowEventModal(false);
        }}
        onSuccess={() => {
          loadData();
          toast.success('Evento creado exitosamente');
        }}
      />
    </div>
  );
};

export default StudentDashboard;
