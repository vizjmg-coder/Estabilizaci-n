/* ==========================================================================
   MULTI-BAND LINEAR STRIP CHART: DIAGRAMA DE BANDAS VIALES SINCRONIZADAS
   Secretaría de Infraestructura Física · Gobernación de Antioquia
   Control Métrico de Obras Puntuales, Drenaje Longitudinal,
   Estructura de Pavimento, Trabajos de Campo y Señalización
   ========================================================================== */

class AbscissasManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCorridor = null;
    this.currentKm = 13.400; // Default station matching reference mockup (K13+400)
    this.activeCategory = 'all'; // all, puntual, drenaje, estructura, campo, senalizacion
    this.activeMode = 'avance'; // avance, cantidades, evidencias
    this.zoomLevel = 1.0; // 1.0, 1.5, 2.0, 3.0
    this.panelOpen = true;
    this.isDragging = false;
  }

  render(corridor) {
    this.currentCorridor = corridor;
    if (!this.container) return;

    const totalKm = corridor.longitud_contractual_km || 23.77;
    // Set initial km to K13+400 if fits in totalKm, otherwise proportional
    if (this.currentKm > totalKm) {
      this.currentKm = Math.min(13.4, totalKm * 0.56);
    }

    const puntos = corridor.puntos_singulares || this.getDefaultPuntos(corridor);
    const culverts = puntos.filter(p => p.categoria === 'alcantarilla' || p.categoria === 'alcantarilla_nueva' || p.categoria === 'anulada');
    const culvertsCount = culverts.length || 22;

    this.container.innerHTML = `
      <div class="strip-chart-card">
        
        <!-- 1. Top Navigation & Controls Toolbar -->
        <div class="strip-toolbar">
          <!-- Left: Category Filter Pills -->
          <div class="strip-category-pills" id="stripCategoryPills">
            <button class="cat-pill ${this.activeCategory === 'all' ? 'active' : ''}" data-category="all">
              <i class="fas fa-layer-group"></i> Todas
            </button>
            <button class="cat-pill ${this.activeCategory === 'drenaje' ? 'active' : ''}" data-category="drenaje">
              <i class="fas fa-droplet" style="color: #2563eb;"></i> Drenaje y Obras
            </button>
            <button class="cat-pill ${this.activeCategory === 'estructura' ? 'active' : ''}" data-category="estructura">
              <i class="fas fa-cubes-stacked" style="color: #ea580c;"></i> Estructura Pavimento
            </button>
            <button class="cat-pill ${this.activeCategory === 'campo' ? 'active' : ''}" data-category="campo">
              <i class="fas fa-compass-drafting" style="color: #0d9488;"></i> Campo y Geotecnia
            </button>
            <button class="cat-pill ${this.activeCategory === 'senalizacion' ? 'active' : ''}" data-category="senalizacion">
              <i class="fas fa-triangle-exclamation" style="color: #7c3aed;"></i> Señalización
            </button>
          </div>

          <!-- Right: Zoom, Search, and Mode Switcher -->
          <div class="strip-right-controls">
            <!-- Zoom Controls -->
            <div class="strip-zoom-group">
              <button class="strip-zoom-btn" id="stripZoomReset" title="Restablecer escala (100%)">
                <i class="fas fa-magnifying-glass"></i>
              </button>
              <button class="strip-zoom-btn" id="stripZoomOut" title="Alejar (-)">
                <i class="fas fa-minus"></i>
              </button>
              <button class="strip-zoom-btn" id="stripZoomIn" title="Acercar (+)">
                <i class="fas fa-plus"></i>
              </button>
            </div>

            <!-- Abscissa Search -->
            <div class="strip-search-box">
              <i class="fas fa-search"></i>
              <input type="text" id="stripAbscissaSearch" placeholder="Buscar abscisa..." autocomplete="off" />
            </div>

            <!-- Mode Switcher -->
            <div class="strip-mode-group">
              <span>Modo:</span>
              <div class="strip-mode-toggle" id="stripModeToggle">
                <button class="mode-btn ${this.activeMode === 'avance' ? 'active' : ''}" data-mode="avance">Avance</button>
                <button class="mode-btn ${this.activeMode === 'cantidades' ? 'active' : ''}" data-mode="cantidades">Cantidades</button>
                <button class="mode-btn ${this.activeMode === 'evidencias' ? 'active' : ''}" data-mode="evidencias">Evidencias</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Main Split Layout: Bands Board + Station Inspector Sidebar -->
        <div class="strip-main-split ${this.panelOpen ? '' : 'panel-collapsed'}" id="stripMainSplit">

          <!-- Left / Center: Synchronized Linear Diagram Stage -->
          <div class="strip-board-stage" id="stripBoardStage">

            <!-- Ruler Track Header Row -->
            <div class="strip-ruler-row">
              <div class="strip-ruler-meta">
                <span class="ruler-title-tag">ABSCISA / PROGRESIVA</span>
              </div>
              
              <div class="strip-ruler-scroll-viewport" id="rulerViewport">
                <div class="strip-ruler-track-wrapper" id="rulerTrackWrapper">
                  <!-- Dark Forest Green Ruler Bar -->
                  <div class="strip-forest-ruler" id="forestRuler">
                    <div class="ruler-ticks-container" id="rulerTicksContainer">
                      ${this.renderRulerTicks(totalKm)}
                    </div>
                    <div class="forest-ruler-bar" id="forestRulerBar" title="Haz clic o arrastra para mover el cursor">
                      <div class="forest-ruler-ticks-line"></div>
                      <div class="ruler-pin-indicator" id="rulerPinIndicator" style="left: ${(this.currentKm / totalKm) * 100}%;">
                        <!-- Floating Tooltip on Top Pin -->
                        <div class="strip-needle-tooltip" id="needleTooltip">
                          <div class="tooltip-header">
                            <span class="tooltip-station" id="tooltipStationText">${this.formatAbscissa(this.currentKm)}</span>
                            <span class="tooltip-status-pill" id="tooltipStatusPill">En progreso</span>
                          </div>
                          <div class="tooltip-body">
                            <span class="tooltip-subtitle">Actividades en esta abscisa:</span>
                            <ul class="tooltip-activities-list" id="tooltipActivitiesList">
                              <!-- Populated dynamically -->
                            </ul>
                          </div>
                          <a href="javascript:void(0)" class="tooltip-action-link" id="tooltipInspectAction">
                            Ver detalle de estación <i class="fas fa-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Synchronized Lanes Scrollable Container -->
            <div class="strip-lanes-scroll-viewport" id="lanesViewport">
              <div class="strip-lanes-content-wrapper" id="lanesContentWrapper">

                <!-- Synchronized Vertical Red Needle (Spans across all bands) -->
                <div class="strip-sync-needle" id="stripSyncNeedle" style="left: calc(240px + 1rem + ((100% - 240px - 1rem) * ${(this.currentKm / totalKm)}));">
                  <!-- Vertical Red Line -->
                  <div class="needle-vertical-line"></div>

                  <!-- Bottom Red Station Badge -->
                  <div class="needle-bottom-badge" id="needleBottomBadge">${this.formatAbscissa(this.currentKm)}</div>
                </div>

                <!-- Lane 1: Drenaje (Cunetas en barra progresiva, Filtros en puntos, Alcantarillas en puntos) -->
                <div class="strip-lane-row" data-lane="drenaje" id="laneDrenaje">
                  <div class="lane-meta-card">
                    <div class="lane-meta-header">
                      <div class="lane-avatar avatar-drenaje">
                        <i class="fas fa-droplet"></i>
                      </div>
                      <div class="lane-meta-texts">
                        <h4 class="lane-title">Drenaje y obras</h4>
                        <span class="lane-subtitle" id="laneSubtitleDrenaje">Cunetas, filtros y 22 alcantarillas · ${totalKm.toFixed(2)} km</span>
                      </div>
                    </div>
                    <div class="lane-sublayers-legend">
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-cuneta"></span> Cunetas (Barra progresiva · 0% ejec.)</div>
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-filtro"></span> Filtros (Puntos · 1.164 ml continuos)</div>
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-alcantarilla"></span> Alcantarillas (22 puntos singulares)</div>
                    </div>
                    <div class="lane-progress-row">
                      <span class="lane-pct-text" id="lanePctDrenaje">48,9%</span>
                      <div class="lane-progress-bar-bg">
                        <div class="lane-progress-bar-fill fill-drenaje" id="laneFillDrenaje" style="width: 48.9%;"></div>
                      </div>
                      <span class="lane-status-badge status-progress">
                        <span class="status-dot"></span> En ejecución
                      </span>
                    </div>
                  </div>

                  <div class="lane-track-card" id="laneTrackDrenaje">
                    ${this.renderDrenajeTrack(puntos, totalKm)}
                  </div>
                </div>

                <!-- Lane 2: Estructura de pavimento (3 capas discriminadas en barras) -->
                <div class="strip-lane-row" data-lane="estructura" id="laneEstructura">
                  <div class="lane-meta-card">
                    <div class="lane-meta-header">
                      <div class="lane-avatar avatar-estructura">
                        <i class="fas fa-cubes-stacked"></i>
                      </div>
                      <div class="lane-meta-texts">
                        <h4 class="lane-title">Estructura pavimento</h4>
                        <span class="lane-subtitle" id="laneSubtitleEstructura">Paquete de 3 capas · ${totalKm.toFixed(2)} km</span>
                      </div>
                    </div>
                    <div class="lane-sublayers-legend">
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-rodadura"></span> Rodadura (TSD/MDC)</div>
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-mgtc"></span> Base Cemento MGTC</div>
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-cal"></span> Subrasante con Cal</div>
                    </div>
                    <div class="lane-progress-row">
                      <span class="lane-pct-text" id="lanePctEstructura">12,4%</span>
                      <div class="lane-progress-bar-bg">
                        <div class="lane-progress-bar-fill fill-estructura" id="laneFillEstructura" style="width: 12.4%;"></div>
                      </div>
                      <span class="lane-status-badge status-progress">
                        <span class="status-dot"></span> En ejecución
                      </span>
                    </div>
                  </div>

                  <div class="lane-track-card" id="laneTrackEstructura">
                    ${this.renderEstructuraTrack(totalKm)}
                  </div>
                </div>

                <!-- Lane 3: Campo (Topografía como barra de progreso, Apiques como puntos) -->
                <div class="strip-lane-row" data-lane="campo" id="laneCampo">
                  <div class="lane-meta-card">
                    <div class="lane-meta-header">
                      <div class="lane-avatar avatar-campo">
                        <i class="fas fa-compass-drafting"></i>
                      </div>
                      <div class="lane-meta-texts">
                        <h4 class="lane-title">Campo y Geotecnia</h4>
                        <span class="lane-subtitle" id="laneSubtitleCampo">Topografía y exploración · ${totalKm.toFixed(2)} km</span>
                      </div>
                    </div>
                    <div class="lane-sublayers-legend">
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-topo"></span> Topografía (Barra 16 km · 67,3%)</div>
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-apiques"></span> Apiques (Puntos 21 km · 88,4%)</div>
                    </div>
                    <div class="lane-progress-row">
                      <span class="lane-pct-text" id="lanePctCampo">77,8%</span>
                      <div class="lane-progress-bar-bg">
                        <div class="lane-progress-bar-fill fill-campo" id="laneFillCampo" style="width: 77.8%;"></div>
                      </div>
                      <span class="lane-status-badge status-progress">
                        <span class="status-dot"></span> En ejecución
                      </span>
                    </div>
                  </div>

                  <div class="lane-track-card" id="laneTrackCampo">
                    ${this.renderCampoTrack(totalKm)}
                  </div>
                </div>

                <!-- Lane 4: Señalización y otros -->
                <div class="strip-lane-row" data-lane="senalizacion" id="laneSenalizacion">
                  <div class="lane-meta-card">
                    <div class="lane-meta-header">
                      <div class="lane-avatar avatar-senalizacion">
                        <i class="fas fa-triangle-exclamation"></i>
                      </div>
                      <div class="lane-meta-texts">
                        <h4 class="lane-title">Señalización y otros</h4>
                        <span class="lane-subtitle" id="laneSubtitleSenalizacion">Señales, defensas y demarcación · ${totalKm.toFixed(2)} km</span>
                      </div>
                    </div>
                    <div class="lane-sublayers-legend">
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-senal"></span> Señales verticales (K2+000, K14+200)</div>
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-defensas"></span> Defensas metálicas (K7+500)</div>
                      <div class="sublayer-item"><span class="sublayer-bullet bullet-demarcacion"></span> Demarcación vial (K19+800)</div>
                    </div>
                    <div class="lane-progress-row">
                      <span class="lane-pct-text" id="lanePctSenalizacion">18,7%</span>
                      <div class="lane-progress-bar-bg">
                        <div class="lane-progress-bar-fill fill-senalizacion" id="laneFillSenalizacion" style="width: 18.7%;"></div>
                      </div>
                      <span class="lane-status-badge status-progress">
                        <span class="status-dot"></span> En ejecución
                      </span>
                    </div>
                  </div>

                  <div class="lane-track-card" id="laneTrackSenalizacion">
                    ${this.renderSenalizacionTrack(totalKm)}
                  </div>
                </div>

              </div>
            </div>

            <!-- Reopen Inspector Button (if panel is closed) -->
            <div id="reopenPanelContainer" style="${this.panelOpen ? 'display: none;' : 'display: flex;'} justify-content: flex-end;">
              <button class="btn-reopen-station-panel" id="btnReopenStationPanel">
                <i class="fas fa-location-dot"></i> Ver detalle de estación (${this.formatAbscissa(this.currentKm)})
              </button>
            </div>

          </div>

          <!-- Right Side Panel: Detalle de estación -->
          <div class="strip-station-panel" id="stripStationPanel">
            <div class="station-panel-header">
              <h3 class="station-panel-title">Detalle de estación</h3>
              <button class="station-panel-close-btn" id="stationPanelCloseBtn" title="Cerrar panel">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="station-panel-body" id="stationPanelBody">
              <!-- Populated dynamically by updateStationPanel -->
            </div>
          </div>

        </div>

        <!-- 3. Bottom Section: Resumen de avance por actividad (5 Cards) -->
        <div class="strip-summary-section">
          <div class="strip-summary-header">
            <h4 class="strip-summary-title">Resumen de avance por actividad</h4>
            <a href="javascript:void(0)" class="strip-summary-link" id="stripSummaryExpandLink">
              Ver detalle completo <i class="fas fa-arrow-right"></i>
            </a>
          </div>

          <div class="strip-summary-cards-grid" id="stripSummaryCardsGrid">
            ${this.renderSummaryCards(totalKm, culvertsCount)}
          </div>
        </div>

        <!-- 4. Collapsible Georeferenced Inventory Table -->
        <div class="strip-inventory-collapsible" id="stripInventoryCollapsible" style="display: none;">
          <div class="inventory-collapsible-header">
            <h4>
              <i class="fas fa-list-check" style="color: var(--brand-green);"></i>
              Inventario Georreferenciado de Puntos Singulares y Obras de Drenaje (${puntos.length} Registros)
            </h4>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="text" id="inventoryTableSearch" placeholder="Filtrar en tabla (ej: 0+579)..." 
                     style="padding: 0.35rem 0.75rem; font-size: 0.78rem; border: 1px solid var(--border-subtle); border-radius: 6px; background: var(--bg-subtle); color: var(--text-primary); outline: none;" />
              <button class="btn-icon" id="btnCloseInventory" style="width: 28px; height: 28px;" title="Cerrar tabla">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div class="table-container" style="max-height: 300px; overflow-y: auto;">
            <table class="data-table" style="font-size: 0.78rem;">
              <thead>
                <tr>
                  <th style="width: 100px;">Abscisa</th>
                  <th>Tipo de Obra</th>
                  <th>Categoría</th>
                  <th>Nombre / Especificación</th>
                  <th>Detalle Técnico e Interventoría</th>
                  <th style="text-align: right;">Acción</th>
                </tr>
              </thead>
              <tbody id="inventoryTableBody">
                ${this.renderInventoryTableRows(puntos)}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    this.attachEvents(totalKm, puntos);
    this.updateMarker(this.currentKm, totalKm, puntos);
  }

  /* --------------------------------------------------------------------------
     RENDER HELPERS: RULER TICKS & GRAPHIC LANES
     -------------------------------------------------------------------------- */

  renderRulerTicks(totalKm) {
    const ticks = [];
    const step = 2.0; // Every 2 km ticks (K0, K2, K4...)
    const numSteps = Math.floor(totalKm / step);

    for (let i = 0; i <= numSteps; i++) {
      const km = i * step;
      const pct = (km / totalKm) * 100;
      ticks.push(`
        <div class="ruler-tick-label" style="left: ${pct.toFixed(2)}%;">
          K${i * 2}
        </div>
      `);
    }

    // Final point tick if not aligned
    const lastKm = totalKm;
    const lastPct = 100;
    const kPart = Math.floor(lastKm);
    const mPart = Math.round((lastKm - kPart) * 1000);
    const lastStr = mPart > 0 ? `K${kPart}+${String(mPart).padStart(3, '0')}` : `K${kPart}`;
    ticks.push(`
      <div class="ruler-tick-label" style="left: ${lastPct}%; transform: translateX(-100%);">
        ${lastStr}
      </div>
    `);

    return ticks.join('');
  }

  /* --------------------------------------------------------------------------
     DISCIPLINE TRACK RENDERERS (MULTI-SUBTRACK ARCHITECTURE)
     -------------------------------------------------------------------------- */

  // 1. DRENAJE Y OBRAS DE ARTE (Cunetas en barra progresiva, Filtros en puntos, Alcantarillas en puntos)
  renderDrenajeTrack(puntos, totalKm) {
    return `
      <div class="lane-subtracks-container">
        <!-- Sub-carril 1: Cunetas (Barra Progresiva) -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-drenaje"></div>
          ${this.renderCunetasSubtrack(totalKm)}
        </div>
        <!-- Sub-carril 2: Filtros (Puntos y tramo continuo de 1.164 ml) -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-drenaje"></div>
          ${this.renderFiltrosSubtrack(totalKm)}
        </div>
        <!-- Sub-carril 3: Alcantarillas (22 puntos singulares georreferenciados) -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-drenaje"></div>
          ${this.renderAlcantarillasSubtrack(puntos, totalKm)}
        </div>
      </div>
    `;
  }

  renderCunetasSubtrack(totalKm) {
    // Cunetas programadas a lo largo de los 23.77 km (31.489 ml presupuestadas, 0% ejecutadas a la fecha)
    return `
      <div class="subtrack-bar bar-cuneta-planned" data-start="0" data-end="${totalKm}" style="left: 0%; width: 100%;"
           title="Cunetas longitudinales en concreto · 23,77 km presupuestados (31.489 ml · 0,0% ejec. · Pendiente de vaciado)">
        <span><i class="fas fa-droplet" style="margin-right: 4px;"></i> Cunetas longitudinales en concreto · 23,77 km (0,0% ejec. · Pendiente vaciado)</span>
        <span style="font-size: 0.62rem; opacity: 0.85;">Invías Art. 671</span>
      </div>
    `;
  }

  renderFiltrosSubtrack(totalKm) {
    // Tramo de filtro granular K0+086 a K1+250 (1.164 ml continuos)
    const startKm = 0.086;
    const endKm = 1.250;
    const startPct = (startKm / totalKm) * 100;
    const endPct = (endKm / totalKm) * 100;
    const widthPct = endPct - startPct;

    return `
      <div class="filter-span-band" data-start="${startKm}" data-end="${endKm}" 
           style="left: ${startPct.toFixed(2)}%; width: ${widthPct.toFixed(2)}%;"
           title="Subdren / Filtro Granular Longitudinal · K 0+086 a K 1+250 (1.164 ml continuos con geotextil y grava filtrante)">
        1.164 ml continuos
      </div>
      <div class="subtrack-point-node point-filtro" data-km="${startKm}" style="left: ${startPct.toFixed(2)}%;"
           title="K 0+086 · Inicio Filtro Longitudinal Granular (1.164 ml)">
        <i class="fas fa-filter"></i>
      </div>
      <span class="subtrack-point-label" style="left: ${startPct.toFixed(2)}%;">K0+086 (Inicio)</span>
      <div class="subtrack-point-node point-filtro point-has-photo" data-km="${endKm}" style="left: ${endPct.toFixed(2)}%;"
           title="K 1+250 · Fin Filtro Longitudinal Granular (1.164 ml · Foto disponible)">
        <i class="fas fa-filter"></i>
      </div>
      <span class="subtrack-point-label" style="left: ${endPct.toFixed(2)}%;">K1+250 (Fin)</span>
    `;
  }

  renderAlcantarillasSubtrack(puntos, totalKm) {
    const culverts = puntos.filter(p => p.categoria === 'alcantarilla' || p.categoria === 'alcantarilla_nueva' || p.categoria === 'anulada');

    let lastLabelPct = -20;
    const minGapPct = Math.max(3.0, 7.5 / (this.zoomLevel || 1.0));

    return culverts.map((p, idx) => {
      const pct = Math.min(99.4, Math.max(0.6, (p.km / totalKm) * 100));
      const isNew = p.categoria === 'alcantarilla_nueva';
      const isAnulada = p.categoria === 'anulada';
      const hasPhoto = !!p.foto;

      let pointClass = 'point-alcantarilla';
      let icon = '<i class="fas fa-circle-dot" style="font-size: 0.5rem;"></i>';

      if (isNew) {
        pointClass = 'point-alcantarilla-nueva';
        icon = '<i class="fas fa-star" style="font-size: 0.55rem;"></i>';
      } else if (isAnulada) {
        pointClass = 'point-alcantarilla-anulada';
        icon = '<i class="fas fa-times" style="font-size: 0.55rem;"></i>';
      }
      if (hasPhoto) pointClass += ' point-has-photo';

      const shortAbs = p.abscisa.replace(' ', '');
      const cleanLabel = isNew ? `${shortAbs} (Nueva)` : (isAnulada ? `${shortAbs} (Anulada)` : `${shortAbs}`);

      let showLabel = false;
      if (pct - lastLabelPct >= minGapPct) {
        showLabel = true;
        lastLabelPct = pct;
      }

      return `
        <div class="subtrack-point-node ${pointClass}"
             data-km="${p.km}"
             data-idx="${idx}"
             style="left: ${pct.toFixed(2)}%;"
             title="${p.abscisa} · ${p.nombre} (${p.detalle})">
          ${icon}
        </div>
        ${showLabel ? `
          <span class="subtrack-point-label" style="left: ${pct.toFixed(2)}%;">
            ${cleanLabel}
          </span>
        ` : ''}
      `;
    }).join('');
  }

  // 2. ESTRUCTURA DE PAVIMENTO (Discriminada en 3 capas de barras de progreso)
  renderEstructuraTrack(totalKm) {
    return `
      <div class="lane-subtracks-container">
        <!-- Capa 1: Rodadura (TSD / MDC-19) -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-estructura"></div>
          ${this.renderRodaduraSubtrack(totalKm)}
        </div>
        <!-- Capa 2: Base Cemento MGTC -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-estructura"></div>
          ${this.renderMgtcSubtrack(totalKm)}
        </div>
        <!-- Capa 3: Subrasante con Cal -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-estructura"></div>
          ${this.renderSubrasanteSubtrack(totalKm)}
        </div>
      </div>
    `;
  }

  renderRodaduraSubtrack(totalKm) {
    // Rodadura dividida en tramos reales:
    // K 0+000 a K 1+200 (1.2 km TSD)
    // K 1+200 a K 3+800 (2.6 km MDC-19 Caliente en fuerte pendiente)
    // K 3+800 a K 5+500 (1.7 km TSD)
    const segs = [
      { start: 0, end: 1.2, title: "TSD (1,2 km)", class: "bar-tsd", tooltip: "K 0+000 a K 1+200 · TSD Tratamiento Superficial Doble (1,2 km)" },
      { start: 1.2, end: 3.8, title: "🔥 MDC-19 Caliente (2,6 km)", class: "bar-mdc", tooltip: "K 1+200 a K 3+800 · MDC-19 Mezcla Densa en Caliente (2,6 km · Fuerte pendiente > 8%)" },
      { start: 3.8, end: 5.5, title: "TSD K3+800", class: "bar-tsd", tooltip: "K 3+800 a K 5+500 · TSD Tratamiento Superficial Doble (1,7 km)" }
    ];

    return segs.map(s => {
      const leftPct = (s.start / totalKm) * 100;
      const widthPct = ((s.end - s.start) / totalKm) * 100;
      return `
        <div class="subtrack-bar ${s.class}" data-start="${s.start}" data-end="${s.end}"
             style="left: ${leftPct.toFixed(2)}%; width: ${widthPct.toFixed(2)}%;"
             title="${s.tooltip}">
          ${s.title}
        </div>
      `;
    }).join('');
  }

  renderMgtcSubtrack(totalKm) {
    // Base cementada MGTC: K 0+000 a K 3+500 (3.5 km, espesor 20 a 28 cm)
    const start = 0;
    const end = 3.5;
    const leftPct = (start / totalKm) * 100;
    const widthPct = ((end - start) / totalKm) * 100;

    return `
      <div class="subtrack-bar bar-mgtc" data-start="${start}" data-end="${end}"
           style="left: ${leftPct.toFixed(2)}%; width: ${widthPct.toFixed(2)}%;"
           title="K 0+000 a K 3+500 · Base Estabilizada con Cemento (MGTC) 20 a 28 cm con recicladora Wirtgen (3,5 km)">
        <i class="fas fa-cubes" style="margin-right: 4px;"></i> Cemento MGTC 20–28 cm (K 0+000 - K 3+500)
      </div>
    `;
  }

  renderSubrasanteSubtrack(totalKm) {
    // Subrasante estabilizada con cal:
    // Sector 1: K 0+000 a K 1+800 (1.8 km plataforma afirmado y cal viva al 3%)
    // Sector 2: K 15+000 a K 23+770 (8.77 km Sector El Cairo)
    const segs = [
      { start: 0, end: 1.8, title: "Cal K0–K1.8", tooltip: "K 0+000 a K 1+800 · Subrasante con cal viva al 3% (1,8 km)" },
      { start: 15.0, end: totalKm, title: "⛰️ Subrasante Cal K15–K23.7 (8,77 km)", tooltip: `K 15+000 a ${this.formatAbscissa(totalKm)} · Sector El Cairo Subrasante tratada con cal (8,77 km)` }
    ];

    return segs.map(s => {
      const leftPct = (s.start / totalKm) * 100;
      const widthPct = ((s.end - s.start) / totalKm) * 100;
      return `
        <div class="subtrack-bar bar-cal" data-start="${s.start}" data-end="${s.end}"
             style="left: ${leftPct.toFixed(2)}%; width: ${widthPct.toFixed(2)}%;"
             title="${s.tooltip}">
          ${s.title}
        </div>
      `;
    }).join('');
  }

  // 3. CAMPO Y GEOTECNIA (Topografía como barra de progreso, Apiques como puntos)
  renderCampoTrack(totalKm) {
    return `
      <div class="lane-subtracks-container">
        <!-- Elemento 1: Topografía (Barra Progresiva Continua K0 a K16) -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-campo"></div>
          ${this.renderTopografiaSubtrack(totalKm)}
        </div>
        <!-- Elemento 2: Apiques (Puntos de exploración geotécnica K0 a K21) -->
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-campo"></div>
          ${this.renderApiquesSubtrack(totalKm)}
        </div>
      </div>
    `;
  }

  renderTopografiaSubtrack(totalKm) {
    // Topografía: 16,00 km de 23,77 km = 67,31% ejecutado continuo
    const end = 16.0;
    const widthPct = (end / totalKm) * 100;

    return `
      <div class="subtrack-bar bar-topografia" data-start="0" data-end="${end}"
           style="left: 0%; width: ${widthPct.toFixed(2)}%;"
           title="K 0+000 a K 16+000 · Levantamiento Topográfico Altimétrico y Planimétrico (16,00 km levantados de 23,77 km · 67,31% de avance)">
        <i class="fas fa-drafting-compass" style="margin-right: 5px;"></i> Levantamiento Topográfico K0+000 a K16+000 (16 km · 67,3%)
      </div>
    `;
  }

  renderApiquesSubtrack(totalKm) {
    // Apiques: PUNTOS de exploración geotécnica cubriendo los 21 km (88,35%)
    const apiqueKms = [0.8, 2.4, 4.2, 6.8, 9.5, 11.8, 13.4, 16.0, 18.5, 21.0].filter(k => k <= totalKm);

    return apiqueKms.map(k => {
      const pct = (k / totalKm) * 100;
      const absStr = this.formatAbscissa(k);
      return `
        <div class="subtrack-point-node point-apique" data-km="${k}"
             style="left: ${pct.toFixed(2)}%;"
             title="${absStr} · Apique Geotécnico de Suelos (Sondeo estratigráfico hasta 1,50 m)">
          ▲
        </div>
        <span class="subtrack-point-label" style="left: ${pct.toFixed(2)}%;">
          ${absStr}
        </span>
      `;
    }).join('');
  }

  // 4. SEÑALIZACIÓN Y OTROS
  renderSenalizacionTrack(totalKm) {
    return `
      <div class="lane-subtracks-container">
        <div class="lane-subtrack-row">
          <div class="subtrack-guideline subtrack-guideline-senalizacion"></div>
          ${this.renderSenalizacionPins(totalKm)}
        </div>
      </div>
    `;
  }

  renderSenalizacionPins(totalKm) {
    const pins = [
      { km: 2.0, label: "K2+000 Señales" },
      { km: 7.5, label: "K7+500 Defensas" },
      { km: 14.2, label: "K14+200 Señales" },
      { km: 19.8, label: "K19+800 Demarcación" }
    ].filter(p => p.km <= totalKm);

    return pins.map(p => {
      const pct = (p.km / totalKm) * 100;
      return `
        <div class="lane-purple-pin" data-km="${p.km}" style="left: ${pct.toFixed(2)}%;" title="${p.label}"></div>
        <span class="lane-purple-label" style="left: ${pct.toFixed(2)}%;">
          ${p.label}
        </span>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     SUMMARY CARDS (5 CARDS MATCHING REFERENCE MOCKUP)
     -------------------------------------------------------------------------- */

  renderSummaryCards(totalKm, culvertsCount) {
    const cards = [
      {
        iconLetter: "A",
        avatarClass: "avatar-puntual",
        title: "Obras puntuales / Alcantarillas",
        units: `${culvertsCount} unidades`,
        pct: "66,7%",
        pctVal: 66.7,
        fillClass: "fill-puntual",
        badgeText: "En ejecución",
        presupuesto: "$ 1.250.000.000",
        ejecutado: "$ 833.500.000",
        status: "En ejecución"
      },
      {
        iconFontAwesome: "fa-droplet",
        avatarClass: "avatar-drenaje",
        title: "Drenaje longitudinal",
        units: "21,4 km",
        pct: "48,9%",
        pctVal: 48.9,
        fillClass: "fill-drenaje",
        badgeText: "48,9%",
        presupuesto: "$ 980.000.000",
        ejecutado: "$ 479.200.000",
        status: "En ejecución"
      },
      {
        iconFontAwesome: "fa-cubes-stacked",
        avatarClass: "avatar-estructura",
        title: "Estructura de pavimento",
        units: `${totalKm.toFixed(2)} km`,
        pct: "12,4%",
        pctVal: 12.4,
        fillClass: "fill-estructura",
        badgeText: "12,4%",
        presupuesto: "$ 4.750.000.000",
        ejecutado: "$ 589.000.000",
        status: "En ejecución"
      },
      {
        iconFontAwesome: "fa-compass-drafting",
        avatarClass: "avatar-campo",
        title: "Campo",
        units: `${totalKm.toFixed(2)} km`,
        pct: "35,2%",
        pctVal: 35.2,
        fillClass: "fill-campo",
        badgeText: "35,2%",
        presupuesto: "$ 620.000.000",
        ejecutado: "$ 218.400.000",
        status: "En ejecución"
      },
      {
        iconFontAwesome: "fa-triangle-exclamation",
        avatarClass: "avatar-senalizacion",
        title: "Señalización y otros",
        units: `${totalKm.toFixed(2)} km`,
        pct: "18,7%",
        pctVal: 18.7,
        fillClass: "fill-senalizacion",
        badgeText: "18,7%",
        presupuesto: "$ 310.000.000",
        ejecutado: "$ 57.900.000",
        status: "En ejecución"
      }
    ];

    return cards.map(c => `
      <div class="summary-activity-card">
        <div class="summary-card-top">
          <div class="lane-avatar ${c.avatarClass}" style="width: 28px; height: 28px; font-size: 0.8rem;">
            ${c.iconLetter ? `<span class="avatar-letter">${c.iconLetter}</span>` : `<i class="fas ${c.iconFontAwesome}"></i>`}
          </div>
          <div class="summary-card-texts">
            <h5 class="summary-card-title">${c.title}</h5>
            <span class="summary-card-units">${c.units}</span>
          </div>
        </div>

        <div class="summary-card-progress">
          <div class="summary-card-pct-row">
            <span class="summary-card-pct">${c.pct}</span>
            <span class="summary-card-badge">${c.badgeText}</span>
          </div>
          <div class="lane-progress-bar-bg" style="height: 5px;">
            <div class="lane-progress-bar-fill ${c.fillClass}" style="width: ${c.pctVal}%;"></div>
          </div>
        </div>

        <div class="summary-card-financials">
          <div>
            <span>Presupuesto:</span>
            <strong>${c.presupuesto}</strong>
          </div>
          <div>
            <span>Ejecutado:</span>
            <strong>${c.ejecutado}</strong>
          </div>
        </div>

        <div class="summary-card-status-dot-row">
          <span class="status-dot"></span> ${c.status}
        </div>
      </div>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     STATION DETAIL SIDEBAR INSPECTOR
     -------------------------------------------------------------------------- */

  updateStationPanel(km, totalKm, puntos) {
    const body = this.container.querySelector('#stationPanelBody');
    if (!body) return;

    const stationStr = this.formatAbscissa(km);
    const corridorName = (this.currentCorridor && (this.currentCorridor.nombre || this.currentCorridor.name)) 
                         || "Abejorral – Santa Bárbara – El Cairo – La Elvira";

    // Detect intersecting activities at currentKm
    const intersecting = [];

    // 1. Drenaje y Obras
    intersecting.push({
      cat: "Drenaje",
      name: "Cunetas en concreto",
      range: `K0+000 - ${this.formatAbscissa(totalKm)} (0,0% ejec. · Pendiente vaciado)`,
      dotClass: "dot-drenaje"
    });

    if (km >= 0.086 && km <= 1.250) {
      intersecting.push({
        cat: "Drenaje",
        name: "Filtro longitudinal granular",
        range: "K0+086 - K1+250 (1.164 ml ejecutados)",
        dotClass: "dot-drenaje"
      });
    }

    const culverts = puntos.filter(p => p.categoria === 'alcantarilla' || p.categoria === 'alcantarilla_nueva' || p.categoria === 'anulada');
    let nearestCulvert = culverts[0];
    let minDist = culverts.length > 0 ? Math.abs(culverts[0].km - km) : 999;
    for (let i = 1; i < culverts.length; i++) {
      const d = Math.abs(culverts[i].km - km);
      if (d < minDist) {
        minDist = d;
        nearestCulvert = culverts[i];
      }
    }

    if (minDist <= 0.45 && nearestCulvert) {
      const isNew = nearestCulvert.categoria === 'alcantarilla_nueva';
      const isAnulada = nearestCulvert.categoria === 'anulada';
      const tag = isNew ? 'Nueva' : (isAnulada ? 'Anulada' : 'Reposición');
      intersecting.push({
        cat: "Drenaje",
        name: `Alcantarilla (${tag}) - ${nearestCulvert.nombre}`,
        range: `${nearestCulvert.abscisa} (a ${Math.round(minDist * 1000)} m)`,
        dotClass: "dot-drenaje"
      });
    }

    // 2. Estructura de pavimento
    if (km <= 1.2) {
      intersecting.push({
        cat: "Estructura",
        name: "Rodadura - TSD (Tratamiento Superficial)",
        range: "K0+000 - K1+200 (1,2 km)",
        dotClass: "dot-estructura"
      });
    } else if (km <= 3.8) {
      intersecting.push({
        cat: "Estructura",
        name: "Rodadura - MDC-19 Mezcla Densa en Caliente",
        range: "K1+200 - K3+800 (2,6 km · Pendiente > 8%)",
        dotClass: "dot-estructura"
      });
    } else if (km <= 5.5) {
      intersecting.push({
        cat: "Estructura",
        name: "Rodadura - TSD K3+800",
        range: "K3+800 - K5+500 (1,7 km)",
        dotClass: "dot-estructura"
      });
    } else {
      intersecting.push({
        cat: "Estructura",
        name: "Rodadura - TSD Proyectado",
        range: `K5+500 - ${this.formatAbscissa(totalKm)}`,
        dotClass: "dot-estructura"
      });
    }

    if (km <= 3.5) {
      intersecting.push({
        cat: "Estructura",
        name: "Base Cemento MGTC (20 a 28 cm)",
        range: "K0+000 - K3+500 (3,5 km)",
        dotClass: "dot-estructura"
      });
    }

    if (km <= 1.8) {
      intersecting.push({
        cat: "Estructura",
        name: "Subrasante con Cal al 3%",
        range: "K0+000 - K1+800 (1,8 km)",
        dotClass: "dot-estructura"
      });
    } else if (km >= 15.0) {
      intersecting.push({
        cat: "Estructura",
        name: "Subrasante con Cal (Sector El Cairo)",
        range: `K15+000 - ${this.formatAbscissa(totalKm)} (8,77 km)`,
        dotClass: "dot-estructura"
      });
    }

    // 3. Campo y Geotecnia
    if (km <= 16.0) {
      intersecting.push({
        cat: "Campo",
        name: "Topografía (Ejecutada · 67,31%)",
        range: "K0+000 - K16+000 (16 km levantados)",
        dotClass: "dot-campo"
      });
    } else {
      intersecting.push({
        cat: "Campo",
        name: "Topografía (Pendiente de levantar)",
        range: `K16+000 - ${this.formatAbscissa(totalKm)}`,
        dotClass: "dot-campo"
      });
    }

    if (km <= 21.0) {
      intersecting.push({
        cat: "Campo",
        name: "Exploración Geotécnica con Apiques (88,35%)",
        range: "K0+000 - K21+000 (21 km explorados)",
        dotClass: "dot-campo"
      });
    }

    // Find closest photographic evidence
    const photos = (this.currentCorridor && this.currentCorridor.registro_fotografico) || [];
    let photoObj = null;
    if (photos.length > 0) {
      photoObj = photos.reduce((prev, curr) => {
        const pDist = Math.abs((prev.km_aprox || 0) - km);
        const cDist = Math.abs((curr.km_aprox || 0) - km);
        return cDist < pDist ? curr : prev;
      });
    } else if (nearestCulvert && nearestCulvert.foto) {
      photoObj = {
        archivo: nearestCulvert.foto,
        titulo: nearestCulvert.nombre,
        abscisa: nearestCulvert.abscisa
      };
    }

    // Update Floating Tooltip on the sync needle
    const tooltipActivitiesList = this.container.querySelector('#tooltipActivitiesList');
    if (tooltipActivitiesList) {
      tooltipActivitiesList.innerHTML = intersecting.map(act => `
        <li class="tooltip-act-item">
          <span class="tooltip-dot ${act.dotClass}"></span>
          <span>${act.name}</span>
        </li>
      `).join('');
    }

    // Populate Sidebar Body
    body.innerHTML = `
      <!-- Station Hero -->
      <div class="station-hero">
        <div class="station-hero-main">
          <i class="fas fa-location-dot station-hero-icon"></i>
          <div>
            <div class="station-hero-title-row">
              <h2 class="station-hero-name">${stationStr}</h2>
              <span class="station-hero-badge">En progreso</span>
            </div>
            <span class="station-hero-sub">Abscisa / Progresiva</span>
          </div>
        </div>
      </div>

      <!-- Section: Información general -->
      <div class="station-section">
        <h5 class="station-section-heading">Información general</h5>
        <div class="station-info-grid">
          <div class="info-label">Vía</div>
          <div class="info-value">${corridorName}</div>
          <div class="info-label">Abscisa</div>
          <div class="info-value">${stationStr}</div>
          <div class="info-label">Unidad</div>
          <div class="info-value">km</div>
          <div class="info-label">Estado</div>
          <div class="info-value status-badge-inline">
            <span class="status-dot"></span> En ejecución
          </div>
        </div>
      </div>

      <!-- Section: Actividades que intersectan -->
      <div class="station-section">
        <h5 class="station-section-heading">Actividades que intersectan</h5>
        <div class="station-activities-list">
          ${intersecting.map(act => `
            <div class="station-act-item">
              <div class="station-act-item-left">
                <span class="tooltip-dot ${act.dotClass}"></span>
                <div>
                  <div class="station-act-name">${act.name}</div>
                  <div class="station-act-sub">${act.range}</div>
                </div>
              </div>
              <span class="station-act-badge">
                <span class="status-dot"></span> En ejecución
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section: Evidencia fotográfica -->
      <div class="station-section">
        <h5 class="station-section-heading">Evidencia fotográfica</h5>
        ${photoObj ? `
          <div class="station-photo-card" id="btnOpenPhotoStation">
            <img src="${encodeURI(photoObj.archivo)}" alt="${photoObj.titulo || 'Registro de obra'}" onerror="this.src='Registro fotográfico/E18/foto_01_alcantarilla_k0+579.jpg'" />
            <div class="station-photo-badge">
              <i class="fas fa-camera"></i> ${photoObj.abscisa || stationStr}
            </div>
          </div>
          <a href="javascript:void(0)" class="station-photo-link" id="linkGalleryStation">
            <i class="fas fa-images"></i> Ver galería (${photos.length || 4}) →
          </a>
        ` : `
          <div class="station-photo-card" style="display: flex; align-items: center; justify-content: center; background: var(--bg-subtle); color: var(--text-muted); font-size: 0.78rem;">
            <span><i class="fas fa-camera-slash"></i> Sin registro en ${stationStr}</span>
          </div>
        `}
      </div>

      <!-- Section: Presupuesto / Avance -->
      <div class="station-section">
        <h5 class="station-section-heading">Presupuesto / Avance</h5>
        <div class="station-budget-box">
          <div class="station-budget-row">
            <span>Presupuesto (COP)</span>
            <strong>$ 1.250.000.000</strong>
          </div>
          <div class="station-budget-row">
            <span>Ejecutado (COP)</span>
            <strong>$ 98.750.000</strong>
          </div>
          <div style="margin-top: 4px;">
            <div class="station-progress-labels">
              <span>Avance físico</span>
              <strong>2,58%</strong>
            </div>
            <div class="station-mini-bar-bg">
              <div class="station-mini-bar-fill" style="width: 2.58%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach photo clicks to lightbox
    const photoCard = body.querySelector('#btnOpenPhotoStation');
    const galleryLink = body.querySelector('#linkGalleryStation');
    const triggerLightbox = () => {
      if (window.app && photoObj) {
        window.app.openPhotoLightbox(photoObj);
      }
    };
    if (photoCard) photoCard.addEventListener('click', triggerLightbox);
    if (galleryLink) galleryLink.addEventListener('click', triggerLightbox);
  }

  /* --------------------------------------------------------------------------
     UPDATE MARKER & SYNCHRONIZED NEEDLE
     -------------------------------------------------------------------------- */

  updateMarker(km, totalKm, puntos) {
    this.currentKm = Math.min(totalKm, Math.max(0, km));
    const pct = (this.currentKm / totalKm) * 100;
    const stationStr = this.formatAbscissa(this.currentKm);

    // 1. Move Pin on Forest Green Ruler
    const rulerPin = this.container.querySelector('#rulerPinIndicator');
    if (rulerPin) rulerPin.style.left = `${pct}%`;

    // 2. Move Synchronized Red Needle across all lanes
    // The lanes wrapper has 240px + 1rem (16px) left meta card, and the track is the remaining width.
    const needle = this.container.querySelector('#stripSyncNeedle');
    if (needle) {
      needle.style.left = `calc(240px + 1rem + ((100% - 240px - 1rem) * ${(this.currentKm / totalKm).toFixed(5)}))`;
    }

    // 3. Update Station Text in Floating Tooltip and Bottom Badge
    const tooltipText = this.container.querySelector('#tooltipStationText');
    if (tooltipText) tooltipText.innerText = stationStr;

    const bottomBadge = this.container.querySelector('#needleBottomBadge');
    if (bottomBadge) bottomBadge.innerText = stationStr;

    // 4. Update Reopen Button text
    const reopenBtn = this.container.querySelector('#btnReopenStationPanel');
    if (reopenBtn) reopenBtn.innerHTML = `<i class="fas fa-location-dot"></i> Ver detalle de estación (${stationStr})`;

    // 5. Update Station Inspector Sidebar
    this.updateStationPanel(this.currentKm, totalKm, puntos);
  }

  /* --------------------------------------------------------------------------
     EVENT LISTENERS & USER INTERACTIONS
     -------------------------------------------------------------------------- */

  attachEvents(totalKm, puntos) {
    // 1. Filter Pills
    const pillsContainer = this.container.querySelector('#stripCategoryPills');
    if (pillsContainer) {
      pillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          pillsContainer.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.getAttribute('data-category');
          this.applyCategoryFilter(cat);
        });
      });
    }

    // 2. Mode Toggle (Avance, Cantidades, Evidencias)
    const modeContainer = this.container.querySelector('#stripModeToggle');
    if (modeContainer) {
      modeContainer.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modeContainer.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeMode = btn.getAttribute('data-mode');
          this.applyMode(this.activeMode);
        });
      });
    }

    // 3. Zoom Controls
    const zoomReset = this.container.querySelector('#stripZoomReset');
    const zoomIn = this.container.querySelector('#stripZoomIn');
    const zoomOut = this.container.querySelector('#stripZoomOut');

    if (zoomReset) {
      zoomReset.addEventListener('click', () => {
        this.zoomLevel = 1.0;
        this.applyZoom();
      });
    }
    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        this.zoomLevel = Math.min(3.0, this.zoomLevel + 0.5);
        this.applyZoom();
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        this.zoomLevel = Math.max(1.0, this.zoomLevel - 0.5);
        this.applyZoom();
      });
    }

    // 4. Abscissa Search Box
    const searchInput = this.container.querySelector('#stripAbscissaSearch');
    if (searchInput) {
      const handleSearch = () => {
        const val = searchInput.value.trim();
        if (!val) return;
        const km = this.parseAbscissaToKm(val);
        if (km !== null && !isNaN(km)) {
          this.updateMarker(km, totalKm, puntos);
          this.openStationPanel();
        }
      };
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
      searchInput.addEventListener('change', handleSearch);
    }

    // 5. Click / Drag interaction on Forest Green Ruler Bar
    const rulerBar = this.container.querySelector('#forestRulerBar');
    if (rulerBar) {
      rulerBar.addEventListener('click', (e) => {
        const rect = rulerBar.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.updateMarker(pct * totalKm, totalKm, puntos);
      });
    }

    // 6. Click on Any Graphic Lane Track
    this.container.querySelectorAll('.lane-track-card').forEach(track => {
      track.addEventListener('click', (e) => {
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.updateMarker(pct * totalKm, totalKm, puntos);
      });
    });

    // 7. Click on Sub-track Points & Milestone Nodes (Alcantarillas, Apiques, Filtros)
    this.container.querySelectorAll('.subtrack-point-node, .lane-milestone-node').forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const km = parseFloat(node.getAttribute('data-km'));
        if (!isNaN(km)) {
          this.updateMarker(km, totalKm, puntos);
          this.openStationPanel();
        }
      });
    });

    // 8. Click on Sub-track Progress Bars & Filter Spans
    this.container.querySelectorAll('.subtrack-bar, .filter-span-band').forEach(bar => {
      bar.addEventListener('click', (e) => {
        e.stopPropagation();
        const start = parseFloat(bar.getAttribute('data-start'));
        if (!isNaN(start)) {
          this.updateMarker(start, totalKm, puntos);
          this.openStationPanel();
        }
      });
    });

    // 9. Click on Purple Pins (Señalización)
    this.container.querySelectorAll('.lane-purple-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const km = parseFloat(pin.getAttribute('data-km'));
        if (!isNaN(km)) {
          this.updateMarker(km, totalKm, puntos);
          this.openStationPanel();
        }
      });
    });

    // 10. Floating Tooltip Action: "Ver detalle de estación"
    const tooltipInspect = this.container.querySelector('#tooltipInspectAction');
    if (tooltipInspect) {
      tooltipInspect.addEventListener('click', () => {
        this.openStationPanel();
      });
    }

    // 11. Station Panel Close & Reopen
    const closeBtn = this.container.querySelector('#stationPanelCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeStationPanel();
      });
    }

    const reopenBtn = this.container.querySelector('#btnReopenStationPanel');
    if (reopenBtn) {
      reopenBtn.addEventListener('click', () => {
        this.openStationPanel();
      });
    }

    // 12. Bottom "Ver detalle completo" Link (Expands Inventory Table)
    const summaryExpand = this.container.querySelector('#stripSummaryExpandLink');
    const inventorySection = this.container.querySelector('#stripInventoryCollapsible');
    const closeInventoryBtn = this.container.querySelector('#btnCloseInventory');

    if (summaryExpand && inventorySection) {
      summaryExpand.addEventListener('click', () => {
        const isHidden = inventorySection.style.display === 'none';
        inventorySection.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          inventorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    if (closeInventoryBtn && inventorySection) {
      closeInventoryBtn.addEventListener('click', () => {
        inventorySection.style.display = 'none';
      });
    }

    // 13. Inventory Search Input
    const tableSearch = this.container.querySelector('#inventoryTableSearch');
    if (tableSearch) {
      tableSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        this.container.querySelectorAll('.inventory-table-row').forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
        });
      });
    }

    // 14. Ubicar buttons in Table
    this.container.querySelectorAll('.btn-locate-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const km = parseFloat(btn.getAttribute('data-km'));
        this.updateMarker(km, totalKm, puntos);
        this.openStationPanel();
        this.container.querySelector('.strip-chart-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* --------------------------------------------------------------------------
     PANEL, ZOOM, CATEGORY & MODE HELPERS
     -------------------------------------------------------------------------- */

  openStationPanel() {
    this.panelOpen = true;
    const split = this.container.querySelector('#stripMainSplit');
    if (split) split.classList.remove('panel-collapsed');

    const reopenContainer = this.container.querySelector('#reopenPanelContainer');
    if (reopenContainer) reopenContainer.style.display = 'none';
  }

  closeStationPanel() {
    this.panelOpen = false;
    const split = this.container.querySelector('#stripMainSplit');
    if (split) split.classList.add('panel-collapsed');

    const reopenContainer = this.container.querySelector('#reopenPanelContainer');
    if (reopenContainer) reopenContainer.style.display = 'flex';
  }

  applyZoom() {
    const lanesWrapper = this.container.querySelector('#lanesContentWrapper');
    const rulerWrapper = this.container.querySelector('#rulerTrackWrapper');

    if (lanesWrapper) {
      lanesWrapper.style.minWidth = `${this.zoomLevel * 100}%`;
    }
    if (rulerWrapper) {
      rulerWrapper.style.minWidth = `${this.zoomLevel * 100}%`;
    }

    // Keep sync needle aligned during zoom
    const totalKm = (this.currentCorridor && this.currentCorridor.longitud_contractual_km) || 23.77;
    const pct = this.currentKm / totalKm;
    const needle = this.container.querySelector('#stripSyncNeedle');
    if (needle) {
      needle.style.left = `calc(240px + 1rem + ((100% - 240px - 1rem) * ${pct.toFixed(5)}))`;
    }
  }

  applyCategoryFilter(cat) {
    this.activeCategory = cat;
    const laneRows = this.container.querySelectorAll('.strip-lane-row');

    laneRows.forEach(row => {
      const laneKey = row.getAttribute('data-lane');
      if (cat === 'all') {
        row.style.opacity = '1';
        row.style.filter = 'none';
      } else if (laneKey === cat) {
        row.style.opacity = '1';
        row.style.filter = 'none';
      } else {
        row.style.opacity = '0.28';
        row.style.filter = 'grayscale(60%)';
      }
    });
  }

  applyMode(mode) {
    // Mode highlights
    if (mode === 'evidencias') {
      this.container.querySelectorAll('.subtrack-point-node, .lane-milestone-node').forEach(node => {
        if (node.classList.contains('point-has-photo') || node.classList.contains('node-has-photo')) {
          node.style.boxShadow = '0 0 16px rgba(16, 185, 129, 0.95)';
          node.style.transform = 'translate(-50%, -50%) scale(1.35)';
          node.style.zIndex = '35';
        }
      });
    } else {
      this.container.querySelectorAll('.subtrack-point-node, .lane-milestone-node').forEach(node => {
        node.style.boxShadow = '';
        node.style.transform = '';
        node.style.zIndex = '';
      });
    }
  }

  /* --------------------------------------------------------------------------
     INVENTORY TABLE ROWS (PRESERVING COMPREHENSIVE REGISTRY)
     -------------------------------------------------------------------------- */

  renderInventoryTableRows(puntos) {
    if (!puntos || puntos.length === 0) {
      return `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay puntos registrados.</td></tr>`;
    }

    return puntos.map(p => {
      const isNew = p.categoria === 'alcantarilla_nueva';
      const isAnulada = p.categoria === 'anulada';
      let tagBg = 'rgba(5, 150, 105, 0.1)';
      let tagColor = '#059669';

      if (isNew) {
        tagBg = 'rgba(37, 99, 235, 0.1)';
        tagColor = '#2563eb';
      } else if (isAnulada) {
        tagBg = 'rgba(239, 68, 68, 0.1)';
        tagColor = '#ef4444';
      }

      return `
        <tr class="inventory-table-row" data-km="${p.km}">
          <td>
            <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.82rem; background: var(--bg-subtle); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-subtle); ${isNew ? 'color: #2563eb;' : ''}">
              ${p.abscisa}
            </span>
          </td>
          <td>
            <strong style="color: var(--text-primary); font-size: 0.8rem;">${p.tipo}</strong>
          </td>
          <td>
            <span class="tag-badge" style="background: ${tagBg}; color: ${tagColor}; font-weight: 700;">
              ${p.categoria}
            </span>
          </td>
          <td style="font-weight: 600; font-size: 0.8rem;">
            ${p.nombre} ${p.foto ? '<i class="fas fa-camera" style="color: var(--brand-green); margin-left: 4px;" title="Registro fotográfico disponible"></i>' : ''}
          </td>
          <td style="font-size: 0.76rem; color: var(--text-secondary);">
            ${p.detalle}
          </td>
          <td style="text-align: right;">
            <button class="btn-locate-row" data-km="${p.km}" style="background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 3px 8px; font-size: 0.72rem; font-weight: 700; color: var(--brand-green); cursor: pointer;">
              <i class="fas fa-crosshairs"></i> Ubicar
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     UTILITY: FORMATTING & PARSING ABSCISSAS
     -------------------------------------------------------------------------- */

  formatAbscissa(km) {
    if (isNaN(km) || km < 0) km = 0;
    const kPart = Math.floor(km);
    const mPart = Math.round((km - kPart) * 1000);
    return `K${kPart}+${String(mPart).padStart(3, '0')}`;
  }

  parseAbscissaToKm(str) {
    if (!str) return null;
    let clean = str.toUpperCase().replace('K', '').replace('PR', '').trim();
    if (clean.includes('+')) {
      const parts = clean.split('+');
      const k = parseFloat(parts[0]) || 0;
      const m = parseFloat(parts[1]) || 0;
      return k + (m / 1000);
    }
    const num = parseFloat(clean);
    return isNaN(num) ? null : num;
  }

  getDefaultPuntos(c) {
    return [
      { abscisa: "K 0+086", km: 0.086, tipo: "Filtro Drenante", categoria: "filtro", nombre: "Inicio Filtro Longitudinal", detalle: "1.164 ml continuos", color: "#2563eb" },
      { abscisa: "K 0+160", km: 0.160, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 1", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 0+579", km: 0.579, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 2", detalle: "Reemplazo tubería y cabezal concreto", color: "#0284c7", foto: "Registro fotográfico/E18/foto_01_alcantarilla_k0+579.jpg" },
      { abscisa: "K 0+683", km: 0.683, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 3", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 0+747", km: 0.747, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 4", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 0+841", km: 0.841, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 5", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 1+250", km: 1.250, tipo: "Filtro Drenante", categoria: "filtro", nombre: "Fin Filtro Longitudinal", detalle: "Fin tramo 1.164 ml", color: "#2563eb" },
      { abscisa: "K 1+253", km: 1.253, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 6", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 1+364", km: 1.364, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 7", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 1+571", km: 1.571, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 8", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 1+660", km: 1.660, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 9", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 1+772", km: 1.772, tipo: "Obra Anulada", categoria: "anulada", nombre: "Obra Anulada No. 1", detalle: "Suprimida técnicamente", color: "#ef4444" },
      { abscisa: "K 2+167", km: 2.167, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 10", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 2+573", km: 2.573, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 11", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 2+593", km: 2.593, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 12", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 2+810", km: 2.810, tipo: "Obra Anulada", categoria: "anulada", nombre: "Obra Anulada No. 2", detalle: "Suprimida técnicamente", color: "#ef4444" },
      { abscisa: "K 2+812", km: 2.812, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 13", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 2+985", km: 2.985, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 14", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 3+105", km: 3.105, tipo: "Alcantarilla Nueva", categoria: "alcantarilla_nueva", nombre: "★ Alcantarilla Nueva", detalle: "Nueva estructura de 36 pulg.", color: "#2563eb" },
      { abscisa: "K 3+160", km: 3.160, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 15", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 3+190", km: 3.190, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 16", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 3+315", km: 3.315, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 17", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 3+465", km: 3.465, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 18", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 3+559", km: 3.559, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 19", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 3+660", km: 3.660, tipo: "Obra Anulada", categoria: "anulada", nombre: "Obra Anulada No. 4", detalle: "Suprimida técnicamente", color: "#ef4444" },
      { abscisa: "K 4+339", km: 4.339, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 20", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" },
      { abscisa: "K 4+505", km: 4.505, tipo: "Alcantarilla Reposición", categoria: "alcantarilla", nombre: "Alcantarilla No. 21", detalle: "Tubería concreto 36 pulg.", color: "#0284c7" }
    ];
  }
}

window.AbscissasManager = AbscissasManager;
