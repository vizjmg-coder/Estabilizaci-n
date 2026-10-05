/* ==========================================================================
   APP CONTROLLER: CONTROLADOR PRINCIPAL DEL DASHBOARD DE ESTABILIZACIÓN
   Enrutamiento de pestañas, filtros, selección de corredores y sincronización
   ========================================================================== */

class AppController {
  constructor() {
    this.mapManager = null;
    this.pavementVisualizer = null;
    this.abscissasManager = null;
    this.chartsManager = null;
    this.selectedCorridor = null;
    this.currentLoteFilter = 'all';
    this.currentTab = 'resumen';

    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    if (!window.EST_DATA) {
      console.error('Base de datos EST_DATA no encontrada.');
      return;
    }

    // 1. Populate data views first so UI is immediately loaded
    try { this.populateGeneralKPIs(); } catch (e) { console.error('Error populateGeneralKPIs:', e); }
    try { this.populateFilterControls(); } catch (e) { console.error('Error populateFilterControls:', e); }
    try { this.populateCorridorsTable(); } catch (e) { console.error('Error populateCorridorsTable:', e); }
    try { this.populateLotesMatrix(); } catch (e) { console.error('Error populateLotesMatrix:', e); }
    try { this.populateLotesComparison(); } catch (e) { console.error('Error populateLotesComparison:', e); }

    // 2. Initialize sub-managers
    try {
      this.pavementVisualizer = new PavementVisualizer('pavementVisualizerContainer', 'layerDetailsPanel');
    } catch (e) { console.error('Error PavementVisualizer:', e); }

    try {
      this.abscissasManager = new AbscissasManager('abscissasContainer');
    } catch (e) { console.error('Error AbscissasManager:', e); }

    try {
      this.weeklyManager = new WeeklyProgressManager('weeklyTrackingContainer');
    } catch (e) { console.error('Error WeeklyProgressManager:', e); }

    try {
      this.pdfReportGenerator = new PDFReportGenerator();
    } catch (e) { console.error('Error PDFReportGenerator:', e); }

    try {
      this.chartsManager = new ChartsManager();
      this.chartsManager.renderLotesBudgetChart('lotesBudgetChart');
      this.chartsManager.renderLotesKmChart('lotesKmChart');
    } catch (e) { console.error('Error ChartsManager:', e); }

    try {
      this.mapManager = new MapManager('mapContainer', (code, props) => {
        this.selectCorridorByCode(code);
      });
    } catch (e) { console.error('Error MapManager:', e); }

    // 3. Default select first corridor (Abejorral - Santa Bárbara)
    try {
      const initialCorridor = window.EST_DATA.corredores && window.EST_DATA.corredores[0];
      if (initialCorridor) {
        this.selectCorridor(initialCorridor, false);
      }
    } catch (e) { console.error('Error selecting initial corridor:', e); }

    // 4. Attach navigation & event listeners
    try {
      this.attachEventListeners();
      this.initPhotoLightbox();
    } catch (e) { console.error('Error attachEventListeners:', e); }
  }

  populateGeneralKPIs() {
    const g = window.EST_DATA.general;
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setTxt('kpiTotalContratos', g.valor_total_contratos_formato);
    setTxt('kpiValorObra', g.valor_obra_formato);
    setTxt('kpiValorProyectado', g.valor_proyectado_formato);
    setTxt('kpiValorAdicion', g.valor_adicion_formato);
    setTxt('kpiKmContratados', `${g.km_contratados.toLocaleString('es-CO')} km`);
    setTxt('kpiKmAlcanzan', `${g.km_alcanzan.toLocaleString('es-CO')} km`);
    setTxt('kpiKmPendientes', `${g.km_pendientes.toLocaleString('es-CO')} km`);
    setTxt('kpiCoberturaPct', `${g.km_alcanzan_pct}%`);
  }

