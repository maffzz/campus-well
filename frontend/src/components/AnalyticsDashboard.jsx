import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  Activity,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Smile,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import config from '../config.js';

const AnalyticsDashboard = () => {
  const [stressTrends, setStressTrends] = useState([]);
  const [moodStats, setMoodStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    let wasSuccessful = false;

    try {
      setError(null);
      const [stressResponse, moodResponse] = await Promise.all([
        apiService.analyticsStressTrends(),
        apiService.analyticsAgeRange(),
      ]);

      setStressTrends(stressResponse?.rows || []);
      setMoodStats(moodResponse?.rows || []);
      wasSuccessful = true;
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Error al cargar los datos de análisis');
      toast.error('Error al cargar los datos de análisis');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    return wasSuccessful;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const wasSuccessful = await loadAnalytics({ silent: true });
    if (wasSuccessful) {
      toast.success('Datos de análisis actualizados');
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatNumber = (value, digits = 0) => {
    if (!Number.isFinite(value)) return '--';
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const stressChartData = useMemo(() => {
    if (!Array.isArray(stressTrends)) return [];

    return stressTrends.map((row, index) => {
      if (Array.isArray(row)) {
        const [weekStartRaw, confirmedRaw] = row;
        const date = weekStartRaw ? new Date(`${weekStartRaw}T00:00:00Z`) : null;
        const hasValidDate = date && !Number.isNaN(date.getTime());

        return {
          weekStart: weekStartRaw,
          weekLabel: hasValidDate
            ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            : `Semana ${index + 1}`,
          confirmed: Number(confirmedRaw) || 0,
        };
      }

      const { week_start, confirmed } = row || {};
      const date = week_start ? new Date(`${week_start}T00:00:00Z`) : null;
      const hasValidDate = date && !Number.isNaN(date.getTime());

      return {
        weekStart: week_start,
        weekLabel: hasValidDate
          ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
          : `Semana ${index + 1}`,
        confirmed: Number(confirmed) || 0,
      };
    });
  }, [stressTrends]);

  const moodChartData = useMemo(() => {
    if (!Array.isArray(moodStats)) return [];

    return moodStats.map((row) => {
      if (Array.isArray(row)) {
        const [mood, totalRecords, avgSleep, avgExercise] = row;
        return {
          mood: mood || 'Sin dato',
          totalRecords: Number(totalRecords) || 0,
          avgSleep: Number(avgSleep) || 0,
          avgExercise: Number(avgExercise) || 0,
        };
      }

      const { mood, total_registros, avg_sleep, avg_exercise } = row || {};
      return {
        mood: mood || 'Sin dato',
        totalRecords: Number(total_registros) || 0,
        avgSleep: Number(avg_sleep) || 0,
        avgExercise: Number(avg_exercise) || 0,
      };
    });
  }, [moodStats]);

  const totalConfirmed = useMemo(
    () => stressChartData.reduce((sum, item) => sum + item.confirmed, 0),
    [stressChartData]
  );

  const totalMoodRecords = useMemo(
    () => moodChartData.reduce((sum, item) => sum + item.totalRecords, 0),
    [moodChartData]
  );

  const avgSleepGlobal = useMemo(() => {
    if (!totalMoodRecords) return 0;
    const total = moodChartData.reduce(
      (sum, item) => sum + item.avgSleep * item.totalRecords,
      0
    );
    return total / totalMoodRecords;
  }, [moodChartData, totalMoodRecords]);

  const avgExerciseGlobal = useMemo(() => {
    if (!totalMoodRecords) return 0;
    const total = moodChartData.reduce(
      (sum, item) => sum + item.avgExercise * item.totalRecords,
      0
    );
    return total / totalMoodRecords;
  }, [moodChartData, totalMoodRecords]);

  const dominantMood = useMemo(() => {
    if (!moodChartData.length) return null;
    return moodChartData.reduce((top, item) =>
      item.totalRecords > top.totalRecords ? item : top
    );
  }, [moodChartData]);

  const StressTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const [{ value, payload: point }] = payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{point.weekLabel}</p>
          <p className="text-sm text-blue-600">
            Citas confirmadas: {formatNumber(value)}
          </p>
          {point.weekStart && (
            <p className="text-xs text-gray-500">
              Semana iniciada el {point.weekStart}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const MoodTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const [{ payload: point }] = payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{point.mood}</p>
          <p className="text-sm text-green-600">
            Registros: {formatNumber(point.totalRecords)}
          </p>
          <p className="text-sm text-gray-600">
            Sueño: {formatNumber(point.avgSleep, 1)} h
          </p>
          <p className="text-sm text-gray-600">
            Ejercicio: {formatNumber(point.avgExercise, 1)} min
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Cargando análisis de tendencias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar datos</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button onClick={handleRefresh} className="mt-4 btn-primary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-3 h-6 w-6 text-blue-500" />
              Dashboard de Análisis
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Seguimiento de tendencias de estrés y hábitos por estado de ánimo
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <a
              href={`${config.ANALYTICS_URL}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Swagger API
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Semanas analizadas</p>
              <p className="text-2xl font-bold text-gray-900">{stressChartData.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Citas confirmadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(totalConfirmed)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Estados de ánimo monitoreados</p>
              <p className="text-2xl font-bold text-gray-900">{moodChartData.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatNumber(totalMoodRecords)} registros totales
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Smile className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Estado de ánimo dominante</p>
              <p className="text-2xl font-bold text-gray-900">
                {dominantMood ? dominantMood.mood : '--'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dominantMood
                  ? `${formatNumber(dominantMood.totalRecords)} registros`
                  : 'Sin datos suficientes'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Tendencias semanales</h3>
            <p className="text-sm text-gray-600">Citas psicológicas confirmadas por semana</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stressChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="weekLabel" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<StressTooltip />} />
                <Line
                  type="monotone"
                  dataKey="confirmed"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  name="Citas Confirmadas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Estado de ánimo y hábitos</h3>
            <p className="text-sm text-gray-600">Distribución de registros y promedios de bienestar</p>
          </div>
          <div className="p-6 space-y-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mood" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<MoodTooltip />} />
                <Bar
                  dataKey="totalRecords"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Registros"
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Horas de sueño promedio</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(avgSleepGlobal, 1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Promedio ponderado por registros</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Minutos de ejercicio promedio</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(avgExerciseGlobal, 1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Promedio ponderado por registros</p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Estado de ánimo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Registros
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sueño (hrs)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ejercicio (min)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {moodChartData.map((item) => (
                    <tr key={item.mood}>
                      <td className="px-6 py-3 text-sm text-gray-900">{item.mood}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {formatNumber(item.totalRecords)}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {formatNumber(item.avgSleep, 1)}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {formatNumber(item.avgExercise, 1)}
                      </td>
                    </tr>
                  ))}
                  {!moodChartData.length && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-sm text-gray-500 text-center"
                      >
                        Sin datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Información de la fuente</h3>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Datos en tiempo real</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Los datos provienen del microservicio de Analytics (MS5) con consultas en
                  Athena y S3, integrando confirmaciones psicológicas y hábitos registrados
                  según el estado de ánimo.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-blue-600">
                  <span>📈 Tendencias: Confirmaciones semanales</span>
                  <span>🧠 Hábitos: Sueño y ejercicio por estado de ánimo</span>
                  <span>🔄 Actualización: Automática</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
