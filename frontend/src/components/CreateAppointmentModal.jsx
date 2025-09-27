import React, { useState } from 'react';
import { Calendar, User, Clock } from 'lucide-react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const CreateAppointmentModal = ({ isOpen, onClose, studentId, onSuccess }) => {
  const [formData, setFormData] = useState({
    psychologist: '',
    date: '',
    time: '',
    status: 'PENDING'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        studentId: parseInt(studentId),
        psychologist: formData.psychologist,
        date: `${formData.date}T${formData.time}:00Z`,
        status: formData.status
      };

      // Intentar primero con el aggregator
      try {
        await apiService.createAppointment(appointmentData);
      } catch (aggError) {
        console.warn('Aggregator no disponible, usando método directo:', aggError);
        // Si el aggregator falla, usar método directo
        await apiService.createAppointmentDirect(appointmentData);
      }
      onClose();
      if (onSuccess) onSuccess();
      
      // Reset form
      setFormData({
        psychologist: '',
        date: '',
        time: '',
        status: 'PENDING'
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Error al crear la cita. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`fixed inset-0 z-[9999] overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-500" />
              Nueva Cita Psicológica
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 inline mr-1" />
                Psicólogo
              </label>
              <input
                type="text"
                name="psychologist"
                value={formData.psychologist}
                onChange={handleChange}
                className="input"
                placeholder="Nombre del psicólogo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="h-4 w-4 inline mr-1" />
                Hora
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;
