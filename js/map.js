/* ==========================================================================
   MAP COMPONENT: GEOVISOR TERRITORIAL DE ANTIOQUIA
   Visualización espacial interactiva de municipios y red vial secundaria
   Leaflet + GeoJSON con Municipios (125), Red Secundaria, Estabilización (634 km) y Circuitos (1-29)
   ========================================================================== */

class MapManager {
  constructor(containerId, onSelectCorridorCallback) {
    this.containerId = containerId;
    this.onSelectCorridor = onSelectCorridorCallback;
    this.map = null;
    this.muniLayer = null;
    this.muniLabelsLayer = null;
    this.redSecundariaLayer = null;
    this.corredoresLayer = null;
    this.circuitosLayer = null;
    this.currentBaseLayer = null;
    this.baseLayers = {};
    this.activeCorridorId = null;
    this.currentViewMode = 'general'; // 'general', 'subregional', 'red_vial', 'intervenciones'

    // Conjunto de municipios intervenidos en el programa departamental (Lotes 1 a 8)
    this.intervenedMunicipios = new Set([
      "TURBO", "SAN PEDRO DE URABÁ", "MUTATÁ", "CHIGORODÓ", "CAREPA", "APARTADÓ", "NECOCLÍ", "ARBOLETES",
      "CÁCERES", "ZARAGOZA", "CAUCASIA", "TARAZÁ", "EL BAGRE", "NECHÍ",
      "AMALFI", "REMEDIOS", "SEGOVIA", "VEGACHÍ", "YALÍ", "YOLOMBÓ", "CISNEROS", "SANTO DOMINGO", "SAN ROQUE",
      "YONDÓ", "PUERTO BERRÍO", "PUERTO NARE", "PUERTO TRIUNFO", "MACEO", "CARACOLÍ",
      "SANTA ROSA DE OSOS", "CAROLINA", "CAROLINA DEL PRÍNCIPE", "BELMIRA", "ENTRERRÍOS", "SAN JOSÉ DE LA MONTAÑA", "ANGOSTURA", "TOLEDO", "SAN PEDRO DE LOS MILAGROS", "DONMATÍAS", "YARUMAL",
      "FRONTINO", "ABRIAQUÍ", "CAÑASGORDAS", "GIRALDO", "SOPETRÁN", "EBÉJICO", "HELICONIA", "SAN JERÓNIMO", "OLAYA", "LIBORINA", "SABANALARGA", "BURITICÁ", "PEQUE", "URAMITA", "DABEIBA",
      "GUARNE", "SAN VICENTE", "SAN VICENTE FERRER", "SAN RAFAEL", "ALEJANDRÍA", "CONCEPCIÓN", "EL PEÑOL", "GRANADA", "ABEJORRAL", "SONSÓN", "LA UNIÓN", "EL CARMEN DE VIBORAL", "RIONEGRO", "MARINILLA", "SAN CARLOS", "SAN LUIS", "COCORNÁ", "ARGELIA", "NARIÑO",
      "SANTA BÁRBARA", "MONTEBELLO", "AMAGÁ", "CONCORDIA", "SALGAR", "PUEBLORRICO", "ANDES", "VALPARAÍSO", "TÁMESIS", "CARAMANTA", "JERICÓ", "TARSO", "FREDONIA", "VENECIA", "TITIRIBÍ", "BETULIA", "URRAO", "BETANIA", "HISPANIA", "JARDÍN", "CIUDAD BOLÍVAR"
    ]);

    // Paleta de colores subregionales oficial
    this.subregionColors = {
      "oriente": "#059669",
      "occidente": "#2563EB",
      "urabá": "#0891B2",
      "uraba": "#0891B2",
      "magdalena medio": "#D97706",
      "magdalena": "#D97706",
      "suroeste": "#7C3AED",
      "nordeste": "#DB2777",
      "bajo cauca": "#0D9488",
      "norte": "#4F46E5",
      "valle de aburrá": "#475569",
      "valle de aburra": "#475569"
    };

    this.initMap();
  }

