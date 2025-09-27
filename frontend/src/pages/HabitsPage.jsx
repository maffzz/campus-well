import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Heart, 
  Moon, 
  Dumbbell, 
  TrendingUp, 
  Plus,
  RefreshCw,
  AlertCircle,
  Activity
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateHabitModal from '../components/CreateHabitModal';
import HabitsChart from '../components/HabitsChart';
import config from '../config.js';

const HabitsPage = () => {
  const { studentId } = useParams();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadHabits = async () => {
    try {
      setError(null);
      const habitsData = await apiService.habitsList(studentId);
      setHabits(habitsData || []);
    } catch (err) {
      console.error('Error loading habits:', err);
      setError('Error al cargar los hábitos');
      toast.error('Error al cargar los hábitos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    toast.success('Hábitos actualizados correctamente');
  };

  useEffect(() => {
    loadHabits();
  }, [studentId]);

  const getMoodValue = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'excellent': return 5;
      case 'good': return 4;
      case 'neutral': return 3;
      case 'bad': return 2;
      case 'terrible': return 1;
      default: return 3;
    }
  };

  const getMoodText = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'neutral': return 'Neutral';
      case 'bad': return 'Mal';
      case 'terrible': return 'Terrible';
      default: return mood;
    }
  };

  const getMoodColor = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'neutral': return 'text-yellow-600 bg-yellow-100';
      case 'bad': return 'text-orange-600 bg-orange-100';
      case 'terrible': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Calcular promedios
  const avgSleep = habits.length > 0 
    ? (habits.reduce((sum, habit) => sum + (habit.sleepHours || 0), 0) / habits.length).toFixed(1)
    : 0;

  const avgExercise = habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + (habit.exerciseMinutes || 0), 0) / habits.length)
    : 0;

  const avgMood = habits.length > 0 
    ? (habits.reduce((sum, habit) => sum + getMoodValue(habit.mood), 0) / habits.length).toFixed(1)
    : 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar los hábitos</h3>
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
            <Heart className="mr-3 h-8 w-8 text-pink-500" />
            Seguimiento de Hábitos
          </h1>
          <p className="text-gray-600">
            Registra y monitorea tus hábitos de bienestar diarios
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
            onClick={() => setShowHabitModal(true)}
            className="btn-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Hábito
          </button>
          <a
            href={`${config.HABITS_URL}/swagger-ui.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Activity className="mr-2 h-4 w-4" />
            API Docs
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Moon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sueño Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgSleep}h</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Dumbbell className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ejercicio Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgExercise}min</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ánimo Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{avgMood}/5</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {habits.length > 0 && (
        <HabitsChart habits={habits} />
      )}

      {/* Recent Habits */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Registros Recientes</h3>
          <p className="text-sm text-gray-600">
            {habits.length} registro{habits.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay hábitos registrados</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza registrando tu primer hábito de bienestar.
            </p>
            <button
              onClick={() => setShowHabitModal(true)}
              className="mt-4 btn-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Registrar Hábito
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((habit) => (
                <div
                  key={habit._id || habit.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        {format(parseISO(habit.date), 'dd MMM yyyy', { locale: es })}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Moon className="mr-1 h-4 w-4 text-blue-500" />
                          {habit.sleepHours || 0}h sueño
                        </span>
                        <span className="flex items-center">
                          <Dumbbell className="mr-1 h-4 w-4 text-green-500" />
                          {habit.exerciseMinutes || 0}min ejercicio
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMoodColor(habit.mood)}`}>
                        {getMoodText(habit.mood)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateHabitModal
        isOpen={showHabitModal}
        onClose={() => setShowHabitModal(false)}
        studentId={studentId}
        onSuccess={() => {
          loadHabits();
          toast.success('Hábito registrado exitosamente');
        }}
      />
    </div>
  );
};

export default HabitsPage;
