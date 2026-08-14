/**
 * GOBERNACIÓN DE ANTIOQUIA - CENTRO DE CONTROL TERRITORIAL
 * Map Controller: Leaflet Map Instance, GeoJSON Vector Layers, Interactivity & Symbology
 */

import { APP_CONFIG } from './config.js';

export class MapController {
  constructor(mapContainerId, onFeatureSelect) {
    this.containerId = mapContainerId;
    this.onFeatureSelect = onFeatureSelect; // Callback when feature clicked
    this.map = null;

    // GeoJSON Layers
    this.municipiosLayer = null;
    this.secundariaLayer = null;
    this.prioritariasLayer = null;

    // Raw feature data caches
    this.municipiosGeoData = null;
    this.secundariaGeoData = null;

    // Layer visibility state
    this.visibleLayers = {
      subregiones: true,
      municipios: true,
      secundaria: true,
      intervenciones: true,
      circuitos: true
    };

    this.selectedFeature = null;
  }

  async initMap() {
    // Initialize Leaflet Map centered on Antioquia
    this.map = L.map(this.containerId, {
      center: APP_CONFIG.ANTIOQUIA_CENTER,
      zoom: APP_CONFIG.DEFAULT_ZOOM,
      minZoom: APP_CONFIG.MIN_ZOOM,
      maxZoom: APP_CONFIG.MAX_ZOOM,
      zoomControl: false,
      attributionControl: false,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true
    });

    // Add custom zoom control top-left
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Create Custom Stacking Panes with Strict Z-Index Hierarchy
    this.map.createPane('municipiosPane');
    this.map.getPane('municipiosPane').style.zIndex = '400';

    this.map.createPane('secundariaPane');
    this.map.getPane('secundariaPane').style.zIndex = '450';

    this.map.createPane('prioritariasPane');
    this.map.getPane('prioritariasPane').style.zIndex = '500';

    this.map.createPane('circuitMarkersPane');
    this.map.getPane('circuitMarkersPane').style.zIndex = '600';

    this.map.createPane('municipioLabelsPane');
    this.map.getPane('municipioLabelsPane').style.zIndex = '650';

    // Add Base Tile Layer (Carto Light) with clean tile rendering
    L.tileLayer(APP_CONFIG.TILE_PROVIDERS.cartoLight.url, {
      maxZoom: 18,
      subdomains: 'abcd',
      keepBuffer: 8,
      updateWhenIdle: false,
      updateWhenZooming: true
    }).addTo(this.map);

    // Continuous container resize tracking to prevent cut-off areas
    const mapEl = document.getElementById(this.containerId);
    if (mapEl && window.ResizeObserver) {
      const observer = new ResizeObserver(() => {
        if (this.map) {
          this.map.invalidateSize({ pan: false });
        }
      });
      observer.observe(mapEl);
      if (mapEl.parentElement) {
        observer.observe(mapEl.parentElement);
      }
    }

    // Keep tiles loaded across zoom transitions
    this.map.on('zoomstart zoomend moveend resize', () => {
      if (this.map) {
        this.map.invalidateSize({ pan: false });
      }
    });

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 750);

