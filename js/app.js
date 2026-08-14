/**
 * GOBERNACIÓN DE ANTIOQUIA - CENTRO DE CONTROL TERRITORIAL
 * Main Application Orchestrator & State Manager
 */

import { APP_CONFIG } from './config.js';
import { DataProcessor } from './dataProcessor.js';
import { MapController } from './mapController.js';
import { ChartController } from './chartController.js';
import { UIController } from './uiController.js';
import { ExportController } from './exportController.js';

class App {
  constructor() {
    this.dataProcessor = new DataProcessor();
    this.mapController = null;
    this.chartController = null;
    this.uiController = null;
    this.selectedCircuitId = null;
  }

  async init() {
    console.log('Initializing Centro de Control Territorial - Gobernación de Antioquia...');
    
    // 1. Initialize UI Controller
    this.uiController = new UIController({
      onSubregionChange: (subregion) => this.handleSubregionFilter(subregion),
      onCircuitSelect: (circuitId) => this.handleCircuitSelect(circuitId),
      onFocusCircuitOnMap: (circuitId) => this.mapController.focusCircuit(circuitId)
    });

    // 2. Initialize Chart Controller
    this.chartController = new ChartController(
      (subregion) => this.handleSubregionFilter(subregion),
      (circuitId) => this.handleCircuitSelect(circuitId)
    );

    // 3. Initialize Map Controller
    this.mapController = new MapController('leaflet-map', (type, data) => {
      if (type === 'circuito') {
        this.handleCircuitSelect(data);
      } else if (type === 'municipio') {
        const mpioName = data.name;
        const circuitsInMpio = this.dataProcessor.circuits.filter(c => c.municipios.includes(mpioName));
        this.uiController.openMunicipioModal(data, circuitsInMpio);
      }
    });

    // 4. Load Data & Initialize Map
    try {
      await this.dataProcessor.loadData();
      await this.mapController.initMap();
      
      // Populate Filter Dropdowns
      this.populateFilterDropdowns();
      
      // Attach Global Event Handlers
      this.attachEventHandlers();

      // Render Initial State
      this.refreshAll();

      console.log('Centro de Control Territorial initialized successfully.');
    } catch (err) {
      console.error('Initialization error:', err);
      alert('Error inicializando los datos de la Gobernación de Antioquia.');
    }
  }

  populateFilterDropdowns() {
    // Subregions dropdown
    const subSelect = document.getElementById('filter-subregion');
    if (subSelect) {
      subSelect.innerHTML = '<option value="ALL">Todas las Subregiones</option>' +
        Object.keys(APP_CONFIG.SUBREGIONS).map(s => `<option value="${s}">${s}</option>`).join('');
    }

    // Circuitos dropdown
    const circSelect = document.getElementById('filter-circuito');
    if (circSelect) {
      circSelect.innerHTML = '<option value="ALL">Todos los Circuitos</option>' +
        this.dataProcessor.circuits.map(c => `<option value="${c.id}">${c.codigo} - ${c.name}</option>`).join('');
    }

    // Municipios dropdown
    this.updateMunicipiosDropdown();
  }

  updateMunicipiosDropdown() {
    const mpioSelect = document.getElementById('filter-municipio');
    if (!mpioSelect) return;

    const availableMpios = this.dataProcessor.getFilteredMunicipalities();
    mpioSelect.innerHTML = '<option value="ALL">Todos los Municipios</option>' +
      availableMpios.map(m => `<option value="${m.name}">${m.name} (${m.subregion})</option>`).join('');
  }

