import React, { useState } from 'react';
import { Moon, Dumbbell, Heart } from 'lucide-react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const CreateHabitModal = ({ isOpen, onClose, studentId, onSuccess }) => {
  const [formData, setFormData] = useState({
    sleepHours: '',
    exerciseMinutes: '',
    mood: 'neutral'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const habitData = {
        studentId: parseInt(studentId),
        sleepHours: parseInt(formData.sleepHours),
        exerciseMinutes: parseInt(formData.exerciseMinutes),
        mood: formData.mood
      };

      // Intentar primero con el aggregator
      try {
        await apiService.createHabit(habitData);
      } catch (aggError) {
        console.warn('Aggregator no disponible, usando método directo:', aggError);
        // Si el aggregator falla, usar método directo
        await apiService.createHabitDirect(habitData);
      }
      onClose();
      if (onSuccess) onSuccess();
      
      // Reset form
      setFormData({
        sleepHours: '',
        exerciseMinutes: '',
        mood: 'neutral'
      });
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Error al registrar el hábito. Inténtalo de nuevo.');
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
              <Heart className="h-5 w-5 mr-2 text-secondary-500" />
              Registrar Hábito
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
                <Moon className="h-4 w-4 inline mr-1" />
                Horas de Sueño
              </label>
              <input
                type="number"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleChange}
                className="input"
                placeholder="8"
                min="0"
                max="24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Dumbbell className="h-4 w-4 inline mr-1" />
                Minutos de Ejercicio
              </label>
              <input
                type="number"
                name="exerciseMinutes"
                value={formData.exerciseMinutes}
                onChange={handleChange}
                className="input"
                placeholder="30"
                min="0"
                max="480"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Heart className="h-4 w-4 inline mr-1" />
                Estado de Ánimo
              </label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="terrible">Terrible</option>
                <option value="bad">Mal</option>
                <option value="neutral">Neutral</option>
                <option value="good">Bien</option>
                <option value="excellent">Excelente</option>
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
                {loading ? 'Registrando...' : 'Registrar Hábito'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHabitModal;
