/* ==========================================================================
   PAVEMENT VISUALIZER: CORTE ESTRATIGRÁFICO ESTRUCTURAL COMPARATIVO 3D
   Módulo de Visualización Simultánea de las 3 Estructuras de Pavimento
   (Teórica Licitación vs. Aprobada MDC-19 vs. Aprobada TSD)
   Presentación contrastada lado a lado con Isométricos 3D y Matriz Técnica
   ========================================================================== */

class PavementVisualizer {
  constructor(containerId, inspectorContainerId) {
    this.container = document.getElementById(containerId);
    this.inspector = document.getElementById(inspectorContainerId);
    this.currentCorridor = null;
    this.selectedStructureIndex = 1; // Default to MDC-19 (the principal approved modification)
    this.selectedLayerIndex = 0;
  }

  render(corridor) {
    this.currentCorridor = corridor;
    if (!this.container) return;

    const structures = corridor.estructuras_pavimento || [];
    if (structures.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem;">
          <i class="fas fa-layer-group" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; opacity: 0.4;"></i>
          <p>No se encontraron estructuras de pavimento registradas para este corredor.</p>
        </div>
      `;
      return;
    }

    // Default selection: Structure 1 (MDC-19) layer 0 if available, otherwise 0
    if (this.selectedStructureIndex >= structures.length) {
      this.selectedStructureIndex = 0;
    }

    const corridorTraffic = corridor.transito_diseno || '311.553';

    // 1. Structure Cards HTML (The 3 Columns side-by-side)
    const cardsHtml = structures.map((st, sIdx) => {
      const isSelectedStruct = (sIdx === this.selectedStructureIndex);
      const activeLayerInThisStruct = isSelectedStruct ? this.selectedLayerIndex : -1;
      const typeConfig = this.getStructureMeta(st, sIdx);

      return `
        <div class="pavement-struct-card ${typeConfig.cardClass} ${isSelectedStruct ? 'active-structure' : ''}" 
             data-struct-idx="${sIdx}">
          
          <!-- Card Header -->
          <div class="struct-card-header">
            <div class="struct-tag-row">
              <span class="struct-badge ${typeConfig.badgeClass}">
                <i class="fas ${typeConfig.icon}"></i> ${typeConfig.badgeText}
              </span>
              <span class="struct-delta-pill ${typeConfig.deltaClass}">
                ${typeConfig.deltaText}
              </span>
            </div>

            <h4 class="struct-title">${typeConfig.title}</h4>
            <p class="struct-subtitle">${typeConfig.subtitle}</p>

            <div class="struct-thickness-banner">
              <div class="thick-metric">
                <span class="thick-number">${st.espesor_total_cm.toFixed(1).replace('.', ',')}</span>
                <span class="thick-unit">cm</span>
              </div>
              <div class="thick-meta">
                <span class="thick-caption">Espesor Total Paquete</span>
                <span class="thick-layers-count">${st.capas ? st.capas.length : 3} Capas Estructurales</span>
              </div>
            </div>
          </div>

          <!-- 3D Isometric Stratigraphic Cut SVG Stage -->
          <div class="pavement-iso-box" id="pavementIsoBox_${sIdx}">
            ${this.generateIsometricSVG(st, sIdx, activeLayerInThisStruct)}
          </div>

          <!-- Interactive Layers Breakdown List -->
          <div class="struct-layers-container">
            <div class="layers-list-title">
              <span>Estratigrafía (Superficie &rarr; Subrasante)</span>
              <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: normal;">Clic para inspeccionar</span>
            </div>
            <div class="struct-layers-list">
              ${(st.capas || []).map((layer, lIdx) => {
                const isSelectedLayer = (isSelectedStruct && lIdx === this.selectedLayerIndex);
                return `
                  <div class="layer-item-row ${isSelectedLayer ? 'active-layer' : ''}" 
                       data-struct-idx="${sIdx}" 
                       data-layer-idx="${lIdx}"
                       onclick="window.app && window.app.pavementVisualizer.selectLayer(${sIdx}, ${lIdx})">
                    <div class="layer-row-left">
                      <span class="layer-dot" style="background: ${layer.color || '#334155'};"></span>
                      <div class="layer-name-wrap">
                        <strong class="layer-name-text">${layer.nombre}</strong>
                        <span class="layer-type-chip chip-${layer.tipo}">${layer.tipo.toUpperCase()}</span>
                      </div>
                    </div>
                    <div class="layer-row-right">
                      <span class="layer-thick-pill">${layer.espesor_display || (layer.espesor_cm > 0 ? layer.espesor_cm + ' cm' : 'Sello')}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Card Engineering Footer / Operating Condition -->
          <div class="struct-card-footer ${typeConfig.footerClass}">
            <i class="fas ${typeConfig.footerIcon}"></i>
            <span>${typeConfig.footerText}</span>
          </div>

        </div>
      `;
    }).join('');

    // 2. Complete Layout Structure:
    // Header + 3 Side-by-Side Columns + Comparative Matrix + Layer Technical Inspector + Geotechnical Note
    this.container.innerHTML = `
      <div class="pavement-contrast-wrapper">
        
        <!-- Module Header -->
        <div class="pavement-header">
          <div>
            <span class="pavement-pre-title">
              <i class="fas fa-layer-group"></i> Corte Estratigráfico Estructural &middot; Análisis Comparativo
            </span>
            <h3 class="pavement-main-title">
              Contraste de Estructuras de Pavimento: Licitación vs. Alternativas Aprobadas
            </h3>
            <p class="pavement-subtitle">
              Visualización simultánea de los perfiles estratigráficos 3D para evaluar el comportamiento mecánico según pendiente longitudinal y soporte de subrasante.
            </p>
          </div>

          <div class="pavement-header-badges">
            <span class="header-stat-pill">
              <i class="fas fa-truck-moving" style="color: var(--brand-gold);"></i>
              <span>Tránsito: <strong>${corridorTraffic} ESALs</strong></span>
            </span>
            <span class="header-stat-pill highlight-green">
              <i class="fas fa-cubes-stacked"></i>
              <span><strong>3 Estructuras Contrastadas</strong></span>
            </span>
          </div>
        </div>

        <!-- The 3 Columns Grid Side-by-Side -->
        <div class="pavement-contrast-grid">
          ${cardsHtml}
        </div>

        <!-- Comparative Engineering Matrix -->
        <div class="pavement-matrix-container">
          <div class="matrix-header-bar">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <i class="fas fa-table-columns" style="color: var(--brand-green);"></i>
              <strong style="font-size: 0.85rem; color: var(--text-primary);">Matriz Comparativa Técnica de Estructuras</strong>
            </div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Contraste directo de componentes de diseño vs. pliegos contractuales</span>
          </div>
          ${this.renderComparativeMatrix(structures)}
        </div>

        <!-- Dynamic Selected Layer Technical Inspector -->
        <div class="pavement-inspector-section" id="pavementInspectorSection">
          ${this.renderInspectorCard()}
        </div>

        <!-- Geotechnical & Design Justification Banner -->
        <div class="pavement-note-banner">
          <i class="fas fa-shield-halved" style="color: var(--brand-green); font-size: 1.25rem; margin-top: 2px;"></i>
          <div>
            <strong style="color: var(--text-primary); font-size: 0.82rem;">Justificación Técnica Geotécnica de la Variación:</strong>
            <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 3px; line-height: 1.5;">
              ${corridor.geotecnia_notas || 'La estructura contractual licitada contemplaba Tratamiento Superficial Doble (TSD) para la totalidad del corredor. En fase de obra, los estudios geotécnicos evidenciaron que en sectores con pendientes longitudinales > 8% y curvas pronunciadas, el TSD presenta riesgo inminente de desprendimiento por esfuerzo tangencial de frenado y tracción pesada. Por ello, la Interventoría y el Departamento aprobaron la estructura con Mezcla Densa en Caliente (MDC-19, 7,5 cm) en pendientes pronunciadas, y robustecimiento de la base MGTC a 39 cm en pendientes moderadas (0% - 8%).'}
            </p>
          </div>
        </div>

      </div>
    `;

    // Attach click events on SVG layers
    this.attachSvgEvents();
  }

  getStructureMeta(st, sIdx) {
    const name = (st.nombre || '').toLowerCase();
    const tipo = (st.tipo || '').toLowerCase();

    if (tipo.includes('teorica') || name.includes('teórica') || sIdx === 0) {
      return {
        cardClass: 'card-teorica',
        badgeClass: 'badge-teorica',
        badgeText: 'Licitación (Contractual)',
        icon: 'fa-file-lines',
        deltaClass: 'delta-base',
        deltaText: 'Línea Base Pliegos',
        title: 'Estructura Teórica',
        subtitle: 'Diseño licitatorio preliminar de pliegos de condiciones',
        footerClass: 'footer-teorica',
        footerIcon: 'fa-circle-info',
        footerText: 'Perfil teórico contractual uniforme para todo el corredor.'
      };
    }

    if (tipo.includes('mdc') || name.includes('mdc') || sIdx === 1) {
      return {
        cardClass: 'card-mdc',
        badgeClass: 'badge-mdc',
        badgeText: 'Aprobada · Pendientes > 8%',
        icon: 'fa-road',
        deltaClass: 'delta-mod',
        deltaText: '+4,5 cm vs Licitación',
        title: 'Aprobada MDC-19',
        subtitle: 'Zonas críticas, curvas y fuertes pendientes (> 8%)',
        footerClass: 'footer-mdc',
        footerIcon: 'fa-triangle-exclamation',
        footerText: 'Asfalto denso MDC-19 para máxima adherencia y tracción en pendientes fuertes.'
      };
    }

    return {
      cardClass: 'card-tsd',
      badgeClass: 'badge-tsd',
      badgeText: 'Aprobada · Pendientes 0–8%',
      icon: 'fa-check-circle',
      deltaClass: 'delta-plus',
      deltaText: '+16,0 cm vs Licitación',
      title: 'Aprobada TSD',
      subtitle: 'Rasantes moderadas y rectas (pendientes &le; 8%)',
      footerClass: 'footer-tsd',
      footerIcon: 'fa-circle-check',
      footerText: 'Tratamiento superficial doble con base MGTC de 39 cm de alta capacidad portante.'
    };
  }

  selectLayer(structIdx, layerIdx) {
    this.selectedStructureIndex = structIdx;
    this.selectedLayerIndex = layerIdx;

    const structures = this.currentCorridor.estructuras_pavimento || [];
    const structure = structures[structIdx];
    if (!structure) return;

    // Update active state in cards
    this.container.querySelectorAll('.pavement-struct-card').forEach((card, idx) => {
      if (idx === structIdx) {
        card.classList.add('active-structure');
      } else {
        card.classList.remove('active-structure');
      }
    });

    // Update layer list item active state
    this.container.querySelectorAll('.layer-item-row').forEach(row => {
      const s = parseInt(row.getAttribute('data-struct-idx'), 10);
      const l = parseInt(row.getAttribute('data-layer-idx'), 10);
      if (s === structIdx && l === layerIdx) {
        row.classList.add('active-layer');
      } else {
        row.classList.remove('active-layer');
      }
    });

    // Re-render SVG highlights in all boxes
    structures.forEach((st, s) => {
      const box = this.container.querySelector(`#pavementIsoBox_${s}`);
      if (box) {
        const activeL = (s === structIdx) ? layerIdx : -1;
        box.innerHTML = this.generateIsometricSVG(st, s, activeL);
      }
    });

    // Re-render the inspector card
    const inspectorSection = this.container.querySelector('#pavementInspectorSection');
    if (inspectorSection) {
      inspectorSection.innerHTML = this.renderInspectorCard();
    }

    this.attachSvgEvents();
  }

  attachSvgEvents() {
    this.container.querySelectorAll('.iso-layer-group').forEach(group => {
      group.addEventListener('click', (e) => {
        e.stopPropagation();
        const sIdx = parseInt(group.getAttribute('data-struct-idx'), 10);
        const lIdx = parseInt(group.getAttribute('data-layer-idx'), 10);
        this.selectLayer(sIdx, lIdx);
      });
    });
  }

  generateIsometricSVG(structure, sIdx, selectedLayerIdx) {
    const layers = structure.capas || [];
    const totalCm = structure.espesor_total_cm || 48;

    // Standardized Parallelogram Coordinates for Top Surface across all 3 cuts
    // P0: Top back, P1: Top left, P2: Top front, P3: Top right
    const P0 = { x: 215, y: 34 };
    const u = { x: -125, y: 62 };   // Down-left vector (cross-section cut)
    const v = { x: 140, y: 70 };    // Down-right vector (road longitudinal)
    const P1 = { x: P0.x + u.x, y: P0.y + u.y }; // (90, 96)
    const P2 = { x: P1.x + v.x, y: P1.y + v.y }; // (230, 166)
    const P3 = { x: P0.x + v.x, y: P0.y + v.y }; // (355, 104)

    // Calculate vertical thickness in pixels calibrated to cm thickness
    // This allows physical height comparison (e.g. 64 cm looks clearly thicker than 48 cm)
    const layerHeights = layers.map((layer) => {
      if (layer.espesor_cm <= 0) {
        return 18; // Visible sleek slab for TSD
      }
      if (layer.material && layer.material.includes('MDC')) {
        return 28; // Visibly defined asphalt layer for MDC-19 (7.5 cm)
      }
      return Math.round(Math.max(26, layer.espesor_cm * 2.35));
    });

    // Cumulative z-offsets
    const zOffsets = [0];
    for (let i = 0; i < layerHeights.length; i++) {
      zOffsets.push(zOffsets[i] + layerHeights[i]);
    }
    const finalZ = zOffsets[zOffsets.length - 1];

    // SVG polygon facets for each layer
    let layersSvg = '';
    layers.forEach((layer, idx) => {
      const zTop = zOffsets[idx];
      const zBot = zOffsets[idx + 1];
      const isSelected = (idx === selectedLayerIdx);

      // Facet points
      const L1_top = `${P1.x},${P1.y + zTop}`;
      const L2_top = `${P2.x},${P2.y + zTop}`;
      const L2_bot = `${P2.x},${P2.y + zBot}`;
      const L1_bot = `${P1.x},${P1.y + zBot}`;

      const R2_top = `${P2.x},${P2.y + zTop}`;
      const R3_top = `${P3.x},${P3.y + zTop}`;
      const R3_bot = `${P3.x},${P3.y + zBot}`;
      const R2_bot = `${P2.x},${P2.y + zBot}`;

      // Fills based on material
      const mat = (layer.material || '').toLowerCase();
      let leftFill = `url(#grad-cal-left-${sIdx})`;
      let rightFill = `url(#grad-cal-right-${sIdx})`;
      let topFill = `url(#grad-cal-top-${sIdx})`;
      let patternOverlay = '';

      if (mat.includes('tsd') || mat.includes('mdc')) {
        leftFill = `url(#grad-asphalt-left-${sIdx})`;
        rightFill = `url(#grad-asphalt-right-${sIdx})`;
        topFill = `url(#grad-asphalt-top-${sIdx})`;
      } else if (mat.includes('mgtc') || mat.includes('cemento')) {
        leftFill = `url(#grad-mgtc-left-${sIdx})`;
        rightFill = `url(#grad-mgtc-right-${sIdx})`;
        topFill = `url(#grad-mgtc-top-${sIdx})`;
        patternOverlay = `url(#pat-pebbles-${sIdx})`;
      } else if (mat.includes('cal')) {
        leftFill = `url(#grad-cal-left-${sIdx})`;
        rightFill = `url(#grad-cal-right-${sIdx})`;
        topFill = `url(#grad-cal-top-${sIdx})`;
        patternOverlay = `url(#pat-soil-${sIdx})`;
      } else if (mat.includes('afirmado') || mat.includes('granular')) {
        leftFill = `url(#grad-afirmado-left-${sIdx})`;
        rightFill = `url(#grad-afirmado-right-${sIdx})`;
        topFill = `url(#grad-afirmado-top-${sIdx})`;
        patternOverlay = `url(#pat-gravel-${sIdx})`;
      }

      const glowFilter = isSelected ? `filter="url(#iso-glow-${sIdx})"` : '';
      const outlineStroke = isSelected ? 'stroke="#0284c7" stroke-width="2.2"' : 'stroke="rgba(255,255,255,0.45)" stroke-width="0.75"';

      layersSvg += `
        <g class="iso-layer-group ${isSelected ? 'selected-layer' : ''}" 
           data-struct-idx="${sIdx}" 
           data-layer-idx="${idx}" 
           style="cursor: pointer;">
          
          <!-- Top Surface for Layer 0 -->
          ${idx === 0 ? `
            <polygon points="${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}" 
                     fill="${topFill}" stroke="#334155" stroke-width="0.8" />
            <polygon points="${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}" 
                     fill="url(#pat-asphalt-grain-${sIdx})" opacity="0.65" />

            <!-- Asphalt Road Markings -->
            <line x1="${(P0.x + P1.x) / 2}" y1="${(P0.y + P1.y) / 2}" 
                  x2="${(P3.x + P2.x) / 2}" y2="${(P3.y + P2.y) / 2}" 
                  stroke="#facc15" stroke-dasharray="9,6" stroke-width="2" opacity="0.9" />
            <line x1="${(P0.x + P3.x) / 2}" y1="${(P0.y + P3.y) / 2}" 
                  x2="${(P1.x + P2.x) / 2}" y2="${(P1.y + P2.y) / 2}" 
                  stroke="#0f172a" stroke-width="1.2" opacity="0.7" />
          ` : ''}

          <!-- Left Facet (Cross-Section Cut) -->
          <polygon points="${L1_top} ${L2_top} ${L2_bot} ${L1_bot}" 
                   fill="${leftFill}" ${outlineStroke} />
          ${patternOverlay ? `
            <polygon points="${L1_top} ${L2_top} ${L2_bot} ${L1_bot}" 
                     fill="${patternOverlay}" opacity="0.32" />
          ` : ''}

          <!-- Right Facet (Longitudinal Cut) -->
          <polygon points="${R2_top} ${R3_top} ${R3_bot} ${R2_bot}" 
                   fill="${rightFill}" ${outlineStroke} />

          <!-- Selected Layer Highlight Glow -->
          ${isSelected ? `
            <polygon points="${L1_top} ${L2_top} ${L2_bot} ${L1_bot}" 
                     fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="2.2" ${glowFilter} />
            <polygon points="${R2_top} ${R3_top} ${R3_bot} ${R2_bot}" 
                     fill="rgba(2, 132, 199, 0.14)" stroke="#0284c7" stroke-width="2.2" ${glowFilter} />
            ${idx === 0 ? `
              <polygon points="${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}" 
                       fill="rgba(2, 132, 199, 0.15)" stroke="#0284c7" stroke-width="2.2" ${glowFilter} />
            ` : ''}
          ` : ''}

          <!-- Top Bevel Highlight Edge -->
          <line x1="${P1.x}" y1="${P1.y + zTop}" x2="${P2.x}" y2="${P2.y + zTop}" 
                stroke="#ffffff" stroke-width="0.8" opacity="0.5" />
          <line x1="${P2.x}" y1="${P2.y + zTop}" x2="${P3.x}" y2="${P3.y + zTop}" 
                stroke="#ffffff" stroke-width="0.8" opacity="0.3" />
        </g>
      `;
    });

    // Dimension Callouts on Right Side (Pill Badges)
    let rightDimensionBadgesSvg = '';
    const bracketX = 372;
    const badgeX = bracketX + 8;

    layers.forEach((layer, idx) => {
      const zTop = zOffsets[idx];
      const zBot = zOffsets[idx + 1];
      const yMid = P3.y + (zTop + zBot) / 2;
      const isSelected = (idx === selectedLayerIdx);

      rightDimensionBadgesSvg += `
        <g class="dim-callout-group" style="cursor: pointer;" 
           onclick="window.app && window.app.pavementVisualizer.selectLayer(${sIdx}, ${idx})">
          <line x1="${P3.x + 3}" y1="${P3.y + zTop}" x2="${bracketX}" y2="${P3.y + zTop}" stroke="#94a3b8" stroke-width="0.9" stroke-dasharray="2,2"/>
          <line x1="${P3.x + 3}" y1="${P3.y + zBot}" x2="${bracketX}" y2="${P3.y + zBot}" stroke="#94a3b8" stroke-width="0.9" stroke-dasharray="2,2"/>
          <line x1="${bracketX}" y1="${P3.y + zTop}" x2="${bracketX}" y2="${P3.y + zBot}" stroke="#64748b" stroke-width="1.3"/>

          <g transform="translate(${badgeX}, ${yMid})">
            <rect x="0" y="-10" width="54" height="20" rx="4" 
                  fill="#ffffff" stroke="${isSelected ? '#0284c7' : '#cbd5e1'}" 
                  stroke-width="${isSelected ? '2' : '1'}" 
                  filter="url(#badge-shadow-${sIdx})"/>
            <text x="27" y="3.5" text-anchor="middle" font-family="var(--font-mono)" 
                  font-size="9.5" font-weight="800" fill="${isSelected ? '#0284c7' : '#0f172a'}">
              ${layer.espesor_display || (layer.espesor_cm > 0 ? layer.espesor_cm + ' cm' : 'TSD')}
            </text>
          </g>
        </g>
      `;
    });

    // Left Depth Ruler (Superficie to Subrasante)
    const rulerX = 52;
    const rulerTopY = P1.y;
    const rulerBotY = P1.y + finalZ;

    // Zoom Lens Coordinates for Structure 1 (MDC-19)
    const isMdcStruct = (sIdx === 1 || (structure.tipo && structure.tipo.includes('mdc')));
    const lensCenter = { x: 388, y: 72 };
    const lensRadius = 30;
    const targetPoint = { x: 275, y: 122 };

    return `
      <svg class="isometric-pavement-svg" viewBox="0 0 450 365" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Material Gradients uniquely scoped to structure index -->
          <linearGradient id="grad-asphalt-top-${sIdx}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="grad-asphalt-left-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#242e3d"/>
            <stop offset="100%" stop-color="#141a24"/>
          </linearGradient>
          <linearGradient id="grad-asphalt-right-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#18202c"/>
            <stop offset="100%" stop-color="#0a0d13"/>
          </linearGradient>

          <linearGradient id="grad-mgtc-top-${sIdx}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f1e7da"/>
            <stop offset="100%" stop-color="#dfd2c1"/>
          </linearGradient>
          <linearGradient id="grad-mgtc-left-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#d6c6b2"/>
            <stop offset="100%" stop-color="#beac96"/>
          </linearGradient>
          <linearGradient id="grad-mgtc-right-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a6947f"/>
            <stop offset="100%" stop-color="#8d7c69"/>
          </linearGradient>

          <linearGradient id="grad-cal-top-${sIdx}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c67d4f"/>
            <stop offset="100%" stop-color="#b16738"/>
          </linearGradient>
          <linearGradient id="grad-cal-left-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a6592e"/>
            <stop offset="100%" stop-color="#8c4721"/>
          </linearGradient>
          <linearGradient id="grad-cal-right-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#733716"/>
            <stop offset="100%" stop-color="#58270c"/>
          </linearGradient>

          <linearGradient id="grad-afirmado-left-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a27e57"/>
            <stop offset="100%" stop-color="#89643d"/>
          </linearGradient>
          <linearGradient id="grad-afirmado-right-${sIdx}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#6f4e2c"/>
            <stop offset="100%" stop-color="#563b1e"/>
          </linearGradient>

          <!-- Grain & Aggregate Patterns -->
          <pattern id="pat-asphalt-grain-${sIdx}" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.7" fill="#ffffff" opacity="0.16"/>
            <circle cx="5" cy="5" r="0.5" fill="#000000" opacity="0.25"/>
          </pattern>
          <pattern id="pat-pebbles-${sIdx}" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill="#78350f" opacity="0.22"/>
            <circle cx="10" cy="7" r="1.8" fill="#573012" opacity="0.28"/>
            <circle cx="6" cy="11" r="1.1" fill="#92400e" opacity="0.18"/>
          </pattern>
          <pattern id="pat-gravel-${sIdx}" width="12" height="12" patternUnits="userSpaceOnUse">
            <polygon points="2,2 4,1 5,4 3,5" fill="#451a03" opacity="0.22"/>
            <polygon points="8,8 10,7 11,10 9,11" fill="#78350f" opacity="0.26"/>
          </pattern>
          <pattern id="pat-soil-${sIdx}" width="24" height="8" patternUnits="userSpaceOnUse">
            <path d="M 0,2 Q 6,0 12,2 T 24,2" stroke="#58270c" stroke-width="0.75" fill="none" opacity="0.3"/>
          </pattern>

          <!-- Filters -->
          <filter id="iso-glow-${sIdx}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="shadow-blur-${sIdx}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7"/>
          </filter>

          <filter id="badge-shadow-${sIdx}" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.12"/>
          </filter>

          <clipPath id="lens-clip-${sIdx}">
            <circle cx="${lensCenter.x}" cy="${lensCenter.y}" r="${lensRadius}"/>
          </clipPath>
        </defs>

        <!-- Drop Shadow Under the Slab Stack -->
        <ellipse cx="${P2.x}" cy="${P2.y + finalZ + 9}" rx="145" ry="24" 
                 fill="rgba(15, 23, 42, 0.12)" filter="url(#shadow-blur-${sIdx})"/>

        <!-- Left Vertical Depth Dimension Ruler -->
        <g class="iso-depth-ruler" opacity="0.85">
          <text x="${rulerX - 5}" y="${rulerTopY - 6}" font-family="var(--font-mono)" 
                font-size="9" font-weight="700" fill="#64748b" text-anchor="end">
            0 cm (Sup.)
          </text>
          
          <line x1="${rulerX}" y1="${rulerTopY}" x2="${rulerX}" y2="${rulerBotY}" 
                stroke="#94a3b8" stroke-width="1.1" stroke-dasharray="2.5,2.5"/>
          <line x1="${rulerX - 4}" y1="${rulerTopY}" x2="${rulerX + 10}" y2="${rulerTopY}" 
                stroke="#64748b" stroke-width="1.3"/>
          <line x1="${rulerX - 4}" y1="${rulerBotY}" x2="${rulerX + 10}" y2="${rulerBotY}" 
                stroke="#64748b" stroke-width="1.3"/>

          ${[0.33, 0.66].map(ratio => `
            <line x1="${rulerX - 2.5}" y1="${rulerTopY + finalZ * ratio}" 
                  x2="${rulerX + 3.5}" y2="${rulerTopY + finalZ * ratio}" 
                  stroke="#94a3b8" stroke-width="0.9"/>
          `).join('')}

          <text x="${rulerX - 5}" y="${rulerBotY + 12}" font-family="var(--font-mono)" 
                font-size="9" font-weight="700" fill="#64748b" text-anchor="end">
            ${totalCm.toFixed(1).replace('.0', '')} cm (Sub.)
          </text>
        </g>

        <!-- 3D Layer Slabs -->
        <g id="isoStack_${sIdx}">
          ${layersSvg}
        </g>

        <!-- Right Dimension Badges -->
        <g id="isoBadges_${sIdx}">
          ${rightDimensionBadgesSvg}
        </g>

        <!-- Optional Magnifying Lens Callout for MDC-19 -->
        ${isMdcStruct ? `
          <g class="iso-zoom-callout" style="pointer-events: none;">
            <polygon points="${targetPoint.x},${targetPoint.y} ${lensCenter.x - 22},${lensCenter.y - 18} ${lensCenter.x - 22},${lensCenter.y + 18}" 
                     fill="rgba(217, 119, 6, 0.12)" stroke="rgba(217, 119, 6, 0.4)" stroke-width="0.9" stroke-dasharray="2,2"/>
            <circle cx="${targetPoint.x}" cy="${targetPoint.y}" r="3.5" 
                    fill="#d97706" stroke="#ffffff" stroke-width="1.5"/>
            <image href="assets/aggregate_macro.jpg" 
                   x="${lensCenter.x - lensRadius}" y="${lensCenter.y - lensRadius}" 
                   width="${lensRadius * 2}" height="${lensRadius * 2}" 
                   clip-path="url(#lens-clip-${sIdx})" preserveAspectRatio="xMidYMid slice"/>
            <circle cx="${lensCenter.x}" cy="${lensCenter.y}" r="${lensRadius}" 
                    fill="none" stroke="#d97706" stroke-width="2.2"/>
            <circle cx="${lensCenter.x}" cy="${lensCenter.y}" r="${lensRadius - 1.2}" 
                    fill="none" stroke="#fde68a" stroke-width="1" opacity="0.75"/>
          </g>
        ` : ''}

      </svg>
    `;
  }

  renderComparativeMatrix(structures) {
    if (!structures || structures.length === 0) return '';

    return `
      <div class="table-responsive" style="margin-top: 0.25rem;">
        <table class="pavement-comparison-table">
          <thead>
            <tr>
              <th style="width: 22%;">Criterio de Ingeniería</th>
              <th class="col-teorica" style="width: 26%;">
                <span class="matrix-col-tag tag-teorica">1. Teórica (Licitación)</span>
                <strong>Estructura Pliegos</strong>
              </th>
              <th class="col-mdc" style="width: 26%;">
                <span class="matrix-col-tag tag-mdc">2. Aprobada (Pendientes &gt; 8%)</span>
                <strong>MDC-19 (Asfalto Denso)</strong>
              </th>
              <th class="col-tsd" style="width: 26%;">
                <span class="matrix-col-tag tag-tsd">3. Aprobada (Pendientes 0–8%)</span>
                <strong>TSD (Base Granular 39 cm)</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="row-label">
                <i class="fas fa-arrows-up-down" style="color: var(--text-muted); margin-right: 4px;"></i>
                <strong>Espesor Total</strong>
              </td>
              <td><span class="matrix-thick-pill">48,0 cm</span> <span class="matrix-subtext">(Línea base)</span></td>
              <td><span class="matrix-thick-pill highlight-mdc">52,5 cm</span> <span class="matrix-delta">+4,5 cm</span></td>
              <td><span class="matrix-thick-pill highlight-tsd">64,0 cm</span> <span class="matrix-delta">+16,0 cm</span></td>
            </tr>
            <tr>
              <td class="row-label">
                <i class="fas fa-road" style="color: var(--text-muted); margin-right: 4px;"></i>
                <strong>Carpeta de Rodadura</strong>
              </td>
              <td>Tratamiento Superficial Doble (TSD) &middot; 0 cm nominal</td>
              <td><strong style="color: #b45309;">Mezcla Densa en Caliente (MDC-19) &middot; 7,5 cm</strong></td>
              <td>Tratamiento Superficial Doble (TSD) &middot; 0 cm nominal</td>
            </tr>
            <tr>
              <td class="row-label">
                <i class="fas fa-layer-group" style="color: var(--text-muted); margin-right: 4px;"></i>
                <strong>Capa de Base</strong>
              </td>
              <td>Estabilización con Cemento (Subbase 13 cm) &middot; <strong>28 cm</strong></td>
              <td>Base Suelo-Cemento MGTC &middot; <strong>20 cm</strong></td>
              <td>Base Suelo-Cemento MGTC Reforzada &middot; <strong style="color: #047857;">39 cm</strong></td>
            </tr>
            <tr>
              <td class="row-label">
                <i class="fas fa-mountain" style="color: var(--text-muted); margin-right: 4px;"></i>
                <strong>Capa Inferior / Subrasante</strong>
              </td>
              <td>Subrasante estabilizada con Cal &middot; 20 cm</td>
              <td>Afirmado granular de soporte &middot; 25 cm</td>
              <td>Afirmado granular de soporte &middot; 25 cm</td>
            </tr>
            <tr>
              <td class="row-label">
                <i class="fas fa-gauge-high" style="color: var(--text-muted); margin-right: 4px;"></i>
                <strong>Rango de Pendiente</strong>
              </td>
              <td>Sin discriminación de pendiente en pliegos</td>
              <td><span class="slope-badge alert">Pendientes &gt; 8% y Curvas</span></td>
              <td><span class="slope-badge normal">Pendientes &le; 8% (Moderadas)</span></td>
            </tr>
            <tr>
              <td class="row-label">
                <i class="fas fa-circle-check" style="color: var(--text-muted); margin-right: 4px;"></i>
                <strong>Desempeño / Justificación</strong>
              </td>
              <td style="color: var(--text-secondary); font-size: 0.78rem;">
                Diseño preliminar genérico con riesgo de desprendimiento en rampas.
              </td>
              <td style="color: #92400e; font-size: 0.78rem; font-weight: 600;">
                Alta adherencia neumático-pavimento y resistencia a fuerzas cortantes de tracción y frenado.
              </td>
              <td style="color: #065f46; font-size: 0.78rem; font-weight: 600;">
                Alta rigidez y capacidad de dispersión de carga axial mediante paquete granular de 64 cm.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  renderInspectorCard() {
    const structures = this.currentCorridor.estructuras_pavimento || [];
    const structure = structures[this.selectedStructureIndex] || structures[0];
    if (!structure) return '';

    const layer = (structure.capas && structure.capas[this.selectedLayerIndex]) || (structure.capas && structure.capas[0]);
    if (!layer) return '';

    const techSpecs = this.getMaterialSpecs(layer.material, layer.espesor_cm);
    const corridorTraffic = this.currentCorridor.transito_diseno || '311.553';

    return `
      <div class="iso-detail-card">
        <div class="detail-header-band">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-microscope" style="color: var(--brand-green);"></i>
            <span>Ficha de Especificación Técnica Invías &middot; Capa Seleccionada: <strong>${layer.nombre}</strong></span>
          </div>
          <span class="layer-pill-code">${layer.material.toUpperCase()} &middot; ${structure.nombre.replace('Estructura ', '')}</span>
        </div>

        <div class="detail-card-inner">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span style="font-size: 0.72rem; font-weight: 800; color: var(--brand-green); text-transform: uppercase; letter-spacing: 0.05em;">
                Capa Estructural: ${layer.tipo.toUpperCase()} &middot; Espesor: ${layer.espesor_display || layer.espesor_cm + ' cm'}
              </span>
              <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 2px; line-height: 1.25;">
                ${layer.nombre}
              </h4>
            </div>
            <span class="structure-origin-pill">
              Pertenece a: <strong>${structure.nombre}</strong>
            </span>
          </div>

          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            ${techSpecs.funcion}
          </p>

          <!-- 4 Technical Specifications Tiles Grid -->
          <div class="detail-specs-grid">
            <div class="spec-tile">
              <span class="spec-label"><i class="fas fa-book-bookmark"></i> Normativa Invías:</span>
              <strong class="spec-value">${techSpecs.norma}</strong>
            </div>
            <div class="spec-tile">
              <span class="spec-label"><i class="fas fa-flask-vial"></i> Dosificación / Tipo:</span>
              <strong class="spec-value">${techSpecs.dosificacion}</strong>
            </div>
            <div class="spec-tile">
              <span class="spec-label"><i class="fas fa-dumbbell"></i> Resistencia / Módulo:</span>
              <strong class="spec-value">${techSpecs.resistencia}</strong>
            </div>
            <div class="spec-tile highlight-cbr">
              <span class="spec-label"><i class="fas fa-chart-line"></i> CBR Esperado:</span>
              <strong class="spec-value">${techSpecs.cbr}</strong>
            </div>
          </div>

          <div class="detail-footer-esals">
            <span style="color: var(--text-muted); font-size: 0.78rem; font-weight: 600;">
              <i class="fas fa-truck"></i> Tránsito Proyectado Corredor (ESALs 8.2 ton):
            </span>
            <strong style="color: var(--text-primary); font-family: var(--font-mono); font-size: 1rem;">
              ${corridorTraffic}
            </strong>
          </div>
        </div>
      </div>
    `;
  }

  getMaterialSpecs(material, espesor) {
    const m = (material || '').toLowerCase();
    if (m.includes('mdc')) {
      return {
        norma: 'Artículo 450 (MDC-19)',
        dosificacion: 'Cemento Asfáltico 60-70 (5.2% – 5.8%)',
        resistencia: 'Estabilidad Marshall > 900 kgf · Flujo 8–14',
        cbr: '> 100% equivalente estructural',
        funcion: 'Capa asfáltica densa en caliente diseñada para sectores de alta pendiente (> 8%) y curvas cerradas, proporcionando máxima adherencia superficial, impermeabilidad y alta resistencia al esfuerzo tangencial de tracción y frenado de vehículos de carga.'
      };
    }
    if (m.includes('tsd')) {
      return {
        norma: 'Artículo 440 (TSD)',
        dosificacion: 'Emulsión asfáltica catiónica de rotura rápida (CRR-1) + gravilla seleccionada',
        resistencia: 'Impermeabilización superficial y fricción antideslizante',
        cbr: 'Protección de rodadura contra intemperie y agua',
        funcion: 'Tratamiento superficial doble con dos aplicaciones sucesivas de ligante asfáltico y agregados pétreos calibrados para sellar la base estabilizada y proporcionar textura de rodadura en tramos con pendientes leves o moderadas.'
      };
    }
    if (m.includes('mgtc') || m.includes('bgtc') || m.includes('cemento')) {
      return {
        norma: 'Artículo 330 (Suelo-Cemento / MGTC)',
        dosificacion: 'Cemento Portland Tipo UG (3.0% – 5.5% en peso según fórmula de trabajo)',
        resistencia: 'Rc (7 días curado húmedo) ≥ 2.5 – 4.5 MPa',
        cbr: 'CBR > 120% (Base rígida / semirrígida)',
        funcion: 'Material granular homogéneamente mezclado con cemento hidratado y compactado para proveer alta capacidad de soporte estructural, distribución uniforme de esfuerzos axiales y protección contra deformaciones permanentes.'
      };
    }
    if (m.includes('cal')) {
      return {
        norma: 'Artículo 320 (Estabilización con Cal)',
        dosificacion: 'Cal viva o hidratada al 3% en peso seco',
        resistencia: 'Reducción de Plasticidad (IP < 10), expansión < 1%',
        cbr: 'CBR subrasante mejorado de 1.5% a > 15%',
        funcion: 'Tratamiento químico de arcillas expansivas para neutralizar la plasticidad mediante intercambio catiónico y reacciones puzolánicas, mejorando la estabilidad de la rasante natural.'
      };
    }
    return {
      norma: 'Artículo 300 / 310 (Afirmado de Soporte)',
      dosificacion: 'Agregado pétreo triturado seleccionado clasificado A-1-a / A-1-b',
      resistencia: 'CBR ≥ 40% (Subbase granular)',
      cbr: 'CBR 40% – 80%',
      funcion: 'Capa granular de transición y amortiguamiento que proporciona drenaje subsuperficial y una plataforma uniforme de soporte estructural hacia la subrasante natural.'
    };
  }
}

window.PavementVisualizer = PavementVisualizer;
