// CampusWell Frontend - Configuración de Microservicios
// Este archivo contiene las URLs de los microservicios

const config = {
  // MS4 - Aggregator Service (puerto 8080)
  AGGREGATOR_URL: process.env.REACT_APP_AGGREGATOR_URL || 'http://localhost:8080',
  
  // MS1 - Psychology Service (puerto 8081)
  PSYCH_URL: process.env.REACT_APP_PSYCH_URL || 'http://localhost:8081',
  
  // MS2 - Sports Service (puerto 8082)
  SPORTS_URL: process.env.REACT_APP_SPORTS_URL || 'http://localhost:8082',
  
  // MS3 - Habits Service (puerto 8083)
  HABITS_URL: process.env.REACT_APP_HABITS_URL || 'http://localhost:8083',
  
  // MS5 - Analytics Service (puerto 8084)
  ANALYTICS_URL: process.env.REACT_APP_ANALYTICS_URL || 'http://localhost:8084',
  
  // Configuración adicional
  APP_NAME: process.env.REACT_APP_APP_NAME || 'CampusWell',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0'
};

export default config;