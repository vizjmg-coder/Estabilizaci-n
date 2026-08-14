/**
 * GOBERNACIÓN DE ANTIOQUIA - CENTRO DE CONTROL TERRITORIAL
 * Export Controller: Ficha Ejecutiva Territorial A4 Horizontal (Landscape)
 * Mapa 100% Vectorial Nativo jsPDF — Proporción Cartográfica 1:1 (0% Deformación / 0% Estiramiento)
 */

import { APP_CONFIG } from './config.js';
import { ESCUDO_BASE64 } from './escudoData.js';

export class ExportController {
  
  static cachedMunPdf = null;
  static cachedSecPdf = null;

  /**
   * Carga los datos vectoriales optimizados para el mapa
   */
  static async loadPdfGeoData() {
    if (!this.cachedMunPdf || !this.cachedSecPdf) {
      try {
        const [munRes, secRes] = await Promise.all([
          fetch('Data/Municipios_pdf.geojson'),
          fetch('Data/Secundaria_pdf.geojson')
        ]);
        this.cachedMunPdf = await munRes.json();
        this.cachedSecPdf = await secRes.json();
      } catch (e) {
        console.warn('Error loading pdf geojson, using fallback:', e);
      }
    }
    return {
      mun: this.cachedMunPdf,
      sec: this.cachedSecPdf
    };
  }

