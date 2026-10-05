/* ==========================================================================
   CHARTS MANAGER: GESTOR DE GRÁFICOS INTERACTIVOS (CHART.JS)
   Comparativas Financieras, Distribución de Actividades y Avance Físico
   ========================================================================== */

class ChartsManager {
  constructor() {
    this.chartInstances = {};
  }

  destroyChart(id) {
    if (this.chartInstances[id]) {
      this.chartInstances[id].destroy();
      delete this.chartInstances[id];
    }
  }

  formatMoney(num) {
    if (num >= 1e9) {
      return `$ ${(num / 1e9).toFixed(1)} mil M`;
    }
    if (num >= 1e6) {
      return `$ ${(num / 1e6).toFixed(0)} M`;
    }
    return `$ ${num.toLocaleString('es-CO')}`;
  }

  // 1. Chart: Variación Presupuestal por Lote (Contractual vs Proyectado vs Adición)
  renderLotesBudgetChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.EST_DATA) return;
    this.destroyChart(canvasId);

    const lotes = window.EST_DATA.lotes || [];
    const labels = lotes.map(l => l.name.replace('Lote ', 'L.').replace(' – Subregión ', ' '));
    const dataContract = lotes.map(l => l.valor_obra / 1e6);
    const dataProjected = lotes.map(l => l.valor_proyectado / 1e6);
    const dataAddition = lotes.map(l => l.valor_requerido / 1e6);

    const ctx = canvas.getContext('2d');
    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Valor Contractual Obra (M)',
            data: dataContract,
            backgroundColor: 'rgba(5, 150, 105, 0.75)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Valor Proyectado Total (M)',
            data: dataProjected,
            backgroundColor: 'rgba(59, 130, 246, 0.75)',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Adición Requerida (M)',
            data: dataAddition,
            backgroundColor: 'rgba(239, 68, 68, 0.75)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: $ ${context.parsed.y.toLocaleString('es-CO')} M`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              callback: (val) => `$ ${val.toLocaleString('es-CO')} M`
            }
          }
        }
      }
    });
  }

  // 2. Chart: Kilómetros Cubiertos vs Pendientes por Lote
  renderLotesKmChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.EST_DATA) return;
    this.destroyChart(canvasId);

    const lotes = window.EST_DATA.lotes || [];
    const labels = lotes.map(l => l.subregion);
    const dataAlcanzan = lotes.map(l => l.km_alcanzan);
    const dataPendientes = lotes.map(l => l.km_pendientes);

    const ctx = canvas.getContext('2d');
    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Km que se alcanzan (64.5%)',
            data: dataAlcanzan,
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: 'Km pendientes (35.5%)',
            data: dataPendientes,
            backgroundColor: '#ef4444',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} km`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              callback: (val) => `${val} km`
            }
          }
        }
      }
    });
  }

  // 3. Chart: Comparación de Actividades de un Corredor (Contractual vs Proyectado)
  renderCorridorActivitiesChart(canvasId, corridor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this.destroyChart(canvasId);

    const acts = corridor.actividades_presupuesto || [];
    if (acts.length === 0) return;

    const labels = acts.map(a => a.actividad.replace('Construcción ', ''));
    const dataContract = acts.map(a => (a.contractual_val || 0) / 1e6);
    const dataProyect = acts.map(a => (a.proyectado_val || 0) / 1e6);

    const ctx = canvas.getContext('2d');
    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Valor Contractual (M)',
            data: dataContract,
            backgroundColor: 'rgba(16, 185, 129, 0.75)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Valor Proyectado Ajustado (M)',
            data: dataProyect,
            backgroundColor: 'rgba(245, 158, 11, 0.75)',
            borderColor: '#f59e0b',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: (c) => `${c.dataset.label}: $ ${c.parsed.y.toLocaleString('es-CO')} M`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94a3b8',
              callback: (v) => `$ ${v} M`
            }
          }
        }
      }
    });
  }
}

window.ChartsManager = ChartsManager;
