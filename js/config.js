/**
 * GOBERNACIÓN DE ANTIOQUIA - CENTRO DE CONTROL TERRITORIAL
 * Global Configuration & Geospatial Constants
 */

export const APP_CONFIG = {
  TITLE: 'Centro de Control Territorial - Red Vial Secundaria',
  SUBTITLE: 'Gobernación de Antioquia - Seguimiento a la Estabilización',
  VERSION: '1.0.0',
  
  // Geographic bounds and center for Antioquia
  ANTIOQUIA_CENTER: [7.0, -75.5],
  DEFAULT_ZOOM: 8,
  MIN_ZOOM: 7,
  MAX_ZOOM: 16,
  
  // Bounds for Antioquia [[minLat, minLon], [maxLat, maxLon]]
  ANTIOQUIA_BOUNDS: [
    [5.40, -77.20],
    [8.90, -73.80]
  ],
  
  // Subregions metadata and theme colors
  SUBREGIONS: {
    'Norte': { color: '#1E7E34', code: 'NOR', center: [6.85, -75.45], zoom: 9 },
    'Urabá': { color: '#00838F', code: 'URA', center: [7.90, -76.60], zoom: 9 },
    'Oriente': { color: '#2E7D32', code: 'ORI', center: [6.05, -75.20], zoom: 9 },
    'Occidente': { color: '#37474F', code: 'OCC', center: [6.60, -75.85], zoom: 9 },
    'Suroeste': { color: '#4E342E', code: 'SUR', center: [5.85, -75.80], zoom: 9 },
    'Magdalena Medio': { color: '#0277BD', code: 'MAG', center: [6.35, -74.55], zoom: 9 },
    'Nordeste': { color: '#E65100', code: 'NDE', center: [6.95, -74.90], zoom: 9 },
    'Bajo Cauca': { color: '#F57F17', code: 'BCA', center: [7.85, -75.15], zoom: 9 },
    'Valle de Aburrá': { color: '#5C6BC0', code: 'VAB', center: [6.25, -75.55], zoom: 10 }
  },

  // Map Tile Providers (High Quality, Free, Institutional)
  TILE_PROVIDERS: {
    cartoLight: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    cartoDark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO'
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    }
  }
};
