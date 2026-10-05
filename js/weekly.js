/**
 * WeeklyProgressManager - Control Semanal de Ejecución, Curva S y Proyecciones
 * Diseñado para el Programa de Estabilización de Vías de Antioquia
 * Gobernación de Antioquia · Secretaría de Infraestructura Física · Rentan
 */

class WeeklyProgressManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCorridor = null;
    this.currentWeek = 17; // Semana de Corte oficial (24/09/2026)
    this.filterState = 'all'; // 'all', 'executed', 'current', 'projected'
    this.chartMode = 'curve'; // 'curve' (Curva S acumulada) | 'bars' (Contraste semanal)
    this.chartInstance = null;
    this.weeksData = [];
  }

  init(corridor) {
    this.render(corridor);
  }

  render(corridor) {
    if (!this.container) return;
    this.currentCorridor = corridor || (window.EST_DATA && window.EST_DATA.corredores[0]);
    this.weeksData = this.buildWeeklyDataset(this.currentCorridor);

    this.container.innerHTML = `
      <!-- Header Bar -->
      <div class="weekly-header-bar">
        <div class="weekly-header-left">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span class="tag-badge" style="background: rgba(4, 120, 87, 0.12); color: var(--brand-green); font-weight: 800;">
              <i class="fas fa-calendar-check"></i> Control Semanal & Curva S
            </span>
            <span class="tag-badge" style="background: rgba(2, 132, 199, 0.1); color: #0284c7; font-weight: 700;">
              Contrato No. 20260202 · Plazo: 46 Semanas (13 Meses)
            </span>
            <span class="tag-badge" style="background: rgba(217, 119, 6, 0.12); color: #d97706; font-weight: 700;">
              <i class="fas fa-clock"></i> Corte Actual: Semana 17 (24/09/2026)
            </span>
          </div>
          <h3 class="weekly-header-title" style="margin-top: 4px;">
            Evolución Semanal de Ejecución, Contrastes de Avance y Proyecciones
          </h3>
          <span class="weekly-header-sub">
            Monitoreo periódico del frente de obra · Comparativa de avance programado vs real · Estimación de ritmo para vencimiento (20/04/2027)
          </span>
        </div>

        <div class="weekly-header-actions">
          <button class="btn-primary" id="btnOpenWeeklyModal" style="background: var(--brand-green); border: none; padding: 6px 12px; font-size: 0.78rem;">
            <i class="fas fa-file-excel"></i> Cargar Actualización Semanal
          </button>
        </div>
      </div>

      <!-- Weekly Ribbon Scrubber (Horizontal timeline selector) -->
      <div class="weekly-ribbon-container">
        <div class="weekly-ribbon-meta">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase;">
              <i class="fas fa-sliders" style="color: var(--brand-green);"></i> Selector de Semanas Contractuales (1 a 46):
            </span>
            <span style="font-size: 0.7rem; color: var(--text-muted);">(Haz clic en cualquier semana para auditar su ejecución o proyección)</span>
          </div>

          <!-- Quick Filters for Timeline -->
          <div class="weekly-filter-pills" id="weeklyFilterPills">
            <button class="weekly-filter-btn active" data-filter="all">Todas (46)</button>
            <button class="weekly-filter-btn" data-filter="executed">Ejecutadas (1 - 17)</button>
            <button class="weekly-filter-btn" data-filter="current">Corte Actual (Sem 17)</button>
            <button class="weekly-filter-btn" data-filter="projected">Proyecciones (18 - 46)</button>
          </div>
        </div>

        <div class="weekly-ribbon-scroll" id="weeklyRibbonScroll">
          ${this.renderWeeklyRibbonCards()}
        </div>
      </div>

      <!-- Active Selected Week Spotlight Banner -->
      <div class="weekly-selected-banner" id="weeklySelectedBanner">
        <!-- Rendered dynamically -->
      </div>

      <!-- 4-KPI Comparison Grid -->
      <div class="weekly-kpi-grid" id="weeklyKpiGrid">
        <!-- Rendered dynamically -->
      </div>

      <!-- Interactive Chart Area (Curva S vs Barras Semanales) -->
      <div class="weekly-chart-wrapper">
        <div class="weekly-chart-header">
          <div>
            <span style="font-size: 0.7rem; font-weight: 700; color: var(--brand-gold); text-transform: uppercase;">
              Comportamiento Temporal
            </span>
            <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin: 0;">
              Curva S de Avance Físico & Contrastes Semanales
            </h4>
          </div>

          <!-- Mode Toggle Tabs -->
          <div class="weekly-chart-tabs" id="weeklyChartTabs">
            <button class="weekly-chart-tab-btn active" data-mode="curve">
              <i class="fas fa-chart-line"></i> Curva S Acumulada (%)
            </button>
            <button class="weekly-chart-tab-btn" data-mode="bars">
              <i class="fas fa-chart-simple"></i> Producción Semanal (%)
            </button>
          </div>
        </div>

        <div style="position: relative; height: 260px;">
          <canvas id="weeklyCurveChart"></canvas>
        </div>
      </div>

      <!-- Weekly Execution Audit Table -->
      <div class="weekly-table-card">
        <div class="weekly-table-header">
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.4rem; margin: 0;">
              <i class="fas fa-table-list" style="color: var(--brand-green);"></i> Registro Tabular de Ejecución Semanal y Metas
            </h4>
            <span style="font-size: 0.72rem; color: var(--text-muted);">
              Cifras porcentuales y cantidades físicas discriminadas por semana contractual
            </span>
          </div>

          <div style="font-size: 0.72rem; color: var(--text-muted);">
            Mostrando: <strong id="weeklyTableCount">${this.weeksData.length} semanas</strong>
          </div>
        </div>

        <div class="weekly-table-scroll">
          <table class="data-table" style="font-size: 0.76rem;">
            <thead>
              <tr>
                <th style="width: 70px;">Semana</th>
                <th style="width: 140px;">Periodo</th>
                <th style="width: 100px;">Estado</th>
                <th style="text-align: right;">Prog. Semanal</th>
                <th style="text-align: right;">Real Semanal</th>
                <th style="text-align: right;">Delta Sem.</th>
                <th style="text-align: right;">Prog. Acum.</th>
                <th style="text-align: right;">Real Acum.</th>
                <th>Hitos Principales de la Semana</th>
                <th style="text-align: right; width: 75px;">Acción</th>
              </tr>
            </thead>
            <tbody id="weeklyTableBody">
              ${this.renderWeeklyTableRows()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal for Future Weekly Data Upload Simulation -->
      <div class="modal-overlay" id="modalWeeklyImport" style="display: none;">
        <div class="modal-card" style="max-width: 620px;">
          <div class="modal-header">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
              <i class="fas fa-file-excel" style="color: #10b981;"></i> Cargar / Actualizar Datos de Semana
            </h3>
            <button class="modal-close-btn" id="btnCloseWeeklyModal">&times;</button>
          </div>
          <div class="modal-body" style="font-size: 0.82rem;">
            <p style="color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.45;">
              Este módulo permite ingresar los informes de avance semanal de la obra. Próximamente se podrá conectar directamente con planillas Excel o sincronización en tiempo real vía Google Sheets.
            </p>

            <div class="modal-form-grid">
              <div class="form-group">
                <label>Número de Semana Contractual:</label>
                <input type="number" id="inputModalSemana" value="18" min="1" max="46" />
              </div>
              <div class="form-group">
                <label>Periodo de la Semana:</label>
                <input type="text" id="inputModalPeriodo" value="28/09/2026 - 04/10/2026" />
              </div>
              <div class="form-group">
                <label>Avance Programado de la Semana (%):</label>
                <input type="number" step="0.01" id="inputModalProg" value="0.85" />
              </div>
              <div class="form-group">
                <label>Avance Real Ejecutado en la Semana (%):</label>
                <input type="number" step="0.01" id="inputModalReal" value="0.92" />
              </div>
              <div class="form-group">
                <label>Filtros Drenantes Instalados (ml):</label>
                <input type="number" id="inputModalFiltro" value="280" />
              </div>
              <div class="form-group">
                <label>Base Cemento MGTC Ejecutada (m):</label>
                <input type="number" id="inputModalCemento" value="650" />
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label>Observaciones de Obra e Interventoría:</label>
                <textarea rows="2" id="inputModalObs">Apertura de segundo frente de estabilización en sector K 3+500. Buen rendimiento climático durante la semana.</textarea>
              </div>
            </div>

            <div style="background: rgba(4, 120, 87, 0.08); border: 1px solid rgba(4, 120, 87, 0.2); border-radius: var(--radius-sm); padding: 0.75rem; margin-top: 1rem;">
              <strong style="color: var(--brand-green); font-size: 0.78rem; display: block; margin-bottom: 2px;">
                <i class="fas fa-lightbulb"></i> Simulación Instantánea:
              </strong>
              <span style="font-size: 0.74rem; color: var(--text-secondary);">
                Al hacer clic en "Simular Carga de Semana 18", el dashboard convertirá la semana 18 proyectada en semana ejecutada, actualizando la Curva S y los contrastes de avance al instante.
              </span>
            </div>
          </div>
          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button class="btn-secondary" id="btnCancelWeeklyModal">Cancelar</button>
            <button class="btn-primary" id="btnSaveWeeklyModal" style="background: var(--brand-green); border: none;">
              <i class="fas fa-check"></i> Simular Carga de Semana 18
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.selectWeek(this.currentWeek, false);
    this.renderChart();
  }

  buildWeeklyDataset(corridor) {
    const isE18 = !corridor || corridor.code === 'E-18' || corridor.code === 'E18' || (corridor.name && corridor.name.includes('Abejorral'));
    const totalWeeks = 46;
    const currentCutoffWeek = 17;

    // Base start date: 01/06/2026
    const startDate = new Date(2026, 5, 1); // Month is 0-indexed: 5 = June

    const weeks = [];
    let progAcum = 0;
    let realAcum = 0;

    // Real weekly execution percentages up to week 17 (totaling 2.58% at cut-off)
    const realIncrements = [
      0.05, 0.10, 0.15, 0.18, 0.18, 0.20, 0.20, 0.22, 0.18, 0.22,
      0.20, 0.15, 0.25, 0.28, 0.32, 0.38, 0.45
    ]; // Sum = ~3.71, let's normalize so week 17 hits 2.58% exactly
    const rawSum = realIncrements.reduce((a, b) => a + b, 0);
    const targetReal17 = isE18 ? 2.58 : 3.10;
    const factorReal = targetReal17 / rawSum;

    // Programmed weekly percentages (cumulative reaches 3.85% at week 17, and 100% at week 46)
    // S-curve distribution across 46 weeks:
    const progIncrements = [];
    for (let w = 1; w <= totalWeeks; w++) {
      if (w <= 17) {
        // Early phase: ~0.10% to 0.42% per week (sum to 3.85%)
        progIncrements.push(0.10 + (w - 1) * (0.32 / 16));
      } else {
        // Production & completion phase: remaining 96.15% over 29 weeks
        // S-curve peak between weeks 25 and 38 (~4.5% to 5.0% per week)
        const progressPhase = (w - 17) / 29; // 0 to 1
        const weight = Math.sin(progressPhase * Math.PI); // Peak in the middle
        const val = 1.8 + weight * 2.8; // 1.8% to 4.6% per week
        progIncrements.push(val);
      }
    }

    // Normalize programmed so week 17 is exactly 3.85%, and week 46 is 100.0%
    const progSum17 = progIncrements.slice(0, 17).reduce((a, b) => a + b, 0);
    const progFactor17 = 3.85 / progSum17;
    for (let i = 0; i < 17; i++) {
      progIncrements[i] = progIncrements[i] * progFactor17;
    }

    const progSumRest = progIncrements.slice(17).reduce((a, b) => a + b, 0);
    const progFactorRest = (100.0 - 3.85) / progSumRest;
    for (let i = 17; i < totalWeeks; i++) {
      progIncrements[i] = progIncrements[i] * progFactorRest;
    }

    // Authentic milestones catalogue for weeks
    const milestonesCatalog = [
      { sem: 1, text: 'Acta de Inicio (01/06/2026) · Replanteo general y comisiones topográficas K0 a K2.', top: 1500, flt: 0, alc: 0, cem: 0 },
      { sem: 2, text: 'Topografía de precisión y nivelación geométrica K2 a K4 · Coordinación predial.', top: 2000, flt: 0, alc: 0, cem: 0 },
      { sem: 3, text: 'Inicio de apiques geomecánicos (CBR K0 a K3) · Muestreo de subrasante.', top: 1800, flt: 0, alc: 0, cem: 0 },
      { sem: 4, text: 'Ensayos de laboratorio (Límites, Proctor, Granulometría) y apiques K3 a K7.', top: 2200, flt: 0, alc: 0, cem: 0 },
      { sem: 5, text: 'Topografía de detalle en curvas críticas K7 a K10 · Inspección de drenajes.', top: 2000, flt: 0, alc: 0, cem: 0 },
      { sem: 6, text: 'Diseño preliminar de mezcla de estabilización con cal y cemento Portland.', top: 1200, flt: 0, alc: 0, cem: 0 },
      { sem: 7, text: 'Inventario georreferenciado de alcantarillas existentes (22 puntos singularizados).', top: 1600, flt: 0, alc: 0, cem: 0 },
      { sem: 8, text: 'Topografía sector K10 a K13 · Localización de fuentes de materiales y botaderos.', top: 1500, flt: 0, alc: 0, cem: 0 },
      { sem: 9, text: 'Demolición controlada y limpieza de cabezotes en alcantarilla K 0+150.', top: 500, flt: 0, alc: 1, cem: 0 },
      { sem: 10, text: 'Instalación de tubería de concreto 36 pulg. en alcantarilla K 0+150 y encole.', top: 400, flt: 0, alc: 1, cem: 0 },
      { sem: 11, text: 'Excavación mecánica de zanja para filtro longitudinal granular en K 0+086 MI.', top: 300, flt: 150, alc: 0, cem: 0 },
      { sem: 12, text: 'Movilización e instalación de planta y maquinaria de estabilización en obra.', top: 400, flt: 220, alc: 1, cem: 0 },
      { sem: 13, text: 'INICIO DE ESTABILIZACIÓN (26/08/2026) · Tramo de prueba subrasante con cal K 0 a K 0+400.', top: 300, flt: 250, alc: 1, cem: 0 },
      { sem: 14, text: 'Subrasante estabilizada con cal al 3% K 0+400 a K 1+200 · Filtro granular MI en avance.', top: 200, flt: 240, alc: 1, cem: 0 },
      { sem: 15, text: 'Instalación de geotextil no tejido y tubería perforada en filtro K 0+600 a K 0+950.', top: 100, flt: 210, alc: 1, cem: 0 },
      { sem: 16, text: 'Tendido y compactación de Base MGTC 20-28 cm K 0+000 a K 0+800 · Pruebas de densidad.', top: 100, flt: 180, alc: 1, cem: 800 },
      { sem: 17, text: 'CORTE OFICIAL (24/09/2026): Cierre filtro MI (1.164 ml acumulados) · TSD K0-K1.2.', top: 100, flt: 164, alc: 1, cem: 400 },
      { sem: 18, text: 'Proyectada: Apertura de 2º frente de estabilización K 1+200 a K 3+500 (Base MGTC y MDC-19).', top: 500, flt: 300, alc: 2, cem: 1200 },
      { sem: 19, text: 'Proyectada: Estabilización con cemento MGTC K 1+800 a K 3+000 · Alcantarilla nueva K 3+105.', top: 400, flt: 350, alc: 2, cem: 1200 },
      { sem: 20, text: 'Proyectada: Construcción de cabezotes y aletas en alcantarillas K 1+820 y K 2+300.', top: 300, flt: 400, alc: 2, cem: 1400 }
    ];

    for (let w = 1; w <= totalWeeks; w++) {
      // Calculate start and end date of the week (7-day intervals)
      const wStart = new Date(startDate.getTime() + (w - 1) * 7 * 24 * 60 * 60 * 1000);
      const wEnd = new Date(wStart.getTime() + 6 * 24 * 60 * 60 * 1000);

      const startStr = `${String(wStart.getDate()).padStart(2, '0')}/${String(wStart.getMonth() + 1).padStart(2, '0')}/${wStart.getFullYear()}`;
      const endStr = `${String(wEnd.getDate()).padStart(2, '0')}/${String(wEnd.getMonth() + 1).padStart(2, '0')}/${wEnd.getFullYear()}`;

      const isClosed = w < currentCutoffWeek;
      const isCurrent = w === currentCutoffWeek;
      const isProjected = w > currentCutoffWeek;

      const pSem = parseFloat(progIncrements[w - 1].toFixed(2));
      progAcum = parseFloat((progAcum + pSem).toFixed(2));

      let rSem = null;
      let varSem = null;

      if (!isProjected) {
        if (w === currentCutoffWeek) {
          realAcum = targetReal17; // Exactly 2.58%
          const prevAcum = weeks.length > 0 ? weeks[weeks.length - 1].real_acum : 0;
          rSem = parseFloat((realAcum - prevAcum).toFixed(2));
        } else {
          rSem = parseFloat((realIncrements[w - 1] * factorReal).toFixed(2));
          realAcum = parseFloat((realAcum + rSem).toFixed(2));
        }
        varSem = parseFloat((rSem - pSem).toFixed(2));
      }

      // Projections for remaining weeks
      let proyAcum = null;
      if (isProjected) {
        // Projected cumulative starts from actual realAcum at week 17 and ramps up
        const remainingWeeks = totalWeeks - currentCutoffWeek;
        const remainingTarget = 100 - targetReal17;
        const idx = w - currentCutoffWeek;
        // Smooth progression to 100%
        proyAcum = parseFloat((targetReal17 + (remainingTarget * (idx / remainingWeeks))).toFixed(2));
      }

      // Find catalog info or generate projection notes
      const cat = milestonesCatalog.find(m => m.sem === w) || {
        text: `Proyección técnica: Avance programado del sector K ${(w * 0.5).toFixed(1)} km · Pavimentación y estabilización intensiva.`,
        top: 0,
        flt: isProjected ? 300 : 0,
        alc: isProjected ? 1 : 0,
        cem: isProjected ? 1200 : 0
      };

      weeks.push({
        semana: w,
        fecha_inicio: startStr,
        fecha_fin: endStr,
        rango_corto: `${wStart.getDate()} ${this.getMonthShort(wStart.getMonth())} - ${wEnd.getDate()} ${this.getMonthShort(wEnd.getMonth())}`,
        estado: isCurrent ? 'corte_actual' : (isClosed ? 'cerrada' : 'proyectada'),
        prog_semanal: pSem,
        real_semanal: rSem,
        variacion_semanal: varSem,
        prog_acum: progAcum,
        real_acum: realAcum,
        proy_acum: isProjected ? proyAcum : null,
        topografia_m: cat.top || 0,
        filtros_ml: cat.flt || 0,
        alcantarillas_und: cat.alc || 0,
        cemento_m: cat.cem || 0,
        hitos: cat.text
      });
    }

    return weeks;
  }

  getMonthShort(m) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[m] || '';
  }

  renderWeeklyRibbonCards() {
    return this.weeksData.map(w => {
      let stateClass = 'state-closed';
      let tagText = 'Cerrada';
      let tagBg = 'rgba(5, 150, 105, 0.12)';
      let tagColor = '#059669';
      let valDisplay = `+${w.real_semanal}%`;

      if (w.estado === 'corte_actual') {
        stateClass = 'state-current';
        tagText = 'Corte Actual';
        tagBg = 'var(--brand-green)';
        tagColor = '#ffffff';
        valDisplay = `+${w.real_semanal}%`;
      } else if (w.estado === 'proyectada') {
        stateClass = 'state-projected';
        tagText = 'Proyectada';
        tagBg = 'rgba(99, 102, 241, 0.12)';
        tagColor = '#6366f1';
        valDisplay = `Meta +${w.prog_semanal}%`;
      }

      const isSelected = w.semana === this.currentWeek;

      return `
        <div class="week-pill-node ${stateClass} ${isSelected ? 'active-selected' : ''}" 
             data-semana="${w.semana}"
             data-estado="${w.estado}"
             title="Semana ${w.semana} (${w.fecha_inicio} a ${w.fecha_fin})">
          <div class="week-node-num">
            <span>Semana ${w.semana}</span>
            <span class="week-node-tag" style="background: ${tagBg}; color: ${tagColor}; font-size: 0.58rem;">
              ${tagText}
            </span>
          </div>
          <div class="week-node-dates">${w.rango_corto}</div>
          <div class="week-node-values">
            <span class="week-node-val" style="color: ${w.estado === 'proyectada' ? '#6366f1' : '#047857'};">
              ${valDisplay}
            </span>
            <span style="font-size: 0.62rem; color: var(--text-muted); font-family: var(--font-mono);">
              Acum: ${w.estado === 'proyectada' ? w.proy_acum : w.real_acum}%
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderWeeklyTableRows() {
    return this.weeksData.map(w => {
      const isSelected = w.semana === this.currentWeek;
      let stateBadge = '';

      if (w.estado === 'corte_actual') {
        stateBadge = '<span class="tag-badge" style="background: var(--brand-green); color: #fff; font-weight: 800;">★ Semana 17 (Corte)</span>';
      } else if (w.estado === 'cerrada') {
        stateBadge = '<span class="tag-badge" style="background: rgba(5,150,105,0.12); color: #047857; font-weight: 700;"><i class="fas fa-check"></i> Cerrada</span>';
      } else {
        stateBadge = '<span class="tag-badge" style="background: rgba(99,102,241,0.12); color: #6366f1; font-weight: 700;"><i class="fas fa-forward"></i> Proyectada</span>';
      }

      let deltaBadge = '<span style="color: var(--text-muted);">-</span>';
      if (w.variacion_semanal !== null) {
        if (w.variacion_semanal >= 0) {
          deltaBadge = `<span style="color: #059669; font-weight: 700;">▲ +${w.variacion_semanal}%</span>`;
        } else {
          deltaBadge = `<span style="color: var(--alert-red); font-weight: 700;">▼ ${w.variacion_semanal}%</span>`;
        }
      }

      return `
        <tr class="weekly-table-row ${isSelected ? 'active-row' : ''}" data-semana="${w.semana}">
          <td style="font-weight: 800; font-family: var(--font-mono); color: var(--text-primary);">
            Sem ${String(w.semana).padStart(2, '0')}
          </td>
          <td style="font-size: 0.72rem; color: var(--text-secondary);">
            ${w.fecha_inicio} al ${w.fecha_fin}
          </td>
          <td>${stateBadge}</td>
          <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: var(--text-muted);">
            ${w.prog_semanal.toFixed(2)}%
          </td>
          <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: ${w.real_semanal !== null ? '#047857' : 'var(--text-muted)'};">
            ${w.real_semanal !== null ? `${w.real_semanal.toFixed(2)}%` : '—'}
          </td>
          <td style="text-align: right; font-family: var(--font-mono); font-size: 0.72rem;">
            ${deltaBadge}
          </td>
          <td style="text-align: right; font-family: var(--font-mono); color: var(--text-secondary);">
            ${w.prog_acum.toFixed(2)}%
          </td>
          <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: var(--text-primary);">
            ${w.estado === 'proyectada' ? `${w.proy_acum.toFixed(2)}% (Proy)` : `${w.real_acum.toFixed(2)}%`}
          </td>
          <td style="font-size: 0.73rem; color: var(--text-secondary); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${w.hitos}">
            ${w.hitos}
          </td>
          <td style="text-align: right;">
            <button class="btn-select-week-row" data-semana="${w.semana}" style="background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 2px 6px; font-size: 0.7rem; font-weight: 700; cursor: pointer; color: var(--brand-green);">
              Ver
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  selectWeek(weekNum, scrollIntoView = true) {
    this.currentWeek = weekNum;
    const w = this.weeksData.find(item => item.semana === weekNum) || this.weeksData[16];

    // Highlight node in ribbon
    if (this.container) {
      this.container.querySelectorAll('.week-pill-node').forEach(node => {
        const s = parseInt(node.getAttribute('data-semana'), 10);
        if (s === weekNum) {
          node.classList.add('active-selected');
          if (scrollIntoView) {
            node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        } else {
          node.classList.remove('active-selected');
        }
      });

      // Highlight row in table
      this.container.querySelectorAll('.weekly-table-row').forEach(row => {
        const s = parseInt(row.getAttribute('data-semana'), 10);
        if (s === weekNum) {
          row.classList.add('active-row');
        } else {
          row.classList.remove('active-row');
        }
      });
    }

    // Update Spotlight Banner
    this.updateSpotlightBanner(w);

    // Update 4-KPI Grid
    this.updateKpiGrid(w);

    // Update Chart with highlighted index
    this.updateChartHighlight(weekNum);
  }

  updateSpotlightBanner(w) {
    const banner = this.container.querySelector('#weeklySelectedBanner');
    if (!banner) return;

    let badgeStatus = '';
    if (w.estado === 'corte_actual') {
      badgeStatus = '<span class="tag-badge" style="background: var(--brand-green); color: #fff; font-weight: 800;"><i class="fas fa-star"></i> SEMANA DE CORTE OFICIAL (24/09/2026)</span>';
    } else if (w.estado === 'cerrada') {
      badgeStatus = '<span class="tag-badge" style="background: rgba(5,150,105,0.15); color: #047857; font-weight: 700;"><i class="fas fa-check-circle"></i> SEMANA CERRADA Y CERTIFICADA</span>';
    } else {
      badgeStatus = '<span class="tag-badge" style="background: rgba(99,102,241,0.15); color: #6366f1; font-weight: 700;"><i class="fas fa-compass"></i> PROYECCIÓN TÉCNICA FUTURA</span>';
    }

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap;">
        <div style="background: var(--brand-green); color: #ffffff; font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; padding: 6px 12px; border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);">
          SEM ${String(w.semana).padStart(2, '0')}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <strong style="font-size: 0.95rem; color: var(--text-primary);">
              Periodo: ${w.fecha_inicio} al ${w.fecha_fin}
            </strong>
            ${badgeStatus}
          </div>
          <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 2px;">
            <i class="fas fa-bullhorn" style="color: var(--brand-gold);"></i> <strong>Hito de Obra:</strong> ${w.hitos}
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.5rem;">
        <button class="btn-secondary btn-nav-week" data-dir="-1" ${w.semana <= 1 ? 'disabled' : ''} style="padding: 4px 8px; font-size: 0.72rem;">
          <i class="fas fa-chevron-left"></i> Semana Anterior
        </button>
        <button class="btn-secondary btn-nav-week" data-dir="1" ${w.semana >= 46 ? 'disabled' : ''} style="padding: 4px 8px; font-size: 0.72rem;">
          Semana Siguiente <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;

    banner.querySelectorAll('.btn-nav-week').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = parseInt(btn.getAttribute('data-dir'), 10);
        const next = Math.max(1, Math.min(46, this.currentWeek + dir));
        this.selectWeek(next, true);
      });
    });
  }

  updateKpiGrid(w) {
    const grid = this.container.querySelector('#weeklyKpiGrid');
    if (!grid) return;

    const isProj = w.estado === 'proyectada';

    // Delta badge logic
    let deltaHtml = '';
    if (!isProj && w.variacion_semanal !== null) {
      if (w.variacion_semanal >= 0) {
        deltaHtml = `<span class="kpi-badge success" style="font-size: 0.68rem;"><i class="fas fa-arrow-trend-up"></i> +${w.variacion_semanal}% Favorable vs meta</span>`;
      } else {
        deltaHtml = `<span class="kpi-badge danger" style="font-size: 0.68rem;"><i class="fas fa-arrow-trend-down"></i> ${w.variacion_semanal}% Brecha semanal</span>`;
      }
    } else {
      deltaHtml = `<span class="tag-badge" style="background: rgba(99,102,241,0.1); color: #6366f1; font-size: 0.68rem;">Meta Programada de Curva</span>`;
    }

    // Accumulated gap logic
    const gapAcum = isProj ? null : (w.real_acum - w.prog_acum).toFixed(2);
    let gapAcumHtml = '';
    if (gapAcum !== null) {
      if (gapAcum >= 0) {
        gapAcumHtml = `<span style="color: #059669; font-weight: 700;">+${gapAcum}% por encima del cronograma</span>`;
      } else {
        gapAcumHtml = `<span style="color: var(--alert-red); font-weight: 700;">${gapAcum}% de desvío acumulado</span>`;
      }
    } else {
      gapAcumHtml = `<span style="color: #6366f1; font-weight: 700;">Curva proyectada a meta 100%</span>`;
    }

    // Remaining required weekly rate
    const weeksRemaining = Math.max(1, 46 - w.semana);
    const targetRemaining = 100 - (isProj ? w.proy_acum : w.real_acum);
    const reqRate = (targetRemaining / weeksRemaining).toFixed(2);

    grid.innerHTML = `
      <!-- KPI 1: Weekly Increment Contrast -->
      <div class="weekly-kpi-box">
        <div class="weekly-kpi-box-header">
          <span class="weekly-kpi-label">Avance en la Semana ${w.semana}</span>
          <i class="fas fa-calendar-day" style="color: var(--brand-green);"></i>
        </div>
        <div class="weekly-kpi-big" style="color: ${isProj ? '#6366f1' : 'var(--brand-green)'};">
          ${isProj ? `+${w.prog_semanal}%` : `+${w.real_semanal}%`}
        </div>
        <div class="weekly-kpi-subtext">
          ${deltaHtml}
        </div>
        <div style="font-size: 0.68rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 4px; margin-top: 2px;">
          Programado Semanal: <strong>${w.prog_semanal}%</strong>
        </div>
      </div>

      <!-- KPI 2: Cumulative Progress vs Programmed -->
      <div class="weekly-kpi-box kpi-accent-gold">
        <div class="weekly-kpi-box-header">
          <span class="weekly-kpi-label">Avance Acumulado a Sem ${w.semana}</span>
          <i class="fas fa-chart-line" style="color: var(--brand-gold);"></i>
        </div>
        <div class="weekly-kpi-big" style="color: var(--text-primary);">
          ${isProj ? `${w.proy_acum}%` : `${w.real_acum}%`}
        </div>
        <div class="weekly-kpi-subtext" style="font-size: 0.7rem;">
          ${gapAcumHtml}
        </div>
        <div style="font-size: 0.68rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 4px; margin-top: 2px;">
          Programado Acumulado: <strong>${w.prog_acum}%</strong>
        </div>
      </div>

      <!-- KPI 3: Physical Quantities in Week -->
      <div class="weekly-kpi-box kpi-accent-blue">
        <div class="weekly-kpi-box-header">
          <span class="weekly-kpi-label">Producción Física en Semana</span>
          <i class="fas fa-cubes-stacked" style="color: #0284c7;"></i>
        </div>
        <div style="display: flex; flex-direction: column; gap: 3px; margin: 4px 0;">
          <div style="display: flex; justify-content: space-between; font-size: 0.74rem;">
            <span><i class="fas fa-filter" style="color: #2563eb;"></i> Filtros Drenantes:</span>
            <strong>+${w.filtros_ml} ml</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.74rem;">
            <span><i class="fas fa-road" style="color: #d97706;"></i> Base Cemento MGTC:</span>
            <strong>+${w.cemento_m} m</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.74rem;">
            <span><i class="fas fa-circle-dot" style="color: #0284c7;"></i> Obras Puntuales:</span>
            <strong>${w.alcantarillas_und > 0 ? `+${w.alcantarillas_und} Alcantarilla` : 'Mantenimiento'}</strong>
          </div>
        </div>
        <div style="font-size: 0.68rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 4px; margin-top: 2px;">
          Topografía: <strong>${w.topografia_m > 0 ? `+${w.topografia_m} m` : 'Fase concluida'}</strong>
        </div>
      </div>

      <!-- KPI 4: Future Performance & Projection Rate -->
      <div class="weekly-kpi-box kpi-accent-purple">
        <div class="weekly-kpi-box-header">
          <span class="weekly-kpi-label">Ritmo Requerido al Vencimiento</span>
          <i class="fas fa-flag-checkered" style="color: #6366f1;"></i>
        </div>
        <div class="weekly-kpi-big" style="color: #6366f1;">
          ${reqRate}% <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">/ sem</span>
        </div>
        <div class="weekly-kpi-subtext" style="font-size: 0.7rem;">
          <span style="color: var(--text-secondary);">Semanas Restantes: <strong>${weeksRemaining} sem</strong></span>
        </div>
        <div style="font-size: 0.68rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 4px; margin-top: 2px;">
          Fecha Meta: <strong>20/04/2027 (Semana 46)</strong>
        </div>
      </div>
    `;
  }

  renderChart() {
    const canvas = document.getElementById('weeklyCurveChart');
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    const labels = this.weeksData.map(w => `Sem ${w.semana}`);

    if (this.chartMode === 'curve') {
      // 1. Curva S Acumulada: Programado vs Real vs Proyección
      const progAcumData = this.weeksData.map(w => w.prog_acum);
      const realAcumData = this.weeksData.map(w => (w.semana <= 17 ? w.real_acum : null));
      const proyAcumData = this.weeksData.map(w => {
        if (w.semana === 17) return w.real_acum;
        if (w.semana > 17) return w.proy_acum;
        return null;
      });

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Programado Contractual (Curva S %)',
              data: progAcumData,
              borderColor: '#d97706',
              backgroundColor: 'rgba(217, 119, 6, 0.05)',
              borderWidth: 2,
              borderDash: [4, 4],
              pointRadius: 1,
              tension: 0.35,
              fill: true
            },
            {
              label: 'Ejecutado Real Acumulado (%)',
              data: realAcumData,
              borderColor: '#047857',
              backgroundColor: 'rgba(4, 120, 87, 0.12)',
              borderWidth: 3,
              pointRadius: (ctx) => {
                const idx = ctx.dataIndex;
                return (idx + 1 === this.currentWeek) ? 6 : 2;
              },
              pointBackgroundColor: '#047857',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Proyección Futura Requerida (%)',
              data: proyAcumData,
              borderColor: '#0284c7',
              borderWidth: 2.5,
              borderDash: [5, 5],
              pointRadius: (ctx) => {
                const idx = ctx.dataIndex;
                return (idx + 1 === this.currentWeek) ? 6 : 1;
              },
              pointBackgroundColor: '#0284c7',
              tension: 0.35,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: "'Outfit', sans-serif", size: 11, weight: 'bold' },
                color: '#334155'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleFont: { weight: 'bold', size: 12 },
              bodyFont: { size: 11 },
              padding: 10,
              callbacks: {
                label: function(context) {
                  const val = context.parsed.y;
                  if (val === null || val === undefined) return '';
                  return `${context.dataset.label}: ${val.toFixed(2)}%`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 10 },
                color: '#64748b',
                maxTicksLimit: 16
              }
            },
            y: {
              min: 0,
              max: 105,
              ticks: {
                font: { size: 10 },
                color: '#64748b',
                callback: (val) => `${val}%`
              },
              grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
          }
        }
      });
    } else {
      // 2. Producción Semanal (Barras de Contraste)
      const progWeeklyData = this.weeksData.map(w => w.prog_semanal);
      const realWeeklyData = this.weeksData.map(w => (w.semana <= 17 ? w.real_semanal : null));
      const proyWeeklyData = this.weeksData.map(w => (w.semana > 17 ? w.prog_semanal : null));

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ejecutado Real en Semana (%)',
              data: realWeeklyData,
              backgroundColor: '#047857',
              borderRadius: 3,
              borderWidth: 0
            },
            {
              label: 'Programado en Semana (%)',
              data: progWeeklyData,
              backgroundColor: 'rgba(217, 119, 6, 0.4)',
              borderColor: '#d97706',
              borderWidth: 1,
              borderRadius: 3
            },
            {
              label: 'Meta Semanal Proyectada (%)',
              data: proyWeeklyData,
              backgroundColor: 'rgba(99, 102, 241, 0.3)',
              borderColor: '#6366f1',
              borderWidth: 1,
              borderDash: [2, 2],
              borderRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: "'Outfit', sans-serif", size: 11, weight: 'bold' },
                color: '#334155'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              callbacks: {
                label: function(context) {
                  const val = context.parsed.y;
                  if (val === null || val === undefined) return '';
                  return `${context.dataset.label}: +${val.toFixed(2)}%`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, color: '#64748b', maxTicksLimit: 16 }
            },
            y: {
              min: 0,
              ticks: {
                font: { size: 10 },
                color: '#64748b',
                callback: (val) => `+${val}%`
              },
              grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
          }
        }
      });
    }
  }

  updateChartHighlight(weekNum) {
    if (!this.chartInstance) return;
    this.chartInstance.update();
  }

  attachEvents() {
    // 1. Ribbon Week Pill Click
    this.container.querySelectorAll('.week-pill-node').forEach(node => {
      node.addEventListener('click', () => {
        const w = parseInt(node.getAttribute('data-semana'), 10);
        this.selectWeek(w, true);
      });
    });

    // 2. Ribbon Quick Filter Buttons
    const filterContainer = this.container.querySelector('#weeklyFilterPills');
    if (filterContainer) {
      filterContainer.querySelectorAll('.weekly-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.weekly-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');
          this.applyFilter(filter);
        });
      });
    }

    // 3. Chart Mode Toggle (Curva S vs Barras)
    const chartTabs = this.container.querySelector('#weeklyChartTabs');
    if (chartTabs) {
      chartTabs.querySelectorAll('.weekly-chart-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          chartTabs.querySelectorAll('.weekly-chart-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.chartMode = btn.getAttribute('data-mode');
          this.renderChart();
        });
      });
    }

    // 4. Table Row Click & Locate
    this.container.querySelectorAll('.weekly-table-row').forEach(row => {
      row.addEventListener('click', () => {
        const w = parseInt(row.getAttribute('data-semana'), 10);
        this.selectWeek(w, true);
      });
    });

    this.container.querySelectorAll('.btn-select-week-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const w = parseInt(btn.getAttribute('data-semana'), 10);
        this.selectWeek(w, true);
      });
    });

    // 5. Modal Cargar / Actualizar Semana
    const openModalBtn = this.container.querySelector('#btnOpenWeeklyModal');
    const modal = this.container.querySelector('#modalWeeklyImport');
    const closeModalBtn = this.container.querySelector('#btnCloseWeeklyModal');
    const cancelModalBtn = this.container.querySelector('#btnCancelWeeklyModal');
    const saveModalBtn = this.container.querySelector('#btnSaveWeeklyModal');

    const openModal = () => { if (modal) modal.style.display = 'flex'; };
    const closeModal = () => { if (modal) modal.style.display = 'none'; };

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (saveModalBtn) {
      saveModalBtn.addEventListener('click', () => {
        this.simulateAddWeek18();
        closeModal();
      });
    }
  }

  applyFilter(filterKey) {
    this.filterState = filterKey;
    const scrollNodes = this.container.querySelectorAll('.week-pill-node');
    const tableRows = this.container.querySelectorAll('.weekly-table-row');

    let visibleCount = 0;

    scrollNodes.forEach(node => {
      const sem = parseInt(node.getAttribute('data-semana'), 10);
      const est = node.getAttribute('data-estado');
      let show = true;

      if (filterKey === 'executed' && est === 'projected') show = false;
      if (filterKey === 'current' && est !== 'corte_actual') show = false;
      if (filterKey === 'projected' && est !== 'projected') show = false;

      node.style.display = show ? 'flex' : 'none';
    });

    tableRows.forEach(row => {
      const sem = parseInt(row.getAttribute('data-semana'), 10);
      const w = this.weeksData.find(item => item.semana === sem);
      if (!w) return;

      let show = true;
      if (filterKey === 'executed' && w.estado === 'proyectada') show = false;
      if (filterKey === 'current' && w.estado !== 'corte_actual') show = false;
      if (filterKey === 'projected' && w.estado !== 'proyectada') show = false;

      row.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    const countLabel = this.container.querySelector('#weeklyTableCount');
    if (countLabel) countLabel.innerText = `${visibleCount} semanas`;
  }

  simulateAddWeek18() {
    // Convert week 18 from projected into actual executed
    const w18 = this.weeksData.find(w => w.semana === 18);
    if (w18) {
      w18.estado = 'cerrada';
      w18.real_semanal = 0.92;
      w18.real_acum = parseFloat((2.58 + 0.92).toFixed(2)); // 3.50%
      w18.variacion_semanal = parseFloat((0.92 - w18.prog_semanal).toFixed(2));
      w18.hitos = 'ACTUALIZACIÓN SEMANAL CARGADA: Apertura 2º frente K 3+500 · +280 ml filtros · +650 m base MGTC ejecutados.';
      w18.filtros_ml = 280;
      w18.cemento_m = 650;
      w18.alcantarillas_und = 2;

      // Re-render dataset and select week 18
      this.currentWeek = 18;
      this.render(this.currentCorridor);
      this.selectWeek(18, true);

      // Toast feedback
      this.showToast('¡Actualización de Semana 18 cargada exitosamente! Avance real: +0.92% (Acumulado: 3.50%). Curva S y contrastes actualizados.');
    }
  }

  showToast(msg) {
    let toast = document.getElementById('weeklyToastAlert');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'weeklyToastAlert';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.background = 'var(--brand-green)';
      toast.style.color = '#ffffff';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
      toast.style.zIndex = '9999';
      toast.style.fontSize = '0.85rem';
      toast.style.fontWeight = '700';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-circle-check" style="margin-right: 6px;"></i> ${msg}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 4500);
  }
}

// Export globally
window.WeeklyProgressManager = WeeklyProgressManager;
