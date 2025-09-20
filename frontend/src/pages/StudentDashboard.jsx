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
      const [wellbeingData, recommendationsData] = await Promise.all([
        apiService.getWellbeingOverview(studentId),
        apiService.getRecommendations(studentId)
      ]);
      
      setWellbeing(wellbeingData);
      setRecommendations(recommendationsData);
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

  useEffect(() => {
    loadData();
  }, [studentId]);

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
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Recommendations */}
          {recommendations && (
            <RecommendationsCard recommendations={recommendations} />
          )}

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button 
                className="w-full btn-primary"
                onClick={() => setShowAppointmentModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cita
              </button>
              <button 
                className="w-full btn-secondary"
                onClick={() => setShowHabitModal(true)}
              >
                <Activity className="mr-2 h-4 w-4" />
                Registrar Hábito
              </button>
              <button 
                className="w-full btn-secondary"
                onClick={() => setShowEventModal(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
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
      <EventsList studentId={studentId} />

      {/* Modals */}
      <CreateAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        studentId={studentId}
      />
      
      <CreateHabitModal
        isOpen={showHabitModal}
        onClose={() => setShowHabitModal(false)}
        studentId={studentId}
      />
      
      <CreateEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
};

export default StudentDashboard;
