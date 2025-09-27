import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import config from '../config.js';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [healthStatus, setHealthStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAdminData = async () => {
    try {
      setError(null);
      
      // Cargar datos de todos los microservicios
      const [stressTrends, aggHealth, psyHealth, spoHealth, habHealth, anaHealth] = await Promise.all([
        apiService.analyticsStressTrends().catch(() => null),
        apiService.aggregatorHealth().catch(() => null),
        apiService.psychHealth().catch(() => null),
        apiService.sportsHealth().catch(() => null),
        apiService.habitsHealth().catch(() => null),
        apiService.analyticsHealth().catch(() => null)
      ]);

      setAnalytics(stressTrends);
      setHealthStatus({
        aggregator: aggHealth,
        psych: psyHealth,
        sports: spoHealth,
        habits: habHealth,
        analytics: anaHealth
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Error al cargar los datos administrativos');
      toast.error('Error al cargar los datos administrativos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadAdminData();
    toast.success('Datos administrativos actualizados');
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Procesar datos para gráficos
  const processAdminData = () => {
    if (!analytics?.data) return [];
    
    return analytics.data.map(item => ({
      semana: `S${item.semana}`,
      confirmadas: item.confirmadas,
      tendencia: item.confirmadas > 50 ? 'Alta demanda' : item.confirmadas > 25 ? 'Demanda media' : 'Baja demanda'
    }));
  };

  const chartData = processAdminData();

  const getHealthStatus = (service) => {
    const status = healthStatus[service];
    if (!status) return { status: 'unknown', color: 'gray', text: 'Desconocido' };
    
    if (status.status === 'UP' || status.status === 'ok') {
      return { status: 'healthy', color: 'green', text: 'Saludable' };
    } else {
      return { status: 'unhealthy', color: 'red', text: 'Con problemas' };
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} citas
            </p>
          ))}
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
          <p className="mt-4 text-sm text-gray-600">Cargando dashboard administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-3 h-6 w-6 text-purple-500" />
              Dashboard Administrativo
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Panel de control para el equipo de Bienestar Estudiantil
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-primary"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estado de Microservicios */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Estado de los Microservicios</h3>
          <p className="text-sm text-gray-600">Monitoreo en tiempo real</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { key: 'aggregator', name: 'Aggregator', port: '8080', docs: '/docs' },
              { key: 'psych', name: 'Psychology', port: '8081', docs: '/swagger-ui.html' },
              { key: 'sports', name: 'Sports', port: '8082', docs: '/docs' },
              { key: 'habits', name: 'Habits', port: '8083', docs: '/swagger-ui.html' },
              { key: 'analytics', name: 'Analytics', port: '8084', docs: '/docs' }
            ].map((service) => {
              const health = getHealthStatus(service.key);
              return (
                <div key={service.key} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${
                      health.color === 'green' ? 'bg-green-500' : 
                      health.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Puerto: {service.port}</p>
                  <p className={`text-xs font-medium ${
                    health.color === 'green' ? 'text-green-600' : 
                    health.color === 'red' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {health.text}
                  </p>
                  <a
                    href={`http://localhost:${service.port}${service.docs}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Swagger
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-xs text-green-600">+12% este mes</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Citas Programadas</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-xs text-blue-600">Esta semana</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Nivel de Estrés</p>
              <p className="text-2xl font-bold text-gray-900">Medio</p>
              <p className="text-xs text-yellow-600">Requiere atención</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Eventos Activos</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-xs text-green-600">En curso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de tendencias */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tendencias de demanda psicológica */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Demanda de Servicios Psicológicos</h3>
            <p className="text-sm text-gray-600">Citas confirmadas por semana</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="semana" 
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
                  dataKey="confirmadas" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                  name="Citas Confirmadas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de servicios */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Distribución de Servicios</h3>
            <p className="text-sm text-gray-600">Uso por tipo de servicio</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Psicología', value: 45, color: '#ef4444' },
                { name: 'Deportes', value: 30, color: '#22c55e' },
                { name: 'Hábitos', value: 25, color: '#3b82f6' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alertas y recomendaciones */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Alertas y Recomendaciones</h3>
          <p className="text-sm text-gray-600">Acciones sugeridas para el equipo</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Alta demanda psicológica</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Las citas psicológicas han aumentado un 23% esta semana. Considera ampliar el horario de atención.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Sistema funcionando correctamente</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Todos los microservicios están operativos. La infraestructura está estable.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Participación en eventos</h4>
                <p className="text-sm text-green-700 mt-1">
                  La participación en eventos deportivos ha mejorado un 15%. Continúa con las campañas actuales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
