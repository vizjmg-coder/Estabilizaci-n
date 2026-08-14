/**
 * GOBERNACIÓN DE ANTIOQUIA - CENTRO DE CONTROL TERRITORIAL
 * UI Controller: KPIs, Tables, Drawers, Quick Pills & Toast Notifications
 */

export class UIController {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.currentPage = 1;
    this.pageSize = 10;
    this.sortField = 'km_intervenir';
    this.sortAsc = false;
  }

  renderKPIs(kpis) {
    document.getElementById('kpi-km-value').textContent = Number(kpis.totalKm).toLocaleString('es-CO');
    document.getElementById('kpi-circuitos-value').textContent = kpis.circuitosCount;
    document.getElementById('kpi-subregiones-value').textContent = kpis.subregionesCount;
    document.getElementById('kpi-municipios-value').textContent = kpis.municipiosIntervenidosCount;
    document.getElementById('kpi-cobertura-value').textContent = `${kpis.coveragePercentage}%`;
  }

  renderSubregionPills(subregionsData, activeSubregion = 'ALL') {
    const container = document.getElementById('subregion-pills-container');
    if (!container) return;

    const hasActive = activeSubregion && activeSubregion !== 'ALL';

    let html = `
      <span class="subregion-pill-label">Filtrar:</span>
      <div class="subregion-pill ${activeSubregion === 'ALL' ? 'active' : (hasActive ? 'dimmed' : '')}" data-subregion="ALL">
        <span>Todas</span>
      </div>
    `;

    subregionsData.forEach(s => {
      const isActive = activeSubregion === s.name;
      const isDimmed = hasActive && !isActive;
      html += `
        <div class="subregion-pill ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}" data-subregion="${s.name}">
          <span class="pill-dot" style="background: ${s.color};"></span>
          <span>${s.name}</span>
          <span class="pill-km">${s.km_total} km</span>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.subregion-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const subName = pill.getAttribute('data-subregion');
        if (this.callbacks.onSubregionChange) {
          this.callbacks.onSubregionChange(subName);
        }
      });
    });
  }

  renderSubregionCards(containerId, subregionsData, activeSubregion = 'ALL') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = `
      <div class="subregion-cards-grid">
        ${subregionsData.map(s => {
          const isActive = activeSubregion === s.name;
          return `
            <div class="subreg-card ${isActive ? 'active' : ''}" data-subregion="${s.name}">
              <div class="subreg-card-indicator" style="background: ${s.color};"></div>
              <div class="subreg-card-name">${s.name}</div>
              <div class="subreg-card-km">${s.km_total.toLocaleString('es-CO')} <small>km</small></div>
              <div class="subreg-card-meta">
                <span>${s.circuitos_count} circuitos</span>
                <span>${s.municipios_count} mpios</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.subreg-card').forEach(card => {
      card.addEventListener('click', () => {
        const subName = card.getAttribute('data-subregion');
        if (this.callbacks.onSubregionChange) {
          this.callbacks.onSubregionChange(subName === activeSubregion ? 'ALL' : subName);
        }
      });
    });
  }

  renderCircuitsTable(circuits) {
    const tbody = document.getElementById('circuits-table-body');
    const footer = document.getElementById('table-pagination-footer');
    if (!tbody) return;

    if (!circuits || circuits.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: #64748b;">
            No se encontraron circuitos para los filtros seleccionados.
          </td>
        </tr>
      `;
      if (footer) footer.innerHTML = '';
      return;
    }

    // Sort
    const sorted = [...circuits].sort((a, b) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];
      if (typeof valA === 'string') return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return this.sortAsc ? valA - valB : valB - valA;
    });

    // Pagination
    const totalPages = Math.ceil(sorted.length / this.pageSize);
    if (this.currentPage > totalPages) this.currentPage = 1;

    const start = (this.currentPage - 1) * this.pageSize;
    const paginated = sorted.slice(start, start + this.pageSize);

    tbody.innerHTML = paginated.map(c => `
      <tr data-circuit-id="${c.id}">
        <td><strong>${c.codigo}</strong></td>
        <td>
          <div style="font-weight: 600;">${c.name}</div>
          <div style="font-size: 0.72rem; color: #64748b;">Mpios: ${c.municipios.slice(0, 3).join(', ')}${c.municipios.length > 3 ? '...' : ''}</div>
        </td>
        <td>
          <span class="tag-subregion">${c.subregion}</span>
          ${c.is_multi_subregion ? '<span class="tag-multi">Multi</span>' : ''}
        </td>
        <td><strong style="color: #095642;">${c.km_intervenir.toLocaleString('es-CO')} km</strong></td>
        <td><span style="font-size: 0.75rem; color: #047857; font-weight: 600;">● Priorizado</span></td>
        <td>
          <button class="btn-inspect-circuit" style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;" data-id="${c.id}">
            Ver Detalle →
          </button>
        </td>
      </tr>
    `).join('');

    // Attach row click listeners
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => {
        const cid = row.getAttribute('data-circuit-id');
        if (this.callbacks.onCircuitSelect) {
          this.callbacks.onCircuitSelect(cid);
        }
      });
    });

    // Render footer
    if (footer) {
      footer.innerHTML = `
        <span>Mostrando ${start + 1} - ${Math.min(start + this.pageSize, sorted.length)} de ${sorted.length} circuitos</span>
        <div class="pagination-controls">
          <button class="page-btn" id="btn-prev-page" ${this.currentPage === 1 ? 'disabled' : ''}>← Anterior</button>
          <span style="font-weight: 700; padding: 0 6px;">Pág. ${this.currentPage} de ${totalPages}</span>
          <button class="page-btn" id="btn-next-page" ${this.currentPage === totalPages ? 'disabled' : ''}>Siguiente →</button>
        </div>
      `;

      document.getElementById('btn-prev-page')?.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderCircuitsTable(circuits);
        }
      });

      document.getElementById('btn-next-page')?.addEventListener('click', () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderCircuitsTable(circuits);
        }
      });
    }
  }

  openCircuitDrawer(circuit) {
    if (!circuit) return;

    document.getElementById('drawer-title').textContent = circuit.name;
    document.getElementById('drawer-code-tag').textContent = `${circuit.codigo} • ${circuit.subregion}`;

    let breakdownHtml = '';
    Object.entries(circuit.subregion_breakdown || {}).forEach(([sName, km]) => {
      breakdownHtml += `
        <div class="subreg-breakdown-card">
          <span style="font-weight: 700;">${sName}</span>
          <strong style="color: #095642;">${km} km</strong>
        </div>
      `;
    });

    let mpiosHtml = circuit.municipios.map(m => `
      <span class="m-tag" data-mpio="${m}">${m}</span>
    `).join('');

    const bodyContent = `
      <div class="drawer-section">
        <div class="drawer-section-title">Información del Corredor</div>
        <div class="detail-stat-row">
          <span class="detail-stat-label">Longitud a Intervenir:</span>
          <span class="detail-stat-val" style="color: #095642; font-size: 1rem;">${circuit.km_intervenir} km</span>
        </div>
        <div class="detail-stat-row">
          <span class="detail-stat-label">Total Longitud Corredor:</span>
          <span class="detail-stat-val">${circuit.total_corredor_km} km</span>
        </div>
        <div class="detail-stat-row">
          <span class="detail-stat-label">Cruza Varias Subregiones:</span>
          <span class="detail-stat-val">${circuit.is_multi_subregion ? 'Sí (Inter-subregional)' : 'No'}</span>
        </div>
        <div class="detail-stat-row">
          <span class="detail-stat-label">Estado de Intervención:</span>
          <span class="detail-stat-val" style="color: #059669;">● ${circuit.estado}</span>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Distribución Territorial por Subregión</div>
        ${breakdownHtml}
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Municipios Involucrados (${circuit.municipios.length})</div>
        <div class="municipality-tag-cloud">
          ${mpiosHtml}
        </div>
      </div>

      <button id="btn-focus-map" style="background: #095642; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        📍 Enfocar en el Mapa
      </button>
    `;

    document.getElementById('drawer-body').innerHTML = bodyContent;

    document.getElementById('btn-focus-map')?.addEventListener('click', () => {
      if (this.callbacks.onFocusCircuitOnMap) {
        this.callbacks.onFocusCircuitOnMap(circuit.id);
      }
      this.closeDrawer();
    });

    document.getElementById('drawer-backdrop').classList.add('open');
    document.getElementById('drawer-panel').classList.add('open');
  }

  openMunicipioModal(municipio, circuitsInMpio) {
    const modalBackdrop = document.getElementById('gov-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = `Municipio de ${municipio.name}`;
    
    let circuitsHtml = circuitsInMpio.length > 0
      ? circuitsInMpio.map(c => `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; font-size: 0.82rem;">${c.name}</div>
              <div style="font-size: 0.72rem; color: #64748b;">${c.subregion}</div>
            </div>
            <strong style="color: #095642;">${c.km_intervenir} km</strong>
          </div>
        `).join('')
      : `<div style="color: #64748b; font-size: 0.8rem; padding: 8px 0;">No registra corredores priorizados directamente en este tramo.</div>`;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px;">
        <div style="background: #e8f5f1; padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.7rem; color: #047857; font-weight: 700; text-transform: uppercase;">Subregión</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #095642;">${municipio.subregion}</div>
        </div>
        <div style="background: #f1f5f9; padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.7rem; color: #475569; font-weight: 700; text-transform: uppercase;">Zona / Territorio</div>
          <div style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">${municipio.zona || 'N/D'}</div>
        </div>
      </div>

      <div style="font-size: 0.78rem; font-weight: 700; color: #334155; text-transform: uppercase; margin-bottom: 6px;">
        Corredores de Intervención en el Municipio (${circuitsInMpio.length}):
      </div>
      ${circuitsHtml}
    `;

    modalBackdrop.classList.add('open');
  }

  closeDrawer() {
    document.getElementById('drawer-backdrop').classList.remove('open');
    document.getElementById('drawer-panel').classList.remove('open');
  }

  closeModal() {
    document.getElementById('gov-modal-backdrop').classList.remove('open');
  }

  showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