  populateFilterControls() {
    const selectLote = document.getElementById('selectLoteFilter');
    const selectCorridor = document.getElementById('selectCorridorFilter');
    const pillsContainer = document.getElementById('lotePillsContainer');

    const lotes = window.EST_DATA.lotes || [];
    const corredores = window.EST_DATA.corredores || [];

    // Populate Lote Select
    if (selectLote) {
      selectLote.innerHTML = '<option value="all">Todos los Lotes (Antioquia)</option>';
      lotes.forEach(l => {
        selectLote.innerHTML += `<option value="${l.id}">${l.name}</option>`;
      });
    }

    // Populate Corridor Select
    if (selectCorridor) {
      selectCorridor.innerHTML = '<option value="">Buscar o seleccionar corredor...</option>';
      corredores.forEach(c => {
        selectCorridor.innerHTML += `<option value="${c.code || c.id}">[${c.code || 'TRAMO'}] ${c.name}</option>`;
      });
    }

    // Populate Quick Pills
    if (pillsContainer) {
      pillsContainer.innerHTML = `<button class="lote-pill active" data-lote="all">Todos (8 Lotes)</button>`;
      lotes.forEach(l => {
        pillsContainer.innerHTML += `
          <button class="lote-pill" data-lote="${l.id}">
            ${l.subregion}
          </button>
        `;
      });

      pillsContainer.querySelectorAll('.lote-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          pillsContainer.querySelectorAll('.lote-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const loteVal = btn.getAttribute('data-lote');
          if (selectLote) selectLote.value = loteVal;
          this.filterByLote(loteVal);
        });
      });
    }
  }

  populateCorridorsTable() {
    const tbody = document.getElementById('corridorsTableBody');
    if (!tbody) return;

    const corredores = window.EST_DATA.corredores || [];

    tbody.innerHTML = corredores.map(c => {
      const isSelected = this.selectedCorridor && (this.selectedCorridor.id === c.id || this.selectedCorridor.code === c.code);
      const adicionFormato = c.variacion_total > 0 ? `▲ $ ${(c.variacion_total / 1e6).toFixed(0)} M` : `$ 0`;
      const isRed = c.variacion_pct > 50;

      return `
        <tr class="${isSelected ? 'selected' : ''}" data-code="${c.code || c.id}">
          <td>
            <span style="background: ${c.color || '#10b981'}; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-family: var(--font-mono); font-size: 11px;">
              ${c.code || 'TRAMO'}
            </span>
          </td>
          <td>
            <strong style="color: var(--text-primary); display: block;">${c.name}</strong>
            <span style="color: var(--text-muted); font-size: 11px;">${c.subregion || ''}</span>
          </td>
          <td><strong>${c.longitud_contractual_km} km</strong></td>
          <td><span style="color: #34d399; font-weight: 700;">${c.longitud_probable_km} km</span></td>
          <td>${c.cobertura_pct ? c.cobertura_pct + '%' : '-'}</td>
          <td>$ ${(c.valor_contractual / 1e6).toFixed(0)} M</td>
          <td style="color: ${isRed ? 'var(--alert-red)' : 'var(--text-primary)'}; font-weight: 700;">
            ${adicionFormato}
          </td>
          <td>
            <span class="kpi-badge ${c.avance_fisico_pct > 10 ? 'success' : 'neutral'}">
              ${c.avance_fisico_pct || 0}%
            </span>
          </td>
          <td>
            <button class="btn-icon" style="width: 28px; height: 28px; font-size: 11px;" title="Ver detalle">
              <i class="fas fa-chevron-right"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('tr').forEach(tr => {
      tr.addEventListener('click', () => {
        const code = tr.getAttribute('data-code');
        this.selectCorridorByCode(code);
      });
    });
  }

  filterByLote(loteId) {
    this.currentLoteFilter = loteId;
    const corredores = window.EST_DATA.corredores || [];
    const lotes = window.EST_DATA.lotes || [];

    let targetSubregion = '';
    if (loteId !== 'all') {
      const targetLote = lotes.find(l => String(l.id) === String(loteId));
      if (targetLote) targetSubregion = targetLote.subregion;
    }

    // Filter table rows
    const tbody = document.getElementById('corridorsTableBody');
    if (tbody) {
      tbody.querySelectorAll('tr').forEach(tr => {
        const code = tr.getAttribute('data-code');
        const c = corredores.find(item => item.code === code || item.id === code);
        if (!c) return;

        const show = (loteId === 'all' || String(c.lote_id) === String(loteId));
        tr.style.display = show ? '' : 'none';
      });
    }

    // Filter map
    if (this.mapManager) {
      this.mapManager.filterByLote(loteId, targetSubregion);
    }
  }

  selectCorridorByCode(code) {
    const corredores = window.EST_DATA.corredores || [];
    const found = corredores.find(c => c.code === code || c.id === code || (c.name && c.name.includes(code)));
    if (found) {
      this.selectCorridor(found, true);
    }
  }

  selectCorridor(corridor, switchTab = true) {
    this.selectedCorridor = corridor;

    // Update select dropdown
    const selectCorridor = document.getElementById('selectCorridorFilter');
    if (selectCorridor) selectCorridor.value = corridor.code || corridor.id;

    // Update highlight in table
    const tbody = document.getElementById('corridorsTableBody');
    if (tbody) {
      tbody.querySelectorAll('tr').forEach(tr => {
        const code = tr.getAttribute('data-code');
        if (code === (corridor.code || corridor.id)) {
          tr.classList.add('selected');
        } else {
          tr.classList.remove('selected');
        }
      });
    }

    // Update Detail View Headers and KPIs
    this.updateCorridorDetailUI(corridor);
    this.updateContractAdminUI(corridor);

    // Render Weekly Progress & S-Curve Studio
    if (this.weeklyManager) {
      this.weeklyManager.render(corridor);
    }

    // Render Abscissas Chainage Progression Studio
    if (this.abscissasManager) {
      this.abscissasManager.render(corridor);
    }

    // Render Pavement Visualizer
    if (this.pavementVisualizer) {
      this.pavementVisualizer.render(corridor);
    }

    // Render Activity Chart and Table
    if (this.chartsManager) {
      this.chartsManager.renderCorridorActivitiesChart('corridorActivitiesChart', corridor);
    }
    this.renderCorridorActivitiesTable(corridor);

    // Render Photographic Registry
    this.renderPhotoGallery(corridor);

    // Map flyTo
    if (this.mapManager) {
      this.mapManager.highlightCorridor(corridor.code || corridor.id);
    }

    // Switch to detail tab if requested
    if (switchTab && this.currentTab === 'resumen') {
      this.switchTab('detalle');
    }
  }

  updateCorridorDetailUI(c) {
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setTxt('detailCodeBadge', c.code || 'TRAMO');
    setTxt('detailCorridorTitle', c.name);
    setTxt('detailSubregionBadge', c.subregion);
    setTxt('detailLoteBadge', c.lote_name);

    setTxt('detailKmContractual', `${c.longitud_contractual_km} km`);
    setTxt('detailKmProbable', `${c.longitud_probable_km} km`);
    setTxt('detailAlcanceReal', c.alcance_real_km ? `${c.alcance_real_km} km` : `${c.longitud_probable_km} km`);
    setTxt('detailCobertura', `${c.cobertura_pct || 65}%`);

    setTxt('detailValorContractual', `$ ${(c.valor_contractual / 1e6).toLocaleString('es-CO')} M`);
    setTxt('detailValorProyectado', `$ ${(c.valor_proyectado / 1e6).toLocaleString('es-CO')} M`);
    setTxt('detailAdicion', `▲ $ ${(c.variacion_total / 1e6).toLocaleString('es-CO')} M`);
    setTxt('detailVariacionPct', `+${c.variacion_pct || 0}%`);

    setTxt('detailAvanceFisico', `${c.avance_fisico_pct || 0}%`);
    setTxt('detailAvanceFinanciero', `${c.avance_financiero_pct || 0}%`);
    setTxt('detailPlazoTranscurrido', `${c.plazo_transcurrido_pct || 38.1}%`);
    setTxt('detailPlazoDias', c.plazo_dias || '123 de 323 días');

    setTxt('detailFechaInicio', c.fecha_inicio || '01/06/2026');
    setTxt('detailFechaTerminacion', c.fecha_terminacion || '20/04/2027');
    setTxt('detailFechaCorte', c.fecha_corte || '24/09/2026');
  }

  updateContractAdminUI(c) {
    const info = c.contrato_info || {
      numero_contrato: "20260202",
      contratista: "CONSORCIO ANTIOQUIA ORIENTE",
      numero_interventoria: "20260210",
      interventor: "CAMILO ANDRÉS ÁNGEL SALDARRIAGA",
      objeto: "ACTIVIDADES DE MEJORAMIENTO, MANTENIMIENTO Y OBRAS COMPLEMENTARIAS PARA LA ESTABILIZACIÓN DE LAS VÍAS A CARGO DEL DEPARTAMENTO DE ANTIOQUIA - GRUPO 2 SUBREGIÓN ORIENTE",
      plazo_meses: "13 MESES",
      fecha_acta_inicio: c.fecha_inicio || "01/06/2026",
      fecha_inicio_estabilizacion: c.fecha_inicio_estabilizacion || "26/08/2026",
      fecha_corte: c.fecha_corte || "24/09/2026",
      fecha_vencimiento: c.fecha_terminacion || "20/04/2027",
      plazo_dias: 323,
      dias_transcurridos: 123,
      dias_faltantes: 200,
      plazo_pct: 38.1
    };

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setTxt('contractNo', info.numero_contrato || '20260202');
    setTxt('contractorName', info.contratista || 'CONSORCIO ANTIOQUIA ORIENTE');
    setTxt('interventoriaNo', info.numero_interventoria || '20260210');
    setTxt('interventorName', info.interventor || 'CAMILO ANDRÉS ÁNGEL SALDARRIAGA');
    setTxt('contractObjeto', info.objeto || 'Actividades de mejoramiento, mantenimiento y estabilización.');
    setTxt('contractPlazo', info.plazo_meses || '13 Meses');

    setTxt('timelineInicio', info.fecha_acta_inicio || '01/06/2026');
    setTxt('timelineEstabilizacion', info.fecha_inicio_estabilizacion || '26/08/2026');
    setTxt('timelineCorte', info.fecha_corte || '24/09/2026');
    setTxt('timelineVencimiento', info.fecha_vencimiento || '20/04/2027');

    const pct = info.plazo_pct || c.plazo_transcurrido_pct || 38.1;
    const progressEl = document.getElementById('timelineProgressBar');
    if (progressEl) progressEl.style.width = `${pct}%`;

    const diasTrans = info.dias_transcurridos || 123;
    const diasTot = info.plazo_dias || 323;
    const diasFalt = info.dias_faltantes || (diasTot - diasTrans);
    const faltPct = (100 - pct).toFixed(1);

    setTxt('timelineTranscurrido', `${diasTrans} de ${diasTot} días (${pct}%)`);
    setTxt('timelineFaltante', `${diasFalt} días (${faltPct}%)`);
  }

  renderPhotoGallery(c) {
    const grid = document.getElementById('photoGalleryGrid');
    const countBadge = document.getElementById('photoGalleryCountBadge');
    if (!grid) return;

    this.currentPhotos = c.registro_fotografico || [];

    if (countBadge) {
      countBadge.innerText = `${this.currentPhotos.length} Fotografías Georreferenciadas`;
    }

    if (this.currentPhotos.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: var(--text-muted); background: var(--bg-subtle); border-radius: var(--radius-md);">
          <i class="fas fa-camera" style="font-size: 2.2rem; margin-bottom: 0.75rem; color: var(--border-strong); display: block;"></i>
          <strong style="color: var(--text-primary); font-size: 0.95rem;">Registro fotográfico en fase de integración para este corredor.</strong><br/>
          <span style="font-size: 0.8rem;">Consulte el corredor E-18 (Abejorral - Santa Bárbara) o E-17 para ver el registro fotográfico completo de obra e interventoría.</span>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.currentPhotos.map(photo => {
      return `
        <div class="photo-card" data-cat="${photo.componente_id || ''}" data-id="${photo.id}">
          <div class="photo-img-wrapper">
            <img src="${encodeURI(photo.archivo)}" alt="${photo.titulo}" class="photo-img" loading="lazy" onerror="this.src='assets/hero_estabilizacion.png';" />
            <div class="photo-abscissa-badge">${photo.abscisa}</div>
            <div class="photo-category-badge">${photo.categoria}</div>
          </div>
          <div class="photo-body">
            <h4 class="photo-title">${photo.titulo}</h4>
            <p class="photo-desc">${photo.descripcion}</p>
            <div class="photo-footer">
              <span><i class="fas fa-calendar-day"></i> ${photo.fecha}</span>
              <span style="color: var(--brand-green); font-weight: 700;"><i class="fas fa-expand"></i> Ampliar</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to cards
    grid.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', () => {
        const photoId = card.getAttribute('data-id');
        const photo = this.currentPhotos.find(p => p.id === photoId);
        if (photo) this.openPhotoLightbox(photo);
      });
    });
  }

  filterPhotos(filterKey) {
    const grid = document.getElementById('photoGalleryGrid');
    if (!grid) return;

    grid.querySelectorAll('.photo-card').forEach(card => {
      const cat = card.getAttribute('data-cat') || '';
      if (filterKey === 'all') {
        card.style.display = '';
      } else if (cat.includes(filterKey)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  openPhotoLightbox(photo) {
    const modal = document.getElementById('photoLightboxModal');
    if (!modal) return;

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    const img = document.getElementById('modalPhotoImg');
    if (img) {
      img.src = encodeURI(photo.archivo);
      img.alt = photo.titulo;
    }

    setTxt('modalPhotoTitle', photo.titulo);
    setTxt('modalPhotoDesc', photo.descripcion);
    setTxt('modalPhotoAbscissa', photo.abscisa);
    setTxt('modalPhotoCategory', photo.categoria);
    setTxt('modalPhotoDate', photo.fecha || 'Septiembre 2026');
    setTxt('modalPhotoCoords', photo.coordenadas || 'Antioquia, Colombia');
    setTxt('modalPhotoInterventoria', photo.contrato_interventoria || 'Interventoría No. 20260210 · CAAS / Rentan');
    setTxt('modalPhotoFuente', photo.tipo_fuente || 'Registro Oficial de Obra Civil');

    modal.classList.add('active');
  }

  initPhotoLightbox() {
    const modal = document.getElementById('photoLightboxModal');
    const closeBtn = document.getElementById('closePhotoModalBtn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      });
    }

    // Photo filter pills
    const pillsContainer = document.getElementById('photoFilterPills');
    if (pillsContainer) {
      pillsContainer.querySelectorAll('.comp-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          pillsContainer.querySelectorAll('.comp-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const pfilter = btn.getAttribute('data-pfilter');
          this.filterPhotos(pfilter);
        });
      });
    }
  }

  renderCorridorActivitiesTable(corridor) {
    const tbody = document.getElementById('activitiesTableBody');
    if (!tbody) return;

    const acts = corridor.actividades_presupuesto || [];
    if (acts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Actividades consolidadas en paquete global del lote.</td></tr>`;
      return;
    }

    tbody.innerHTML = acts.map(a => {
      const isAdicion = a.variacion_val > 0;
      const varColor = isAdicion ? 'var(--alert-red)' : '#10b981';
      const icon = isAdicion ? '▲' : (a.variacion_val < 0 ? '▼' : '—');
      return `
        <tr>
          <td><strong>${a.actividad}</strong></td>
          <td>$ ${(a.contractual_val / 1e6).toFixed(1)} M</td>
          <td style="color: var(--text-muted);">${a.contractual_pct || 0}%</td>
          <td>$ ${(a.proyectado_val / 1e6).toFixed(1)} M</td>
          <td style="color: var(--text-muted);">${a.proyectado_pct || 0}%</td>
          <td style="color: ${varColor}; font-weight: 700;">
            ${icon} $ ${(Math.abs(a.variacion_val) / 1e6).toFixed(1)} M
          </td>
          <td style="color: ${varColor}; font-weight: 700;">
            ${a.variacion_pct > 0 ? '+' : ''}${a.variacion_pct}%
          </td>
        </tr>
      `;
    }).join('');
  }

  populateLotesMatrix() {
    const tbody = document.getElementById('lotesMatrixBody');
    if (!tbody) return;

    const lotes = window.EST_DATA.lotes || [];
    tbody.innerHTML = lotes.map(l => {
      return `
        <tr>
          <td><strong style="color: ${l.color};">${l.name}</strong></td>
          <td>${l.corredores_count}</td>
          <td><strong>${l.km_contratados} km</strong></td>
          <td><span style="color: #34d399; font-weight: 700;">${l.km_alcanzan} km</span></td>
          <td><span style="color: var(--alert-red);">${l.km_pendientes} km</span></td>
          <td><strong>${l.cobertura_km_pct}%</strong></td>
          <td>$ ${(l.valor_obra / 1e6).toLocaleString('es-CO')} M</td>
          <td>$ ${(l.valor_proyectado / 1e6).toLocaleString('es-CO')} M</td>
          <td>$ ${(l.valor_km_proyectado / 1e6).toFixed(1)} M/km</td>
          <td style="color: var(--alert-red); font-weight: 800;">▲ $ ${(l.valor_requerido / 1e6).toLocaleString('es-CO')} M</td>
          <td><span class="kpi-badge danger">+${l.variacion_pct}%</span></td>
        </tr>
      `;
    }).join('');
  }

  populateLotesComparison() {
    const grid = document.getElementById('lotesComparisonGrid');
    if (!grid) return;

    const lotes = window.EST_DATA.lotes || [];
    grid.innerHTML = lotes.map(l => {
      return `
        <div class="kpi-card" style="border-top: 4px solid ${l.color};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div>
              <span style="font-size: 0.72rem; font-weight: 700; color: ${l.color}; text-transform: uppercase;">
                ${l.code} · ${l.subregion}
              </span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
                ${l.name}
              </h4>
            </div>
            <span class="kpi-badge ${l.cobertura_km_pct >= 65 ? 'success' : 'danger'}">
              ${l.cobertura_km_pct}% cobertura
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 0.75rem 0; font-size: 0.8rem;">
            <div style="background: var(--bg-subtle); padding: 6px 10px; border-radius: 6px;">
              <span style="color: var(--text-muted); font-size: 0.7rem; display: block;">Km Contratados:</span>
              <strong>${l.km_contratados} km</strong>
            </div>
            <div style="background: var(--bg-subtle); padding: 6px 10px; border-radius: 6px;">
              <span style="color: var(--text-muted); font-size: 0.7rem; display: block;">Km que se alcanzan:</span>
              <strong style="color: #34d399;">${l.km_alcanzan} km</strong>
            </div>
            <div style="background: var(--bg-subtle); padding: 6px 10px; border-radius: 6px;">
              <span style="color: var(--text-muted); font-size: 0.7rem; display: block;">Costo Proyectado/km:</span>
              <strong>$ ${(l.valor_km_proyectado / 1e6).toFixed(0)} M</strong>
            </div>
            <div style="background: var(--bg-subtle); padding: 6px 10px; border-radius: 6px;">
              <span style="color: var(--text-muted); font-size: 0.7rem; display: block;">Adición Requerida:</span>
              <strong style="color: var(--alert-red);">▲ $ ${(l.valor_requerido / 1e6).toFixed(0)} M</strong>
            </div>
          </div>

          <div style="font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.5rem; display: flex; justify-content: space-between;">
            <span>${l.corredores_count} Corredores</span>
            <span>Plazo: ${l.plazo_pct}% (${l.plazo_dias})</span>
          </div>
        </div>
      `;
    }).join('');
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav button active states
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update pane active states
    document.querySelectorAll('.view-pane').forEach(pane => {
      if (pane.id === `pane-${tabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // If map was hidden and shown, invalidate size
    if (tabId === 'resumen' && this.mapManager && this.mapManager.map) {
      setTimeout(() => this.mapManager.map.invalidateSize(), 150);
    }
  }

  attachEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Select Lote Filter
    const selectLote = document.getElementById('selectLoteFilter');
    if (selectLote) {
      selectLote.addEventListener('change', (e) => {
        const val = e.target.value;
        const pills = document.querySelectorAll('.lote-pill');
        pills.forEach(p => {
          if (p.getAttribute('data-lote') === val) p.classList.add('active');
          else p.classList.remove('active');
        });
        this.filterByLote(val);
      });
    }

    // Select Corridor Filter
    const selectCorridor = document.getElementById('selectCorridorFilter');
    if (selectCorridor) {
      selectCorridor.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) this.selectCorridorByCode(val);
      });
    }

    // Map Basemap Switcher
    const baseSelector = document.getElementById('mapBaseSelector');
    if (baseSelector) {
      baseSelector.addEventListener('change', (e) => {
        if (this.mapManager) this.mapManager.setBaseMap(e.target.value);
      });
    }

    // Reset Map View Button
    const resetMapBtn = document.getElementById('resetMapBtn');
    if (resetMapBtn) {
      resetMapBtn.addEventListener('click', () => {
        if (this.mapManager) this.mapManager.resetView();
      });
    }

    // Theme Toggle (Dark / Light)
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeBtn.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        if (this.mapManager) {
          this.mapManager.setBaseMap(newTheme === 'light' ? 'light' : 'dark');
        }
      });
    }

    // Print Report -> Generate Synthetic Landscape PDF Report (Vector Canvas)
    const printBtn = document.getElementById('printReportBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        if (this.pdfReportGenerator) {
          const corridor = this.selectedCorridor || (window.EST_DATA && window.EST_DATA.corredores[0]);
          this.pdfReportGenerator.generateExecutiveReport(corridor);
        } else {
          window.print();
        }
      });
    }
  }
}

// Global initialization
window.app = new AppController();
