import React from 'react';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const AppointmentsList = ({ appointments }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          Citas Psicológicas
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {appointments.length} cita{appointments.length !== 1 ? 's' : ''} programada{appointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Programa tu primera cita con un psicólogo.
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Programar Cita
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id || appointment.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.psychologist}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    {format(parseISO(appointment.date), 'dd MMM yyyy, HH:mm', { locale: es })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={getStatusColor(appointment.status)}>
                  {getStatusText(appointment.status)}
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full btn-secondary">
              <Plus className="mr-2 h-4 w-4" />
              Programar Nueva Cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
