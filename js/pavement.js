/* ==========================================================================
   PAVEMENT VISUALIZER: CORTE ESTRATIGRÁFICO ESTRUCTURAL ISOMÉTRICO 3D
   Visualizador Interactivo Tridimensional con Texturas, Rótulos de Cota,
   Lupa de Agregados y Ficha de Especificaciones Técnicas Invías
   ========================================================================== */

class PavementVisualizer {
  constructor(containerId, inspectorContainerId) {
    this.container = document.getElementById(containerId);
    this.inspector = document.getElementById(inspectorContainerId);
    this.currentCorridor = null;
    this.selectedStructureIndex = 0;
    this.selectedLayerIndex = 0;
  }

  render(corridor) {
    this.currentCorridor = corridor;
    this.selectedStructureIndex = 0;
    this.selectedLayerIndex = 0;

    if (!this.container) return;

    const structures = corridor.estructuras_pavimento || [];
    if (structures.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem;">
          <i class="fas fa-layer-group" style="font-size: 2.5rem; margin-bottom: 1rem; display: block; opacity: 0.4;"></i>
          <p>Estructura de pavimento tipo estándar (TSD + MGTC + Cal).</p>
        </div>
      `;
      if (this.inspector) this.inspector.innerHTML = '';
      return;
    }

    // Header buttons (Pill tabs)
    const buttonsHtml = structures.map((st, idx) => `
      <button class="struct-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
        <i class="fas ${st.tipo.includes('mdc') ? 'fa-road' : 'fa-layer-group'}"></i>
        ${st.nombre.replace('Estructura ', '')}
      </button>
    `).join('');

    this.container.innerHTML = `
      <div class="pavement-header">
        <div>
          <span style="font-size: 0.72rem; font-weight: 800; color: var(--brand-green); text-transform: uppercase; letter-spacing: 0.05em; display: block;">
            Corte Estratigráfico Estructural
          </span>
          <h3 id="currentStructTitle" style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 2px; letter-spacing: -0.01em;">
            ${structures[0].nombre}
          </h3>
        </div>
        <div class="structure-switch-buttons" id="structButtonsContainer">
          ${buttonsHtml}
        </div>
      </div>

      <!-- Main Isometric 3D Stage -->
      <div class="pavement-isometric-stage">
        
        <!-- Left Column: Interactive 3D Isometric Block -->
        <div class="isometric-view-container" id="isoViewContainer">
          <!-- Populated dynamically by generateIsometricSVG -->
        </div>

        <!-- Right Column: Selected Layer Engineering Inspector -->
        <div class="isometric-inspector-container" id="isoInspectorContainer">
          <!-- Populated dynamically by renderLayerDetails -->
        </div>

      </div>

      <!-- Geotechnical & Engineering Design Note Bar -->
      <div class="pavement-note-banner">
        <i class="fas fa-info-circle" style="color: var(--brand-green); font-size: 1.15rem; margin-top: 1px;"></i>
        <div>
          <strong style="color: var(--text-primary); font-size: 0.8rem;">Nota Técnica Geotécnica:</strong>
          <span style="color: var(--text-secondary); margin-left: 4px; font-size: 0.8rem;">
            ${corridor.geotecnia_notas || 'Se cuenta con 4 estructuras aprobadas según CBR (1,2% - 38,6%) y pendientes longitudinales. En pendientes > 8% se utiliza MDC-19 para la carpeta de rodadura.'}
          </span>
        </div>
      </div>
    `;

    // Attach structure selector button events
    const btnContainer = this.container.querySelector('#structButtonsContainer');
    if (btnContainer) {
      btnContainer.querySelectorAll('.struct-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          btnContainer.querySelectorAll('.struct-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.switchStructure(idx);
        });
      });
    }

    this.renderCurrentLayers();
  }

  switchStructure(idx) {
    this.selectedStructureIndex = idx;
    this.selectedLayerIndex = 0;
    const structure = this.currentCorridor.estructuras_pavimento[idx];

    const titleEl = this.container.querySelector('#currentStructTitle');
    if (titleEl) titleEl.innerText = structure.nombre;

    this.renderCurrentLayers();
  }

  renderCurrentLayers() {
    const structure = this.currentCorridor.estructuras_pavimento[this.selectedStructureIndex];
    if (!structure) return;

    const isoContainer = this.container.querySelector('#isoViewContainer');
    if (isoContainer) {
      isoContainer.innerHTML = this.generateIsometricSVG(structure, this.selectedLayerIndex);
      this.attachSvgLayerEvents();
    }

    this.renderLayerDetails();
  }

  selectLayer(lIdx) {
    this.selectedLayerIndex = lIdx;
    const structure = this.currentCorridor.estructuras_pavimento[this.selectedStructureIndex];
    if (!structure) return;

    const isoContainer = this.container.querySelector('#isoViewContainer');
    if (isoContainer) {
      isoContainer.innerHTML = this.generateIsometricSVG(structure, this.selectedLayerIndex);
      this.attachSvgLayerEvents();
    }

    this.renderLayerDetails();
  }

  attachSvgLayerEvents() {
    const isoContainer = this.container.querySelector('#isoViewContainer');
    if (!isoContainer) return;

    // Attach click to 3D isometric layer groups
    isoContainer.querySelectorAll('.iso-layer-group').forEach(group => {
      group.addEventListener('click', (e) => {
        e.stopPropagation();
        const lIdx = parseInt(group.getAttribute('data-layer-idx'), 10);
        this.selectLayer(lIdx);
      });
    });

    // Attach click to floating mini-card layer items
    isoContainer.querySelectorAll('.floating-layer-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const lIdx = parseInt(item.getAttribute('data-layer-idx'), 10);
        this.selectLayer(lIdx);
      });
    });
  }

  generateIsometricSVG(structure, selectedLayerIdx) {
    const layers = structure.capas || [];
    const totalCm = structure.espesor_total_cm || 48;

    // Isometric Parallelogram Constants for Top Surface
    // P0: Top back, P1: Top left, P2: Top front, P3: Top right
    const P0 = { x: 235, y: 48 };
    const u = { x: -150, y: 78 };   // Down-left vector (cross section)
    const v = { x: 170, y: 86 };    // Down-right vector (road longitudinal)
    const P1 = { x: P0.x + u.x, y: P0.y + u.y }; // (85, 126)
    const P2 = { x: P1.x + v.x, y: P1.y + v.y }; // (255, 212)
    const P3 = { x: P0.x + v.x, y: P0.y + v.y }; // (405, 134)

    // Calculate vertical thickness in pixels for each layer
    const totalPxHeight = 175;
    let nonZeroCm = 0;
    layers.forEach(l => { if (l.espesor_cm > 0) nonZeroCm += l.espesor_cm; });
    if (nonZeroCm === 0) nonZeroCm = totalCm;

    const layerHeights = layers.map((layer, idx) => {
      if (layer.espesor_cm <= 0) {
        return 18; // Sleek visible slab for TSD
      }
      return Math.round(Math.max(26, (layer.espesor_cm / nonZeroCm) * (totalPxHeight - 18)));
    });

    // Calculate cumulative vertical offsets z_i
    const zOffsets = [0];
    for (let i = 0; i < layerHeights.length; i++) {
      zOffsets.push(zOffsets[i] + layerHeights[i]);
    }
    const finalZ = zOffsets[zOffsets.length - 1];

    // Build SVG polygons for each layer
    let layersSvg = '';
    layers.forEach((layer, idx) => {
      const zTop = zOffsets[idx];
      const zBot = zOffsets[idx + 1];
      const isSelected = (idx === selectedLayerIdx);

      // Coordinates for this layer's facets
      const L1_top = `${P1.x},${P1.y + zTop}`;
      const L2_top = `${P2.x},${P2.y + zTop}`;
      const L2_bot = `${P2.x},${P2.y + zBot}`;
      const L1_bot = `${P1.x},${P1.y + zBot}`;

      const R2_top = `${P2.x},${P2.y + zTop}`;
      const R3_top = `${P3.x},${P3.y + zTop}`;
      const R3_bot = `${P3.x},${P3.y + zBot}`;
      const R2_bot = `${P2.x},${P2.y + zBot}`;

      // Gradient IDs based on material
      const mat = (layer.material || '').toLowerCase();
      let leftFill = 'url(#grad-cal-left)';
      let rightFill = 'url(#grad-cal-right)';
      let topFill = 'url(#grad-cal-top)';
      let patternOverlay = '';

      if (mat.includes('tsd') || mat.includes('mdc')) {
        leftFill = 'url(#grad-asphalt-left)';
        rightFill = 'url(#grad-asphalt-right)';
        topFill = 'url(#grad-asphalt-top)';
      } else if (mat.includes('mgtc') || mat.includes('cemento')) {
        leftFill = 'url(#grad-mgtc-left)';
        rightFill = 'url(#grad-mgtc-right)';
        topFill = 'url(#grad-mgtc-top)';
        patternOverlay = 'url(#pat-pebbles)';
      } else if (mat.includes('cal')) {
        leftFill = 'url(#grad-cal-left)';
        rightFill = 'url(#grad-cal-right)';
        topFill = 'url(#grad-cal-top)';
        patternOverlay = 'url(#pat-soil)';
      } else if (mat.includes('afirmado') || mat.includes('granular')) {
        leftFill = 'url(#grad-afirmado-left)';
        rightFill = 'url(#grad-afirmado-right)';
        topFill = 'url(#grad-afirmado-top)';
        patternOverlay = 'url(#pat-gravel)';
      }

      const glowFilter = isSelected ? 'filter="url(#iso-layer-glow)"' : '';
      const outlineStroke = isSelected ? 'stroke="#38bdf8" stroke-width="2.5"' : 'stroke="rgba(255,255,255,0.4)" stroke-width="0.8"';

      layersSvg += `
        <!-- Layer ${idx}: ${layer.nombre} -->
        <g class="iso-layer-group ${isSelected ? 'selected-layer' : ''}" data-layer-idx="${idx}" style="cursor: pointer;">
          
          <!-- Top Surface (Rendered for Layer 0, or illuminated outline if selected) -->
          ${idx === 0 ? `
            <polygon points="${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}" 
                     fill="${topFill}" stroke="#475569" stroke-width="1" />
            <polygon points="${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}" 
                     fill="url(#pat-asphalt-grain)" opacity="0.6" />

            <!-- Asphalt Road Markings: Centerline -->
            <line x1="${(P0.x + P1.x) / 2}" y1="${(P0.y + P1.y) / 2}" 
                  x2="${(P3.x + P2.x) / 2}" y2="${(P3.y + P2.y) / 2}" 
                  stroke="#facc15" stroke-dasharray="10,7" stroke-width="2.2" opacity="0.85" />
            <!-- Asphalt Transverse Joint -->
            <line x1="${(P0.x + P3.x) / 2}" y1="${(P0.y + P3.y) / 2}" 
                  x2="${(P1.x + P2.x) / 2}" y2="${(P1.y + P2.y) / 2}" 
                  stroke="#0f172a" stroke-width="1.2" opacity="0.75" />
          ` : ''}

          <!-- Left Facet (Cross-Section Cut) -->
          <polygon points="${L1_top} ${L2_top} ${L2_bot} ${L1_bot}" 
                   fill="${leftFill}" ${outlineStroke} />
          ${patternOverlay ? `
            <polygon points="${L1_top} ${L2_top} ${L2_bot} ${L1_bot}" 
                     fill="${patternOverlay}" opacity="0.35" />
          ` : ''}

          <!-- Right Facet (Longitudinal Cut) -->
          <polygon points="${R2_top} ${R3_top} ${R3_bot} ${R2_bot}" 
                   fill="${rightFill}" ${outlineStroke} />

          <!-- Selected Layer Cyan Glow Overlay -->
          ${isSelected ? `
            <polygon points="${L1_top} ${L2_top} ${L2_bot} ${L1_bot}" 
                     fill="rgba(56, 189, 248, 0.16)" stroke="#38bdf8" stroke-width="2.5" ${glowFilter} />
            <polygon points="${R2_top} ${R3_top} ${R3_bot} ${R2_bot}" 
                     fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="2.5" ${glowFilter} />
            ${idx === 0 ? `
              <polygon points="${P0.x},${P0.y} ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}" 
                       fill="rgba(56, 189, 248, 0.12)" stroke="#38bdf8" stroke-width="2.5" ${glowFilter} />
            ` : ''}
          ` : ''}

          <!-- Highlight Bevel line at top edge -->
          <line x1="${P1.x}" y1="${P1.y + zTop}" x2="${P2.x}" y2="${P2.y + zTop}" 
                stroke="#ffffff" stroke-width="1" opacity="0.45" />
          <line x1="${P2.x}" y1="${P2.y + zTop}" x2="${P3.x}" y2="${P3.y + zTop}" 
                stroke="#ffffff" stroke-width="1" opacity="0.25" />
        </g>
      `;
    });

    // Dimension Callouts on Right Side (White Badges matching Reference Image)
    let rightDimensionBadgesSvg = '';
    layers.forEach((layer, idx) => {
      const zTop = zOffsets[idx];
      const zBot = zOffsets[idx + 1];
      const yMid = P3.y + (zTop + zBot) / 2;
      const bracketX = 425;
      const badgeX = bracketX + 10;
      const isSelected = (idx === selectedLayerIdx);

      rightDimensionBadgesSvg += `
        <!-- Dimension Bracket for Layer ${idx} -->
        <g class="dim-callout-group" style="cursor: pointer;" onclick="window.app && window.app.pavementVisualizer.selectLayer(${idx})">
          <!-- Bracket ticks -->
          <line x1="${P3.x + 4}" y1="${P3.y + zTop}" x2="${bracketX}" y2="${P3.y + zTop}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>
          <line x1="${P3.x + 4}" y1="${P3.y + zBot}" x2="${bracketX}" y2="${P3.y + zBot}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>
          <line x1="${bracketX}" y1="${P3.y + zTop}" x2="${bracketX}" y2="${P3.y + zBot}" stroke="#64748b" stroke-width="1.5"/>

          <!-- White Pill Dimension Badge -->
          <g transform="translate(${badgeX}, ${yMid})">
            <rect x="0" y="-12" width="58" height="24" rx="4" 
                  fill="#ffffff" stroke="${isSelected ? '#38bdf8' : '#cbd5e1'}" 
                  stroke-width="${isSelected ? '2' : '1.2'}" 
                  filter="url(#badge-shadow)"/>
            <text x="29" y="4" text-anchor="middle" font-family="var(--font-mono)" 
                  font-size="11" font-weight="800" fill="${isSelected ? '#0284c7' : '#0f172a'}">
              ${layer.espesor_display || layer.espesor_cm + ' cm'}
            </text>
          </g>
        </g>
      `;
    });

    // Left Depth Ruler (Superficie to Subrasante)
    const rulerX = 50;
    const rulerTopY = P1.y;
    const rulerBotY = P1.y + finalZ;

    // Zoom Lens Coordinates & Connection Beam
    const lensCenter = { x: 485, y: 92 };
    const lensRadius = 38;
    const targetPoint = { x: 345, y: 148 };

    return `
      <svg class="isometric-pavement-svg" viewBox="0 0 560 425" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Material 3D Gradients -->
          <linearGradient id="grad-asphalt-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="grad-asphalt-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#242e3d"/>
            <stop offset="100%" stop-color="#141a24"/>
          </linearGradient>
          <linearGradient id="grad-asphalt-right" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#18202c"/>
            <stop offset="100%" stop-color="#0a0d13"/>
          </linearGradient>

          <linearGradient id="grad-mgtc-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f1e7da"/>
            <stop offset="100%" stop-color="#dfd2c1"/>
          </linearGradient>
          <linearGradient id="grad-mgtc-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#d6c6b2"/>
            <stop offset="100%" stop-color="#beac96"/>
          </linearGradient>
          <linearGradient id="grad-mgtc-right" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a6947f"/>
            <stop offset="100%" stop-color="#8d7c69"/>
          </linearGradient>

          <linearGradient id="grad-cal-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c67d4f"/>
            <stop offset="100%" stop-color="#b16738"/>
          </linearGradient>
          <linearGradient id="grad-cal-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a6592e"/>
            <stop offset="100%" stop-color="#8c4721"/>
          </linearGradient>
          <linearGradient id="grad-cal-right" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#733716"/>
            <stop offset="100%" stop-color="#58270c"/>
          </linearGradient>

          <linearGradient id="grad-afirmado-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#a27e57"/>
            <stop offset="100%" stop-color="#89643d"/>
          </linearGradient>
          <linearGradient id="grad-afirmado-right" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#6f4e2c"/>
            <stop offset="100%" stop-color="#563b1e"/>
          </linearGradient>

          <!-- Grain & Aggregate Patterns -->
          <pattern id="pat-asphalt-grain" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#ffffff" opacity="0.18"/>
            <circle cx="5" cy="5" r="0.6" fill="#000000" opacity="0.3"/>
          </pattern>
          <pattern id="pat-pebbles" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.5" fill="#78350f" opacity="0.25"/>
            <circle cx="12" cy="8" r="2.2" fill="#573012" opacity="0.3"/>
            <circle cx="7" cy="13" r="1.2" fill="#92400e" opacity="0.2"/>
          </pattern>
          <pattern id="pat-gravel" width="14" height="14" patternUnits="userSpaceOnUse">
            <polygon points="2,2 4,1 5,4 3,5" fill="#451a03" opacity="0.25"/>
            <polygon points="9,9 12,8 13,11 10,12" fill="#78350f" opacity="0.3"/>
          </pattern>
          <pattern id="pat-soil" width="28" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0,3 Q 7,1 14,3 T 28,3 M 0,7 Q 7,9 14,7 T 28,7" stroke="#58270c" stroke-width="0.8" fill="none" opacity="0.35"/>
          </pattern>

          <!-- Filters -->
          <filter id="iso-layer-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8"/>
          </filter>

          <filter id="badge-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.14"/>
          </filter>

          <filter id="lens-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#2563eb" flood-opacity="0.35"/>
          </filter>

          <!-- Lens Clip Circle -->
          <clipPath id="lens-clip-circle">
            <circle cx="${lensCenter.x}" cy="${lensCenter.y}" r="${lensRadius}"/>
          </clipPath>
        </defs>

        <!-- 0. Ground Contact Drop Shadow -->
        <ellipse cx="${P2.x}" cy="${P2.y + finalZ + 12}" rx="185" ry="34" 
                 fill="rgba(15, 23, 42, 0.12)" filter="url(#shadow-blur)"/>

        <!-- 1. Left Vertical Depth Dimension Ruler -->
        <g class="iso-depth-ruler" opacity="0.85">
          <!-- Top Surface Indicator -->
          <text x="${rulerX - 6}" y="${rulerTopY - 10}" font-family="var(--font-mono)" 
                font-size="10" font-weight="700" fill="#64748b" text-anchor="end">
            0 cm (Superficie)
          </text>
          
          <!-- Graduation Axis -->
          <line x1="${rulerX}" y1="${rulerTopY}" x2="${rulerX}" y2="${rulerBotY}" 
                stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3"/>
          <line x1="${rulerX - 5}" y1="${rulerTopY}" x2="${rulerX + 12}" y2="${rulerTopY}" 
                stroke="#64748b" stroke-width="1.5"/>
          <line x1="${rulerX - 5}" y1="${rulerBotY}" x2="${rulerX + 12}" y2="${rulerBotY}" 
                stroke="#64748b" stroke-width="1.5"/>

          <!-- Intermediate Scale Ticks -->
          ${[0.25, 0.5, 0.75].map(ratio => `
            <line x1="${rulerX - 3}" y1="${rulerTopY + finalZ * ratio}" 
                  x2="${rulerX + 4}" y2="${rulerTopY + finalZ * ratio}" 
                  stroke="#94a3b8" stroke-width="1"/>
          `).join('')}

          <!-- Bottom Subgrade Indicator -->
          <text x="${rulerX - 6}" y="${rulerBotY + 16}" font-family="var(--font-mono)" 
                font-size="10" font-weight="700" fill="#64748b" text-anchor="end">
            ${totalCm} cm (Subrasante)
          </text>
        </g>

        <!-- 2. The 3D Isometric Layer Slabs Stack -->
        <g id="isoPavementStack">
          ${layersSvg}
        </g>

        <!-- 3. Dimension Badges on the Right Side -->
        <g id="isoDimensionBadges">
          ${rightDimensionBadgesSvg}
        </g>

        <!-- 4. Magnifying Zoom Callout Lens (Aggregate Texture) -->
        <g class="iso-zoom-callout">
          <!-- Conical Translucent Blue Guide Beam -->
          <polygon points="${targetPoint.x},${targetPoint.y} ${lensCenter.x - 28},${lensCenter.y - 25} ${lensCenter.x - 28},${lensCenter.y + 25}" 
                   fill="rgba(59, 130, 246, 0.14)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="1" stroke-dasharray="3,3"/>
          
          <!-- Target Point on Pavement Surface -->
          <circle cx="${targetPoint.x}" cy="${targetPoint.y}" r="4.5" 
                  fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
          <circle cx="${targetPoint.x}" cy="${targetPoint.y}" r="9" 
                  fill="none" stroke="#60a5fa" stroke-width="1" opacity="0.6"/>

          <!-- Circular Macro Image of Aggregate Gravel & Asphalt -->
          <image href="assets/aggregate_macro.jpg" 
                 x="${lensCenter.x - lensRadius}" y="${lensCenter.y - lensRadius}" 
                 width="${lensRadius * 2}" height="${lensRadius * 2}" 
                 clip-path="url(#lens-clip-circle)" preserveAspectRatio="xMidYMid slice"/>

          <!-- Glowing Blue Lens Rim -->
          <circle cx="${lensCenter.x}" cy="${lensCenter.y}" r="${lensRadius}" 
                  fill="none" stroke="#2563eb" stroke-width="3" filter="url(#lens-glow)"/>
          <circle cx="${lensCenter.x}" cy="${lensCenter.y}" r="${lensRadius - 1.5}" 
                  fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.8"/>

          <!-- Specular Reflection Arc for Glass Realism -->
          <ellipse cx="${lensCenter.x - 12}" cy="${lensCenter.y - 12}" rx="18" ry="9" 
                   fill="rgba(255,255,255,0.3)" transform="rotate(-30 ${lensCenter.x - 12} ${lensCenter.y - 12})"/>
        </g>

      </svg>

      <!-- Floating Mini-Card at Bottom-Left (Layer Legend & Quick Selection) -->
      ${this.generateFloatingMiniCard(structure, selectedLayerIdx)}
    `;
  }

  generateFloatingMiniCard(structure, selectedLayerIdx) {
    const layers = structure.capas || [];
    return `
      <div class="floating-pavement-minicard">
        <div class="minicard-header">
          <span style="display: flex; align-items: center; gap: 4px;">
            <i class="fas fa-bars-staggered"></i> ${layers[0] ? layers[0].material : 'MDC-19'}
          </span>
          <span class="minicard-tag">${layers[0] ? layers[0].tipo.toUpperCase() : 'RODADURA'}</span>
        </div>
        <div class="minicard-body">
          ${layers.map((layer, idx) => `
            <div class="floating-layer-item ${idx === selectedLayerIdx ? 'active' : ''}" data-layer-idx="${idx}">
              <div style="display: flex; align-items: center; gap: 6px; overflow: hidden;">
                <span class="layer-color-dot" style="background: ${layer.color || '#334155'};"></span>
                <span class="layer-name-truncate">${layer.nombre}</span>
              </div>
              <span class="layer-thick-badge">${layer.espesor_display || layer.espesor_cm + ' cm'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderLayerDetails() {
    const structure = this.currentCorridor.estructuras_pavimento[this.selectedStructureIndex];
    if (!structure) return;
    const layer = structure.capas[this.selectedLayerIndex] || structure.capas[0];
    if (!layer) return;

    const panelEl = this.container.querySelector('#isoInspectorContainer');
    if (!panelEl) return;

    const techSpecs = this.getMaterialSpecs(layer.material, layer.espesor_cm);

    panelEl.innerHTML = `
      <div class="iso-detail-card">
        <!-- Top Banner Header -->
        <div class="detail-header-band">
          <i class="fas fa-microscope" style="color: var(--brand-green);"></i>
          <span>Detalle de Capa Seleccionada (${layer.material.toUpperCase()})</span>
        </div>

        <div class="detail-card-inner">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div>
              <span style="font-size: 0.72rem; font-weight: 800; color: var(--brand-green); text-transform: uppercase; letter-spacing: 0.05em;">
                Capa Seleccionada (${layer.tipo.toUpperCase()})
              </span>
              <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-top: 2px; line-height: 1.25;">
                ${layer.nombre}
              </h4>
            </div>
            <span class="layer-pill-code">
              ${layer.material}
            </span>
          </div>

          <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
            ${techSpecs.funcion}
          </p>

          <!-- 2x2 Technical Specifications Grid -->
          <div class="detail-specs-grid">
            <div class="spec-tile">
              <span class="spec-label">Normativa Invías:</span>
              <strong class="spec-value">${techSpecs.norma}</strong>
            </div>
            <div class="spec-tile">
              <span class="spec-label">Dosificación / Tipo:</span>
              <strong class="spec-value">${techSpecs.dosificacion}</strong>
            </div>
            <div class="spec-tile">
              <span class="spec-label">Módulo Resiliente / Resistencia:</span>
              <strong class="spec-value">${techSpecs.resistencia}</strong>
            </div>
            <div class="spec-tile highlight-cbr">
              <span class="spec-label">CBR Esperado:</span>
              <strong class="spec-value">${techSpecs.cbr}</strong>
            </div>
          </div>

          <!-- Bottom Metric: Design Traffic ESALs -->
          <div class="detail-footer-esals">
            <span style="color: var(--text-muted); font-size: 0.8rem; font-weight: 600;">
              Tránsito Proyectado (ESALs):
            </span>
            <strong style="color: var(--text-primary); font-family: var(--font-mono); font-size: 1.05rem;">
              ${this.currentCorridor.transito_diseno || '311.553'}
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
        dosificacion: 'Cemento Asfáltico 60-70 (5.2 - 5.8%)',
        resistencia: 'Estabilidad Marshall > 900 kgf',
        cbr: '> 100% equivalente',
        funcion: 'Capa asfáltica densa en caliente diseñada para sectores de alta pendiente (> 8%) y curvas cerradas, proporcionando máxima adherencia y resistencia al esfuerzo cortante.'
      };
    }
    if (m.includes('tsd')) {
      return {
        norma: 'Artículo 440 (TSD)',
        dosificacion: 'Emulsión catiónica de rotura rápida + gravilla',
        resistencia: 'Impermeabilización y fricción superficial',
        cbr: 'Protección de rodadura',
        funcion: 'Tratamiento superficial doble con dos aplicaciones sucesivas de ligante asfáltico y agregado pétreo seleccionado para sellado e impermeabilización.'
      };
    }
    if (m.includes('mgtc') || m.includes('bgtc') || m.includes('cemento')) {
      return {
        norma: 'Artículo 330 (Suelo-Cemento)',
        dosificacion: 'Cemento Portland (3.0% – 5.5% en peso)',
        resistencia: 'Rc (7 días) ≥ 2.5 – 4.5 MPa',
        cbr: 'CBR > 120% (Base rígida/semirrígida)',
        funcion: 'Material granular homogéneamente mezclado con cemento hidratado y compactado para proveer alta capacidad de soporte y distribución uniforme de cargas axiales pesadas.'
      };
    }
    if (m.includes('cal')) {
      return {
        norma: 'Artículo 320 (Estabilización con Cal)',
        dosificacion: 'Cal viva o hidratada al 3% en peso',
        resistencia: 'Reducción IP < 10, hinchamiento < 1%',
        cbr: 'CBR subrasante mejorado de 1.5% a > 15%',
        funcion: 'Tratamiento químico de arcillas expansivas para neutralizar la plasticidad, incrementar la trabajabilidad e impartir capacidad portante durable a la rasante.'
      };
    }
    return {
      norma: 'Artículo 300 / 310 (Afirmado)',
      dosificacion: 'Agregado pétreo triturado seleccionado',
      resistencia: 'CBR ≥ 40% (Subbase granular)',
      cbr: 'CBR 40% – 80%',
      funcion: 'Capa de soporte granular permeable para drenaje subsuperficial y transición estructural hacia la subrasante natural.'
    };
  }
}

window.PavementVisualizer = PavementVisualizer;