  /**
   * Dibuja el mapa territorial como trazados vectoriales puros nativos en jsPDF.
   * Aplica proyección isométrica 1:1 real con cos(lat) para evitar TODO estiramiento.
   */
  static drawPureVectorMap(doc, municipiosGeo, secundariaGeo, activeSubregion = 'ALL', mapX = 10, mapY = 44, mapW = 146, mapH = 78) {
    if (!municipiosGeo || !municipiosGeo.features) return;

    const normStr = (s) => (s || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const isAll = (activeSubregion === 'ALL' || !activeSubregion);
    const normActive = normStr(activeSubregion);

    // 1. Calculate Geographic Bounding Box
    let minLon = -77.25, maxLon = -73.75, minLat = 5.35, maxLat = 8.95;

    if (!isAll) {
      const subFeatures = municipiosGeo.features.filter(
        f => normStr(f.properties.subregion) === normActive
      );

      if (subFeatures.length > 0) {
        let sMinLon = 180, sMaxLon = -180, sMinLat = 90, sMaxLat = -90;
        const scanCoords = (coords) => {
          if (typeof coords[0] === 'number') {
            sMinLon = Math.min(sMinLon, coords[0]);
            sMaxLon = Math.max(sMaxLon, coords[0]);
            sMinLat = Math.min(sMinLat, coords[1]);
            sMaxLat = Math.max(sMaxLat, coords[1]);
          } else {
            coords.forEach(scanCoords);
          }
        };
        subFeatures.forEach(f => scanCoords(f.geometry.coordinates));

        const lonMargin = (sMaxLon - sMinLon) * 0.08 || 0.08;
        const latMargin = (sMaxLat - sMinLat) * 0.08 || 0.08;
        minLon = sMinLon - lonMargin;
        maxLon = sMaxLon + lonMargin;
        minLat = sMinLat - latMargin;
        maxLat = sMaxLat + latMargin;
      }
    }

    // 2. ISOTROPIC 1:1 PROJECTION (Zero Distortion / True Geographic Proportion)
    const midLat = (minLat + maxLat) / 2;
    const cosLat = Math.cos(midLat * Math.PI / 180);
    const geoW = (maxLon - minLon) * cosLat;
    const geoH = (maxLat - minLat);

    // Available interior space inside the map frame (accounting for 5mm title bar & margins)
    const availW = mapW - 12;
    const availH = mapH - 12;

    // Constrain by the limiting dimension so horizontal scale == vertical scale (1:1 aspect)
    const scale = Math.min(availW / (geoW || 1), availH / (geoH || 1));

    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;
    const boxCenterX = mapX + mapW / 2;
    const boxCenterY = mapY + 4.5 + (mapH - 4.5) / 2;

    const projectPDF = (lon, lat) => {
      const x = boxCenterX + (lon - centerLon) * cosLat * scale;
      const y = boxCenterY - (lat - centerLat) * scale;
      return [x, y];
    };

    // Vector Ring Drawer (jsPDF relative lines)
    const drawVectorRing = (ring, style = 'FD') => {
      if (!ring || ring.length < 3) return;
      const start = projectPDF(ring[0][0], ring[0][1]);
      const lines = [];
      let prevX = start[0];
      let prevY = start[1];

      for (let i = 1; i < ring.length; i++) {
        const pt = projectPDF(ring[i][0], ring[i][1]);
        lines.push([pt[0] - prevX, pt[1] - prevY]);
        prevX = pt[0];
        prevY = pt[1];
      }

      try {
        doc.lines(lines, start[0], start[1], [1, 1], style, true);
      } catch (e) {}
    };

    // Vector Polyline Drawer
    const drawVectorLine = (coords) => {
      if (!coords || coords.length < 2) return;
      const start = projectPDF(coords[0][0], coords[0][1]);
      const lines = [];
      let prevX = start[0];
      let prevY = start[1];

      for (let i = 1; i < coords.length; i++) {
        const pt = projectPDF(coords[i][0], coords[i][1]);
        lines.push([pt[0] - prevX, pt[1] - prevY]);
        prevX = pt[0];
        prevY = pt[1];
      }

      try {
        doc.lines(lines, start[0], start[1], [1, 1], 'S', false);
      } catch (e) {}
    };

    // 3. Draw Background Box with Institutional Header
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(mapX, mapY, mapW, mapH, 1, 1, 'FD');

    // Title Bar
    doc.setFillColor(9, 86, 66);
    doc.rect(mapX, mapY, mapW, 4.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    const subTitleLabel = isAll ? 'TODA ANTIOQUIA' : `SUBREGIÓN ${activeSubregion.toUpperCase()}`;
    doc.text(`GEOVISOR TERRITORIAL VECTORIAL — ${subTitleLabel}`, mapX + 3, mapY + 3.2);

    // 4. Draw Municipalities (Vector Polygons)
    municipiosGeo.features.forEach(f => {
      const p = f.properties;
      const geom = f.geometry;
      const mSubNorm = normStr(p.subregion);
      const isSubActive = isAll || mSubNorm === normActive;
      const hasIntervention = p.circuits_count > 0;

      // When filtered, ONLY render municipalities of the filtered subregion
      if (!isAll && !isSubActive) return;

      if (isSubActive) {
        if (hasIntervention) {
          doc.setFillColor(10, 92, 54); // Verde Pino Sólido (#0A5C36)
          doc.setDrawColor(4, 56, 31);
          doc.setLineWidth(isAll ? 0.2 : 0.3);
        } else {
          doc.setFillColor(209, 213, 219); // Gris Claro (#D1D5DB)
          doc.setDrawColor(156, 163, 175);
          doc.setLineWidth(isAll ? 0.12 : 0.18);
        }
      }

      if (geom.type === 'Polygon') {
        geom.coordinates.forEach(r => drawVectorRing(r, 'FD'));
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach(poly => poly.forEach(r => drawVectorRing(r, 'FD')));
      }
    });

    // 5. Draw Secondary Roads (Vector Polylines)
    if (secundariaGeo && secundariaGeo.features) {
      doc.setDrawColor(148, 163, 184); // Gris sutil (#94A3B8)
      doc.setLineWidth(isAll ? 0.08 : 0.12);

      secundariaGeo.features.forEach(f => {
        if (f.properties.is_prioritized) return;
        const sub = normStr(f.properties.subregion || '');
        if (!isAll && !sub.includes(normActive)) return;

        const geom = f.geometry;
        if (geom.type === 'LineString') {
          drawVectorLine(geom.coordinates);
        } else if (geom.type === 'MultiLineString') {
          geom.coordinates.forEach(drawVectorLine);
        }
      });

      // 6. Draw Prioritized Corridors (Verde Esmeralda Vibrante #00D084) - Refined & Crisp
      doc.setDrawColor(0, 208, 132);
      doc.setLineWidth(isAll ? 0.28 : 0.38);

      secundariaGeo.features.forEach(f => {
        if (!f.properties.is_prioritized) return;
        const sub = normStr(f.properties.subregion || '');
        if (!isAll && !sub.includes(normActive)) return;

        const geom = f.geometry;
        if (geom.type === 'LineString') {
          drawVectorLine(geom.coordinates);
        } else if (geom.type === 'MultiLineString') {
          geom.coordinates.forEach(drawVectorLine);
        }
      });

      // 7. Draw Centered Circuit Badges (Vector Circles & Text)
      const drawnCircuits = new Set();
      secundariaGeo.features.forEach(f => {
        const cid = f.properties.circuit_id;
        if (!f.properties.is_prioritized || !cid || drawnCircuits.has(cid)) return;

        const sub = normStr(f.properties.subregion || '');
        if (!isAll && !sub.includes(normActive)) return;

        const geom = f.geometry;
        let coords = [];
        if (geom.type === 'LineString') {
          coords = geom.coordinates;
        } else if (geom.type === 'MultiLineString' && geom.coordinates.length > 0) {
          coords = geom.coordinates[0];
        }

        if (coords.length > 0) {
          drawnCircuits.add(cid);
          const mid = coords[Math.floor(coords.length / 2)];
          const pt = projectPDF(mid[0], mid[1]);

          // Vector Circle Badge
          doc.setFillColor(10, 92, 54);
          doc.setDrawColor(0, 208, 132);
          doc.setLineWidth(0.25);
          doc.circle(pt[0], pt[1], isAll ? 1.4 : 1.8, 'FD');

          // Number Text
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(isAll ? 3.8 : 4.5);
          doc.text(cid.toString(), pt[0], pt[1] + (isAll ? 0.35 : 0.45), { align: 'center' });
        }
      });
    }

    // 8. Draw Municipality Name Labels ONLY when filtered (subregion/municipio) to keep general map uncluttered
    if (!isAll) {
      const labelFontSize = 4.6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(labelFontSize);

      const haloOffsets = [
        [-0.12, -0.12],
        [0.12, -0.12],
        [-0.12, 0.12],
        [0.12, 0.12],
        [0, -0.15],
        [0, 0.15],
        [-0.15, 0],
        [0.15, 0]
      ];

      municipiosGeo.features.forEach(f => {
        const p = f.properties;
        const geom = f.geometry;
        const hasIntervention = p.circuits_count > 0;
        const mSubNorm = normStr(p.subregion);
        
        if (!hasIntervention) return;
        if (mSubNorm !== normActive) return;

        let centerPt = null;
        try {
          const sampleRing = geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0];
          if (sampleRing && sampleRing.length > 0) {
            let sumX = 0, sumY = 0;
            sampleRing.forEach(pt => { sumX += pt[0]; sumY += pt[1]; });
            centerPt = projectPDF(sumX / sampleRing.length, sumY / sampleRing.length);
          }
        } catch (e) {}

        if (centerPt) {
          // Thin Black Border / Halo around text
          doc.setTextColor(15, 23, 42); // Black #0F172A
          haloOffsets.forEach(([dx, dy]) => {
            doc.text(p.name, centerPt[0] + dx, centerPt[1] + dy, { align: 'center' });
          });

          // Crisp White Foreground Text
          doc.setTextColor(255, 255, 255);
          doc.text(p.name, centerPt[0], centerPt[1], { align: 'center' });
        }
      });
    }

    // 9. Vector North Arrow
    const cx = mapX + mapW - 6, cy = mapY + 10;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.15);
    doc.circle(cx, cy, 2.8, 'FD');

    doc.setFillColor(9, 86, 66);
    doc.triangle(cx, cy - 2.2, cx + 0.8, cy + 0.4, cx - 0.8, cy + 0.4, 'F');
    doc.setFontSize(3.5);
    doc.setTextColor(9, 86, 66);
    doc.text('N', cx, cy - 2.5, { align: 'center' });

    // 10. Vector Legend Box
    const lx = mapX + 2, ly = mapY + mapH - 7, lw = 48, lh = 5.5;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.15);
    doc.roundedRect(lx, ly, lw, lh, 0.5, 0.5, 'FD');