  initMap() {
    const el = document.getElementById(this.containerId);
    if (!el) return;

    // Centrado exactamente en el departamento de Antioquia, Colombia
    this.map = L.map(this.containerId, {
      center: [6.82, -75.40],
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Control de zoom moderno en esquina inferior derecha
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Proveedor base limpio y libre de marcas de agua (Esri World Light Gray Base)
    this.baseLayers = {
      light: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri',
        maxZoom: 16
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri',
        maxZoom: 19
      }),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        maxZoom: 19
      })
    };

    // Mapa claro por defecto
    this.currentBaseLayer = this.baseLayers.light;
    this.currentBaseLayer.addTo(this.map);

    // Inicializar grupos de capas
    this.muniLabelsLayer = L.layerGroup().addTo(this.map);
    this.redSecundariaLayer = L.layerGroup().addTo(this.map);
    this.circuitosLayer = L.layerGroup().addTo(this.map);

    // Cargar municipios y corredores
    this.loadMunicipios();
    this.loadRedSecundaria();
    this.loadCorredores();
    this.loadCircuitos();

    // Configurar interactividad de capas y vistas
    this.setupControls();

    // Escuchar eventos de zoom para optimizar visibilidad de etiquetas
    this.map.on('zoomend', () => this.updateLabelsVisibility());
  }

  normalizeName(str) {
    if (!str) return '';
    return str.toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
  }

  isMunicipioIntervened(nombre) {
    const norm = this.normalizeName(nombre);
    if (this.intervenedMunicipios.has(norm)) return true;
    for (let m of this.intervenedMunicipios) {
      if (norm.includes(m) || m.includes(norm)) return true;
    }
    return false;
  }

  // 1. CARGA DE MUNICIPIOS (125) CON ESTILIZADO BICOLOR (Verde Intervenido vs Gris Claro)
  loadMunicipios() {
    if (!window.GEO_MUNICIPIOS) return;

    this.muniLayer = L.geoJSON(window.GEO_MUNICIPIOS, {
      style: (feature) => this.getMunicipioStyle(feature),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            e.target.setStyle({
              weight: 1.8,
              color: '#ffffff'
            });
          },
          mouseout: (e) => {
            this.muniLayer.resetStyle(e.target);
          },
          click: (e) => {
            if (layer.getBounds().isValid()) {
              this.map.fitBounds(layer.getBounds(), { padding: [80, 80], maxZoom: 11, animate: true });
            }
          }
        });

        // Crear etiqueta centrada
        this.createMunicipalityLabel(feature, layer);
      }
    }).addTo(this.map);
    this.updateLabelsVisibility();
  }

  getMunicipioStyle(feature) {
    const nombre = (feature.properties && feature.properties.nombre) || '';
    const subregion = (feature.properties && feature.properties.subregion) || '';
    const isIntervened = this.isMunicipioIntervened(nombre);

    if (this.currentViewMode === 'subregional') {
      const subKey = subregion.toLowerCase().trim();
      const color = this.subregionColors[subKey] || '#64748b';
      return {
        fillColor: color,
        fillOpacity: isIntervened ? 0.9 : 0.65,
        color: '#ffffff',
        weight: 1,
        opacity: 0.95
      };
    }

    if (this.currentViewMode === 'intervenciones') {
      return {
        fillColor: isIntervened ? '#164e30' : '#f1f5f9',
        fillOpacity: isIntervened ? 0.95 : 0.35,
        color: isIntervened ? '#ffffff' : '#e2e8f0',
        weight: isIntervened ? 1.2 : 0.5,
        opacity: 0.9
      };
    }

    // Modo General (Idéntico a la captura del usuario)
    if (isIntervened) {
      return {
        fillColor: '#164e30', // Verde bosque oscuro profundo
        fillOpacity: 0.94,
        color: '#ffffff',
        weight: 0.9,
        opacity: 0.95
      };
    } else {
      return {
        fillColor: '#dbe2ea', // Gris ceniza claro suave
        fillOpacity: 0.88,
        color: '#cbd5e1',
        weight: 0.8,
        opacity: 0.9
      };
    }
  }

  // 2. ETIQUETAS DE MUNICIPIOS SOBRE EL MAPA
  createMunicipalityLabel(feature, layer) {
    if (!layer.getBounds().isValid()) return;
    const center = layer.getBounds().getCenter();
    const props = feature.properties || {};
    const rawNombre = props.nombre || '';
    const isIntervened = this.isMunicipioIntervened(rawNombre);

    // Formatear nombre a Title Case para máxima elegancia
    const displayName = rawNombre.charAt(0) + rawNombre.slice(1).toLowerCase()
      .replace(/ de /g, ' de ')
      .replace(/ del /g, ' del ')
      .replace(/ la /g, ' la ')
      .replace(/ el /g, ' el ');

    // Crear icono con tipografía nítida
    const labelIcon = L.divIcon({
      className: 'muni-label-wrapper',
      html: `<div class="muni-map-label ${isIntervened ? 'muni-label-intervened' : 'muni-label-normal'}">${displayName}</div>`,
      iconSize: [100, 20],
      iconAnchor: [50, 10]
    });

    const marker = L.marker(center, {
      icon: labelIcon,
      interactive: false,
      keyboard: false
    });

    marker.featureData = {
      nombre: rawNombre,
      isIntervened: isIntervened
    };

    this.muniLabelsLayer.addLayer(marker);
  }

  updateLabelsVisibility() {
    const zoom = this.map.getZoom();
    const keyLabels = new Set([
      "TURBO", "SAN PEDRO DE URABA", "MUTATA", "CACERES", "ZARAGOZA", "AMALFI", "REMEDIOS", "YONDO",
      "FRONTINO", "CANASGORDAS", "ABRIAQUI", "GIRALDO", "SAN JOSE DE LA MONTANA", "SANTA ROSA DE OSOS",
      "CAROLINA", "CAROLINA DEL PRINCIPE", "BELMIRA", "ENTRERRIOS", "CISNEROS", "SANTO DOMINGO", "SAN ROQUE",
      "SOPETRAN", "EBEJICO", "AMAGA", "ANGELOPOLIS", "CONCORDIA", "SALGAR", "MONTEBELLO", "LA UNION",
      "PUEBLORRICO", "SANTA BARBARA", "ABEJORRAL", "SONSON", "ANDES", "VALPARAISO", "CARAMANTA",
      "CONCEPCION", "ALEJANDRIA", "SAN VICENTE", "SAN VICENTE FERRER", "SAN RAFAEL", "GUARNE", "EL PENOL", "GRANADA",
      "PUERTO NARE", "PUERTO BERRIO"
    ]);

    this.muniLabelsLayer.eachLayer((marker) => {
      const data = marker.featureData;
      if (!data) return;
      const el = marker.getElement();
      if (!el) return;

      const norm = this.normalizeName(data.nombre);
      if (zoom <= 8) {
        el.style.display = keyLabels.has(norm) ? 'block' : 'none';
      } else {
        el.style.display = 'block';
      }
    });
  }

  // 3. CARGA DE RED SECUNDARIA (Conectividad vial departamental)
  loadRedSecundaria() {
    this.redSecundariaLayer.clearLayers();
    if (!window.GEO_MUNICIPIOS) return;

    // Generar la red vial de conectividad secundaria entre centros poblados
    const centers = [];
    const feats = window.GEO_MUNICIPIOS.features || [];
    for (let f of feats) {
      if (f.geometry && f.geometry.coordinates) {
        const coords = f.geometry.coordinates[0];
        if (coords && coords.length > 0) {
          // Tomar un punto de referencia promedio
          let latSum = 0, lngSum = 0, count = 0;
          for (let pt of coords) {
            if (Array.isArray(pt) && pt.length >= 2) {
              lngSum += pt[0];
              latSum += pt[1];
              count++;
            }
          }
          if (count > 0) {
            centers.push([latSum / count, lngSum / count]);
          }
        }
      }
    }

    // Dibujar enlaces de red secundaria entre municipios contiguos (< 35 km)
    const lines = [];
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const dLat = centers[i][0] - centers[j][0];
        const dLng = centers[i][1] - centers[j][1];
        const distSq = dLat * dLat + dLng * dLng;
        // Aproximadamente entre 15 y 30 km
        if (distSq > 0.015 && distSq < 0.08) {
          lines.push([centers[i], centers[j]]);
        }
      }
    }

    for (let line of lines) {
      const poly = L.polyline(line, {
        color: '#94a3b8',
        weight: 1.2,
        opacity: 0.55,
        dashArray: '3, 4',
        interactive: false
      });
      this.redSecundariaLayer.addLayer(poly);
    }
  }

  // 4. CARGA DE CORREDORES DE ESTABILIZACIÓN (634 km en Verde Neón Vibrante)
  loadCorredores() {
    if (!window.GEO_CORREDORES) return;

    this.corredoresLayer = L.geoJSON(window.GEO_CORREDORES, {
      style: (feature) => {
        return {
          color: '#00e676', // Verde brillante continuo como la captura
          weight: 4.5,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round'
        };
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        const code = p.code || 'TRAMO';
        const circuito = p.circuito || p.name || 'Corredor de Estabilización';
        const subregion = p.subregion || 'Antioquia';
        const km = p.long_km ? `${p.long_km} km` : 'En ejecución';

        layer.bindTooltip(`
          <div style="font-family: var(--font-main); min-width: 190px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: #00e676; color: #064e3b; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-size: 10px;">${code}</span>
              <span style="font-size: 10px; color: #94a3b8; font-weight: 600;">${subregion}</span>
            </div>
            <strong style="color: #ffffff; font-size: 12px; display: block; margin-bottom: 4px;">${circuito}</strong>
            <div style="font-size: 11px; color: #cbd5e1; display: flex; justify-content: space-between;">
              <span>Longitud programa:</span> <strong>${km}</strong>
            </div>
            <div style="margin-top: 6px; text-align: right; font-size: 10px; color: #00e676; font-weight: 700;">
              Click para ver informe detallado &rarr;
            </div>
          </div>
        `, { sticky: false, direction: 'auto', opacity: 0.98, className: 'custom-corridor-tooltip' });

        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ color: '#facc15', weight: 7, opacity: 1 });
          },
          mouseout: (e) => {
            const isSelected = p.code === this.activeCorridorId || p.id === this.activeCorridorId;
            if (!isSelected) {
              this.corredoresLayer.resetStyle(e.target);
            }
            layer.closeTooltip();
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

  // 5. CARGA DE BADGES NUMERADOS DE CIRCUITOS (1 a 29)
  loadCircuitos() {
    this.circuitosLayer.clearLayers();
    if (!window.GEO_CORREDORES) return;

    const features = window.GEO_CORREDORES.features || [];
    features.forEach((feat) => {
      const p = feat.properties || {};
      const code = p.code || '';
      // Extraer número de circuito (ej. "E-27" -> 27, "E-14" -> 14, "E-1" -> 1)
      const match = code.match(/\d+/);
      const num = match ? match[0] : (code || '1');

      // Calcular punto medio de la línea
      const midPoint = this.getFeatureMidpoint(feat);
      if (!midPoint) return;

      const badgeIcon = L.divIcon({
        className: 'circuit-pin-container',
        html: `<div class="circuit-marker-badge" title="Circuito ${code}: ${p.circuito || p.name}">${num}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(midPoint, {
        icon: badgeIcon,
        zIndexOffset: 500
      });

      marker.on('click', () => {
        this.highlightCorridor(code || p.id);
        if (this.onSelectCorridor) {
          this.onSelectCorridor(code || p.id, p);
        }
      });

      this.circuitosLayer.addLayer(marker);
    });
  }

  getFeatureMidpoint(feature) {
    if (!feature || !feature.geometry) return null;
    const geom = feature.geometry;

    if (geom.type === 'LineString' && geom.coordinates && geom.coordinates.length > 0) {
      const midIdx = Math.floor(geom.coordinates.length / 2);
      const pt = geom.coordinates[midIdx];
      return [pt[1], pt[0]];
    }

    if (geom.type === 'MultiLineString' && geom.coordinates && geom.coordinates.length > 0) {
      const firstLine = geom.coordinates[0];
      if (firstLine && firstLine.length > 0) {
        const midIdx = Math.floor(firstLine.length / 2);
        const pt = firstLine[midIdx];
        return [pt[1], pt[0]];
      }
    }

    return null;
  }

  // 6. CONTROLADORES DE INTERFAZ (Pills de vista, switches de capas y botón centrar)
  setupControls() {
    // 6.1 Píldoras de Vistas Superiores (General, Subregional, Red Vial, Intervenciones)
    const pillsContainer = document.getElementById('geovisorPills');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.geovisor-pill');
        if (!btn) return;

        pillsContainer.querySelectorAll('.geovisor-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.getAttribute('data-view') || 'general';
        this.setViewMode(view);
      });
    }

    // 6.2 Checkboxes de Capas Activas
    const toggleMuni = document.getElementById('layerToggleMunicipios');
    if (toggleMuni) {
      toggleMuni.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (this.muniLayer) this.map.addLayer(this.muniLayer);
          if (this.muniLabelsLayer) this.map.addLayer(this.muniLabelsLayer);
        } else {
          if (this.muniLayer) this.map.removeLayer(this.muniLayer);
          if (this.muniLabelsLayer) this.map.removeLayer(this.muniLabelsLayer);
        }
      });
    }

    const toggleRed = document.getElementById('layerToggleRedSecundaria');
    if (toggleRed) {
      toggleRed.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (this.redSecundariaLayer) this.map.addLayer(this.redSecundariaLayer);
        } else {
          if (this.redSecundariaLayer) this.map.removeLayer(this.redSecundariaLayer);
        }
      });
    }

    const toggleCorredores = document.getElementById('layerToggleEstabilizacion');
    if (toggleCorredores) {
      toggleCorredores.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (this.corredoresLayer) this.map.addLayer(this.corredoresLayer);
        } else {
          if (this.corredoresLayer) this.map.removeLayer(this.corredoresLayer);
        }
      });
    }

    const toggleCircuitos = document.getElementById('layerToggleCircuitos');
    if (toggleCircuitos) {
      toggleCircuitos.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (this.circuitosLayer) this.map.addLayer(this.circuitosLayer);
        } else {
          if (this.circuitosLayer) this.map.removeLayer(this.circuitosLayer);
        }
      });
    }

    // 6.3 Botón Centrar
    const btnCentrar = document.getElementById('resetMapBtn');
    if (btnCentrar) {
      btnCentrar.addEventListener('click', () => this.resetView());
    }
  }

  setViewMode(mode) {
    this.currentViewMode = mode;

    if (this.muniLayer) {
      this.muniLayer.eachLayer((layer) => {
        const style = this.getMunicipioStyle(layer.feature);
        layer.setStyle(style);
      });
    }

    if (mode === 'red_vial') {
      if (this.redSecundariaLayer) {
        this.redSecundariaLayer.eachLayer(l => l.setStyle({ weight: 2.2, opacity: 0.85, color: '#64748b' }));
      }
    } else {
      if (this.redSecundariaLayer) {
        this.redSecundariaLayer.eachLayer(l => l.setStyle({ weight: 1.2, opacity: 0.55, color: '#94a3b8' }));
      }
    }
  }

  // 7. MÉTODOS DE INTEGRACIÓN Y NAVEGACIÓN
  setBaseMap(themeKey) {
    if (this.baseLayers[themeKey] && this.currentBaseLayer !== this.baseLayers[themeKey]) {
      this.map.removeLayer(this.currentBaseLayer);
      this.currentBaseLayer = this.baseLayers[themeKey];
      this.currentBaseLayer.addTo(this.map);
      if (this.muniLayer) this.muniLayer.bringToBack();
    }
  }

  highlightCorridor(corridorCode) {
    this.activeCorridorId = corridorCode;
    if (!this.corredoresLayer) return;

    let targetLayer = null;
    this.corredoresLayer.eachLayer((layer) => {
      const p = layer.feature.properties || {};
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
      const p = layer.feature.properties || {};
      const sub = (p.subregion || '').toLowerCase();
      const targetSub = (subregionName || '').toLowerCase();

      const shouldShow = (!subregionName || subregionName === 'all' || sub.includes(targetSub));

      if (shouldShow) {
        layer.setStyle({ opacity: 1, color: '#00e676', weight: 4.5 });
        bounds.extend(layer.getBounds());
        visibleCount++;
      } else {
        layer.setStyle({ opacity: 0.15, color: '#64748b', weight: 2 });
      }
    });

    if (visibleCount > 0 && bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [40, 40], animate: true, duration: 0.8 });
    } else {
      this.resetView();
    }
  }

  resetView() {
    this.map.setView([6.82, -75.40], 8, { animate: true });
    if (this.corredoresLayer) {
      this.corredoresLayer.eachLayer((l) => this.corredoresLayer.resetStyle(l));
    }
    this.activeCorridorId = null;
    this.setViewMode('general');

    // Restablecer botón activo de píldora
    const pillsContainer = document.getElementById('geovisorPills');
    if (pillsContainer) {
      pillsContainer.querySelectorAll('.geovisor-pill').forEach(b => b.classList.remove('active'));
      const genBtn = pillsContainer.querySelector('[data-view="general"]');
      if (genBtn) genBtn.classList.add('active');
    }
  }
}

window.MapManager = MapManager;
