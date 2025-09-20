import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Activity, 
  Brain, 
  ArrowRight, 
  CheckCircle,
  TrendingUp,
  Shield,
  Calendar
} from 'lucide-react';
import apiService from '../services/api';

const HomePage = () => {
  const [systemHealth, setSystemHealth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        const health = await apiService.getHealth();
        setSystemHealth(health && health.status === 'ok');
      } catch (error) {
        console.error('Error checking system health:', error);
        setSystemHealth(false);
      } finally {
        setLoading(false);
      }
    };

    checkSystemHealth();
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'Bienestar Integral',
      description: 'Monitorea tu salud mental y física con herramientas avanzadas de seguimiento.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Brain,
      title: 'Apoyo Psicológico',
      description: 'Accede a servicios de psicología y programa citas con profesionales.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Activity,
      title: 'Actividad Física',
      description: 'Participa en eventos deportivos y mantén un estilo de vida activo.',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Conecta con otros estudiantes y forma parte de una comunidad saludable.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  const stats = [
    { label: 'Estudiantes Activos', value: '1,200+', icon: Users },
    { label: 'Citas Programadas', value: '350+', icon: Calendar },
    { label: 'Eventos Deportivos', value: '45+', icon: Activity },
    { label: 'Satisfacción', value: '98%', icon: TrendingUp }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Bienvenido a{' '}
            <span className="text-gradient">CampusWell</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Tu plataforma integral de bienestar estudiantil. Monitorea tu salud mental, 
            programa citas psicológicas, participa en actividades deportivas y mantén 
            hábitos saludables.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/student/1"
              className="btn-primary text-lg px-8 py-3"
            >
              Ver Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="btn-secondary text-lg px-8 py-3">
              Conocer más
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${systemHealth ? 'bg-green-100' : 'bg-red-100'}`}>
              {systemHealth ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Shield className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Estado del Sistema
              </h3>
              <p className="text-sm text-gray-500">
                {loading ? 'Verificando...' : systemHealth ? 'Todos los servicios funcionando correctamente' : 'Algunos servicios no están disponibles'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            systemHealth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {loading ? 'Verificando' : systemHealth ? 'Operativo' : 'Error'}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card hover:shadow-lg transition-shadow">
              <div className={`inline-flex p-3 rounded-lg ${feature.bgColor}`}>
                <Icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas del Sistema</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="inline-flex p-3 rounded-lg bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para mejorar tu bienestar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Únete a miles de estudiantes que ya están cuidando su salud mental y física.
          </p>
          <Link
            to="/student/1"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Comenzar Ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
