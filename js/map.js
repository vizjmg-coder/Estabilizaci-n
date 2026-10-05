/* ==========================================================================
   MAP COMPONENT: GESTOR DE MAPAS GIS Y CORREDORES DE ANTIOQUIA
   Leaflet + GeoJSON con Municipios y Tramos de Estabilización
   ========================================================================== */

class MapManager {
  constructor(containerId, onSelectCorridorCallback) {
    this.containerId = containerId;
    this.onSelectCorridor = onSelectCorridorCallback;
    this.map = null;
    this.muniLayer = null;
    this.corredoresLayer = null;
    this.currentBaseLayer = null;
    this.baseLayers = {};
    this.activeCorridorId = null;

    this.initMap();
  }

  initMap() {
    if (!document.getElementById(this.containerId)) return;

    // Centered on Antioquia, Colombia
    this.map = L.map(this.containerId, {
      center: [6.85, -75.55],
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
      zoomControl: false
    });

    // Custom zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Reliable, keyless tile providers
    this.baseLayers = {
      light: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
        maxZoom: 19
      }),
      dark: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
      })
    };

    // Default to light theme (Gobernación de Antioquia)
    this.currentBaseLayer = this.baseLayers.light;
    this.currentBaseLayer.addTo(this.map);

    // Load municipal boundaries and corridors safely
    try {
      this.loadMunicipios();
    } catch (err) {
      console.warn('Advertencia cargando municipios:', err);
    }
    try {
      this.loadCorredores();
    } catch (err) {
      console.warn('Advertencia cargando corredores:', err);
    }
  }

  setBaseMap(themeKey) {
    if (this.baseLayers[themeKey] && this.currentBaseLayer !== this.baseLayers[themeKey]) {
      this.map.removeLayer(this.currentBaseLayer);
      this.currentBaseLayer = this.baseLayers[themeKey];
      this.currentBaseLayer.addTo(this.map);
    }
  }

  loadMunicipios() {
    if (!window.GEO_MUNICIPIOS) return;

    this.muniLayer = L.geoJSON(window.GEO_MUNICIPIOS, {
      style: (feature) => {
        return {
          fillColor: '#1e293b',
          fillOpacity: 0.15,
          color: '#475569',
          weight: 1,
          opacity: 0.45,
          dashArray: '2, 3'
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        layer.bindTooltip(`
          <div style="font-family: var(--font-main); font-size: 11px;">
            <strong>${props.nombre || 'Municipio'}</strong><br/>
            <span style="color: #94a3b8;">Subregión: ${props.subregion || 'Antioquia'}</span>
          </div>
        `, { sticky: true, opacity: 0.95, className: 'custom-corridor-tooltip' });

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ fillOpacity: 0.35, color: '#94a3b8', weight: 1.5 });
          },
          mouseout: (e) => {
            this.muniLayer.resetStyle(e.target);
          }
        });
      }
    }).addTo(this.map);
  }

  loadCorredores() {
    if (!window.GEO_CORREDORES) return;

    const getLoteColor = (props) => {
      const sub = (props.subregion || '').toLowerCase();
      if (sub.includes('oriente')) return '#10B981';
      if (sub.includes('occidente')) return '#3B82F6';
      if (sub.includes('urab')) return '#06B6D4';
      if (sub.includes('magdalena')) return '#F59E0B';
      if (sub.includes('suroeste')) return '#8B5CF6';
      if (sub.includes('nordeste')) return '#EC4899';
      if (sub.includes('cauca')) return '#14B8A6';
      if (sub.includes('norte')) return '#6366F1';
      return '#10B981';
    };

    this.corredoresLayer = L.geoJSON(window.GEO_CORREDORES, {
      style: (feature) => {
        const color = getLoteColor(feature.properties);
        return {
          color: color,
          weight: 4.5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const color = getLoteColor(p);
        
        layer.bindTooltip(`
          <div style="font-family: var(--font-main); min-width: 180px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: ${color}; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">${p.code || 'TRAMO'}</span>
              <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">${p.subregion || ''}</span>
            </div>
            <strong style="color: #fff; font-size: 12px; display: block; margin-bottom: 4px;">${p.circuito || p.name}</strong>
            <div style="font-size: 11px; color: #cbd5e1; display: flex; justify-content: space-between;">
              <span>Longitud:</span> <strong>${p.long_km ? p.long_km + ' km' : 'En intervención'}</strong>
            </div>
            <div style="margin-top: 6px; text-align: right; font-size: 10px; color: #34d399; font-weight: 600;">
              Click para ver informe completo &rarr;
            </div>
          </div>
        `, { sticky: true, opacity: 0.98, className: 'custom-corridor-tooltip' });

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 7, opacity: 1 });
            l.bringToFront();
          },
          mouseout: (e) => {
            const isSelected = p.code === this.activeCorridorId || p.id === this.activeCorridorId;
            if (!isSelected) {
              this.corredoresLayer.resetStyle(e.target);
            }
          },
          click: (e) => {
            this.highlightCorridor(p.code || p.id);
            if (this.onSelectCorridor) {
              this.onSelectCorridor(p.code || p.id, p);
            }
          }
        });
      }
    }).addTo(this.map);
  }

  highlightCorridor(corridorCode) {
    this.activeCorridorId = corridorCode;
    if (!this.corredoresLayer) return;

    let targetLayer = null;
    this.corredoresLayer.eachLayer((layer) => {
      const p = layer.feature.properties;
      const isMatch = (p.code === corridorCode || p.id === corridorCode || (p.name && p.name.includes(corridorCode)));
      if (isMatch) {
        targetLayer = layer;
        layer.setStyle({
          color: '#facc15',
          weight: 8,
          opacity: 1
        });
        layer.bringToFront();
      } else {
        this.corredoresLayer.resetStyle(layer);
      }
    });

    if (targetLayer) {
      this.map.fitBounds(targetLayer.getBounds(), { padding: [60, 60], maxZoom: 12, animate: true, duration: 1 });
    }
  }

  filterByLote(loteId, subregionName) {
    if (!this.corredoresLayer) return;

    let bounds = L.latLngBounds([]);
    let visibleCount = 0;

    this.corredoresLayer.eachLayer((layer) => {
      const p = layer.feature.properties;
      const sub = (p.subregion || '').toLowerCase();
      const targetSub = (subregionName || '').toLowerCase();

      const shouldShow = (!subregionName || subregionName === 'all' || sub.includes(targetSub));
      
      if (shouldShow) {
        layer.setStyle({ opacity: 0.9, fillOpacity: 0.9 });
        bounds.extend(layer.getBounds());
        visibleCount++;
      } else {
        layer.setStyle({ opacity: 0.1, fillOpacity: 0.1 });
      }
    });

    if (visibleCount > 0 && bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [40, 40], animate: true, duration: 0.8 });
    } else {
      this.resetView();
    }
  }

  resetView() {
    this.map.setView([6.85, -75.55], 8, { animate: true });
    if (this.corredoresLayer) {
      this.corredoresLayer.eachLayer((l) => this.corredoresLayer.resetStyle(l));
    }
    this.activeCorridorId = null;
  }
}

window.MapManager = MapManager;
