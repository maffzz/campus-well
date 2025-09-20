import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ size = 'large', text = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
      <p className="mt-4 text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