    // Load GeoJSON data
    await this.loadGeoData();
  }

  async loadGeoData() {
    try {
      // Load optimized GeoJSONs for fast 60fps rendering
      const [munRes, secRes] = await Promise.all([
        fetch('Data/Municipios_opt.geojson'),
        fetch('Data/Secundaria_opt.geojson')
      ]);

      this.municipiosGeoData = await munRes.json();
      this.secundariaGeoData = await secRes.json();

      this.renderLayers();
    } catch (err) {
      console.error('Error loading GeoJSON data:', err);
    }
  }

  renderLayers() {
    // 1. Municipios Layer (Pane 400)
    if (this.municipiosLayer) {
      this.map.removeLayer(this.municipiosLayer);
    }

    this.municipiosLayer = L.geoJSON(this.municipiosGeoData, {
      pane: 'municipiosPane',
      style: (feature) => this.getMunicipioStyle(feature),
      onEachFeature: (feature, layer) => {
        this.bindMunicipioEvents(feature, layer);
      }
    });

    // 2. Red Vial Secundaria General Layer (Pane 450)
    if (this.secundariaLayer) {
      this.map.removeLayer(this.secundariaLayer);
    }

    this.secundariaLayer = L.geoJSON(this.secundariaGeoData, {
      pane: 'secundariaPane',
      filter: (feature) => !feature.properties.is_prioritized,
      style: {
        color: '#94a3b8',
        weight: 1.0,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      },
      onEachFeature: (feature, layer) => {
        this.bindSecundariaEvents(feature, layer);
      }
    });

    // 3. Corredores Priorizados de Estabilización (Pane 500 - Always on Top of Polygons)
    if (this.prioritariasLayer) {
      this.map.removeLayer(this.prioritariasLayer);
    }

    this.prioritariasLayer = L.geoJSON(this.secundariaGeoData, {
      pane: 'prioritariasPane',
      filter: (feature) => feature.properties.is_prioritized,
      style: (feature) => ({
        color: '#00d084', // Verde esmeralda brillante institucional de la infografía
        weight: 4.8,
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: null
      }),
      onEachFeature: (feature, layer) => {
        this.bindPrioritariaEvents(feature, layer);
      }
    });

    // 4. Circuit Code Badges Centered on Each Corridor (Pane 600)
    if (this.circuitMarkersLayer) {
      this.map.removeLayer(this.circuitMarkersLayer);
    }
    this.circuitMarkersLayer = L.layerGroup();
    this.circuitMarkers = {};

    // Group prioritized features by circuit_id
    const circuitCoordsMap = {};
    const circuitPropsMap = {};

    this.secundariaGeoData.features.forEach(f => {
      if (!f.properties.is_prioritized || !f.properties.circuit_id) return;
      const cid = f.properties.circuit_id;
      if (!circuitCoordsMap[cid]) {
        circuitCoordsMap[cid] = [];
        circuitPropsMap[cid] = f.properties;
      }

      const geom = f.geometry;
      if (geom.type === 'LineString') {
        geom.coordinates.forEach(c => circuitCoordsMap[cid].push(c));
      } else if (geom.type === 'MultiLineString') {
        geom.coordinates.forEach(line => line.forEach(c => circuitCoordsMap[cid].push(c)));
      }
    });

    Object.keys(circuitCoordsMap).forEach(cid => {
      const coords = circuitCoordsMap[cid];
      if (coords.length === 0) return;

      const midCoord = coords[Math.floor(coords.length / 2)];
      const p = circuitPropsMap[cid];
      const lat = midCoord[1];
      const lng = midCoord[0];

      const marker = L.marker([lat, lng], {
        pane: 'circuitMarkersPane',
        icon: L.divIcon({
          className: 'circuit-marker-wrapper',
          html: `<div class="circuit-code-badge" id="circuit-badge-${cid}" data-circuit-id="${cid}" title="Circuito ${cid}: ${p.circuit_name || p.nombre}">${cid}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        }),
        zIndexOffset: 800
      });

      marker.bindTooltip(`
        <div class="custom-geo-tooltip-content">
          <div class="tooltip-title" style="color: #00d084;">★ Circuito ${cid}: ${p.circuit_name || p.nombre}</div>
          <div class="tooltip-row"><span>Longitud:</span> <strong>${p.km_intervenir || p.longitud_km || ''} km</strong></div>
          <div class="tooltip-row"><span>Subregión:</span> <strong>${p.subregion || ''}</strong></div>
        </div>
      `, {
        sticky: true,
        direction: 'top',
        offset: [0, -12],
        className: 'custom-geo-tooltip',
        opacity: 0.98
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (this.onFeatureSelect) {
          this.onFeatureSelect('circuito', cid);
        }
      });

      marker.subregion = p.subregion;
      marker.circuitId = cid;
      this.circuitMarkers[cid] = marker;
      this.circuitMarkersLayer.addLayer(marker);
    });

    // 5. Municipality Name Labels on Map (Pane 650)
    if (this.municipioLabelsLayer) {
      this.map.removeLayer(this.municipioLabelsLayer);
    }
    this.municipioLabelsLayer = L.layerGroup();
    this.municipioLabelMarkers = {};

    this.municipiosGeoData.features.forEach(f => {
      const p = f.properties;
      const geom = f.geometry;
      const hasCircuits = p.circuits_count > 0;

      // Calculate exact geometric center of the municipality
      let centerLat = null, centerLng = null;
      try {
        const polyLayer = L.geoJSON(f);
        const center = polyLayer.getBounds().getCenter();
        centerLat = center.lat;
        centerLng = center.lng;
      } catch (e) { }

      if (hasCircuits && centerLat && centerLng) {
        const lblMarker = L.marker([centerLat, centerLng], {
          pane: 'municipioLabelsPane',
          icon: L.divIcon({
            className: 'mpio-label-marker-wrapper',
            html: `<div class="mpio-map-label has-intervencion" id="mpio-lbl-${p.code || p.name}">${p.name}</div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          }),
          zIndexOffset: 400,
          interactive: false
        });

        lblMarker.subregion = p.subregion;
        lblMarker.hasCircuits = true;
        this.municipioLabelMarkers[p.name] = lblMarker;
        this.municipioLabelsLayer.addLayer(lblMarker);
      }
    });

    // Add layers according to visibility state
    if (this.visibleLayers.municipios) this.map.addLayer(this.municipiosLayer);
    if (this.visibleLayers.secundaria) this.map.addLayer(this.secundariaLayer);
    if (this.visibleLayers.intervenciones) this.map.addLayer(this.prioritariasLayer);
    if (this.visibleLayers.circuitos) this.map.addLayer(this.circuitMarkersLayer);
    this.map.addLayer(this.municipioLabelsLayer);
  }

  getMunicipioStyle(feature, activeSubregion = 'ALL') {
    const subregName = feature.properties.subregion;
    const hasCircuits = feature.properties.circuits_count > 0;

    // Dim if filtering by subregion and this does not match
    const isMuted = activeSubregion !== 'ALL' && subregName !== activeSubregion;
    const isTargetSubregion = activeSubregion !== 'ALL' && subregName === activeSubregion;

    // 1. Municipios fuera de la subregión filtrada (Opacos / Muted para contexto)
    if (isMuted) {
      return {
        fillColor: '#ffffff',
        fillOpacity: 0.05,
        color: '#e2e8f0',
        weight: 0.5,
        dashArray: '2, 3'
      };
    }

    // 2. Subregión activa filtrada (Colores oficiales: Verde Pino para intervenidos, Gris claro para el resto)
    if (isTargetSubregion) {
      return {
        fillColor: hasCircuits ? '#0a5c36' : '#d1d5db',
        fillOpacity: hasCircuits ? 0.95 : 0.90,
        color: hasCircuits ? '#04381f' : '#9ca3af',
        weight: hasCircuits ? 1.8 : 0.9,
        dashArray: null
      };
    }

    // 3. Vista general Antioquia:
    // - Municipios impactados: Verde Pino Oscuro Sólido (#0a5c36)
    // - Municipios NO impactados: Gris Claro Limpio (#d1d5db)
    return {
      fillColor: hasCircuits ? '#0a5c36' : '#d1d5db',
      fillOpacity: hasCircuits ? 0.92 : 0.85,
      color: hasCircuits ? '#04381f' : '#9ca3af',
      weight: hasCircuits ? 1.4 : 0.8,
      dashArray: null
    };
  }

  bindMunicipioEvents(feature, layer) {
    const p = feature.properties;

    // Custom Rich Tooltip
    const tooltipContent = `
      <div class="custom-geo-tooltip-content">
        <div class="tooltip-title">
          <span>${p.name}</span>
          <span class="tooltip-badge">${p.subregion}</span>
        </div>
        <div class="tooltip-row">
          <span>Circuitos:</span>
          <strong>${p.circuits_count}</strong>
        </div>
        ${p.km_intervencion > 0 ? `
          <div class="tooltip-row">
            <span>Km intervención:</span>
            <strong>${p.km_intervencion} km</strong>
          </div>
        ` : ''}
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: 'top',
      offset: [0, -10],
      className: 'custom-geo-tooltip',
      opacity: 0.98
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        const s = this.getMunicipioStyle(feature, this.currentSubregion);
        l.setStyle({
          fillColor: s.fillColor,
          fillOpacity: Math.min(1.0, s.fillOpacity + 0.08),
          weight: s.weight + 1.2,
          color: '#d4af37'
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          l.bringToFront();
        }
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(this.getMunicipioStyle(feature, this.currentSubregion));
        l.closeTooltip();
      },
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        this.map.closeTooltip();
        this.map.fitBounds(e.target.getBounds(), { padding: [40, 40], maxZoom: 12 });
        if (this.onFeatureSelect) {
          this.onFeatureSelect('municipio', p);
        }
      }
    });
  }

  bindSecundariaEvents(feature, layer) {
    const p = feature.properties;
    layer.bindTooltip(`
      <div class="custom-geo-tooltip-content">
        <div class="tooltip-title">${p.nombre || 'Vía Secundaria'}</div>
        <div class="tooltip-row"><span>Código:</span> <strong>${p.codigo || 'N/D'}</strong></div>
        <div class="tooltip-row"><span>Longitud:</span> <strong>${p.longitud_km || 'N/D'} km</strong></div>
      </div>
    `, {
      sticky: true,
      direction: 'top',
      offset: [0, -10],
      className: 'custom-geo-tooltip',
      opacity: 0.98
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3.5,
          color: '#38bdf8'
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 1.0,
          color: '#94a3b8',
          opacity: 0.35
        });
        l.closeTooltip();
      }
    });
  }

  bindPrioritariaEvents(feature, layer) {
    const p = feature.properties;
    layer.bindTooltip(`
      <div class="custom-geo-tooltip-content">
        <div class="tooltip-title" style="color: #00d084;">
          <span>★ ${p.circuit_name || p.nombre}</span>
        </div>
        <div class="tooltip-row"><span>Subregión:</span> <strong>${p.subregion || 'N/D'}</strong></div>
        <div class="tooltip-row"><span>Km a Intervenir:</span> <strong>${p.km_intervenir} km</strong></div>
      </div>
    `, {
      sticky: true,
      direction: 'top',
      offset: [0, -10],
      className: 'custom-geo-tooltip',
      opacity: 0.98
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 6.0,
          color: '#d4af37'
        });
      },
      mouseout: (e) => {
        const l = e.target;
        const cid = feature.properties.circuit_id;
        const isSelected = this.selectedCircuitId && cid && cid.toString() === this.selectedCircuitId.toString();
        l.setStyle({
          weight: isSelected ? 5.8 : 4.8,
          color: isSelected ? '#d4af37' : '#00d084',
          opacity: 1.0
        });
        l.closeTooltip();
      },
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        this.map.closeTooltip();
        this.map.fitBounds(e.target.getBounds(), { padding: [60, 60] });
        if (this.onFeatureSelect && p.circuit_id) {
          this.onFeatureSelect('circuito', p.circuit_id);
        }
      }
    });
  }

  updateFilterState(subregion = 'ALL', selectedCircuitId = null) {
    this.currentSubregion = subregion || 'ALL';
    this.selectedCircuitId = selectedCircuitId;
    if (!this.municipiosLayer) return;

    // Update Municipio polygon styles dynamically
    this.municipiosLayer.setStyle((feature) => this.getMunicipioStyle(feature, this.currentSubregion));

    // Update Prioritarias layer highlight
    if (this.prioritariasLayer) {
      this.prioritariasLayer.setStyle((feature) => {
        const cid = feature.properties.circuit_id;
        const sub = feature.properties.subregion || '';
        const isMatch = subregion === 'ALL' || sub.toLowerCase().includes(subregion.toLowerCase());
        const isSelected = selectedCircuitId && cid && cid.toString() === selectedCircuitId.toString();

        return {
          color: isSelected ? '#d4af37' : '#00d084',
          weight: isSelected ? 5.8 : (isMatch ? 4.8 : 2.0),
          opacity: isMatch ? 1.0 : 0.15
        };
      });
    }

    // Update Circuit Code Badges (filter by subregion and highlight selected)
    if (this.circuitMarkers) {
      Object.keys(this.circuitMarkers).forEach(cid => {
        const marker = this.circuitMarkers[cid];
        const el = document.getElementById(`circuit-badge-${cid}`);

        const isMatch = subregion === 'ALL' || (marker.subregion && marker.subregion.toLowerCase().includes(subregion.toLowerCase()));
        const isSelected = selectedCircuitId && cid.toString() === selectedCircuitId.toString();

        if (this.circuitMarkersLayer) {
          if (isMatch) {
            if (!this.circuitMarkersLayer.hasLayer(marker)) {
              this.circuitMarkersLayer.addLayer(marker);
            }
          } else {
            if (this.circuitMarkersLayer.hasLayer(marker)) {
              this.circuitMarkersLayer.removeLayer(marker);
            }
          }
        }

        if (el) {
          if (isSelected) {
            el.classList.add('selected');
          } else {
            el.classList.remove('selected');
          }
        }
      });
    }

    // Update Municipality Name Labels on Map (Strictly only for intervened municipalities of active subregion)
    if (this.municipioLabelMarkers) {
      Object.keys(this.municipioLabelMarkers).forEach(mName => {
        const marker = this.municipioLabelMarkers[mName];
        const isMatch = subregion === 'ALL'
          ? marker.hasCircuits
          : (marker.subregion && marker.subregion.toLowerCase() === subregion.toLowerCase() && marker.hasCircuits);

        if (this.municipioLabelsLayer) {
          if (isMatch) {
            if (!this.municipioLabelsLayer.hasLayer(marker)) {
              this.municipioLabelsLayer.addLayer(marker);
            }
          } else {
            if (this.municipioLabelsLayer.hasLayer(marker)) {
              this.municipioLabelsLayer.removeLayer(marker);
            }
          }
        }
      });
    }

    // Zoom and Centering into Subregion
    if (subregion !== 'ALL') {
      if (this.municipiosGeoData) {
        const subFeatures = this.municipiosGeoData.features.filter(
          f => f.properties.subregion && f.properties.subregion.toLowerCase() === subregion.toLowerCase()
        );
        if (subFeatures.length > 0) {
          const subLayer = L.geoJSON(subFeatures);
          this.map.invalidateSize({ pan: false });
          this.map.fitBounds(subLayer.getBounds(), { padding: [45, 45], maxZoom: 11, duration: 0.9 });
        } else if (APP_CONFIG.SUBREGIONS[subregion]) {
          const subConf = APP_CONFIG.SUBREGIONS[subregion];
          this.map.invalidateSize({ pan: false });
          this.map.flyTo(subConf.center, subConf.zoom, { duration: 0.9 });
        }
      }
    } else {
      this.map.invalidateSize({ pan: false });
      this.map.flyToBounds(APP_CONFIG.ANTIOQUIA_BOUNDS, { duration: 0.8 });
    }
  }

  focusCircuit(circuitId) {
    if (!this.secundariaGeoData) return;

    // Find matching features in GeoJSON
    const matchedFeatures = this.secundariaGeoData.features.filter(
      f => f.properties.circuit_id && f.properties.circuit_id.toString() === circuitId.toString()
    );

    if (matchedFeatures.length > 0) {
      const group = L.geoJSON(matchedFeatures);
      this.map.invalidateSize({ pan: false });
      this.map.fitBounds(group.getBounds(), { padding: [60, 60], maxZoom: 13 });
    }

    this.updateFilterState('ALL', circuitId);
  }

  toggleLayer(layerKey, isVisible) {
    this.visibleLayers[layerKey] = isVisible;
    if (layerKey === 'municipios') {
      if (isVisible) {
        if (this.municipiosLayer) this.map.addLayer(this.municipiosLayer);
        if (this.municipioLabelsLayer) this.map.addLayer(this.municipioLabelsLayer);
      } else {
        if (this.municipiosLayer) this.map.removeLayer(this.municipiosLayer);
        if (this.municipioLabelsLayer) this.map.removeLayer(this.municipioLabelsLayer);
      }
    }
    if (layerKey === 'secundaria' && this.secundariaLayer) {
      isVisible ? this.map.addLayer(this.secundariaLayer) : this.map.removeLayer(this.secundariaLayer);
    }
    if (layerKey === 'intervenciones' && this.prioritariasLayer) {
      isVisible ? this.map.addLayer(this.prioritariasLayer) : this.map.removeLayer(this.prioritariasLayer);
    }
    if (layerKey === 'circuitos' && this.circuitMarkersLayer) {
      isVisible ? this.map.addLayer(this.circuitMarkersLayer) : this.map.removeLayer(this.circuitMarkersLayer);
    }
  }

  resetView() {
    this.updateFilterState('ALL');
    this.map.invalidateSize({ pan: false });
    this.map.flyToBounds(APP_CONFIG.ANTIOQUIA_BOUNDS, { duration: 0.8 });
  }

  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize({ pan: false });
    }
  }
}
