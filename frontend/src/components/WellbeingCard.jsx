import React from 'react';
import { Heart, Moon, Activity, Smile } from 'lucide-react';

const WellbeingCard = ({ habits }) => {
  // Calcular métricas de bienestar
  const calculateMetrics = () => {
    if (!habits || habits.length === 0) {
      return {
        avgSleep: 0,
        avgExercise: 0,
        avgMood: 0,
        totalHabits: 0
      };
    }

    const totalSleep = habits.reduce((sum, habit) => sum + (habit.sleepHours || 0), 0);
    const totalExercise = habits.reduce((sum, habit) => sum + (habit.exerciseMinutes || 0), 0);
    
    // Convertir mood a números para calcular promedio
    const moodValues = habits.map(habit => {
      const mood = habit.mood?.toLowerCase();
      switch (mood) {
        case 'excellent': return 5;
        case 'good': return 4;
        case 'neutral': return 3;
        case 'bad': return 2;
        case 'terrible': return 1;
        default: return 3;
      }
    });
    
    const totalMood = moodValues.reduce((sum, mood) => sum + mood, 0);

    return {
      avgSleep: totalSleep / habits.length,
      avgExercise: totalExercise / habits.length,
      avgMood: totalMood / habits.length,
      totalHabits: habits.length
    };
  };

  const metrics = calculateMetrics();

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

  const wellbeingItems = [
    {
      icon: Moon,
      label: 'Sueño Promedio',
      value: `${metrics.avgSleep.toFixed(1)}h`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Activity,
      label: 'Ejercicio Promedio',
      value: `${metrics.avgExercise.toFixed(0)}min`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Smile,
      label: 'Estado de Ánimo',
      value: getMoodText(metrics.avgMood),
      color: getMoodColor(metrics.avgMood).split(' ')[0],
      bgColor: getMoodColor(metrics.avgMood).split(' ')[1]
    },
    {
      icon: Heart,
      label: 'Registros Totales',
      value: metrics.totalHabits.toString(),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Heart className="mr-2 h-5 w-5 text-red-500" />
          Resumen de Bienestar
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Basado en tus últimos {metrics.totalHabits} registros
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wellbeingItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="text-center">
              <div className={`inline-flex p-3 rounded-lg ${item.bgColor}`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {metrics.totalHabits === 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            No hay registros de hábitos disponibles. 
            <span className="text-primary-600 font-medium"> ¡Comienza a registrar tus hábitos!</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default WellbeingCard;
