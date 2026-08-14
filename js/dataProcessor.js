/**
 * GOBERNACIÓN DE ANTIOQUIA - CENTRO DE CONTROL TERRITORIAL
 * Data Processor: Ingestion, Filtering, Aggregations & Metrics Calculation
 */

import { APP_CONFIG } from './config.js';

export class DataProcessor {
  constructor() {
    this.rawDataset = null;
    this.subregions = [];
    this.circuits = [];
    this.municipalities = [];
    
    // Active filters
    this.filters = {
      subregion: 'ALL',
      municipio: 'ALL',
      circuito: 'ALL',
      searchQuery: ''
    };
  }

  async loadData() {
    try {
      const response = await fetch('Data/data_normalized.json');
      if (!response.ok) {
        throw new Error(`Error loading data: ${response.statusText}`);
      }
      this.rawDataset = await response.json();
      this.subregions = this.rawDataset.subregiones || [];
      this.circuits = this.rawDataset.circuitos || [];
      this.municipalities = this.rawDataset.municipios || [];
      return true;
    } catch (err) {
      console.error('DataProcessor loadData failed:', err);
      throw err;
    }
  }

  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
  }

  resetFilters() {
    this.filters = {
      subregion: 'ALL',
      municipio: 'ALL',
      circuito: 'ALL',
      searchQuery: ''
    };
  }

  getFilteredCircuits() {
    return this.circuits.filter(c => {
      // Subregion filter
      if (this.filters.subregion !== 'ALL') {
        const hasSubregion = Object.keys(c.subregion_breakdown || {}).includes(this.filters.subregion);
        if (!hasSubregion) return false;
      }

      // Municipality filter
      if (this.filters.municipio !== 'ALL') {
        if (!c.municipios.includes(this.filters.municipio)) return false;
      }

      // Circuit ID filter
      if (this.filters.circuito !== 'ALL') {
        if (c.id.toString() !== this.filters.circuito.toString()) return false;
      }

      // Global Search Query
      if (this.filters.searchQuery && this.filters.searchQuery.trim() !== '') {
        const q = this.filters.searchQuery.toLowerCase().trim();
        const inName = c.name.toLowerCase().includes(q);
        const inSubreg = c.subregion.toLowerCase().includes(q);
        const inMpios = c.municipios.some(m => m.toLowerCase().includes(q));
        const inCode = (c.codigo || '').toLowerCase().includes(q);
        if (!inName && !inSubreg && !inMpios && !inCode) return false;
      }

      return true;
    });
  }

  getFilteredMunicipalities() {
    return this.municipalities.filter(m => {
      if (this.filters.subregion !== 'ALL' && m.subregion !== this.filters.subregion) {
        return false;
      }
      if (this.filters.municipio !== 'ALL' && m.name !== this.filters.municipio) {
        return false;
      }
      return true;
    });
  }

  calculateKPIs() {
    const filteredCircuits = this.getFilteredCircuits();
    
    // Total km to intervene for current filter
    let totalKm = 0;
    if (this.filters.subregion === 'ALL') {
      totalKm = filteredCircuits.reduce((sum, c) => sum + (c.km_intervenir || 0), 0);
    } else {
      // If a specific subregion is selected, sum only the km within that subregion
      totalKm = filteredCircuits.reduce((sum, c) => {
        const subKm = c.subregion_breakdown?.[this.filters.subregion] || 0;
        return sum + subKm;
      }, 0);
    }

    // Circuits count
    const totalCircuitos = filteredCircuits.length;

    // Subregions involved
    const subregionsInvolved = new Set();
    filteredCircuits.forEach(c => {
      Object.keys(c.subregion_breakdown || {}).forEach(s => {
        if (this.filters.subregion === 'ALL' || s === this.filters.subregion) {
          subregionsInvolved.add(s);
        }
      });
    });

    // Municipalities involved within current subregion scope
    const mpiosInvolved = new Set();
    filteredCircuits.forEach(c => {
      c.municipios.forEach(m => {
        if (this.filters.subregion === 'ALL') {
          mpiosInvolved.add(m);
        } else {
          const mObj = this.getMunicipalityByName(m);
          if (mObj && mObj.subregion === this.filters.subregion) {
            mpiosInvolved.add(m);
          }
        }
      });
    });

    // Total municipalities in filtered context
    const totalMpiosInScope = this.filters.subregion === 'ALL'
      ? this.municipalities.length
      : this.municipalities.filter(m => m.subregion === this.filters.subregion).length;

    const coveragePct = totalMpiosInScope > 0
      ? ((mpiosInvolved.size / totalMpiosInScope) * 100).toFixed(1)
      : 0;

    return {
      totalKm: totalKm.toFixed(2),
      circuitosCount: totalCircuitos,
      subregionesCount: this.filters.subregion === 'ALL' ? subregionsInvolved.size : (subregionsInvolved.size > 0 ? 1 : 0),
      municipiosIntervenidosCount: mpiosInvolved.size,
      totalMunicipiosInScope: totalMpiosInScope,
      coveragePercentage: coveragePct
    };
  }

  getSubregionsSummary() {
    const filteredCircuits = this.getFilteredCircuits();
    const summaryMap = {};

    // Initialize map
    Object.keys(APP_CONFIG.SUBREGIONS).forEach(sName => {
      summaryMap[sName] = {
        name: sName,
        color: APP_CONFIG.SUBREGIONS[sName].color,
        km_total: 0,
        circuitos_count: 0,
        municipios: new Set()
      };
    });

    // Calculate km from filtered circuits
    filteredCircuits.forEach(c => {
      Object.entries(c.subregion_breakdown || {}).forEach(([sName, km]) => {
        // If a subregion filter is active, only include the selected subregion
        if (this.filters.subregion !== 'ALL' && sName !== this.filters.subregion) return;

        if (summaryMap[sName]) {
          summaryMap[sName].km_total += km;
          summaryMap[sName].circuitos_count += 1;
          c.municipios.forEach(m => {
            const mObj = this.getMunicipalityByName(m);
            if (!mObj || mObj.subregion === sName) {
              summaryMap[sName].municipios.add(m);
            }
          });
        }
      });
    });

    const result = Object.values(summaryMap)
      .filter(item => this.filters.subregion === 'ALL' ? item.km_total > 0 : item.name === this.filters.subregion)
      .map(item => ({
        ...item,
        km_total: Number(item.km_total.toFixed(2)),
        municipios_count: item.municipios.size,
        municipios_list: Array.from(item.municipios)
      }))
      .sort((a, b) => b.km_total - a.km_total);

    const grandTotalKm = result.reduce((sum, item) => sum + item.km_total, 0);

    return result.map(item => ({
      ...item,
      pct_total: grandTotalKm > 0 ? Number(((item.km_total / grandTotalKm) * 100).toFixed(1)) : 100
    }));
  }

  getAllSubregions() {
    const summaryMap = {};
    Object.keys(APP_CONFIG.SUBREGIONS).forEach(sName => {
      summaryMap[sName] = {
        name: sName,
        color: APP_CONFIG.SUBREGIONS[sName].color,
        km_total: 0,
        circuitos_count: 0,
        municipios: new Set()
      };
    });

    this.circuits.forEach(c => {
      Object.entries(c.subregion_breakdown || {}).forEach(([sName, km]) => {
        if (summaryMap[sName]) {
          summaryMap[sName].km_total += km;
          summaryMap[sName].circuitos_count += 1;
          c.municipios.forEach(m => summaryMap[sName].municipios.add(m));
        }
      });
    });

    const result = Object.values(summaryMap)
      .map(item => ({
        ...item,
        km_total: Number(item.km_total.toFixed(2)),
        municipios_count: item.municipios.size,
        municipios_list: Array.from(item.municipios)
      }))
      .sort((a, b) => b.km_total - a.km_total);

    const grandTotalKm = result.reduce((sum, item) => sum + item.km_total, 0);

    return result.map(item => ({
      ...item,
      pct_total: grandTotalKm > 0 ? Number(((item.km_total / grandTotalKm) * 100).toFixed(1)) : 0
    }));
  }

  getTopCircuits(limit = 10) {
    const filteredCircuits = this.getFilteredCircuits();
    return [...filteredCircuits]
      .sort((a, b) => b.km_intervenir - a.km_intervenir)
      .slice(0, limit);
  }

  getCircuitById(id) {
    return this.circuits.find(c => c.id.toString() === id.toString());
  }

  getMunicipalityByName(name) {
    return this.municipalities.find(m => m.name.toLowerCase() === name.toLowerCase());
  }
}