  attachEventHandlers() {
    // 1. Subregion Filter Change
    document.getElementById('filter-subregion')?.addEventListener('change', (e) => {
      this.handleSubregionFilter(e.target.value);
    });

    // 2. Municipio Filter Change
    document.getElementById('filter-municipio')?.addEventListener('change', (e) => {
      this.dataProcessor.setFilters({ municipio: e.target.value });
      this.refreshAll();
    });

    // 3. Circuito Filter Change
    document.getElementById('filter-circuito')?.addEventListener('change', (e) => {
      const cid = e.target.value;
      this.dataProcessor.setFilters({ circuito: cid });
      if (cid !== 'ALL') {
        this.mapController.focusCircuit(cid);
      }
      this.refreshAll();
    });

    // 4. Global Search
    const searchInput = document.getElementById('global-search');
    searchInput?.addEventListener('input', (e) => {
      this.dataProcessor.setFilters({ searchQuery: e.target.value });
      this.refreshAll();
    });

    // 5. Clear Filters Button
    document.getElementById('btn-clear-filters')?.addEventListener('click', () => {
      this.dataProcessor.resetFilters();
      document.getElementById('filter-subregion').value = 'ALL';
      document.getElementById('filter-municipio').value = 'ALL';
      document.getElementById('filter-circuito').value = 'ALL';
      if (searchInput) searchInput.value = '';
      this.selectedCircuitId = null;
      this.updateMunicipiosDropdown();
      this.mapController.resetView();
      this.refreshAll();
      this.uiController.showToast('Filtros restablecidos');
    });

    // 6. Presentation Mode Toggle
    document.getElementById('btn-presentation-mode')?.addEventListener('click', () => {
      document.body.classList.toggle('presentation-mode');
      const isPres = document.body.classList.contains('presentation-mode');
      this.mapController.invalidateSize();
      this.uiController.showToast(isPres ? 'Modo Presentación Activado' : 'Modo Estándar');
    });

    // 7. Layer Switcher Checkboxes
    document.querySelectorAll('.layer-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const layerKey = e.target.getAttribute('data-layer');
        this.mapController.toggleLayer(layerKey, e.target.checked);
      });
    });

    // 8. Map View Modes (General, Subregional, Vial, Intervención)
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        this.handleMapViewMode(mode);
      });
    });

    // 9. Reset Zoom Button
    document.getElementById('btn-reset-map-view')?.addEventListener('click', () => {
      this.mapController.resetView();
    });

    // 10. Drawer & Modal Close
    document.getElementById('drawer-backdrop')?.addEventListener('click', () => this.uiController.closeDrawer());
    document.getElementById('btn-drawer-close')?.addEventListener('click', () => this.uiController.closeDrawer());
    document.getElementById('btn-modal-close')?.addEventListener('click', () => this.uiController.closeModal());
    document.getElementById('gov-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'gov-modal-backdrop') this.uiController.closeModal();
    });

    // 11. Export Ficha PDF Button (Pure Vector SVG & Direct Download)
    document.getElementById('btn-export-pdf')?.addEventListener('click', async () => {
      const context = {
        kpis: this.dataProcessor.calculateKPIs(),
        subregions: this.dataProcessor.getSubregionsSummary(),
        circuits: this.dataProcessor.getFilteredCircuits(),
        filters: this.dataProcessor.filters,
        municipiosGeoJSON: this.mapController.municipiosGeoData,
        secundariaGeoJSON: this.mapController.secundariaGeoData
      };
      await ExportController.exportFichaPDF(context);
    });
  }

  handleSubregionFilter(subregion) {
    this.dataProcessor.setFilters({ subregion: subregion, municipio: 'ALL' });
    
    // Sync dropdown
    const subSelect = document.getElementById('filter-subregion');
    if (subSelect) subSelect.value = subregion;
    
    this.updateMunicipiosDropdown();
    this.mapController.updateFilterState(subregion, this.selectedCircuitId);
    this.refreshAll();
    
    this.uiController.showToast(subregion === 'ALL' ? 'Mostrando toda Antioquia' : `Subregión ${subregion} seleccionada`);
  }

  handleCircuitSelect(circuitId) {
    this.selectedCircuitId = circuitId;
    const circuit = this.dataProcessor.getCircuitById(circuitId);
    if (circuit) {
      this.mapController.focusCircuit(circuitId);
      this.uiController.openCircuitDrawer(circuit);
      this.refreshAll();
    }
  }

  handleMapViewMode(mode) {
    if (mode === 'general') {
      this.mapController.resetView();
      this.mapController.toggleLayer('municipios', true);
      this.mapController.toggleLayer('secundaria', true);
      this.mapController.toggleLayer('intervenciones', true);
    } else if (mode === 'subregional') {
      this.mapController.toggleLayer('municipios', true);
      this.mapController.toggleLayer('secundaria', false);
      this.mapController.toggleLayer('intervenciones', true);
    } else if (mode === 'vial') {
      this.mapController.toggleLayer('municipios', false);
      this.mapController.toggleLayer('secundaria', true);
      this.mapController.toggleLayer('intervenciones', true);
    } else if (mode === 'intervencion') {
      this.mapController.toggleLayer('municipios', false);
      this.mapController.toggleLayer('secundaria', false);
      this.mapController.toggleLayer('intervenciones', true);
    }
  }

  refreshAll() {
    const kpis = this.dataProcessor.calculateKPIs();
    const subSummary = this.dataProcessor.getSubregionsSummary();
    const topCircuits = this.dataProcessor.getTopCircuits(8);
    const filteredCircuits = this.dataProcessor.getFilteredCircuits();
    const activeSubregion = this.dataProcessor.filters.subregion;

    const allSubregions = this.dataProcessor.getAllSubregions();

    // 1. Render KPIs
    this.uiController.renderKPIs(kpis);

    // 2. Render Quick Subregion Pills Bar (Always shows all 9 subregions with active highlighted)
    this.uiController.renderSubregionPills(allSubregions, activeSubregion);

    // 3. Render Subregions Bar Chart
    this.chartController.renderSubregionsBarChart('subregion-bar-chart-container', subSummary, activeSubregion);

    // 4. Render Territorial Donut Chart
    this.chartController.renderTerritorialDonut('donut-distribution-canvas', subSummary);

    // 5. Render Top Circuits Ranking
    this.chartController.renderTopCircuitsRanking('ranking-circuits-container', topCircuits, this.selectedCircuitId);

    // 6. Update Coverage Gauge
    this.chartController.updateCoverageGauge('coverage-gauge-container', kpis.coveragePercentage, kpis.municipiosIntervenidosCount, kpis.totalMunicipiosInScope);

    // 7. Render Subregion Cards Gallery
    this.uiController.renderSubregionCards('subregion-cards-container', allSubregions, activeSubregion);

    // 8. Render Table
    this.uiController.renderCircuitsTable(filteredCircuits);

    // 9. Update Map status text
    const statusEl = document.getElementById('map-active-status');
    if (statusEl) {
      statusEl.textContent = activeSubregion === 'ALL'
        ? `Toda Antioquia • ${kpis.totalKm} km en ${kpis.circuitosCount} corredores`
        : `${activeSubregion} • ${kpis.totalKm} km en ${kpis.circuitosCount} corredores`;
    }
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  window.AntioquiaApp = app;
});
