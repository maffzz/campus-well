import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingUp, Activity, Moon } from 'lucide-react';

const HabitsChart = ({ habits }) => {
  // Procesar datos para los gráficos
  const processChartData = () => {
    if (!habits || habits.length === 0) return [];

    return habits
      .map(habit => ({
        date: format(parseISO(habit.date), 'dd/MM', { locale: es }),
        fullDate: habit.date,
        sleepHours: habit.sleepHours || 0,
        exerciseMinutes: habit.exerciseMinutes || 0,
        mood: habit.mood || 'neutral'
      }))
      .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
      .slice(-7); // Últimos 7 registros
  };

  const chartData = processChartData();

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

  const moodData = chartData.map(item => ({
    ...item,
    moodValue: getMoodValue(item.mood)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'sleepHours' ? 'h' : entry.dataKey === 'exerciseMinutes' ? 'min' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos suficientes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Registra más hábitos para ver las tendencias.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
          Tendencias de Hábitos
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Últimos {chartData.length} registros
        </p>
      </div>

      <div className="space-y-6">
        {/* Gráfico de Sueño y Ejercicio */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Sueño y Ejercicio</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="sleepHours" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Horas de Sueño"
              />
              <Line 
                type="monotone" 
                dataKey="exerciseMinutes" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                name="Minutos de Ejercicio"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Estado de Ánimo */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Estado de Ánimo</h4>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 5]}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const mood = payload[0].payload.mood;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">Estado: {mood}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="moodValue" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen de métricas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Moon className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Sueño Promedio</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {(chartData.reduce((sum, item) => sum + item.sleepHours, 0) / chartData.length).toFixed(1)}h
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Ejercicio Promedio</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {Math.round(chartData.reduce((sum, item) => sum + item.exerciseMinutes, 0) / chartData.length)}min
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Ánimo Promedio</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-purple-600">
              {(moodData.reduce((sum, item) => sum + item.moodValue, 0) / moodData.length).toFixed(1)}/5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsChart;
