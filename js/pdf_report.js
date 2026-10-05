/**
 * PDFReportGenerator - Generador de Informes Ejecutivos en PDF Horizontal
 * Programa Departamental de Estabilización de Vías de Antioquia 2026
 * Gobernación de Antioquia · Secretaría de Infraestructura Física · Rentan
 * 
 * Generación vectorial pura (sin pantallazos rasterizados de baja resolución)
 * Diseñado en orientación apaisada (Landscape A4: 297mm x 210mm)
 */

class PDFReportGenerator {
  constructor() {
    this.jsPDF = null;
  }

  ensureLibrary() {
    if (window.jspdf && window.jspdf.jsPDF) {
      this.jsPDF = window.jspdf.jsPDF;
      return true;
    }
    if (window.jsPDF) {
      this.jsPDF = window.jsPDF;
      return true;
    }
    return false;
  }

  generateExecutiveReport(corridor) {
    if (!this.ensureLibrary()) {
      alert('La librería jsPDF no está disponible en este momento. Por favor verifique su conexión o recargue la página.');
      return;
    }

    const c = corridor || (window.EST_DATA && window.EST_DATA.corredores[0]);
    if (!c) return;

    // Landscape A4: 297mm width x 210mm height
    const doc = new this.jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // -------------------------------------------------------------
    // PÁGINA 1: INFORME EJECUTIVO, PROGRESIÓN DE ABSCISAS Y CURVA S
    // -------------------------------------------------------------
    this.drawPageHeader(doc, c, 1, 2);
    this.drawContractBanner(doc, c);
    this.drawExecutiveKPICards(doc, c);
    this.drawVectorStripChart(doc, c);
    this.drawSplitBottomSection(doc, c);
    this.drawPageFooter(doc, 1, 2);

    // -------------------------------------------------------------
    // PÁGINA 2: AUDITORÍA SEMANAL (1-46) Y REGISTRO FOTOGRÁFICO
    // -------------------------------------------------------------
    doc.addPage('a4', 'landscape');
    this.drawPageHeader(doc, c, 2, 2, 'ANEXO TÉCNICO: AUDITORÍA SEMANAL DE EJECUCIÓN & REGISTRO FOTOGRÁFICO');
    this.drawPage2Content(doc, c);
    this.drawPageFooter(doc, 2, 2);

    // Save PDF
    const filename = `Informe_Ejecutivo_${(c.code || 'Corredor').replace(/[^a-zA-Z0-9_-]/g, '_')}_Estabilizacion_Antioquia.pdf`;
    doc.save(filename);

    this.showSuccessToast(`Informe ejecutivo en PDF generado exitosamente (${filename})`);
  }

  drawPageHeader(doc, c, pageNum, totalPages, subheaderText) {
    // Top Institutional Green Banner (277mm wide x 13mm high)
    doc.setFillColor(4, 120, 87); // #047857 Antioquia Brand Green
    doc.roundedRect(10, 7, 277, 13, 1.5, 1.5, 'F');

    // Left Title Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('GOBERNACIÓN DE ANTIOQUIA', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(220, 252, 231);
    doc.text('Secretaría de Infraestructura Física · Rentan', 14, 16.5);

    // Center Title Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    const centerTitle = subheaderText || 'PROGRAMA DEPARTAMENTAL DE ESTABILIZACIÓN DE VÍAS 2026 — INFORME EJECUTIVO';
    doc.text(centerTitle, 148.5, 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(220, 252, 231);
    doc.text('Reporte Oficial de Variación de Alcances, Progresión por Abscisas y Curva S', 148.5, 16.5, { align: 'center' });

    // Right Metadata
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Fecha de Corte: 24/09/2026', 283, 12, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(220, 252, 231);
    doc.text(`Semana 17 de 46 · Pág. ${pageNum} de ${totalPages}`, 283, 16.5, { align: 'right' });
  }

  drawContractBanner(doc, c) {
    const admin = c.informacion_contractual || {
      numero_contrato: '20260202',
      contratista: 'CONSORCIO ANTIOQUIA ORIENTE',
      numero_interventoria: '20260210',
      interventor: 'CAMILO ANDRÉS ÁNGEL SALDARRIAGA',
      plazo_meses: '13 Meses',
      fecha_acta_inicio: '01/06/2026',
      fecha_inicio_estabilizacion: '26/08/2026',
      fecha_corte: '24/09/2026',
      fecha_vencimiento: '20/04/2027',
      dias_transcurridos: 123,
      plazo_dias: 323,
      plazo_pct: 38.1
    };

    // Container box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, 22, 277, 13, 1, 1, 'FD');

    // Green vertical ribbon on the left
    doc.setFillColor(4, 120, 87);
    doc.rect(10, 22, 2.5, 13, 'F');

    // Line 1: Corridor title and location
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`CORREDOR: [${c.code || 'E-18'}] ${c.name || 'Abejorral – Santa Bárbara – El Cairo – La Elvira'}`, 15, 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Subregión: ${c.subregion || 'Oriente'}  |  Lote: ${c.lote_name || 'Lote 1 – Grupo 2'}  |  Estado: EN EJECUCIÓN`, 15, 29.8);
    doc.text(`Contrato de Obra No.: ${admin.numero_contrato} (${admin.contratista})  |  Interventoría No.: ${admin.numero_interventoria} (${admin.interventor})`, 15, 33.2);

    // Right Column: Timeline milestones
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    doc.text(`Plazo Contractual: ${admin.plazo_meses} (${admin.plazo_dias || 323} días calendario)`, 283, 26, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Acta Inicio: ${admin.fecha_acta_inicio}  ·  Estabilización: ${admin.fecha_inicio_estabilizacion}  ·  Vencimiento: ${admin.fecha_vencimiento}`, 283, 29.8, { align: 'right' });
    doc.text(`Tiempo Transcurrido: ${admin.dias_transcurridos} de ${admin.plazo_dias || 323} días (${admin.plazo_pct || 38.1}%)  ·  Faltante: 200 días (61,9%)`, 283, 33.2, { align: 'right' });
  }

