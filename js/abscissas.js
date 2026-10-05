/* ==========================================================================
   MULTI-BAND LINEAR STRIP CHART: DIAGRAMA DE BANDAS VIALES SINCRONIZADAS
   Secretaría de Infraestructura Física · Gobernación de Antioquia
   Visualización Métrica de Obras Puntuales, Drenaje Longitudinal,
   Paquete Estructural de Pavimento y Trabajos de Campo (Topografía/Apiques)
   ========================================================================== */

class AbscissasManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentCorridor = null;
    this.currentKm = 0;
    this.isSimulating = false;
    this.simTimer = null;
    this.simSpeed = 1; // 1x, 2x, 5x
    this.activeFilter = 'all';
    this.searchTerm = '';
    this.activePopover = null;
  }

  render(corridor) {
    this.currentCorridor = corridor;
    this.stopSimulation();
    this.currentKm = 0;

    if (!this.container) return;

    const totalKm = corridor.longitud_contractual_km || 23.77;
    const puntos = corridor.puntos_singulares || this.getDefaultPuntos(corridor);
    const avance = corridor.avance_abscisas || {
      abscisas: ["K0", "K2", "K4", "K6", "K8", "K10", "K12", "K14", "K16", "K18", "K20", "K22", `K${Math.round(totalKm)}`],
      campo: { topografia_pct: 67.31, apiques_pct: 88.35 },
      estructura: { rodadura_pct: 0, capa_granular_pct: 0, subrasante_pct: 7.57 },
      drenaje: { cunetas_pct: 0, filtros_pct: 4.08, alcantarillas_pct: 48.89 }
    };

    const culvertsCount = puntos.filter(p => p.categoria === 'alcantarilla' || p.categoria === 'alcantarilla_nueva').length;

    this.container.innerHTML = `
      <div class="strip-chart-card">
        
        <!-- Header & Simulation Controls -->
        <div class="strip-chart-header">
          <div class="strip-title-group">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2px;">
              <span style="font-size: 0.72rem; font-weight: 800; color: var(--brand-green); text-transform: uppercase; letter-spacing: 0.05em; background: var(--success-green-bg); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(4, 120, 87, 0.2);">
                <i class="fas fa-layer-group"></i> Diagrama de Bandas Viales Sincronizadas
              </span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Longitud: <strong>${totalKm.toFixed(2)} km</strong></span>
            </div>
            <h3>Control Métrico de Progresión por Abscisa y Disciplinas de Obra</h3>
          </div>

          <!-- Speed & Run Controls -->
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 2px;">
              <button class="sim-speed-btn active" data-speed="1">1x</button>
              <button class="sim-speed-btn" data-speed="2">2x</button>
              <button class="sim-speed-btn" data-speed="5">5x</button>
            </div>
            <button id="simPlayBtn" class="btn-primary" style="padding: 0.45rem 1rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fas fa-play"></i> Simular Recorrido
            </button>
            <button id="simResetBtn" class="btn-icon" style="width: 34px; height: 34px;" title="Reiniciar a K 0+000">
              <i class="fas fa-undo"></i>
            </button>
          </div>
        </div>

        <!-- Real-Time HUD Station Display -->
        <div class="strip-hud-panel">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="strip-odometer-box">
              <i class="fas fa-map-pin" style="color: #facc15;"></i>
              <span id="stripOdometerText">K 0 + 000</span>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Estado en Estación:</div>
              <strong id="stripStatusText" style="font-size: 0.92rem; color: var(--text-primary); display: block;">
                Frente Activo: Filtros Granulares (K0+086 a K1+250) y Reposición de Alcantarillas
              </strong>
            </div>
          </div>

          <!-- Active Disciplines at Current Station -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;" id="stripActiveChips">
            <!-- Populated dynamically -->
          </div>

          <!-- Nearest Work / Drainage Point -->
          <div style="text-align: right; border-left: 1px solid var(--border-subtle); padding-left: 1.25rem;">
            <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block;">Punto Singular Próximo:</span>
            <strong id="stripNearestText" style="font-size: 0.85rem; color: var(--brand-green);">K 0+086 · Inicio Filtro Longitudinal</strong>
          </div>
        </div>

        <!-- Filter Pills Bar -->
        <div class="strip-filter-bar" id="stripFilterBar">
          <button class="strip-filter-btn active" data-filter="all">
            <i class="fas fa-bars-staggered"></i> Todas las Bandas
          </button>
          <button class="strip-filter-btn" data-filter="banda-puntual">
            <i class="fas fa-circle-dot" style="color: #0284c7;"></i> Obras Puntuales (${culvertsCount})
          </button>
          <button class="strip-filter-btn" data-filter="banda-drenaje">
            <i class="fas fa-water" style="color: #2563eb;"></i> Drenaje Longitudinal (MI / MD)
          </button>
          <button class="strip-filter-btn" data-filter="banda-estructura">
            <i class="fas fa-cubes" style="color: #d97706;"></i> Paquete Estructural (Pavimento)
          </button>
          <button class="strip-filter-btn" data-filter="banda-campo">
            <i class="fas fa-drafting-compass" style="color: #059669;"></i> Campo (Topografía & Apiques)
          </button>
        </div>

        <!-- Master Multi-Band Stage -->
        <div class="strip-stage" id="stripStage">
          
          <!-- Needle Track Overlay (Spans precisely across the central graphic column) -->
          <div class="needle-track-overlay" id="needleTrackOverlay">
            <div class="strip-crosshair-needle" id="stripCrosshairNeedle" style="left: 0%;">
              <div class="crosshair-needle-head"></div>
              <div class="crosshair-needle-badge" id="needleBadge">K 0+000</div>
            </div>
          </div>

          <!-- 0. Main Asphalt Road Ribbon & Active Front -->
          <div class="strip-road-ribbon" title="Haz clic o arrastra para mover la inspección">
            <div class="band-meta-bracket bracket-road">
              <div>
                <span class="band-bracket-title"><i class="fas fa-road" style="color: var(--brand-green);"></i> Calzada Principal</span>
                <span class="band-bracket-sub">Eje Vial y Tráfico</span>
              </div>
            </div>

            <div class="road-ribbon-track" id="roadRibbonTrack">
              <div class="road-ribbon-centerline"></div>

              <!-- Highlighted Active Front Zone (K 0+086 a K 1+250) -->
              <div class="road-ribbon-active-zone" style="left: ${(0.086 / totalKm) * 100}%; width: ${((1.250 - 0.086) / totalKm) * 100}%;">
                <span><i class="fas fa-hard-hat"></i> Frente Activo (K 0+086 a K 1+250)</span>
              </div>

              <!-- Animated Inspection Vehicle -->
              <div class="road-ribbon-vehicle" id="roadRibbonVehicle" style="left: 0%;">
                <i class="fas fa-truck-pickup"></i>
              </div>
            </div>

            <div class="band-progress-cell">
              <div class="band-progress-badge" style="font-size: 0.72rem; color: var(--text-muted);">
                0 – ${totalKm.toFixed(1)} km
              </div>
            </div>
          </div>

          <!-- Continuous Scrubber Range Slider -->
          <div class="strip-scrubber-track">
            <div class="band-meta-bracket bracket-scrubber">
              <div>
                <span class="band-bracket-title"><i class="fas fa-location-crosshairs" style="color: #dc2626;"></i> Control de Abscisa</span>
                <span class="band-bracket-sub">Localizador Progresivo</span>
              </div>
            </div>
            <div style="position: relative; width: 100%;">
              <input type="range" class="scrubber-slider" id="scrubberSlider" min="0" max="${totalKm}" step="0.01" value="0" />
              
              <!-- Kilometer Scale Ticks -->
              <div class="strip-scale-ticks">
                ${(avance.abscisas || []).map((abs, idx, arr) => {
                  let kmVal = 0;
                  const clean = abs.replace('K', '').trim();
                  if (clean.includes('+')) {
                    const parts = clean.split('+');
                    kmVal = parseFloat(parts[0]) + (parseFloat(parts[1]) / 1000);
                  } else {
                    kmVal = parseFloat(clean);
                  }
                  if (isNaN(kmVal)) kmVal = 0;
                  const leftPct = Math.min(100, Math.max(0, (kmVal / totalKm) * 100));
                  let transform = 'translateX(-50%)';
                  if (idx === 0) transform = 'translateX(0)';
                  if (idx === arr.length - 1) transform = 'translateX(-100%)';
                  return `
                    <div class="strip-tick" style="left: ${leftPct.toFixed(2)}%; transform: ${transform};">
                      <span>${abs}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="band-progress-cell">
              <div class="band-progress-badge" style="font-size: 0.75rem; color: #dc2626; font-weight: 800;" id="scrubberBadgeRight">
                K 0+000
              </div>
            </div>
          </div>

          <!-- BANDA 1: OBRAS PUNTUALES DE DRENAJE (ALCANTARILLAS) -->
          <div class="discipline-band-row" data-band="banda-puntual">
            <div class="band-meta-bracket bracket-puntual">
              <div>
                <span class="band-bracket-title"><i class="fas fa-circle-dot" style="color: #0284c7;"></i> Obras Puntuales</span>
                <span class="band-bracket-sub">Alcantarillas (22 Obras)</span>
                <div style="display: flex; gap: 4px; margin-top: 4px; font-size: 0.65rem;">
                  <span title="Completada" style="color: #059669;">●</span>
                  <span title="En Ejecución" style="color: #f59e0b;">●</span>
                  <span title="Nueva 36 pulg." style="color: #2563eb;">★</span>
                  <span title="Pendiente" style="color: #94a3b8;">●</span>
                  <span title="Anulada" style="color: #ef4444;">✕</span>
                </div>
              </div>
            </div>

            <div class="band-graphic-track" id="trackCulverts" style="height: 38px;">
              <div class="culverts-linear-track">
                <div class="culverts-baseline"></div>
                ${this.renderCulvertPins(puntos, totalKm)}
              </div>
            </div>

            <div class="band-progress-cell">
              <div class="band-progress-badge badge-success">48,9%</div>
              <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">11 / 22 Obras</span>
            </div>
          </div>

          <!-- BANDA 2: DRENAJE LONGITUDINAL (CUNETAS & FILTROS) -->
          <div class="discipline-band-row" data-band="banda-drenaje">
            <div class="band-meta-bracket bracket-drenaje">
              <div>
                <span class="band-bracket-title"><i class="fas fa-water" style="color: #2563eb;"></i> Drenaje Lineal</span>
                <span class="band-bracket-sub">Cunetas y Filtros Granulares</span>
                <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 3px; display: flex; gap: 6px;">
                  <span><strong style="color: #2563eb; background: rgba(37,99,235,0.1); padding: 1px 4px; border-radius: 3px;">MI:</strong> Izq.</span>
                  <span><strong style="color: #0284c7; background: rgba(2,132,199,0.1); padding: 1px 4px; border-radius: 3px;">MD:</strong> Der.</span>
                </div>
              </div>
            </div>

            <div class="band-graphic-track" style="height: 44px; cursor: pointer;">
              <div class="dual-margin-track">
                <!-- Margen Izquierda (MI) -->
                <div class="margin-subtrack" title="Margen Izquierda (MI)">
                  <!-- Filtro Longitudinal Granular K 0+086 a K 1+250 (1.164 ml) -->
                  <div class="filter-longitudinal-bar" 
                       style="left: ${(0.086 / totalKm) * 100}%; width: ${((1.250 - 0.086) / totalKm) * 100}%;"
                       title="Filtro Granular Longitudinal MI: K 0+086 a K 1+250 (1.164 ml)">
                    <span class="linear-text-label"><i class="fas fa-filter"></i> Filtro 1.164 ml</span>
                  </div>
                  <!-- Cunetas MI -->
                  <div class="cunetas-bar" style="left: ${(1.250 / totalKm) * 100}%; width: ${(2.5 / totalKm) * 100}%; opacity: 0.5;" title="Cunetas MI Proyectadas">
                    <span class="linear-text-label">Cunetas MI</span>
                  </div>
                </div>

                <!-- Margen Derecha (MD) -->
                <div class="margin-subtrack" title="Margen Derecha (MD)">
                  <!-- Cunetas MD -->
                  <div class="cunetas-bar" style="left: 0%; width: ${(1.250 / totalKm) * 100}%; opacity: 0.5;" title="Cunetas MD K 0+000 a K 1+250">
                    <span class="linear-text-label">Cunetas MD (1,25 km)</span>
                  </div>
                  <!-- Filtro MD puntual -->
                  <div class="filter-longitudinal-bar" style="left: ${(2.8 / totalKm) * 100}%; width: ${(0.4 / totalKm) * 100}%; opacity: 0.6;" title="Filtro MD puntual"></div>
                </div>
              </div>
            </div>

            <div class="band-progress-cell">
              <div class="band-progress-badge">4,1%</div>
              <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">1.164 ml Filtro</span>
            </div>
          </div>

          <!-- BANDA 3: PAQUETE ESTRUCTURAL (PAVIMENTO ESTRATIGRÁFICO) -->
          <div class="discipline-band-row" data-band="banda-estructura">
            <div class="band-meta-bracket bracket-estructura">
              <div>
                <span class="band-bracket-title"><i class="fas fa-layer-group" style="color: #d97706;"></i> Estructura</span>
                <span class="band-bracket-sub">Paquete Pavimento</span>
                <div style="display: flex; flex-direction: column; gap: 1px; font-size: 0.62rem; color: var(--text-muted); margin-top: 2px;">
                  <span><strong style="color: #1e293b;">■</strong> Rodadura (TSD/MDC)</span>
                  <span><strong style="color: #d97706;">■</strong> Base Cemento MGTC</span>
                  <span><strong style="color: #92400e;">■</strong> Subrasante con Cal</span>
                </div>
              </div>
            </div>

            <div class="band-graphic-track" style="height: 52px; cursor: pointer;">
              <div class="pavement-strata-track">
                <!-- Layer 1: Rodadura (TSD / MDC-19) -->
                <div class="strata-layer" title="Capa de Rodadura (TSD en pendientes ≤ 8% / MDC-19 en pendientes > 8%)">
                  <div class="strata-fill fill-rodadura" style="left: 0%; width: ${(1.2 / totalKm) * 100}%;" title="TSD Rodadura K 0+000 a K 1+200">
                    <span class="strata-text-label">TSD (1,2 km)</span>
                  </div>
                  <div class="strata-fill fill-rodadura" style="left: ${(1.2 / totalKm) * 100}%; width: ${(2.6 / totalKm) * 100}%; background: #0f172a;" title="MDC-19 Caliente K 1+200 a K 3+800">
                    <span class="strata-text-label"><i class="fas fa-fire" style="color: #f97316;"></i> MDC-19 Caliente (2,6 km)</span>
                  </div>
                  <div class="strata-fill fill-rodadura" style="left: ${(3.8 / totalKm) * 100}%; width: ${(1.7 / totalKm) * 100}%;" title="TSD Rodadura K 3+800 a K 5+500">
                    <span class="strata-text-label">TSD K3+800</span>
                  </div>
                </div>

                <!-- Layer 2: Cemento MGTC (20 a 28 cm) -->
                <div class="strata-layer" title="Base Estabilizada con Cemento Portland (MGTC 20-28 cm)">
                  <div class="strata-fill fill-cemento" style="left: 0%; width: ${(3.5 / totalKm) * 100}%;" title="Frente Base MGTC K 0+000 a K 3+500 (3,5 km)">
                    <span class="strata-text-label"><i class="fas fa-cubes"></i> Cemento MGTC 20-28 cm (K 0+000 a K 3+500)</span>
                  </div>
                </div>

                <!-- Layer 3: Subrasante Estabilizada con Cal (20 cm) -->
                <div class="strata-layer" title="Subrasante Estabilizada con Cal al 3% (20 cm)">
                  <div class="strata-fill fill-subrasante" style="left: 0%; width: ${(1.8 / totalKm) * 100}%;" title="Subrasante Cal K 0+000 a K 1+800 (1,8 km)">
                    <span class="strata-text-label"><i class="fas fa-mountain"></i> Subrasante Cal 3% (1,8 km)</span>
                  </div>
                  <div class="strata-fill fill-subrasante" style="left: ${(15.0 / totalKm) * 100}%; width: ${((23.77 - 15.0) / totalKm) * 100}%;" title="Subrasante Cal K 15+000 a K 23+770 (8,77 km)">
                    <span class="strata-text-label">Subrasante Cal K15-K23.7</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="band-progress-cell">
              <div class="band-progress-badge">2,58%</div>
              <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">Avance Físico</span>
            </div>
          </div>

          <!-- BANDA 4: CAMPO (TOPOGRAFÍA & GEOTECNIA) -->
          <div class="discipline-band-row" data-band="banda-campo">
            <div class="band-meta-bracket bracket-campo">
              <div>
                <span class="band-bracket-title"><i class="fas fa-drafting-compass" style="color: #059669;"></i> Campo</span>
                <span class="band-bracket-sub">Topografía & Geotecnia</span>
                <div style="display: flex; flex-direction: column; gap: 1px; font-size: 0.62rem; color: var(--text-muted); margin-top: 2px;">
                  <span><strong style="color: #059669;">■</strong> Topografía (16 km / 67%)</span>
                  <span><strong style="color: #0284c7;">■</strong> Apiques CBR (21 km / 88%)</span>
                </div>
              </div>
            </div>

            <div class="band-graphic-track" style="height: 44px; cursor: pointer;">
              <div class="field-progress-track">
                <!-- Topografía (K 0+000 a K 16+000) -->
                <div class="field-subtrack" title="Levantamiento Topográfico Altimétrico: K 0+000 al K 16+000 (16,00 km / 67,31%)">
                  <div class="field-fill-topografia" style="left: 0%; width: ${(16.0 / totalKm) * 100}%;">
                    <span class="field-text-label"><i class="fas fa-check-circle"></i> Topografía K 0+000 a K 16+000 (16,0 km / 67,3%)</span>
                  </div>
                </div>

                <!-- Apiques Geotécnicos (K 0+000 a K 21+000) -->
                <div class="field-subtrack" title="Exploración Geotécnica con Apiques: K 0+000 al K 21+000 (21,00 km / 88,35%)">
                  <div class="field-fill-apiques" style="left: 0%; width: ${(21.0 / totalKm) * 100}%;">
                    <span class="field-text-label"><i class="fas fa-check-circle"></i> Apiques Geotécnicos CBR K 0+000 a K 21+000 (21,0 km / 88,4%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="band-progress-cell">
              <div class="band-progress-badge badge-success">88,4%</div>
              <span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">21 km Apiques</span>
            </div>
          </div>

        </div>

        <!-- Interactive Culvert Popover Anchor -->
        <div id="culvertPopoverContainer" style="position: relative; display: none;"></div>

        <!-- Searchable Georeferenced Inventory Table -->
        <div style="margin-top: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-list-check" style="color: var(--brand-green);"></i>
                Inventario Georreferenciado de Puntos Singulares y Obras de Drenaje
              </h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                21 Reposiciones de Alcantarillas · 1 Alcantarilla Nueva (K 3+105) · 1.164 ml Filtros · Obras Anuladas
              </span>
            </div>

            <!-- Fast Search Input -->
            <div style="position: relative;">
              <input type="text" id="inventorySearchInput" placeholder="Buscar por abscisa (ej: 0+579, 3+105)..." 
                     style="padding: 0.35rem 0.75rem 0.35rem 2rem; font-size: 0.78rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: var(--bg-secondary); color: var(--text-primary); outline: none; width: 260px;" />
              <i class="fas fa-search" style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); font-size: 0.75rem; color: var(--text-muted);"></i>
            </div>
          </div>

          <div class="table-container" style="max-height: 280px; overflow-y: auto;">
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
                ${this.renderInventoryRows(puntos)}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    this.attachEvents(totalKm, puntos);
    const isE18 = corridor && (corridor.code === 'E-18' || corridor.code === 'E18' || corridor.id === 'E-18' || (corridor.name && corridor.name.includes('Abejorral')));
    const initialKm = isE18 ? 1.150 : 0;
    this.setMarkerKm(initialKm, totalKm, puntos);
  }

  renderCulvertPins(puntos, totalKm) {
    return puntos.map((p, idx) => {
      const leftPct = Math.min(99.4, Math.max(0.6, (p.km / totalKm) * 100));

      let stateClass = 'state-completed';
      let icon = idx + 1;

      if (p.categoria === 'alcantarilla_nueva') {
        stateClass = 'state-new';
        icon = '★';
      } else if (p.categoria === 'anulada') {
        stateClass = 'state-annulled';
        icon = '✕';
      } else if (p.km > 1.25 && p.km < 3.5) {
        stateClass = 'state-progress'; // Active front zone
      } else if (p.km >= 3.5) {
        stateClass = 'state-pending';
      }

      // Special highlight for authentic field photo
      const hasPhoto = !!p.foto;

      return `
        <div class="culvert-dot ${stateClass}" 
             data-km="${p.km}"
             data-cat="${p.categoria}"
             data-abs="${p.abscisa}"
             data-idx="${idx}"
             style="left: ${leftPct}%;"
             title="${p.abscisa} · ${p.nombre} (${p.detalle})">
          ${icon}
        </div>
      `;
    }).join('');
  }

  renderInventoryRows(puntos) {
    if (!puntos || puntos.length === 0) {
      return `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay puntos singulares registrados.</td></tr>`;
    }

    return puntos.map(p => {
      const isNew = p.categoria === 'alcantarilla_nueva';
      const isAnulada = p.categoria === 'anulada';
      let catColor = '#0284c7';
      if (isNew) catColor = '#2563eb';
      if (isAnulada) catColor = '#ef4444';
      if (p.categoria === 'filtro') catColor = '#2563eb';

      return `
        <tr data-km="${p.km}" data-cat="${p.categoria}" class="inventory-row">
          <td>
            <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.82rem; background: var(--bg-subtle); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-subtle); ${isNew ? 'color: #2563eb; border-color: #2563eb;' : ''}">
              ${p.abscisa}
            </span>
          </td>
          <td>
            <strong style="color: var(--text-primary); font-size: 0.8rem;">${p.tipo}</strong>
          </td>
          <td>
            <span class="tag-badge" style="background: rgba(4, 120, 87, 0.08); color: ${catColor}; font-weight: 700;">
              ${p.categoria}
            </span>
          </td>
          <td style="font-weight: 600; font-size: 0.8rem;">
            ${p.nombre} ${p.foto ? '<i class="fas fa-camera" style="color: var(--brand-green); margin-left: 4px;" title="Tiene fotografía de obra"></i>' : ''}
          </td>
          <td style="font-size: 0.76rem; color: var(--text-secondary);">
            ${p.detalle}
          </td>
          <td style="text-align: right;">
            <button class="btn-locate-pin" data-km="${p.km}" style="background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 3px 8px; font-size: 0.72rem; font-weight: 700; color: var(--brand-green); cursor: pointer;">
              <i class="fas fa-crosshairs"></i> Ubicar
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  attachEvents(totalKm, puntos) {
    const slider = this.container.querySelector('#scrubberSlider');
    const roadTrack = this.container.querySelector('#roadRibbonTrack');
    const stage = this.container.querySelector('#stripStage');

    // Scrubber Slider drag
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.stopSimulation();
        const km = parseFloat(e.target.value);
        this.setMarkerKm(km, totalKm, puntos);
      });
    }

    // Direct click / drag on Road Ribbon or any graphic band track
    const handleTrackInteraction = (e) => {
      const overlay = this.container.querySelector('#needleTrackOverlay');
      if (overlay) {
        const rect = overlay.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.stopSimulation();
        this.setMarkerKm(pct * totalKm, totalKm, puntos);
      }
    };

    if (roadTrack) roadTrack.addEventListener('click', handleTrackInteraction);
    this.container.querySelectorAll('.band-graphic-track').forEach(track => {
      track.addEventListener('click', handleTrackInteraction);
    });

    // Culvert Dots Click & Inspection Popover
    this.container.querySelectorAll('.culvert-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const km = parseFloat(dot.getAttribute('data-km'));
        const idx = parseInt(dot.getAttribute('data-idx'), 10);
        const p = puntos[idx];
        this.setMarkerKm(km, totalKm, puntos);
        this.showCulvertPopover(dot, p);
      });
    });

    // Speed Selector Buttons
    this.container.querySelectorAll('.sim-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.sim-speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.simSpeed = parseInt(btn.getAttribute('data-speed'), 10);
      });
    });

    // Play / Pause Simulation
    const playBtn = this.container.querySelector('#simPlayBtn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.isSimulating) {
          this.pauseSimulation();
          playBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        } else {
          this.startSimulation(totalKm, puntos);
          playBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        }
      });
    }

    // Reset Button
    const resetBtn = this.container.querySelector('#simResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.stopSimulation();
        this.setMarkerKm(0, totalKm, puntos);
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i> Simular Recorrido';
      });
    }

    // Filter Pills Bar (Highlight specific band)
    const filterBar = this.container.querySelector('#stripFilterBar');
    if (filterBar) {
      filterBar.querySelectorAll('.strip-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('.strip-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');
          this.applyBandFilter(filter);
        });
      });
    }

    // Inventory Search Input
    const searchInput = this.container.querySelector('#inventorySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        this.container.querySelectorAll('.inventory-row').forEach(row => {
          const text = row.innerText.toLowerCase();
          row.style.display = text.includes(val) ? '' : 'none';
        });
      });
    }

    // Locate Buttons in Table
    this.container.querySelectorAll('.btn-locate-pin').forEach(btn => {
      btn.addEventListener('click', () => {
        const km = parseFloat(btn.getAttribute('data-km'));
        this.stopSimulation();
        this.setMarkerKm(km, totalKm, puntos);

        // Highlight matching dot
        const targetDot = this.container.querySelector(`.culvert-dot[data-km="${km}"]`);
        if (targetDot) {
          const idx = parseInt(targetDot.getAttribute('data-idx'), 10);
          this.showCulvertPopover(targetDot, puntos[idx]);
        }
      });
    });

    // Close popover when clicking anywhere else
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.culvert-dot') && !e.target.closest('.culvert-inspection-popover')) {
        this.closeCulvertPopover();
      }
    });
  }

  applyBandFilter(filterKey) {
    this.activeFilter = filterKey;
    const bandRows = this.container.querySelectorAll('.discipline-band-row');
    bandRows.forEach(row => {
      const bandName = row.getAttribute('data-band');
      if (filterKey === 'all') {
        row.style.opacity = '1';
        row.style.borderColor = 'var(--border-subtle)';
        row.style.background = 'var(--bg-subtle)';
      } else if (bandName === filterKey) {
        row.style.opacity = '1';
        row.style.borderColor = 'var(--brand-green-light)';
        row.style.background = '#ffffff';
        row.style.boxShadow = '0 0 14px rgba(4, 120, 87, 0.18)';
      } else {
        row.style.opacity = '0.35';
        row.style.borderColor = 'var(--border-subtle)';
        row.style.background = 'var(--bg-subtle)';
        row.style.boxShadow = 'none';
      }
    });
  }

  showCulvertPopover(dotElement, punto) {
    this.closeCulvertPopover();
    if (!punto) return;

    const popover = document.createElement('div');
    popover.className = 'culvert-inspection-popover';

    const isNew = punto.categoria === 'alcantarilla_nueva';
    const isAnulada = punto.categoria === 'anulada';
    const badgeColor = isNew ? '#2563eb' : (isAnulada ? '#ef4444' : '#059669');

    popover.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="background: var(--bg-subtle); font-family: var(--font-mono); font-weight: 800; padding: 2px 6px; border-radius: 4px; font-size: 0.78rem;">
          ${punto.abscisa}
        </span>
        <span style="font-size: 0.68rem; font-weight: 700; color: ${badgeColor}; text-transform: uppercase;">
          ${punto.tipo}
        </span>
      </div>
      <strong style="color: var(--text-primary); font-size: 0.85rem; line-height: 1.2;">${punto.nombre}</strong>
      <p style="color: var(--text-secondary); font-size: 0.72rem; line-height: 1.35; margin: 0;">${punto.detalle}</p>
      ${punto.foto ? `
        <div style="margin-top: 4px; border-radius: 4px; overflow: hidden; height: 75px; position: relative;">
          <img src="${encodeURI(punto.foto)}" alt="Foto de obra" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.62rem; padding: 1px 4px; border-radius: 2px;">
            <i class="fas fa-camera"></i> Registro de Obra
          </span>
        </div>
        <button class="btn-primary btn-popover-open-photo" style="width: 100%; padding: 4px 8px; font-size: 0.72rem; justify-content: center; margin-top: 4px;">
          <i class="fas fa-expand"></i> Ver Registro Fotográfico
        </button>
      ` : ''}
    `;

    dotElement.appendChild(popover);
    this.activePopover = popover;

    // Attach click to open photo in lightbox if available
    const openPhotoBtn = popover.querySelector('.btn-popover-open-photo');
    if (openPhotoBtn && window.app) {
      openPhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const photos = (this.currentCorridor && this.currentCorridor.registro_fotografico) || [];
        const photo = photos.find(ph => ph.abscisa === punto.abscisa) || photos[0];
        if (photo) window.app.openPhotoLightbox(photo);
      });
    }
  }

  closeCulvertPopover() {
    if (this.activePopover) {
      this.activePopover.remove();
      this.activePopover = null;
    }
  }

  startSimulation(totalKm, puntos) {
    this.isSimulating = true;
    if (this.currentKm >= totalKm) this.currentKm = 0;

    const baseStep = totalKm / 200; // 200 frames across highway
    const stepKm = baseStep * this.simSpeed;

    this.simTimer = setInterval(() => {
      this.currentKm += stepKm;
      if (this.currentKm >= totalKm) {
        this.currentKm = totalKm;
        this.setMarkerKm(this.currentKm, totalKm, puntos);
        this.stopSimulation();
        const playBtn = this.container.querySelector('#simPlayBtn');
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-redo"></i> Repetir Recorrido';
      } else {
        this.setMarkerKm(this.currentKm, totalKm, puntos);
      }
    }, 50);
  }

  pauseSimulation() {
    this.isSimulating = false;
    if (this.simTimer) clearInterval(this.simTimer);
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this.simTimer) clearInterval(this.simTimer);
    this.simTimer = null;
  }

  setMarkerKm(km, totalKm, puntos = []) {
    this.currentKm = Math.min(totalKm, Math.max(0, km));
    const pct = (this.currentKm / totalKm) * 100;

    // 1. Move vehicle marker on Road Ribbon
    const vehicle = this.container.querySelector('#roadRibbonVehicle');
    if (vehicle) vehicle.style.left = `${pct}%`;

    // 2. Move Synchronized Crosshair Needle (passes through all bands)
    const needle = this.container.querySelector('#stripCrosshairNeedle');
    if (needle) {
      needle.style.left = `${pct}%`;
    }

    // 3. Update Scrubber Slider value
    const slider = this.container.querySelector('#scrubberSlider');
    if (slider) slider.value = this.currentKm;

    // 4. Update HUD Odometer & Needle Badge
    const kPart = Math.floor(this.currentKm);
    const mPart = Math.round((this.currentKm - kPart) * 1000);
    const stationStr = `K ${kPart} + ${String(mPart).padStart(3, '0')}`;

    const hudOdo = this.container.querySelector('#stripOdometerText');
    if (hudOdo) hudOdo.innerText = stationStr;

    const needleBadge = this.container.querySelector('#needleBadge');
    if (needleBadge) needleBadge.innerText = stationStr;

    const scrubberBadgeRight = this.container.querySelector('#scrubberBadgeRight');
    if (scrubberBadgeRight) scrubberBadgeRight.innerText = stationStr;

    // 5. Update Active Chips in HUD
    const hudChips = this.container.querySelector('#stripActiveChips');
    if (hudChips) {
      const activePills = [];
      if (this.currentKm <= 16.0) {
        activePills.push('<span class="tag-badge" style="background: rgba(5, 150, 105, 0.12); color: #047857; font-weight: 700;"><i class="fas fa-drafting-compass"></i> Topografía 100%</span>');
      }
      if (this.currentKm <= 21.0) {
        activePills.push('<span class="tag-badge" style="background: rgba(2, 132, 199, 0.12); color: #0284c7; font-weight: 700;"><i class="fas fa-hammer"></i> Geotecnia CBR</span>');
      }
      if (this.currentKm <= 1.8 || (this.currentKm >= 15.0 && this.currentKm <= totalKm)) {
        activePills.push('<span class="tag-badge" style="background: rgba(146, 64, 14, 0.12); color: #92400e; font-weight: 700;"><i class="fas fa-mountain"></i> Subrasante Cal</span>');
      }
      if (this.currentKm >= 0.086 && this.currentKm <= 1.250) {
        activePills.push('<span class="tag-badge" style="background: rgba(37, 99, 235, 0.12); color: #2563eb; font-weight: 700;"><i class="fas fa-filter"></i> Filtro 1.164 ml</span>');
      }
      if (this.currentKm <= 3.5) {
        activePills.push('<span class="tag-badge" style="background: rgba(217, 119, 6, 0.12); color: #d97706; font-weight: 700;"><i class="fas fa-cubes"></i> Cemento MGTC</span>');
      }
      if (this.currentKm <= 1.2 || (this.currentKm >= 3.8 && this.currentKm <= 5.5)) {
        activePills.push('<span class="tag-badge" style="background: rgba(30, 41, 59, 0.12); color: #1e293b; font-weight: 700;"><i class="fas fa-road"></i> Rodadura TSD</span>');
      } else if (this.currentKm > 1.2 && this.currentKm <= 3.8) {
        activePills.push('<span class="tag-badge" style="background: rgba(15, 23, 42, 0.15); color: #0f172a; font-weight: 700;"><i class="fas fa-fire"></i> MDC-19 Caliente</span>');
      }

      hudChips.innerHTML = activePills.length > 0 ? activePills.join('') : '<span style="font-size: 0.75rem; color: var(--text-muted);">Sin intervención activa en esta abscisa</span>';
    }

    // 6. Find nearest singular work
    const hudNearest = this.container.querySelector('#stripNearestText');
    if (hudNearest && puntos.length > 0) {
      let nearest = puntos[0];
      let minDist = Math.abs(puntos[0].km - this.currentKm);

      for (let i = 1; i < puntos.length; i++) {
        const dist = Math.abs(puntos[i].km - this.currentKm);
        if (dist < minDist) {
          minDist = dist;
          nearest = puntos[i];
        }
      }

      const distM = Math.round(minDist * 1000);
      hudNearest.innerHTML = `${nearest.abscisa} · ${nearest.nombre} <span style="font-size: 0.72rem; color: var(--text-muted);">(${distM} m)</span>`;
    }

    // 7. Update Status description in HUD
    const hudStatus = this.container.querySelector('#stripStatusText');
    if (hudStatus) {
      if (this.currentKm < 1.25) {
        hudStatus.innerText = 'Frente Activo: Filtros granulares longitudinales (K0+086 a K1+250) y reposición de alcantarillas';
      } else if (this.currentKm < 3.5) {
        hudStatus.innerText = 'Sector de Obra Nueva: K 3+105 (Alcantarilla 36 pulg.) y plataforma estabilizada con cemento MGTC';
      } else if (this.currentKm < 8.0) {
        hudStatus.innerText = 'Sector de pendiente > 8%: Carpeta proyectada en Mezcla Densa en Caliente (MDC-19)';
      } else if (this.currentKm < 16.0) {
        hudStatus.innerText = 'Frente de topografía finalizada y limpieza de obras hidráulicas';
      } else if (this.currentKm < 21.0) {
        hudStatus.innerText = 'Sector con exploración geotécnica completa (CBR 1,2% a 38,6%)';
      } else {
        hudStatus.innerText = 'Adecuación de plataforma y acceso a La Elvira';
      }
    }
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
