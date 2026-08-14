/**
 * GOBERNACIÓN DE ANTIOQUIA - CENTRO DE CONTROL TERRITORIAL
 * Chart Controller: Interactive Bar Charts, Donut Charts & Ranking Lists
 */

import { APP_CONFIG } from './config.js';

export class ChartController {
  constructor(onSubregionSelect, onCircuitSelect) {
    this.onSubregionSelect = onSubregionSelect;
    this.onCircuitSelect = onCircuitSelect;
    this.donutChartInstance = null;
  }

  renderSubregionsBarChart(containerId, subregionsData, activeSubregion = 'ALL') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!subregionsData || subregionsData.length === 0) {
      container.innerHTML = `<div class="empty-state-text" style="color: #64748b; font-size: 0.8rem; text-align: center; padding: 20px;">Sin datos para los filtros activos</div>`;
      return;
    }

    const maxKm = Math.max(...subregionsData.map(s => s.km_total), 1);

    const html = `
      <div class="bar-chart-list">
        ${subregionsData.map(item => {
          const isActive = activeSubregion === item.name;
          const barWidth = ((item.km_total / maxKm) * 100).toFixed(1);
          return `
            <div class="bar-item ${isActive ? 'active' : ''}" data-subregion="${item.name}">
              <div class="bar-meta">
                <span class="bar-name">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: ${item.color || '#095642'}; display: inline-block;"></span>
                  ${item.name}
                </span>
                <span class="bar-values">
                  ${item.km_total.toLocaleString('es-CO')} km
                  <span class="bar-pct">(${item.pct_total}%)</span>
                </span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${barWidth}%; background: ${item.color || '#095642'};"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;

    // Add click event listeners
    container.querySelectorAll('.bar-item').forEach(el => {
      el.addEventListener('click', () => {
        const subName = el.getAttribute('data-subregion');
        if (this.onSubregionSelect) {
          this.onSubregionSelect(subName === activeSubregion ? 'ALL' : subName);
        }
      });
    });
  }

  renderTopCircuitsRanking(containerId, circuitsData, selectedCircuitId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!circuitsData || circuitsData.length === 0) {
      container.innerHTML = `<div style="color: #64748b; font-size: 0.8rem; text-align: center; padding: 20px;">No hay circuitos para mostrar</div>`;
      return;
    }

    const html = `
      <div class="ranking-list">
        ${circuitsData.map((c, idx) => {
          const isSelected = selectedCircuitId && c.id.toString() === selectedCircuitId.toString();
          return `
            <div class="ranking-item ${isSelected ? 'active' : ''}" data-circuit-id="${c.id}">
              <div class="ranking-left">
                <span class="ranking-pos">${String(idx + 1).padStart(2, '0')}</span>
                <div class="ranking-info">
                  <span class="ranking-name" title="${c.name}">${c.name}</span>
                  <span class="ranking-subreg">${c.subregion}</span>
                </div>
              </div>
              <div class="ranking-right">
                <span class="ranking-km">${c.km_intervenir.toLocaleString('es-CO')} <small>km</small></span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;

    // Add click listeners to focus circuit
    container.querySelectorAll('.ranking-item').forEach(el => {
      el.addEventListener('click', () => {
        const cid = el.getAttribute('data-circuit-id');
        if (this.onCircuitSelect) {
          this.onCircuitSelect(cid);
        }
      });
    });
  }

  renderTerritorialDonut(canvasId, subregionsData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.donutChartInstance) {
      this.donutChartInstance.destroy();
    }

    const labels = subregionsData.map(s => s.name);
    const data = subregionsData.map(s => s.km_total);
    const colors = subregionsData.map(s => s.color || '#095642');

    this.donutChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed || 0;
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${val.toLocaleString('es-CO')} km (${pct}%)`;
              }
            }
          }
        },
        onClick: (evt, elements) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const selectedSubregion = labels[index];
            if (this.onSubregionSelect) {
              this.onSubregionSelect(selectedSubregion);
            }
          }
        }
      }
    });
  }

  updateCoverageGauge(containerId, percentage, coveredMpios, totalMpios) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    container.innerHTML = `
      <div class="coverage-box">
        <div class="coverage-text">
          <span class="coverage-title">Alcance Territorial</span>
          <span class="coverage-desc">${coveredMpios} de ${totalMpios} municipios con corredores de estabilización</span>
        </div>
        <div class="coverage-circle-wrapper">
          <svg class="coverage-circle-svg" viewBox="0 0 60 60">
            <circle class="coverage-circle-bg" cx="30" cy="30" r="${radius}" />
            <circle class="coverage-circle-progress" cx="30" cy="30" r="${radius}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}" />
          </svg>
          <span class="coverage-percent-text">${percentage}%</span>
        </div>
      </div>
    `;
  }
}