  drawExecutiveKPICards(doc, c) {
    const kmContr = (c.longitud_contractual || 23.77).toFixed(2);
    const kmProb = (c.longitud_probable || 9.72).toFixed(2);
    const vlrContr = '$ 19.969 M';
    const vlrAdic = '$ 28.861 M';
    const adicPct = '+144,5%';
    const avanceReal = '2,58%';
    const avanceProg = '3,85%';

    const kpis = [
      {
        label: 'ALCANCE FÍSICO (KM)',
        val: `${kmProb} km probables`,
        sub: `De ${kmContr} km contratados (40,9%)`,
        accent: [4, 120, 87]
      },
      {
        label: 'ADICIÓN REQUERIDA',
        val: `+ ${vlrAdic}`,
        sub: `${adicPct} sobre vlr. contractual`,
        accent: [220, 38, 38]
      },
      {
        label: 'AVANCE FÍSICO ACTUAL',
        val: `${avanceReal} (Sem 17)`,
        sub: `Prog: ${avanceProg} · Brecha: -1,27%`,
        accent: [4, 120, 87]
      },
      {
        label: 'DRENAJE Y FILTROS',
        val: '1.164 ml Filtros MI',
        sub: '11 de 22 Alcantarillas (48,9%)',
        accent: [2, 132, 199]
      },
      {
        label: 'RITMO REQUERIDO',
        val: '3,36% / semana',
        sub: '29 sem restantes · Fin: 20/04/2027',
        accent: [99, 102, 241]
      }
    ];

    const cardW = 53;
    const cardH = 13.5;
    const startY = 37;

    kpis.forEach((kpi, idx) => {
      const x = 10 + idx * (cardW + 3);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.25);
      doc.roundedRect(x, startY, cardW, cardH, 1, 1, 'FD');

      // Top color strip
      doc.setFillColor(...kpi.accent);
      doc.rect(x, startY, cardW, 1.2, 'F');

      // Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.8);
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.label, x + 3, startY + 4.2);

      // Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...kpi.accent);
      doc.text(kpi.val, x + 3, startY + 8.5);

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.8);
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.sub, x + 3, startY + 11.8);
    });
  }

  drawVectorStripChart(doc, c) {
    const totalKm = c.longitud_contractual || 23.77;
    const startY = 52.5;
    const containerH = 48.5;

    // Main background container
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, startY, 277, containerH, 1.5, 1.5, 'FD');

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    doc.text('DIAGRAMA VECTORIAL DE PROGRESIÓN POR ABSCISAS Y DISCIPLINAS DE OBRA', 14, startY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(`Sector evaluado: K 0+000 a K ${totalKm.toFixed(3)}  |  Inspección activa: K 1+150  |  Georreferenciación 100% Vectorial`, 140, startY + 4);

    // Track Geometry
    const legendX = 13;
    const legendW = 42;
    const trackX = 58;
    const trackW = 194;
    const badgeX = 255;
    const badgeW = 29;

    const kmToX = (km) => trackX + (Math.max(0, Math.min(totalKm, km)) / totalKm) * trackW;

    // ---------------------------------------------------------
    // BANDA 0: CALZADA PRINCIPAL Y FRENTE ACTIVO
    // ---------------------------------------------------------
    const r0Y = startY + 6.5;
    this.drawRowBracket(doc, legendX, r0Y, legendW, 'CALZADA PRINCIPAL', 'Eje vial y tráfico', [4, 120, 87]);

    // Asphalt track
    doc.setFillColor(30, 41, 59); // Dark slate
    doc.roundedRect(trackX, r0Y, trackW, 5.2, 0.8, 0.8, 'F');

    // Yellow dashed centerline
    doc.setDrawColor(250, 204, 21);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(trackX, r0Y + 2.6, trackX + trackW, r0Y + 2.6);
    doc.setLineDashPattern([], 0); // Reset dash

    // Active front zone (K 0+086 a K 1+250)
    const fStartX = kmToX(0.086);
    const fEndX = kmToX(1.250);
    doc.setFillColor(245, 158, 11);
    doc.rect(fStartX, r0Y, fEndX - fStartX, 5.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.setTextColor(255, 255, 255);
    doc.text('Frente Activo K0+086 a K1+250', fStartX + 1, r0Y + 3.5);

    this.drawRowBadge(doc, badgeX, r0Y, badgeW, `0 – ${totalKm.toFixed(1)} km`, [100, 116, 139]);

    // ---------------------------------------------------------
    // BANDA 1: ESCALA MÉTRICA Y CONTROL DE ABSCISAS
    // ---------------------------------------------------------
    const r1Y = startY + 13;
    this.drawRowBracket(doc, legendX, r1Y, legendW, 'CONTROL DE ABSCISA', 'Kilometraje continuo', [220, 38, 38]);

    // Baseline
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.35);
    doc.line(trackX, r1Y + 3.2, trackX + trackW, r1Y + 3.2);

    // Major kilometer ticks
    const ticks = [0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23.77];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(100, 116, 139);

    ticks.forEach(tKm => {
      const tX = kmToX(tKm);
      doc.setDrawColor(148, 163, 184);
      doc.line(tX, r1Y + 1.5, tX, r1Y + 4.5);
      const label = tKm === 23.77 ? 'K23.8' : `K${tKm}`;
      doc.text(label, tX, r1Y + 6.2, { align: tKm === 0 ? 'left' : (tKm >= 23 ? 'right' : 'center') });
    });

    this.drawRowBadge(doc, badgeX, r1Y, badgeW, 'K 1 + 150', [220, 38, 38]);

    // ---------------------------------------------------------
    // BANDA 2: OBRAS PUNTUALES DE DRENAJE (ALCANTARILLAS)
    // ---------------------------------------------------------
    const r2Y = startY + 20.5;
    this.drawRowBracket(doc, legendX, r2Y, legendW, 'OBRAS PUNTUALES', '22 Alcantarillas', [2, 132, 199]);

    // Track baseline
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(trackX, r2Y, trackW, 4.8, 0.6, 0.6, 'FD');

    doc.setDrawColor(203, 213, 225);
    doc.line(trackX, r2Y + 2.4, trackX + trackW, r2Y + 2.4);

    // Draw culvert points
    const puntos = c.obras_puntuales || [];
    puntos.forEach(p => {
      const dotX = kmToX(p.km);
      let col = [5, 150, 105]; // Completed green
      if (p.categoria === 'alcantarilla_nueva') col = [37, 99, 235]; // Blue
      else if (p.categoria === 'anulada') col = [239, 68, 68]; // Red
      else if (p.km > 1.25 && p.km < 3.5) col = [245, 158, 11]; // Progress orange
      else if (p.km >= 3.5) col = [148, 163, 184]; // Pending slate

      doc.setFillColor(...col);
      doc.circle(dotX, r2Y + 2.4, 0.9, 'F');
    });

    this.drawRowBadge(doc, badgeX, r2Y, badgeW, '48,9% (11/22)', [5, 150, 105]);

    // ---------------------------------------------------------
    // BANDA 3: DRENAJE LONGITUDINAL (CUNETAS & FILTROS)
    // ---------------------------------------------------------
    const r3Y = startY + 26.5;
    this.drawRowBracket(doc, legendX, r3Y, legendW, 'DRENAJE LINEAL', 'Cunetas y Filtros (MI/MD)', [37, 99, 235]);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(trackX, r3Y, trackW, 5.2, 0.6, 0.6, 'FD');

    // Margen Izquierda (MI): Filtro Granular 1.164 ml
    const fX = kmToX(0.086);
    const fW = kmToX(1.250) - fX;
    doc.setFillColor(37, 99, 235);
    doc.rect(fX, r3Y + 0.6, fW, 1.8, 'F');

    // Cunetas MI
    const cMIX = kmToX(1.250);
    const cMIW = kmToX(3.750) - cMIX;
    doc.setFillColor(2, 132, 199);
    doc.rect(cMIX, r3Y + 0.6, cMIW, 1.8, 'F');

    // Margen Derecha (MD): Cunetas MD
    const cMDW = kmToX(1.250) - trackX;
    doc.setFillColor(2, 132, 199);
    doc.rect(trackX, r3Y + 2.8, cMDW, 1.8, 'F');

    this.drawRowBadge(doc, badgeX, r3Y, badgeW, '1.164 ml (4,1%)', [37, 99, 235]);

    // ---------------------------------------------------------
    // BANDA 4: PAQUETE ESTRUCTURAL (PAVIMENTO ESTRATIGRÁFICO)
    // ---------------------------------------------------------
    const r4Y = startY + 33;
    this.drawRowBracket(doc, legendX, r4Y, legendW, 'ESTRUCTURA', 'TSD / MGTC / Cal', [217, 119, 6]);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(trackX, r4Y, trackW, 6.5, 0.6, 0.6, 'FD');

    // Rodadura TSD 1.2 km y MDC 2.6 km
    doc.setFillColor(30, 41, 59);
    doc.rect(trackX, r4Y + 0.5, kmToX(1.2) - trackX, 1.6, 'F');
    doc.setFillColor(249, 115, 22);
    doc.rect(kmToX(1.2), r4Y + 0.5, kmToX(3.8) - kmToX(1.2), 1.6, 'F');

    // Base Cemento MGTC 20-28 cm (0 a 3.5 km)
    doc.setFillColor(217, 119, 6);
    doc.rect(trackX, r4Y + 2.5, kmToX(3.5) - trackX, 1.6, 'F');

    // Subrasante con Cal al 3% (0 a 1.8 km y K15 a K23.7)
    doc.setFillColor(146, 64, 14);
    doc.rect(trackX, r4Y + 4.5, kmToX(1.8) - trackX, 1.6, 'F');
    doc.rect(kmToX(15.0), r4Y + 4.5, kmToX(23.77) - kmToX(15.0), 1.6, 'F');

    this.drawRowBadge(doc, badgeX, r4Y, badgeW, '2,58% Físico', [217, 119, 6]);

    // ---------------------------------------------------------
    // BANDA 5: CAMPO (TOPOGRAFÍA & GEOTECNIA CBR)
    // ---------------------------------------------------------
    const r5Y = startY + 40.5;
    this.drawRowBracket(doc, legendX, r5Y, legendW, 'CAMPO & CONTROL', 'Topografía & Apiques', [5, 150, 105]);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(trackX, r5Y, trackW, 5.2, 0.6, 0.6, 'FD');

    // Topografía K0 a K16 (67.3%)
    doc.setFillColor(4, 120, 87);
    doc.rect(trackX, r5Y + 0.6, kmToX(16.0) - trackX, 1.8, 'F');

    // Apiques CBR K0 a K21 (88.4%)
    doc.setFillColor(2, 132, 199);
    doc.rect(trackX, r5Y + 2.8, kmToX(21.0) - trackX, 1.8, 'F');

    this.drawRowBadge(doc, badgeX, r5Y, badgeW, '88,4% Apiques', [5, 150, 105]);

    // ---------------------------------------------------------
    // RED CROSSHAIR NEEDLE AT STATION K 1+150
    // ---------------------------------------------------------
    const needleX = kmToX(1.150);
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.4);
    doc.line(needleX, startY + 6.5, needleX, startY + 45.7);

    // Top pointer head
    doc.setFillColor(220, 38, 38);
    doc.circle(needleX, startY + 6.5, 0.8, 'F');

    // Bottom badge
    doc.roundedRect(needleX - 4.5, startY + 45.7, 9, 2.5, 0.4, 0.4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.6);
    doc.setTextColor(255, 255, 255);
    doc.text('K 1+150', needleX, startY + 47.4, { align: 'center' });
  }

  drawRowBracket(doc, x, y, w, title, sub, color) {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(x, y, 1.2, 5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(15, 23, 42);
    doc.text(title, x + 2.5, y + 2.3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    doc.setTextColor(100, 116, 139);
    doc.text(sub, x + 2.5, y + 4.3);
  }

  drawRowBadge(doc, x, y, w, text, color) {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y + 0.5, w, 4.2, 0.6, 0.6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x + w / 2, y + 3.4, { align: 'center' });
  }

  drawSplitBottomSection(doc, c) {
    const startY = 103;
    const h = 91;

    // LEFT COLUMN: CURVA S DE AVANCE FÍSICO (W: 130mm)
    this.drawVectorSCurve(doc, 10, startY, 130, h, c);

    // RIGHT COLUMN: TABLA SINTÉTICA DE BALANCE PRESUPUESTAL (W: 144mm)
    this.drawActivityBudgetTable(doc, 143, startY, 144, h, c);
  }

  drawVectorSCurve(doc, x, y, w, h, c) {
    // Card container
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, 1.5, 1.5, 'FD');

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('CURVA S CONTRACTUAL & CONTROL SEMANAL (SEM 1 A 46)', x + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(100, 116, 139);
    doc.text('Corte Actual: Sem 17 (24/09/2026) · Prog: 3,85% vs Real: 2,58% · Meta: Sem 46 (20/04/2027)', x + 4, y + 8.5);

    // Chart bounding box
    const chartX = x + 12;
    const chartY = y + 13;
    const chartW = w - 18;
    const chartH = h - 26;

    // Y Axis Grid (0% to 100%)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(148, 163, 184);

    const yLevels = [0, 20, 40, 60, 80, 100];
    yLevels.forEach(lvl => {
      const ly = chartY + chartH - (lvl / 100) * chartH;
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(chartX, ly, chartX + chartW, ly);
      doc.text(`${lvl}%`, chartX - 2, ly + 1, { align: 'right' });
    });

    // X Axis Ticks (Weeks 1 to 46)
    const xWeeks = [1, 6, 12, 17, 24, 30, 36, 42, 46];
    xWeeks.forEach(wk => {
      const wx = chartX + ((wk - 1) / 45) * chartW;
      doc.setDrawColor(226, 232, 240);
      doc.line(wx, chartY + chartH, wx, chartY + chartH + 1.5);
      doc.text(`Sem ${wk}`, wx, chartY + chartH + 3.8, { align: 'center' });
    });

    // 1. Programmed Curve Line (Gold) - S-shape mathematical curve reaching 100%
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.setLineDashPattern([1.5, 1], 0);

    for (let w = 1; w < 46; w++) {
      const p1 = this.getProgValue(w);
      const p2 = this.getProgValue(w + 1);
      const x1 = chartX + ((w - 1) / 45) * chartW;
      const y1 = chartY + chartH - (p1 / 100) * chartH;
      const x2 = chartX + (w / 45) * chartW;
      const y2 = chartY + chartH - (p2 / 100) * chartH;
      doc.line(x1, y1, x2, y2);
    }
    doc.setLineDashPattern([], 0);

    // 2. Real Executed Line (Emerald Green) - Weeks 1 to 17
    doc.setDrawColor(4, 120, 87);
    doc.setLineWidth(0.7);

    const realValues = [
      0.03, 0.07, 0.14, 0.22, 0.31, 0.42, 0.54, 0.68, 0.81, 0.98,
      1.16, 1.34, 1.58, 1.83, 2.08, 2.33, 2.58
    ];

    for (let w = 1; w < 17; w++) {
      const r1 = realValues[w - 1];
      const r2 = realValues[w];
      const x1 = chartX + ((w - 1) / 45) * chartW;
      const y1 = chartY + chartH - (r1 / 100) * chartH;
      const x2 = chartX + (w / 45) * chartW;
      const y2 = chartY + chartH - (r2 / 100) * chartH;
      doc.line(x1, y1, x2, y2);
    }

    // 3. Projected Line (Cyan Dashed) - Weeks 17 to 46
    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 1.5], 0);

    for (let w = 17; w < 46; w++) {
      const pr1 = 2.58 + (w - 17) * ((100 - 2.58) / 29);
      const pr2 = 2.58 + (w - 16) * ((100 - 2.58) / 29);
      const x1 = chartX + ((w - 1) / 45) * chartW;
      const y1 = chartY + chartH - (pr1 / 100) * chartH;
      const x2 = chartX + (w / 45) * chartW;
      const y2 = chartY + chartH - (pr2 / 100) * chartH;
      doc.line(x1, y1, x2, y2);
    }
    doc.setLineDashPattern([], 0);

    // Highlight dot on Week 17 (Cut-off point)
    const cutX = chartX + ((17 - 1) / 45) * chartW;
    const cutY = chartY + chartH - (2.58 / 100) * chartH;
    doc.setFillColor(4, 120, 87);
    doc.circle(cutX, cutY, 1.3, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(cutX, cutY, 0.6, 'F');

    // Callout badge for Week 17
    doc.setFillColor(4, 120, 87);
    doc.roundedRect(cutX + 3, cutY - 7, 34, 6.5, 0.8, 0.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.8);
    doc.setTextColor(255, 255, 255);
    doc.text('Corte Sem 17: 2,58% Real', cutX + 4.5, cutY - 4.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Programado: 3,85% · Brecha: -1,27%', cutX + 4.5, cutY - 2);

    // Legend at bottom
    const legY = y + h - 6;
    doc.setDrawColor(217, 119, 6);
    doc.setLineDashPattern([1.5, 1], 0);
    doc.line(x + 10, legY, x + 16, legY);
    doc.setLineDashPattern([], 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.setTextColor(71, 85, 105);
    doc.text('Prog. Contractual (%)', x + 17.5, legY + 0.8);

    doc.setDrawColor(4, 120, 87);
    doc.setLineWidth(0.7);
    doc.line(x + 50, legY, x + 56, legY);
    doc.text('Real Acumulado (2,58%)', x + 57.5, legY + 0.8);

    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 1.5], 0);
    doc.line(x + 90, legY, x + 96, legY);
    doc.setLineDashPattern([], 0);
    doc.text('Proyección Requerida (3,36%/sem)', x + 97.5, legY + 0.8);
  }

  getProgValue(w) {
    if (w <= 17) {
      return (w / 17) * 3.85;
    }
    const ratio = (w - 17) / 29;
    return 3.85 + (100 - 3.85) * (1 / (1 + Math.exp(-6 * (ratio - 0.5))));
  }

  drawActivityBudgetTable(doc, x, y, w, h, c) {
    // Card container
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, 1.5, 1.5, 'FD');

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('BALANCE CONTRACTUAL VS PROYECTADO POR ACTIVIDAD', x + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(100, 116, 139);
    doc.text('Cifras oficiales en Millones de Pesos (M) y Variación Presupuestal', x + 4, y + 8.5);

    const acts = c.actividades || [
      { actividad: 'Construcción alcantarilla', contractual_val: 349118827, proyectado_val: 4569689585, variacion_val: 4220570758, variacion_pct: 1208.9 },
      { actividad: 'Construcción cuneta', contractual_val: 3962861757, proyectado_val: 5209150329, variacion_val: 1246288572, variacion_pct: 31.4 },
      { actividad: 'Construcción filtro', contractual_val: 4154277100, proyectado_val: 4853456980, variacion_val: 699179880, variacion_pct: 16.8 },
      { actividad: 'Construcción bordillos', contractual_val: 587858975, proyectado_val: 31606724, variacion_val: -556252251, variacion_pct: -94.6 },
      { actividad: 'Construcción disipadores', contractual_val: 24152373, proyectado_val: 423717387, variacion_val: 399565014, variacion_pct: 1654.4 },
      { actividad: 'Estabilización (Cal / Cemento)', contractual_val: 10535064588, proyectado_val: 32124443827, variacion_val: 21589379239, variacion_pct: 204.9 },
      { actividad: 'Señalización vial', contractual_val: 355851420, proyectado_val: 417158664, variacion_val: 61307244, variacion_pct: 17.2 },
      { actividad: 'MDC-19 (Mezcla en caliente)', contractual_val: 0, proyectado_val: 1200562468, variacion_val: 1200562468, variacion_pct: 100.0 }
    ];

    const tableRows = acts.map(a => [
      a.actividad,
      `$ ${(a.contractual_val / 1e6).toFixed(1)} M`,
      `$ ${(a.proyectado_val / 1e6).toFixed(1)} M`,
      `${a.variacion_val >= 0 ? '+' : ''}$ ${(a.variacion_val / 1e6).toFixed(1)} M`,
      `${a.variacion_pct >= 0 ? '+' : ''}${a.variacion_pct.toFixed(1)}%`
    ]);

    // Total row
    const totContr = acts.reduce((acc, a) => acc + (a.contractual_val || 0), 0);
    const totProy = acts.reduce((acc, a) => acc + (a.proyectado_val || 0), 0);
    const totVar = totProy - totContr;
    const totPct = ((totVar / totContr) * 100).toFixed(1);

    tableRows.push([
      'TOTAL GENERAL',
      `$ ${(totContr / 1e6).toFixed(1)} M`,
      `$ ${(totProy / 1e6).toFixed(1)} M`,
      `+$ ${(totVar / 1e6).toFixed(1)} M`,
      `+${totPct}%`
    ]);

    doc.autoTable({
      startY: y + 11,
      margin: { left: x + 4, right: 10 },
      tableWidth: w - 8,
      head: [['Actividad Técnica', 'Contractual', 'Proyectado', 'Variación ($)', 'Var (%)']],
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 5.6,
        cellPadding: 1.3,
        font: 'helvetica',
        textColor: [51, 65, 85]
      },
      headStyles: {
        fillColor: [4, 120, 87],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 5.8
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right', fontStyle: 'bold' },
        4: { halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: function(data) {
        if (data.row.index === tableRows.length - 1) {
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [15, 23, 42];
        }
      }
    });
  }

  drawPage2Content(doc, c) {
    // Left Box: Weekly Audit Table (17 executed weeks + projection milestones)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('AUDITORÍA CRONOLÓGICA DE EJECUCIÓN SEMANAL (SEMANAS 1 A 46)', 14, 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Control periódico de cumplimiento de metas físicas por semana calendario', 14, 28.5);

    const weeklyData = [
      ['Sem 01', '01/06 - 07/06', 'Cerrada', '0.09%', '0.03%', '-0.06%', '0.03%', 'Acta de inicio y comisiones topográficas K0 a K2.'],
      ['Sem 02', '08/06 - 14/06', 'Cerrada', '0.10%', '0.07%', '-0.03%', '0.10%', 'Topografía de precisión y nivelación geométrica K2 a K4.'],
      ['Sem 03', '15/06 - 21/06', 'Cerrada', '0.12%', '0.10%', '-0.02%', '0.20%', 'Inicio de apiques geomecánicos CBR K0 a K3.'],
      ['Sem 04', '22/06 - 28/06', 'Cerrada', '0.14%', '0.13%', '-0.01%', '0.33%', 'Ensayos de laboratorio (Límites, Proctor) K3 a K7.'],
      ['Sem 05', '29/06 - 05/07', 'Cerrada', '0.16%', '0.13%', '-0.03%', '0.46%', 'Topografía de detalle en curvas críticas K7 a K10.'],
      ['Sem 06', '06/07 - 12/07', 'Cerrada', '0.17%', '0.14%', '-0.03%', '0.60%', 'Diseño de mezcla de estabilización con cal y cemento.'],
      ['Sem 07', '13/07 - 19/07', 'Cerrada', '0.19%', '0.14%', '-0.05%', '0.74%', 'Inventario de 22 alcantarillas y localización de fuentes.'],
      ['Sem 08', '20/07 - 26/07', 'Cerrada', '0.21%', '0.15%', '-0.06%', '0.89%', 'Topografía sector K10 a K13 y coordinación predial.'],
      ['Sem 09', '27/07 - 02/08', 'Cerrada', '0.23%', '0.13%', '-0.10%', '1.02%', 'Demolición controlada y limpieza cabezotes K 0+150.'],
      ['Sem 10', '03/08 - 09/08', 'Cerrada', '0.25%', '0.15%', '-0.10%', '1.17%', 'Instalación de tubería de concreto 36 pulg. K 0+150.'],
      ['Sem 11', '10/08 - 16/08', 'Cerrada', '0.26%', '0.14%', '-0.12%', '1.31%', 'Excavación mecánica de zanja para filtro en K 0+086 MI.'],
      ['Sem 12', '17/08 - 23/08', 'Cerrada', '0.28%', '0.10%', '-0.18%', '1.41%', 'Movilización de tren de estabilización y fresadora.'],
      ['Sem 13', '24/08 - 30/08', 'Cerrada', '0.30%', '0.17%', '-0.13%', '1.58%', 'INICIO ESTABILIZACIÓN: Tramo prueba cal K 0 a K 0+400.'],
      ['Sem 14', '31/08 - 06/09', 'Cerrada', '0.32%', '0.19%', '-0.13%', '1.77%', 'Subrasante con cal K 0+400 a K 1+200 y filtro MI.'],
      ['Sem 15', '07/09 - 13/09', 'Cerrada', '0.34%', '0.22%', '-0.12%', '1.99%', 'Geotextil y tubería perforada filtro K 0+600 a K 0+950.'],
      ['Sem 16', '14/09 - 20/09', 'Cerrada', '0.35%', '0.26%', '-0.09%', '2.25%', 'Base MGTC 20-28 cm K 0+000 a K 0+800 y densidad.'],
      ['Sem 17', '21/09 - 27/09', 'CORTE OFICIAL', '0.37%', '0.33%', '-0.04%', '2.58%', 'CORTE OFICIAL: Filtro MI 1.164 ml y TSD 1.2 km concluidos.'],
      ['Sem 18', '28/09 - 04/10', 'Proy.', '1.85%', '—', '—', '4.43%', 'Proyectada: Apertura 2º frente K 1+200 a K 3+500.'],
      ['Sem 25', '16/11 - 22/11', 'Proy.', '3.50%', '—', '—', '28.9%', 'Proyectada: Ritmo intensivo de estabilización cal/cemento.'],
      ['Sem 35', '25/01 - 31/01', 'Proy.', '4.20%', '—', '—', '68.5%', 'Proyectada: Pavimentación TSD y MDC-19 en sectores críticos.'],
      ['Sem 46', '14/04 - 20/04', 'Proy.', '2.10%', '—', '—', '100.0%', 'META CONTRACTUAL: Entrega final de 23,77 km estabilizados.']
    ];

    doc.autoTable({
      startY: 31,
      margin: { left: 10, right: 152 },
      tableWidth: 135,
      head: [['Sem', 'Periodo', 'Estado', 'Prog.', 'Real', 'Delta', 'Acum.', 'Hito Técnico Principal']],
      body: weeklyData,
      theme: 'grid',
      styles: { fontSize: 4.8, cellPadding: 1.1, font: 'helvetica' },
      headStyles: { fillColor: [4, 120, 87], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 10, fontStyle: 'bold' },
        1: { cellWidth: 16 },
        2: { cellWidth: 13, fontStyle: 'bold' },
        3: { halign: 'right', cellWidth: 10 },
        4: { halign: 'right', cellWidth: 10, fontStyle: 'bold' },
        5: { halign: 'right', cellWidth: 10 },
        6: { halign: 'right', cellWidth: 10, fontStyle: 'bold' },
        7: { cellWidth: 56 }
      },
      didParseCell: function(data) {
        if (data.row.raw && data.row.raw[0] === 'Sem 17') {
          data.cell.styles.fillColor = [220, 252, 231];
          data.cell.styles.textColor = [4, 120, 87];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // Right Box: Photographic Evidence Cards
    const photoX = 150;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('REGISTRO FOTOGRÁFICO OFICIAL GEORREFERENCIADO', photoX, 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Interventoría Contrato 20260210 · Evidencia de campo en el corredor', photoX, 28.5);

    const photos = [
      {
        titulo: 'Cuadrilla de Topografía y Levantamiento',
        abscisa: 'PR 24+940',
        cat: 'Topografía',
        desc: 'Comisión de topografía con estación total y cuadrilla con chalecos institucionales en el sector de Abejorral.',
        fecha: '23/09/2026 3:54 PM',
        gps: '5.812645°N, 75.420453°W'
      },
      {
        titulo: 'Instalación de Subdren y Filtro Longitudinal',
        abscisa: 'PR 25+320',
        cat: 'Filtros Drenantes',
        desc: 'Colocación de geotextil no tejido, tubería perforada y material granular filtrante en zanja lateral.',
        fecha: '22/09/2026 8:57 AM',
        gps: '5.814333°N, 75.422450°W'
      },
      {
        titulo: 'Valla Reglamentaria y Acopio de Material',
        abscisa: 'PR 25+490',
        cat: 'Señalización',
        desc: 'Valla institucional de obra Gobernación de Antioquia y zona de acopio de materiales pétreos seleccionados.',
        fecha: '22/09/2026 9:15 AM',
        gps: '5.815120°N, 75.423980°W'
      },
      {
        titulo: 'Frente de Estabilización con Maquinaria',
        abscisa: 'PR 25+650',
        cat: 'Estabilización',
        desc: 'Distribución y mezclado de estabilizante químico/cemento con motoniveladora y tren de compactación vibratoria.',
        fecha: '23/09/2026 11:20 AM',
        gps: '5.816045°N, 75.425120°W'
      }
    ];

    photos.forEach((ph, idx) => {
      const py = 32 + idx * 40;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(photoX, py, 137, 37, 1, 1, 'FD');

      // Green left border
      doc.setFillColor(4, 120, 87);
      doc.rect(photoX, py, 1.5, 37, 'F');

      // Title & category
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${ph.titulo}`, photoX + 4, py + 5);

      doc.setFillColor(220, 252, 231);
      doc.roundedRect(photoX + 110, py + 2.5, 23, 4, 0.6, 0.6, 'F');
      doc.setFontSize(5.5);
      doc.setTextColor(4, 120, 87);
      doc.text(ph.abscisa, photoX + 121.5, py + 5.2, { align: 'center' });

      // Technical metadata
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(71, 85, 105);
      doc.text(`Categoría: ${ph.cat}  |  Fecha: ${ph.fecha}`, photoX + 4, py + 10);
      doc.text(`Coordenadas GPS: ${ph.gps}  |  Fuente: Interventoría CAAS / Rentan`, photoX + 4, py + 14);

      // Description
      doc.setFontSize(5.8);
      doc.setTextColor(100, 116, 139);
      const splitDesc = doc.splitTextToSize(ph.desc, 130);
      doc.text(splitDesc, photoX + 4, py + 19);

      // Visual camera badge box
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(photoX + 4, py + 26, 129, 8, 0.6, 0.6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(4, 120, 87);
      doc.text('EVIDENCIA FOTOGRÁFICA CERTIFICADA EN EXPEDIENTE DE INTERVENTORÍA', photoX + 8, py + 31);
    });
  }

  drawPageFooter(doc, pageNum, totalPages) {
    const footY = 202;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(10, footY, 287, footY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(100, 116, 139);
    doc.text('Gobernación de Antioquia · Secretaría de Infraestructura Física · NIT. 890.900.286-0 · Sistema SIVA', 10, footY + 4);

    doc.setFont('helvetica', 'bold');
    doc.text(`Documento Ejecutivo Oficial — Página ${pageNum} de ${totalPages} (Formato Horizontal A4)`, 148.5, footY + 4, { align: 'center' });

    const now = new Date();
    const nowStr = `${now.toLocaleDateString('es-CO')} ${now.toLocaleTimeString('es-CO')}`;
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado: ${nowStr} · Auditoría CAAS / Rentan`, 287, footY + 4, { align: 'right' });
  }

  showSuccessToast(msg) {
    let toast = document.getElementById('pdfSuccessToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pdfSuccessToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.background = 'var(--brand-green)';
      toast.style.color = '#ffffff';
      toast.style.padding = '14px 22px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
      toast.style.zIndex = '9999';
      toast.style.fontSize = '0.85rem';
      toast.style.fontWeight = '700';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '8px';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-file-pdf" style="font-size: 1.1rem;"></i> <div>${msg}</div>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 5000);
  }
}

// Global export
window.PDFReportGenerator = PDFReportGenerator;