    doc.setDrawColor(0, 208, 132);
    doc.setLineWidth(0.35);
    doc.line(lx + 2, ly + 2, lx + 6, ly + 2);

    doc.setFontSize(3.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Estabilización (634 km)', lx + 7.5, ly + 2.5);

    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.10);
    doc.line(lx + 2, ly + 4, lx + 6, ly + 4);

    doc.setTextColor(100, 116, 139);
    doc.text('Red Secundaria General', lx + 7.5, ly + 4.5);
  }

  /**
   * Generación y Descarga de la Ficha Ejecutiva Territorial en A4 Horizontal (Landscape)
   */
  static async exportFichaPDF(context) {
    const { kpis, subregions, circuits, filters, municipiosGeoJSON, secundariaGeoJSON } = context;
    const activeSubregion = filters.subregion || 'ALL';

    // Show Progress Toast
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.background = '#095642';
    toast.style.borderLeft = '4px solid #d4af37';
    toast.innerHTML = '<span>⚡</span> <span>Generando Ficha Territorial A4 Horizontal (Vectorial)...</span>';
    document.getElementById('toast-container')?.appendChild(toast);

    try {
      // 1. Ensure jsPDF is available
      let jsPDFClass = null;
      if (window.jspdf && window.jspdf.jsPDF) {
        jsPDFClass = window.jspdf.jsPDF;
      } else if (window.jsPDF) {
        jsPDFClass = window.jsPDF;
      }

      if (!jsPDFClass) {
        throw new Error('Librería jsPDF no disponible en window');
      }

      // 2. Load Vector GeoData
      let munData = municipiosGeoJSON;
      let secData = secundariaGeoJSON;
      const pdfGeo = await this.loadPdfGeoData();
      if (pdfGeo.mun) munData = pdfGeo.mun;
      if (pdfGeo.sec) secData = pdfGeo.sec;

      // 3. Instantiate jsPDF (A4 Landscape: 297 x 210 mm)
      const doc = new jsPDFClass({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const runAutoTable = (options) => {
        if (typeof doc.autoTable === 'function') {
          doc.autoTable(options);
        } else if (window.jspdf && typeof window.jspdf.autoTable === 'function') {
          window.jspdf.autoTable(doc, options);
        } else if (typeof window.autoTable === 'function') {
          window.autoTable(doc, options);
        }
      };

      const pageWidth = doc.internal.pageSize.getWidth();   // 297 mm
      const pageHeight = doc.internal.pageSize.getHeight(); // 210 mm
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);        // 277 mm

      let currentY = 8;

      // ----------------------------------------------------
      // A. INSTITUTIONAL HEADER BANNER (A4 Landscape Format)
      // ----------------------------------------------------
      const headerHeight = 17;
      doc.setFillColor(9, 86, 66); // Verde Antioquia (#095642)
      doc.rect(margin, currentY, contentWidth, headerHeight, 'F');

      // Gold Bottom Border
      doc.setFillColor(212, 175, 55); // Dorado (#D4AF37)
      doc.rect(margin, currentY + headerHeight - 1.2, contentWidth, 1.2, 'F');

      // Escudo Image
      try {
        if (ESCUDO_BASE64) {
          doc.addImage(ESCUDO_BASE64, 'JPEG', margin + 3, currentY + 2.2, 24, 12.6);
        }
      } catch (e) {
        console.warn('Escudo image load fallback:', e);
      }

      // Header Titles
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('GOBERNACIÓN DE ANTIOQUIA', margin + 30, currentY + 5.8);

      doc.setTextColor(212, 175, 55); // Gold
      doc.setFontSize(8);
      doc.text('SECRETARÍA DE INFRAESTRUCTURA FÍSICA', margin + 30, currentY + 10.2);

      doc.setTextColor(232, 245, 241);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.text('CENTRO DE CONTROL TERRITORIAL — RED VIAL SECUNDARIA', margin + 30, currentY + 14);

      // Top Right Metric Badge
      let filterText = 'TODA ANTIOQUIA (9 SUBREGIONES)';
      if (activeSubregion !== 'ALL') {
        filterText = `SUBREGIÓN ${activeSubregion.toUpperCase()}`;
      }
      if (filters.municipio && filters.municipio !== 'ALL') {
        filterText += ` • ${filters.municipio.toUpperCase()}`;
      }
      if (filters.searchQuery) {
        filterText += ` • "${filters.searchQuery}"`;
      }

      const currentDate = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(212, 175, 55);
      doc.text('PLAN DE ESTABILIZACIÓN — 634,43 KM', pageWidth - margin - 4, currentY + 5.8, { align: 'right' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.text(`ÁMBITO: ${filterText}`, pageWidth - margin - 4, currentY + 10.5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(232, 245, 241);
      doc.setFontSize(6);
      doc.text(`Emisión: ${currentDate}`, pageWidth - margin - 4, currentY + 14.5, { align: 'right' });

      currentY += headerHeight + 3;

      // ----------------------------------------------------
      // B. 5 COMPACT KPI METRIC CARDS (Full Width 277 mm)
      // ----------------------------------------------------
      const kpiCards = [
        { label: 'LONGITUD PRIORIZADA', val: `${Number(kpis.totalKm).toLocaleString('es-CO')} km`, sub: 'Intervención vial', highlight: true },
        { label: 'CIRCUITOS VIALES', val: `${kpis.circuitosCount}`, sub: 'Corredores activos', highlight: false },
        { label: 'SUBREGIONES', val: `${kpis.subregionesCount}`, sub: 'Territorios', highlight: false },
        { label: 'MUNICIPIOS CONECTADOS', val: `${kpis.municipiosIntervenidosCount}`, sub: 'Municipios', highlight: false },
        { label: 'COBERTURA TERRITORIAL', val: `${kpis.coveragePercentage}%`, sub: 'Alcance municipal', highlight: true }
      ];

      const kpiCardWidth = (contentWidth - (4 * 3)) / 5; // ~53 mm
      const kpiCardHeight = 12.5;

      kpiCards.forEach((kpi, idx) => {
        const kX = margin + (idx * (kpiCardWidth + 3));
        
        // Card Background
        doc.setFillColor(kpi.highlight ? 254 : 248, kpi.highlight ? 253 : 250, kpi.highlight ? 249 : 252);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.2);
        doc.roundedRect(kX, currentY, kpiCardWidth, kpiCardHeight, 1, 1, 'FD');

        // Top Accent Bar
        doc.setFillColor(kpi.highlight ? 212 : 9, kpi.highlight ? 175 : 86, kpi.highlight ? 55 : 66);
        doc.rect(kX, currentY, kpiCardWidth, 1.0, 'F');

        // Label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.label, kX + (kpiCardWidth / 2), currentY + 3.8, { align: 'center' });

        // Value
        doc.setFontSize(8.5);
        doc.setTextColor(9, 86, 66);
        doc.text(kpi.val, kX + (kpiCardWidth / 2), currentY + 8.2, { align: 'center' });

        // Subtext
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(4.8);
        doc.setTextColor(71, 85, 105);
        doc.text(kpi.sub, kX + (kpiCardWidth / 2), currentY + 11.2, { align: 'center' });
      });

      currentY += kpiCardHeight + 3.5;

      // ----------------------------------------------------
      // C. MAP & SUBREGIONS TABLE (SIDE-BY-SIDE IN LANDSCAPE)
      // ----------------------------------------------------
      const mapWidth = 146;
      const mapHeight = 78;

      // Draw Pure Vector Map directly into PDF stream (Isotropic 1:1 Projection)
      this.drawPureVectorMap(doc, munData, secData, activeSubregion, margin, currentY, mapWidth, mapHeight);

      // Subregions Breakdown Table on the Right
      const subTableX = margin + mapWidth + 4;
      const subTableWidth = contentWidth - mapWidth - 4; // ~127 mm

      const subTableBody = (subregions || []).map(s => [
        s.name,
        `${s.km_total} km`,
        `${s.pct_total}%`,
        `${s.circuitos_count}`,
        `${s.municipios_count} mpios`
      ]);

      runAutoTable({
        startY: currentY,
        margin: { left: subTableX, right: margin },
        tableWidth: subTableWidth,
        head: [['Subregión', 'Longitud', '% Part.', 'Circ.', 'Municipios']],
        body: subTableBody,
        theme: 'grid',
        headStyles: {
          fillColor: [9, 86, 66],
          textColor: [255, 255, 255],
          fontSize: 6.5,
          fontStyle: 'bold',
          padding: 1.5,
          halign: 'left'
        },
        styles: {
          fontSize: 6,
          cellPadding: 1.2,
          lineColor: [203, 213, 225],
          lineWidth: 0.15,
          textColor: [15, 23, 42]
        },
        columnStyles: {
          0: { cellWidth: 32, fontStyle: 'bold' },
          1: { cellWidth: 24, halign: 'right', fontStyle: 'bold', textColor: [9, 86, 66] },
          2: { cellWidth: 20, halign: 'right', textColor: [100, 116, 139] },
          3: { cellWidth: 16, halign: 'center' },
          4: { cellWidth: 'auto', halign: 'center' }
        }
      });

      currentY += mapHeight + 5;

      // ----------------------------------------------------
      // D. MASTER CIRCUITS TABLE (AutoTable with Pagination)
      // ----------------------------------------------------
      const circuitsTableHead = [['Cód.', 'Corredor Vial Priorizado', 'Subregión', 'Longitud', 'Municipios Involucrados', 'Estado']];
      
      const circuitsTableBody = (circuits || []).map(c => [
        c.codigo || `CIR-${c.id}`,
        c.name,
        `${c.subregion || ''}${c.is_multi_subregion ? ' (MULTI)' : ''}`,
        `${Number(c.km_intervenir || 0).toLocaleString('es-CO')} km`,
        (c.municipios || []).join(', '),
        'Priorizado'
      ]);

      runAutoTable({
        startY: currentY,
        margin: { left: margin, right: margin, bottom: 12 },
        head: circuitsTableHead,
        body: circuitsTableBody,
        theme: 'striped',
        headStyles: {
          fillColor: [9, 86, 66],
          textColor: [255, 255, 255],
          fontSize: 6.8,
          fontStyle: 'bold',
          cellPadding: 1.8
        },
        styles: {
          fontSize: 6.2,
          cellPadding: 1.4,
          lineColor: [203, 213, 225],
          lineWidth: 0.1,
          textColor: [15, 23, 42]
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 18, fontStyle: 'bold', textColor: [9, 86, 66] },
          1: { cellWidth: 70, fontStyle: 'bold' },
          2: { cellWidth: 38 },
          3: { cellWidth: 26, halign: 'right', fontStyle: 'bold', textColor: [9, 86, 66] },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 22, halign: 'center', textColor: [5, 150, 105], fontStyle: 'bold' }
        },
        didDrawPage: (data) => {
          // Footer on all pages
          const pNum = doc.internal.getNumberOfPages();
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(5.5);
          doc.setTextColor(100, 116, 139);

          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.2);
          doc.line(margin, pageHeight - 7, pageWidth - margin, pageHeight - 7);

          doc.text('Gobernación de Antioquia — Secretaría de Infraestructura Física • República de Colombia', margin, pageHeight - 3.8);
          doc.text(`Página ${data.pageNumber}`, pageWidth - margin, pageHeight - 3.8, { align: 'right' });
        }
      });

      // ----------------------------------------------------
      // E. SAVE / DIRECT DOWNLOAD
      // ----------------------------------------------------
      const filename = `Ficha_Territorial_Antioquia_${activeSubregion.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      try {
        doc.save(filename);
      } catch (saveErr) {
        const blob = doc.output('blob');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.remove();

      // Show Success Toast
      const successToast = document.createElement('div');
      successToast.className = 'toast-message';
      successToast.innerHTML = `<span>✓</span> <span>PDF A4 Horizontal descargado: ${filename}</span>`;
      document.getElementById('toast-container')?.appendChild(successToast);
      setTimeout(() => successToast.remove(), 4000);

    } catch (err) {
      console.error('Error generating vector PDF:', err);
      toast.remove();
      alert('Ocurrió un error al compilar el PDF: ' + err.message);
    }
  }

  static exportToCSV(circuits, filename = 'Intervencion_Red_Vial_Antioquia.csv') {
    if (!circuits || circuits.length === 0) {
      alert('No hay datos filtrados para exportar');
      return;
    }

    const headers = [
      'ID',
      'Codigo',
      'Circuito',
      'Subregion_Principal',
      'Es_Multisubregion',
      'Km_Intervenir',
      'Total_Corredor_Km',
      'Municipios_Involucrados',
      'Desglose_Subregiones'
    ];

    const rows = circuits.map(c => [
      c.id,
      `"${c.codigo}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.subregion}"`,
      c.is_multi_subregion ? 'SI' : 'NO',
      c.km_intervenir,
      c.total_corredor_km,
      `"${c.municipios.join(', ')}"`,
      `"${Object.entries(c.subregion_breakdown || {}).map(([s, km]) => `${s}: ${km}km`).join(' | ')}"`
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
