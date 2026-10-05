[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Generating all 29 corridors in data/estabilizacion_corredores.js..."

$all29Json = @'
window.EST_CORREDORES = [
  // --- LOTE 1: ORIENTE ---
  {
    "id": "E-18",
    "code": "E-18",
    "name": "Abejorral – Santa Bárbara – El Cairo – La Elvira",
    "codigo_via": "5601",
    "circuito": "Abejorral - Santa Bárbara",
    "subregion": "Oriente",
    "lote_id": 1,
    "lote_name": "Lote 1 – Subregión Oriente",
    "color": "#059669",
    "longitud_contractual_km": 23.77,
    "longitud_probable_km": 9.72,
    "alcance_real_km": 16.87,
    "diferencia_km": 6.90,
    "cobertura_pct": 40.9,
    "valor_contractual": 19969185040,
    "valor_por_km_contractual": 840100338,
    "valor_proyectado": 48829785964,
    "valor_por_km_proyectado": 2054261084,
    "variacion_total": 28860600924,
    "variacion_pct": 144.5,
    "avance_fisico_pct": 2.58,
    "avance_financiero_pct": 3.40,
    "plazo_transcurrido_pct": 38.1,
    "plazo_dias": "123 de 323 días",
    "dias_transcurridos": 123,
    "dias_totales": 323,
    "dias_faltantes": 200,
    "fecha_inicio": "01/06/2026",
    "fecha_terminacion": "20/04/2027",
    "fecha_corte": "24/09/2026",
    "fecha_inicio_estabilizacion": "26/08/2026",
    "transito_estructuracion": "307.000",
    "transito_diseno": "311.553",
    "geotecnia_notas": "Se cuenta con 4 estructuras aprobadas según CBR (1,2% – 38,6%) y pendientes longitudinales. En pendientes > 8% se utiliza MDC-19 para la carpeta de rodadura.",
    "contrato_info": {
      "numero_contrato": "20260202",
      "contratista": "CONSORCIO ANTIOQUIA ORIENTE",
      "numero_interventoria": "20260210",
      "interventor": "CAMILO ANDRÉS ÁNGEL SALDARRIAGA",
      "objeto": "ACTIVIDADES DE MEJORAMIENTO, MANTENIMIENTO Y OBRAS COMPLEMENTARIAS PARA LA ESTABILIZACIÓN DE LAS VÍAS A CARGO DEL DEPARTAMENTO DE ANTIOQUIA - GRUPO 2 SUBREGIÓN ORIENTE",
      "plazo_meses": "13 MESES",
      "plazo_dias": 323,
      "fecha_acta_inicio": "01/06/2026",
      "fecha_inicio_estabilizacion": "26/08/2026",
      "fecha_corte": "24/09/2026",
      "fecha_vencimiento": "20/04/2027",
      "presupuesto_obra_inicial": 19969185040,
      "presupuesto_proyectado": 48829785964,
      "adicion_requerida": 28860600924,
      "variacion_pct": 144.53,
      "avance_fisico_pct": 2.58,
      "avance_financiero_pct": 3.40
    },
    "componentes_proyecto": [
      {
        "id": "topografia_apiques",
        "nombre": "Topografía / Apiques",
        "categoria": "geotecnia",
        "icono": "fa-drafting-compass",
        "color": "#059669",
        "resumen_abscisas": "K 0+000 al K 16+000 (Topografía) · K 0+000 al K 21+000 (Apiques Geotécnicos)",
        "ejecutado_km": 16.0,
        "total_km": 23.77,
        "porcentaje": 67.31,
        "observacion": "Levantamiento topográfico detallado (67,31%) y 21 km de exploración geotécnica con apiques (88,35%)."
      },
      {
        "id": "subrasante_cal",
        "nombre": "Subrasante Cal",
        "categoria": "plataforma",
        "icono": "fa-mountain",
        "color": "#92400e",
        "resumen_abscisas": "K 0+000 al K 1+800 y K 15+000 al K 23+770",
        "ejecutado_km": 1.80,
        "total_km": 23.77,
        "porcentaje": 7.57,
        "observacion": "Adecuación de calzada existente, escarificación y estabilización química con cal al 3% para neutralizar plasticidad."
      },
      {
        "id": "cemento_mgtc",
        "nombre": "Cemento MGTC",
        "categoria": "base",
        "icono": "fa-cubes",
        "color": "#d97706",
        "resumen_abscisas": "K 0+000 al K 3+500 (Espesor 20 a 28 cm)",
        "ejecutado_km": 0.0,
        "total_km": 9.72,
        "porcentaje": 0.0,
        "observacion": "Base estabilizada in-situ con cemento Portland al 4% mediante recicladora Wirtgen. Tramo inicial de 3,5 km en alistamiento."
      },
      {
        "id": "tsd_rodadura",
        "nombre": "TSD Rodadura",
        "categoria": "rodadura",
        "icono": "fa-road",
        "color": "#334155",
        "resumen_abscisas": "K 0+000 al K 1+200 y K 3+800 al K 5+500",
        "ejecutado_km": 0.0,
        "total_km": 6.12,
        "porcentaje": 0.0,
        "observacion": "Tratamiento Superficial Doble con emulsión asfáltica y gravilla triturada para sectores con pendientes longitudinales ≤ 8%."
      },
      {
        "id": "mdc_caliente",
        "nombre": "MDC-19 Caliente",
        "categoria": "rodadura",
        "icono": "fa-fire-flame-curved",
        "color": "#0f172a",
        "resumen_abscisas": "K 1+200 al K 3+800 y K 6+200 al K 7+900",
        "ejecutado_km": 0.0,
        "total_km": 3.60,
        "porcentaje": 0.0,
        "observacion": "Carpeta en Mezcla Densa en Caliente (Art. 450 Invías) de 7,5 cm en sectores de fuerte pendiente (> 8%) y curvas críticas."
      },
      {
        "id": "filtros_drenantes",
        "nombre": "Filtros Drenantes",
        "categoria": "drenaje",
        "icono": "fa-filter",
        "color": "#2563eb",
        "resumen_abscisas": "K 0+086 al K 1+250 (1.164 metros lineales continuos)",
        "ejecutado_ml": 1164,
        "total_ml": 28524,
        "porcentaje": 4.08,
        "observacion": "Subdren longitudinal con geotextil no tejido, grava filtrante graduada y tubería perforada de 6\"."
      },
      {
        "id": "alcantarilla_nueva",
        "nombre": "Alcantarilla Nueva",
        "categoria": "drenaje",
        "icono": "fa-circle-plus",
        "color": "#3b82f6",
        "resumen_abscisas": "K 3+105 (Estructura Nueva en Tubería de Concreto 36\")",
        "ejecutado_und": 0,
        "total_und": 1,
        "porcentaje": 50.0,
        "observacion": "Construcción de nueva obra transversal en K 3+105 con cabezales y aletas en concreto reforzado."
      },
      {
        "id": "alcantarilla_reposicion",
        "nombre": "Reposición de Alcantarillas (21 Und)",
        "categoria": "drenaje",
        "icono": "fa-arrow-rotate-right",
        "color": "#0891b2",
        "resumen_abscisas": "21 obras en abscisas exactas entre K 0+160 y K 4+505",
        "ejecutado_und": 22,
        "total_und": 45,
        "porcentaje": 48.89,
        "observacion": "Reemplazo de tuberías colapsadas de 24\" y 36\" por concreto reforzado e instalación de cabezales hidráulicos."
      },
      {
        "id": "obras_anuladas",
        "nombre": "Obras Transversales Anuladas (4 Und)",
        "categoria": "drenaje",
        "icono": "fa-ban",
        "color": "#ef4444",
        "resumen_abscisas": "K 1+772 · K 2+810 · K 3+160 · K 3+660",
        "ejecutado_und": 4,
        "total_und": 4,
        "porcentaje": 100.0,
        "observacion": "Estructuras obsoletas o redundantes suprimidas técnicamente tras revisión hidrológica con interventoría."
      }
    ],
    "puntos_singulares": [
      { "abscisa": "K 0+086", "km": 0.086, "tipo": "Filtro Drenante", "categoria": "filtro", "nombre": "Inicio Filtro Longitudinal Granular", "detalle": "Comienzo de tramo de 1.164 ml continuo", "color": "#2563eb", "icono": "fa-filter" },
      { "abscisa": "K 0+160", "km": 0.160, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 1", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 0+579", "km": 0.579, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 2 (Foto 05)", "detalle": "Reemplazo tubería y cabezal concreto", "color": "#0891b2", "icono": "fa-circle-dot", "foto": "Registro fotográfico/E18/foto_01_alcantarilla_k0+579.jpg" },
      { "abscisa": "K 0+683", "km": 0.683, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 3", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 0+747", "km": 0.747, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 4", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 0+841", "km": 0.841, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 5", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 1+200", "km": 1.200, "tipo": "Subrasante Cal", "categoria": "subrasante", "nombre": "Plataforma de Subrasante (Foto 07)", "detalle": "Conformación de calzada y cal viva", "color": "#92400e", "icono": "fa-mountain", "foto": "Registro fotográfico/E18/foto_03_plataforma_k1+200.jpg" },
      { "abscisa": "K 1+250", "km": 1.250, "tipo": "Filtro Drenante", "categoria": "filtro", "nombre": "Fin Filtro Longitudinal Granular", "detalle": "Final de tramo continuo de 1.164 ml", "color": "#2563eb", "icono": "fa-filter", "foto": "Registro fotográfico/E18/foto_02_filtro_k0+086.jpg" },
      { "abscisa": "K 1+253", "km": 1.253, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 6", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 1+364", "km": 1.364, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 7", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 1+571", "km": 1.571, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 8", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 1+660", "km": 1.660, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 9", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 1+772", "km": 1.772, "tipo": "Obra Anulada", "categoria": "anulada", "nombre": "Obra Anulada No. 1", "detalle": "Anulada por Interventoría No. 20260210", "color": "#ef4444", "icono": "fa-ban" },
      { "abscisa": "K 2+100", "km": 2.100, "tipo": "Cemento MGTC", "categoria": "mgtc", "nombre": "Frente de Estabilizadora (Foto 08)", "detalle": "Recicladora-estabilizadora con cemento", "color": "#d97706", "icono": "fa-cubes", "foto": "Registro fotográfico/E18/foto_04_estabilizadora_k2+100.jpg" },
      { "abscisa": "K 2+167", "km": 2.167, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 10", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 2+573", "km": 2.573, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 11", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 2+593", "km": 2.593, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 12", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 2+810", "km": 2.810, "tipo": "Obra Anulada", "categoria": "anulada", "nombre": "Obra Anulada No. 2", "detalle": "Anulada por Interventoría No. 20260210", "color": "#ef4444", "icono": "fa-ban" },
      { "abscisa": "K 2+812", "km": 2.812, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 13", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 2+985", "km": 2.985, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 14", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 3+105", "km": 3.105, "tipo": "Alcantarilla Nueva", "categoria": "alcantarilla_nueva", "nombre": "★ ALCANTARILLA NUEVA K 3+105", "detalle": "Obra transversal nueva de 36\" con cabezales reforzados", "color": "#f59e0b", "icono": "fa-star" },
      { "abscisa": "K 3+160", "km": 3.160, "tipo": "Alcantarilla Reposición / Anulada", "categoria": "alcantarilla", "nombre": "Alcantarilla No. 15 (Ajuste)", "detalle": "Punto de ajuste de alineamiento transversal", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 3+190", "km": 3.190, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 16", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 3+315", "km": 3.315, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 17", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 3+465", "km": 3.465, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 18", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 3+559", "km": 3.559, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 19", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 3+660", "km": 3.660, "tipo": "Obra Anulada", "categoria": "anulada", "nombre": "Obra Anulada No. 4", "detalle": "Anulada por Interventoría No. 20260210", "color": "#ef4444", "icono": "fa-ban" },
      { "abscisa": "K 4+339", "km": 4.339, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 20", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 4+505", "km": 4.505, "tipo": "Alcantarilla Reposición", "categoria": "alcantarilla", "nombre": "Alcantarilla Reposición No. 21", "detalle": "Tubería concreto 36\" reposición", "color": "#0891b2", "icono": "fa-circle-dot" },
      { "abscisa": "K 16+000", "km": 16.000, "tipo": "Topografía", "categoria": "geotecnia", "nombre": "Límite Frente Topografía", "detalle": "16,00 km levantados de 23,77 km (67,31%)", "color": "#059669", "icono": "fa-drafting-compass" },
      { "abscisa": "K 21+000", "km": 21.000, "tipo": "Apiques Geotécnicos", "categoria": "geotecnia", "nombre": "Límite Exploración Geotécnica", "detalle": "21,00 km explorados con apiques (88,35%)", "color": "#059669", "icono": "fa-mountain" },
      { "abscisa": "K 23+770", "km": 23.770, "tipo": "Final Corredor", "categoria": "meta", "nombre": "Límite Contractual E-18", "detalle": "Fin de tramo Abejorral - La Elvira", "color": "#0f172a", "icono": "fa-flag-checkered" }
    ],
    "registro_fotografico": [
      {
        "id": "foto_01",
        "archivo": "Registro fotográfico/E18/Imagen1.png",
        "abscisa": "PR 24+940",
        "km_aprox": 24.94,
        "categoria": "Topografía / Apiques",
        "componente_id": "topografia_apiques",
        "titulo": "Cuadrilla de Topografía y Levantamiento Altimétrico",
        "descripcion": "Comisión de topografía con estación total y cuadrilla de ingenieros con chalecos institucionales en el sector de Abejorral.",
        "fecha": "23/09/2026 3:54 PM",
        "coordenadas": "5.812645°N, 75.420453°W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      },
      {
        "id": "foto_02",
        "archivo": "Registro fotográfico/E18/Imagen2.png",
        "abscisa": "PR 25+320",
        "km_aprox": 25.32,
        "categoria": "Filtros Drenantes",
        "componente_id": "filtros_drenantes",
        "titulo": "Instalación de Subdren y Filtro Longitudinal",
        "descripcion": "Colocación de geotextil no tejido, tendido de tubería perforada de drenaje y material granular filtrante en zanja lateral.",
        "fecha": "22/09/2026 8:57 AM",
        "coordenadas": "5.814333°N, 75.422450°W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      },
      {
        "id": "foto_03",
        "archivo": "Registro fotográfico/E18/Imagen3.jpg",
        "abscisa": "PR 25+490",
        "km_aprox": 25.49,
        "categoria": "Señalización y Obras",
        "componente_id": "subrasante_cal",
        "titulo": "Valla Reglamentaria Inicio de Obra y Acopio",
        "descripcion": "Instalación de vallas de obra de la Gobernación de Antioquia y zona de acopio de materiales pétreos clasificados.",
        "fecha": "23/09/2026 8:56 AM",
        "coordenadas": "5°48'54.7\"N, 75°25'22.2\"W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      },
      {
        "id": "foto_04",
        "archivo": "Registro fotográfico/E18/Imagen6.jpg",
        "abscisa": "PR 25+490",
        "km_aprox": 25.49,
        "categoria": "Subrasante / Movimiento de Tierras",
        "componente_id": "subrasante_cal",
        "titulo": "Transporte y Suministro de Material Granular",
        "descripcion": "Volqueta doble troque descargando material granular de mejoramiento para la adecuación de la plataforma vial.",
        "fecha": "17/09/2026 9:03 AM",
        "coordenadas": "5.8152°N, 75.4223°W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      },
      {
        "id": "foto_05",
        "archivo": "Registro fotográfico/E18/foto_01_alcantarilla_k0+579.jpg",
        "abscisa": "K 0+579",
        "km_aprox": 0.579,
        "categoria": "Alcantarilla Reposición",
        "componente_id": "alcantarilla_reposicion",
        "titulo": "Excavación e Instalación de Alcantarilla K 0+579",
        "descripcion": "Reemplazo de obra transversal con tubería de concreto reforzado de 36 pulgadas, cabezales y aletas de descole.",
        "fecha": "20/09/2026",
        "coordenadas": "5.8201°N, 75.4312°W",
        "contrato_interventoria": "Consorcio Antioquia Oriente · Obra No. 20260202",
        "tipo_fuente": "Registro de Obra Civil"
      },
      {
        "id": "foto_06",
        "archivo": "Registro fotográfico/E18/foto_02_filtro_k0+086.jpg",
        "abscisa": "K 0+086 - K 1+250",
        "km_aprox": 0.086,
        "categoria": "Filtros Drenantes",
        "componente_id": "filtros_drenantes",
        "titulo": "Tramo de Filtro Drenante Granular Longitudinal (1.164 ml)",
        "descripcion": "Vista longitudinal del filtro continuo instalado al costado de la vía para proteger la subrasante estabilizada.",
        "fecha": "21/09/2026",
        "coordenadas": "5.8184°N, 75.4285°W",
        "contrato_interventoria": "Consorcio Antioquia Oriente · Obra No. 20260202",
        "tipo_fuente": "Registro de Obra Civil"
      },
      {
        "id": "foto_07",
        "archivo": "Registro fotográfico/E18/foto_03_plataforma_k1+200.jpg",
        "abscisa": "K 1+200",
        "km_aprox": 1.200,
        "categoria": "Subrasante Cal / Plataforma",
        "componente_id": "subrasante_cal",
        "titulo": "Conformación y Estabilización de Plataforma K 1+200",
        "descripcion": "Motoniveladora y rodillo compactador preparando la rasante para el tratamiento estabilizador con cal viva.",
        "fecha": "22/09/2026",
        "coordenadas": "5.8235°N, 75.4367°W",
        "contrato_interventoria": "Consorcio Antioquia Oriente · Obra No. 20260202",
        "tipo_fuente": "Registro de Obra Civil"
      },
      {
        "id": "foto_08",
        "archivo": "Registro fotográfico/E18/foto_04_estabilizadora_k2+100.jpg",
        "abscisa": "K 2+100",
        "km_aprox": 2.100,
        "categoria": "Cemento MGTC",
        "componente_id": "cemento_mgtc",
        "titulo": "Recicladora-Estabilizadora en Frente MGTC K 2+100",
        "descripcion": "Equipo pesado de mezclado in-situ incorporando cemento Portland dosificado y agua para conformación de base MGTC.",
        "fecha": "24/09/2026",
        "coordenadas": "5.8289°N, 75.4410°W",
        "contrato_interventoria": "Consorcio Antioquia Oriente · Obra No. 20260202",
        "tipo_fuente": "Registro de Obra Civil"
      }
    ],
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica (Licitación)",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + Estabilización con cemento (28 cm) + Subrasante con cal (20 cm)",
        "capas": [
          { "nombre": "Tratamiento Superficial Doble (TSD)", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Estabilización con cemento (Subbase 13 cm)", "tipo": "base", "material": "Cemento", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "cemento" },
          { "nombre": "Subrasante estabilizada con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      },
      {
        "nombre": "Estructura Aprobada (MDC-19 · Pendientes > 8%)",
        "tipo": "aprobada_mdc",
        "espesor_total_cm": 52.5,
        "descripcion": "MDC-19 (7,5 cm) + Base MGTC (20 cm) + Afirmado (25 cm) - Total: 52,5 cm",
        "capas": [
          { "nombre": "Mezcla Densa en Caliente (MDC-19)", "tipo": "rodadura", "material": "MDC-19", "espesor_cm": 7.5, "espesor_display": "7,5 cm", "color": "#111827", "textura": "asfalto_pesado" },
          { "nombre": "Estabilización con cemento (MGTC)", "tipo": "base", "material": "MGTC", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#B45309", "textura": "mgtc" },
          { "nombre": "Afirmado de soporte", "tipo": "subbase", "material": "Afirmado", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#78350F", "textura": "grava" }
        ]
      },
      {
        "nombre": "Estructura Aprobada (TSD · Pendientes ≤ 8%)",
        "tipo": "aprobada_tsd",
        "espesor_total_cm": 64.0,
        "descripcion": "TSD + Base MGTC (39 cm) + Afirmado (25 cm) - Total: 64,0 cm",
        "capas": [
          { "nombre": "Tratamiento Superficial Doble (TSD)", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Estabilización con cemento (MGTC)", "tipo": "base", "material": "MGTC", "espesor_cm": 39.0, "espesor_display": "39 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Afirmado granular", "tipo": "subbase", "material": "Afirmado", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#78350F", "textura": "grava" }
        ]
      }
    ],
    "actividades_presupuesto": [
      { "actividad": "Construcción alcantarilla", "contractual_val": 349118827, "contractual_pct": 1.7, "proyectado_val": 4569689585, "proyectado_pct": 9.4, "variacion_val": 4220570758, "variacion_pct": 1208.9, "tipo": "adicion" },
      { "actividad": "Construcción cuneta", "contractual_val": 3962861757, "contractual_pct": 19.8, "proyectado_val": 5209150329, "proyectado_pct": 10.7, "variacion_val": 1246288572, "variacion_pct": 31.4, "tipo": "adicion" },
      { "actividad": "Construcción filtro", "contractual_val": 4154277100, "contractual_pct": 20.8, "proyectado_val": 4853456980, "proyectado_pct": 9.9, "variacion_val": 699179880, "variacion_pct": 16.8, "tipo": "adicion" },
      { "actividad": "Construcción bordillos", "contractual_val": 587858975, "contractual_pct": 2.9, "proyectado_val": 31606724, "proyectado_pct": 0.1, "variacion_val": -556252251, "variacion_pct": -94.6, "tipo": "ahorro" },
      { "actividad": "Construcción disipadores", "contractual_val": 24152373, "contractual_pct": 0.1, "proyectado_val": 423717387, "proyectado_pct": 0.9, "variacion_val": 399565014, "variacion_pct": 1654.4, "tipo": "adicion" },
      { "actividad": "Estabilización", "contractual_val": 10535064588, "contractual_pct": 52.8, "proyectado_val": 32124443827, "proyectado_pct": 65.8, "variacion_val": 21589379239, "variacion_pct": 204.9, "tipo": "adicion" },
      { "actividad": "Señalización vial", "contractual_val": 355851420, "contractual_pct": 1.8, "proyectado_val": 417158664, "proyectado_pct": 0.9, "variacion_val": 61307244, "variacion_pct": 17.2, "tipo": "adicion" },
      { "actividad": "MDC (Mezcla en Caliente)", "contractual_val": 0, "contractual_pct": 0.0, "proyectado_val": 1200562468, "proyectado_pct": 2.5, "variacion_val": 1200562468, "variacion_pct": 100.0, "tipo": "adicion" }
    ],
    "actividades_ejecucion": [
      { "actividad": "Alcantarillas", "unidad": "und", "presupuestada": 3, "real": 45, "ejec_anterior": 22, "ejec_actual": 22, "delta_semana": 0, "pct": 48.9 },
      { "actividad": "Cunetas", "unidad": "ml", "presupuestada": 23770, "real": 31489, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Filtros", "unidad": "ml", "presupuestada": 23770, "real": 28524, "ejec_anterior": 1164, "ejec_actual": 1164, "delta_semana": 0, "pct": 4.1 },
      { "actividad": "Bordillos", "unidad": "ml", "presupuestada": 4754, "real": 256, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Estabilización", "unidad": "m²", "presupuestada": 118850, "real": 118850, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Señalización", "unidad": "ml", "presupuestada": 71310, "real": 71310, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 }
    ],
    "avance_abscisas": {
      "abscisas": ["K0", "K1", "K2", "K3", "K4", "K6", "K8", "K10", "K12", "K14", "K16", "K18", "K20", "K22", "K23+770"],
      "longitud_m": 23770,
      "campo": { "topografia_pct": 67.31, "apiques_pct": 88.35 },
      "estructura": { "rodadura_pct": 0.0, "capa_granular_pct": 0.0, "subrasante_pct": 7.57 },
      "drenaje": { "cunetas_pct": 0.0, "filtros_pct": 4.08, "alcantarillas_pct": 48.89 },
      "tramos": [
        { "km_inicio": 0, "km_fin": 16.0, "tipo": "Topografía detallada finalizada (67,31%)", "estado": "ejecutado", "color": "#059669", "componente": "topografia_apiques" },
        { "km_inicio": 0, "km_fin": 21.0, "tipo": "Apiques geotécnicos ejecutados (88,35%)", "estado": "ejecutado", "color": "#10b981", "componente": "topografia_apiques" },
        { "km_inicio": 0, "km_fin": 1.8, "tipo": "Subrasante con cal y adecuación de plataforma", "estado": "ejecutado", "color": "#92400e", "componente": "subrasante_cal" },
        { "km_inicio": 0.086, "km_fin": 1.250, "tipo": "Filtro drenante granular longitudinal (1.164 ml)", "estado": "ejecutado", "color": "#2563eb", "componente": "filtros_drenantes" },
        { "km_inicio": 0, "km_fin": 3.5, "tipo": "Base Cemento MGTC programada (Espesor 20-28 cm)", "estado": "programado", "color": "#d97706", "componente": "cemento_mgtc" },
        { "km_inicio": 0, "km_fin": 1.2, "tipo": "TSD Rodadura (Pendientes ≤ 8%)", "estado": "programado", "color": "#334155", "componente": "tsd_rodadura" },
        { "km_inicio": 1.2, "km_fin": 3.8, "tipo": "MDC-19 Mezcla en Caliente (Pendientes > 8%)", "estado": "programado", "color": "#0f172a", "componente": "mdc_caliente" },
        { "km_inicio": 3.105, "km_fin": 3.105, "tipo": "★ Alcantarilla Nueva 36\" K 3+105", "estado": "alcantarilla_nueva", "color": "#f59e0b", "componente": "alcantarilla_nueva" },
        { "km_inicio": 0, "km_fin": 14.6, "tipo": "Limpieza y descole de 146 obras transversales", "estado": "alcantarilla_limpieza", "color": "#06b6d4", "componente": "alcantarilla_reposicion" }
      ]
    }
  },

  {
    "id": "E-17",
    "code": "E-17",
    "name": "La Frontera (Ruta 56) – Mesopotamia – Abejorral",
    "codigo_via": "56AN05 / 56AN07",
    "circuito": "Abejorral - La Frontera",
    "subregion": "Oriente",
    "lote_id": 1,
    "lote_name": "Lote 1 – Subregión Oriente",
    "color": "#059669",
    "longitud_contractual_km": 25.49,
    "longitud_probable_km": 12.35,
    "alcance_real_km": 18.26,
    "diferencia_km": 7.23,
    "cobertura_pct": 48.4,
    "valor_contractual": 23070485659,
    "valor_por_km_contractual": 905079861,
    "valor_proyectado": 47630680065,
    "valor_por_km_proyectado": 1868602592,
    "variacion_total": 24560194406,
    "variacion_pct": 106.5,
    "avance_fisico_pct": 0.55,
    "avance_financiero_pct": 0.63,
    "plazo_transcurrido_pct": 38.1,
    "plazo_dias": "123 de 323 días",
    "dias_transcurridos": 123,
    "dias_totales": 323,
    "dias_faltantes": 200,
    "fecha_inicio": "01/06/2026",
    "fecha_terminacion": "20/04/2027",
    "fecha_corte": "24/09/2026",
    "fecha_inicio_estabilizacion": "26/08/2026",
    "transito_estructuracion": "307.000",
    "transito_diseno": "265.965",
    "geotecnia_notas": "Estructura teórica aprobada con subbase 13 cm, base cementada de 28 cm y subrasante tratada con cal de 20 cm.",
    "contrato_info": {
      "numero_contrato": "20260202",
      "contratista": "CONSORCIO ANTIOQUIA ORIENTE",
      "numero_interventoria": "20260210",
      "interventor": "CAMILO ANDRÉS ÁNGEL SALDARRIAGA",
      "objeto": "ACTIVIDADES DE MEJORAMIENTO, MANTENIMIENTO Y OBRAS COMPLEMENTARIAS PARA LA ESTABILIZACIÓN DE LAS VÍAS A CARGO DEL DEPARTAMENTO DE ANTIOQUIA - GRUPO 2 SUBREGIÓN ORIENTE",
      "plazo_meses": "13 MESES",
      "plazo_dias": 323,
      "fecha_acta_inicio": "01/06/2026",
      "fecha_inicio_estabilizacion": "26/08/2026",
      "fecha_corte": "24/09/2026",
      "fecha_vencimiento": "20/04/2027",
      "presupuesto_obra_inicial": 23070485659,
      "presupuesto_proyectado": 47630680065,
      "adicion_requerida": 24560194406,
      "variacion_pct": 106.46,
      "avance_fisico_pct": 0.55,
      "avance_financiero_pct": 0.63
    },
    "componentes_proyecto": [
      {
        "id": "topografia_apiques",
        "nombre": "Topografía / Apiques",
        "categoria": "geotecnia",
        "icono": "fa-drafting-compass",
        "color": "#059669",
        "resumen_abscisas": "K 10+490 al K 25+490 (15,00 km Topografía) · K 15+490 al K 25+490 (10 km Geotecnia)",
        "ejecutado_km": 15.0,
        "total_km": 25.49,
        "porcentaje": 58.85,
        "observacion": "Levantamiento topográfico desde Mesopotamia hasta Abejorral (58,85%) y apiques geotécnicos en 10 km."
      },
      {
        "id": "subrasante_cal",
        "nombre": "Subrasante Cal",
        "categoria": "plataforma",
        "icono": "fa-mountain",
        "color": "#92400e",
        "resumen_abscisas": "K 19+990 al K 25+490 (5,50 km en adecuación)",
        "ejecutado_km": 5.50,
        "total_km": 25.49,
        "porcentaje": 21.58,
        "observacion": "Escarificación de afirmado existente y estabilización con cal en tramo crítico de aproximación a Abejorral."
      },
      {
        "id": "cemento_mgtc",
        "nombre": "Cemento MGTC",
        "categoria": "base",
        "icono": "fa-cubes",
        "color": "#d97706",
        "resumen_abscisas": "K 20+000 al K 25+490 (Programado)",
        "ejecutado_km": 0.0,
        "total_km": 12.35,
        "porcentaje": 0.0,
        "observacion": "Base estabilizada con cemento Portland al 4% sobre afirmado existente."
      },
      {
        "id": "tsd_rodadura",
        "nombre": "TSD Rodadura",
        "categoria": "rodadura",
        "icono": "fa-road",
        "color": "#334155",
        "resumen_abscisas": "K 12+000 al K 18+000 (Pendientes moderadas)",
        "ejecutado_km": 0.0,
        "total_km": 8.0,
        "porcentaje": 0.0,
        "observacion": "Tratamiento superficial doble con emulsión y gravilla triturada."
      },
      {
        "id": "mdc_caliente",
        "nombre": "MDC-19 Caliente",
        "categoria": "rodadura",
        "icono": "fa-fire-flame-curved",
        "color": "#0f172a",
        "resumen_abscisas": "K 20+000 al K 25+490 (Sectores de alta pendiente)",
        "ejecutado_km": 0.0,
        "total_km": 4.35,
        "porcentaje": 0.0,
        "observacion": "Mezcla asfáltica en caliente de alta fricción para curvas cerradas y bajada pronunciada."
      },
      {
        "id": "filtros_drenantes",
        "nombre": "Filtros Drenantes",
        "categoria": "drenaje",
        "icono": "fa-filter",
        "color": "#2563eb",
        "resumen_abscisas": "K 25+226 al K 25+419 (193 metros lineales)",
        "ejecutado_ml": 193,
        "total_ml": 25447,
        "porcentaje": 0.76,
        "observacion": "Filtros granulares y tubería perforada instalados en sector de ingreso urbano."
      },
      {
        "id": "alcantarilla_nueva",
        "nombre": "Alcantarilla Nueva",
        "categoria": "drenaje",
        "icono": "fa-circle-plus",
        "color": "#3b82f6",
        "resumen_abscisas": "K 25+226 (Nueva obra transversal de 36\")",
        "ejecutado_und": 1,
        "total_und": 1,
        "porcentaje": 100.0,
        "observacion": "Construcción completa de alcantarilla nueva en K 25+226 con cabezal y aletas de concreto."
      }
    ],
    "puntos_singulares": [
      { "abscisa": "K 10+490", "km": 10.490, "tipo": "Topografía", "categoria": "geotecnia", "nombre": "Inicio Levantamiento Topográfico", "detalle": "Sector Mesopotamia", "color": "#059669", "icono": "fa-drafting-compass" },
      { "abscisa": "K 15+490", "km": 15.490, "tipo": "Apiques", "categoria": "geotecnia", "nombre": "Inicio Exploración Geotécnica", "detalle": "Ensayos de CBR y humedad natural", "color": "#059669", "icono": "fa-mountain" },
      { "abscisa": "K 19+990", "km": 19.990, "tipo": "Adecuación", "categoria": "subrasante", "nombre": "Inicio Tramo Adecuación Plataforma", "detalle": "5,5 km continuos de mejoramiento", "color": "#92400e", "icono": "fa-truck" },
      { "abscisa": "K 24+940", "km": 24.940, "tipo": "Topografía / Apiques", "categoria": "geotecnia", "nombre": "Frente Topográfico Activo (Foto 01)", "detalle": "Estación total e interventoría", "color": "#059669", "icono": "fa-drafting-compass", "foto": "Registro fotográfico/E18/Imagen1.png" },
      { "abscisa": "K 25+226", "km": 25.226, "tipo": "Alcantarilla Nueva", "categoria": "alcantarilla_nueva", "nombre": "★ ALCANTARILLA NUEVA K 25+226", "detalle": "Tubería 36\" y cabezales", "color": "#f59e0b", "icono": "fa-star" },
      { "abscisa": "K 25+320", "km": 25.320, "tipo": "Filtros Drenantes", "categoria": "filtro", "nombre": "Frente Subdren Granular (Foto 02)", "detalle": "Geotextil y tubería drenante", "color": "#2563eb", "icono": "fa-filter", "foto": "Registro fotográfico/E18/Imagen2.png" },
      { "abscisa": "K 25+419", "km": 25.419, "tipo": "Filtros Drenantes", "categoria": "filtro", "nombre": "Fin Tramo Filtro K25", "detalle": "193 ml continuos", "color": "#2563eb", "icono": "fa-filter" },
      { "abscisa": "K 25+490", "km": 25.490, "tipo": "Señalización y Acopio", "categoria": "meta", "nombre": "Inicio de Obra PR 25+490 (Foto 03 y 06)", "detalle": "Valla institucional y acopio de granulares", "color": "#d97706", "icono": "fa-flag", "foto": "Registro fotográfico/E18/Imagen3.jpg" }
    ],
    "registro_fotografico": [
      {
        "id": "foto_e17_01",
        "archivo": "Registro fotográfico/E18/Imagen1.png",
        "abscisa": "PR 24+940",
        "km_aprox": 24.94,
        "categoria": "Topografía / Apiques",
        "componente_id": "topografia_apiques",
        "titulo": "Comisión de Topografía Estación Total PR 24+940",
        "descripcion": "Cuadrilla de topógrafos e interventores de Rentan en levantamiento altimétrico de la vía Abejorral - La Frontera.",
        "fecha": "23/09/2026 3:54 PM",
        "coordenadas": "5.812645°N, 75.420453°W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      },
      {
        "id": "foto_e17_02",
        "archivo": "Registro fotográfico/E18/Imagen2.png",
        "abscisa": "PR 25+320",
        "km_aprox": 25.32,
        "categoria": "Filtros Drenantes",
        "componente_id": "filtros_drenantes",
        "titulo": "Instalación de Geotextil y Tubería en Filtro Subdren",
        "descripcion": "Personal de cuadrilla acomodando el manto no tejido y relleno con grava filtrante en PR 25+320.",
        "fecha": "22/09/2026 8:57 AM",
        "coordenadas": "5.814333°N, 75.422450°W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      },
      {
        "id": "foto_e17_03",
        "archivo": "Registro fotográfico/E18/Imagen3.jpg",
        "abscisa": "PR 25+490",
        "km_aprox": 25.49,
        "categoria": "Señalización y Obras",
        "componente_id": "subrasante_cal",
        "titulo": "Valla de Inicio de Obra y Acopio PR 25+490",
        "descripcion": "Valla reglamentaria naranja y campamento con acopio de materiales de subbase en La Ceja - Abejorral.",
        "fecha": "23/09/2026 8:56 AM",
        "coordenadas": "5°48'54.7\"N, 75°25'22.2\"W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      },
      {
        "id": "foto_e17_04",
        "archivo": "Registro fotográfico/E18/Imagen6.jpg",
        "abscisa": "PR 25+490",
        "km_aprox": 25.49,
        "categoria": "Subrasante / Movimiento de Tierras",
        "componente_id": "subrasante_cal",
        "titulo": "Suministro de Afirmado en Volqueta Doble Troque",
        "descripcion": "Descargue de material seleccionado para conformación de la subrasante en PR 25+490.",
        "fecha": "17/09/2026 9:03 AM",
        "coordenadas": "5.8152°N, 75.4223°W",
        "contrato_interventoria": "Contrato 20260210 · CAAS / Rentan",
        "tipo_fuente": "Registro Oficial Interventoría"
      }
    ],
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica Aprobada",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + Estabilización con cemento (28 cm) + Subrasante con cal (20 cm)",
        "capas": [
          { "nombre": "Tratamiento Superficial Doble (TSD)", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Estabilización con cemento (Subbase 13 cm)", "tipo": "base", "material": "Cemento", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "cemento" },
          { "nombre": "Subrasante estabilizada con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ],
    "actividades_presupuesto": [
      { "actividad": "Construcción alcantarilla", "contractual_val": 2244351844, "contractual_pct": 9.7, "proyectado_val": 2852204289, "proyectado_pct": 6.0, "variacion_val": 607852445, "variacion_pct": 27.1, "tipo": "adicion" },
      { "actividad": "Construcción cuneta", "contractual_val": 4212009351, "contractual_pct": 18.3, "proyectado_val": 5518986339, "proyectado_pct": 11.6, "variacion_val": 1306976988, "variacion_pct": 31.0, "tipo": "adicion" },
      { "actividad": "Construcción filtro", "contractual_val": 4325107514, "contractual_pct": 18.7, "proyectado_val": 4313471524, "proyectado_pct": 9.1, "variacion_val": -11635990, "variacion_pct": -0.3, "tipo": "ahorro" },
      { "actividad": "Construcción bordillos", "contractual_val": 630437534, "contractual_pct": 2.7, "proyectado_val": 52976848, "proyectado_pct": 0.1, "variacion_val": -577460686, "variacion_pct": -91.6, "tipo": "ahorro" },
      { "actividad": "Construcción disipadores", "contractual_val": 322236492, "contractual_pct": 1.4, "proyectado_val": 497142581, "proyectado_pct": 1.0, "variacion_val": 174906089, "variacion_pct": 54.3, "tipo": "adicion" },
      { "actividad": "Estabilización", "contractual_val": 10958008114, "contractual_pct": 47.5, "proyectado_val": 32233891864, "proyectado_pct": 67.7, "variacion_val": 21275883750, "variacion_pct": 194.2, "tipo": "adicion" },
      { "actividad": "Señalización vial", "contractual_val": 378334810, "contractual_pct": 1.6, "proyectado_val": 563351431, "proyectado_pct": 1.2, "variacion_val": 185016621, "variacion_pct": 48.9, "tipo": "adicion" },
      { "actividad": "MDC", "contractual_val": 0, "contractual_pct": 0.0, "proyectado_val": 1598655189, "proyectado_pct": 3.4, "variacion_val": 1598655189, "variacion_pct": 100.0, "tipo": "adicion" }
    ],
    "actividades_ejecucion": [
      { "actividad": "Alcantarillas", "unidad": "und", "presupuestada": 57, "real": 75, "ejec_anterior": 9, "ejec_actual": 9, "delta_semana": 0, "pct": 12.0 },
      { "actividad": "Cunetas", "unidad": "ml", "presupuestada": 25490, "real": 33715, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Filtros", "unidad": "ml", "presupuestada": 25490, "real": 25447, "ejec_anterior": 193, "ejec_actual": 193, "delta_semana": 0, "pct": 0.8 },
      { "actividad": "Bordillos", "unidad": "ml", "presupuestada": 5098, "real": 428, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Estabilización", "unidad": "m²", "presupuestada": 127450, "real": 127450, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Señalización", "unidad": "ml", "presupuestada": 76470, "real": 76470, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 }
    ],
    "avance_abscisas": {
      "abscisas": ["K0", "K2", "K4", "K6", "K8", "K10", "K12", "K14", "K16", "K18", "K20", "K22", "K24", "K25+490"],
      "longitud_m": 25490,
      "campo": { "topografia_pct": 58.85, "apiques_pct": 39.23 },
      "estructura": { "rodadura_pct": 0.0, "capa_granular_pct": 0.0, "subrasante_pct": 21.58 },
      "drenaje": { "cunetas_pct": 0.0, "filtros_pct": 0.76, "alcantarillas_pct": 12.0 },
      "tramos": [
        { "km_inicio": 10.49, "km_fin": 25.49, "tipo": "Topografía finalizada (15 km)", "estado": "ejecutado", "color": "#059669", "componente": "topografia_apiques" },
        { "km_inicio": 15.49, "km_fin": 25.49, "tipo": "Apiques geotécnicos ejecutados (10 km)", "estado": "ejecutado", "color": "#10b981", "componente": "topografia_apiques" },
        { "km_inicio": 19.99, "km_fin": 25.49, "tipo": "Subrasante con cal y adecuación (5,5 km)", "estado": "ejecutado", "color": "#92400e", "componente": "subrasante_cal" },
        { "km_inicio": 25.226, "km_fin": 25.419, "tipo": "Filtros drenantes instalados (193 ml)", "estado": "ejecutado", "color": "#2563eb", "componente": "filtros_drenantes" },
        { "km_inicio": 25.226, "km_fin": 25.226, "tipo": "★ Alcantarilla Nueva K 25+226", "estado": "alcantarilla_nueva", "color": "#f59e0b", "componente": "alcantarilla_nueva" }
      ]
    }
  },

  {
    "id": "E-16",
    "code": "E-16",
    "name": "San Vicente – El Peñol",
    "circuito": "San Vicente - El Peñol",
    "subregion": "Oriente",
    "lote_id": 1,
    "lote_name": "Lote 1 – Subregión Oriente",
    "color": "#10B981",
    "longitud_contractual_km": 18.15,
    "longitud_probable_km": 12.70,
    "alcance_real_km": 12.70,
    "diferencia_km": 5.45,
    "cobertura_pct": 73.4,
    "valor_contractual": 17646781111,
    "valor_por_km_contractual": 972274441,
    "valor_proyectado": 24053020311,
    "valor_por_km_proyectado": 1325235279,
    "variacion_total": 6406239200,
    "variacion_pct": 36.3,
    "avance_fisico_pct": 1.40,
    "avance_financiero_pct": 1.20,
    "plazo_transcurrido_pct": 38.1,
    "plazo_dias": "123 de 323 días",
    "fecha_inicio": "01/06/2026",
    "fecha_terminacion": "20/04/2027",
    "fecha_corte": "25/09/2026",
    "transito_estructuracion": "307.000",
    "transito_diseno": "305.611",
    "geotecnia_notas": "El alcance se reduce de 18,15 km a 12,75 km descontando 5,40 km de pavimento existente en buen estado.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + BGTC 28 cm + Base tratada con cal 20 cm",
        "capas": [
          { "nombre": "Tratamiento Superficial Doble (TSD)", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base Granular Tratada con Cemento (BGTC)", "tipo": "base", "material": "BGTC", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "cemento" },
          { "nombre": "Base tratada con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      },
      {
        "nombre": "Estructura Aprobada en Obra",
        "tipo": "aprobada",
        "espesor_total_cm": 40.0,
        "descripcion": "TSD + MGTC 30 cm + Material granular existente 10 cm (Total: 40 cm)",
        "capas": [
          { "nombre": "Tratamiento Superficial Doble (TSD)", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Material Granular Tratado con Cemento (MGTC)", "tipo": "base", "material": "MGTC", "espesor_cm": 30.0, "espesor_display": "30 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Material granular existente", "tipo": "subbase", "material": "Granular", "espesor_cm": 10.0, "espesor_display": "10 cm", "color": "#78350F", "textura": "grava" }
        ]
      }
    ],
    "actividades_presupuesto": [
      { "actividad": "Construcción alcantarilla", "contractual_val": 2107061362, "contractual_pct": 11.94, "proyectado_val": 2104063900, "proyectado_pct": 8.75, "variacion_val": -2997462, "variacion_pct": -0.1, "tipo": "ahorro" },
      { "actividad": "Construcción cuneta", "contractual_val": 3097519177, "contractual_pct": 17.55, "proyectado_val": 3388939783, "proyectado_pct": 14.09, "variacion_val": 291420606, "variacion_pct": 9.4, "tipo": "adicion" },
      { "actividad": "Construcción filtro", "contractual_val": 3280173270, "contractual_pct": 18.59, "proyectado_val": 2637466000, "proyectado_pct": 10.97, "variacion_val": -642707270, "variacion_pct": -19.6, "tipo": "ahorro" },
      { "actividad": "Construcción bordillos", "contractual_val": 466105520, "contractual_pct": 2.64, "proyectado_val": 866821200, "proyectado_pct": 3.60, "variacion_val": 400715680, "variacion_pct": 86.0, "tipo": "adicion" },
      { "actividad": "Construcción disipadores", "contractual_val": 342721665, "contractual_pct": 1.94, "proyectado_val": 342721665, "proyectado_pct": 1.42, "variacion_val": 0, "variacion_pct": 0.0, "tipo": "neutro" },
      { "actividad": "Estabilización", "contractual_val": 8072574897, "contractual_pct": 45.75, "proyectado_val": 14491765743, "proyectado_pct": 60.25, "variacion_val": 6419190846, "variacion_pct": 79.5, "tipo": "adicion" },
      { "actividad": "Señalización vial", "contractual_val": 280625220, "contractual_pct": 1.59, "proyectado_val": 221242020, "proyectado_pct": 0.92, "variacion_val": -59383200, "variacion_pct": -21.2, "tipo": "ahorro" }
    ],
    "actividades_ejecucion": [
      { "actividad": "Alcantarillas", "unidad": "und", "presupuestada": 54, "real": 54, "ejec_anterior": 6, "ejec_actual": 6, "delta_semana": 0, "pct": 11.1 },
      { "actividad": "Cunetas", "unidad": "ml", "presupuestada": 18150, "real": 18360, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Filtros", "unidad": "ml", "presupuestada": 18130, "real": 13000, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Bordillos", "unidad": "ml", "presupuestada": 3630, "real": 7000, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 },
      { "actividad": "Estabilización", "unidad": "m²", "presupuestada": 90750, "real": 68750, "ejec_anterior": 1295, "ejec_actual": 1295, "delta_semana": 0, "pct": 1.9 },
      { "actividad": "Señalización", "unidad": "ml", "presupuestada": 18150, "real": 12700, "ejec_anterior": 0, "ejec_actual": 0, "delta_semana": 0, "pct": 0.0 }
    ],
    "avance_abscisas": {
      "abscisas": ["K0", "K2", "K4", "K6", "K8", "K10", "K12", "K14", "K16", "K18+150"],
      "longitud_m": 18150,
      "campo": { "topografia_pct": 55.0, "apiques_pct": 100.0 },
      "estructura": { "rodadura_pct": 0.0, "capa_granular_pct": 0.0, "subrasante_pct": 1.4 },
      "drenaje": { "cunetas_pct": 0.0, "filtros_pct": 0.0, "alcantarillas_pct": 11.1 },
      "tramos": [
        { "km_inicio": 0, "km_fin": 10.0, "tipo": "Topografía concluida", "estado": "ejecutado", "color": "#10B981" },
        { "km_inicio": 0, "km_fin": 18.15, "tipo": "Apiques completados 100%", "estado": "ejecutado", "color": "#10B981" },
        { "km_inicio": 0, "km_fin": 0.26, "tipo": "Estabilización de subrasante (1.295 m²)", "estado": "ejecutado", "color": "#10B981" }
      ]
    }
  },

  {
    "id": "E-4-Oriente",
    "code": "E-4",
    "name": "San Rafael – San Roque – Santo Domingo – Alejandría (Tramo Oriente)",
    "circuito": "San Rafael - San Roque - Santo Domingo - Alejandría",
    "subregion": "Oriente",
    "lote_id": 1,
    "lote_name": "Lote 1 – Subregión Oriente",
    "color": "#10B981",
    "longitud_contractual_km": 2.26,
    "longitud_probable_km": 1.38,
    "alcance_real_km": 1.38,
    "diferencia_km": 0.88,
    "cobertura_pct": 61.2,
    "valor_contractual": 2707438687,
    "valor_por_km_contractual": 1197981720,
    "valor_proyectado": 4425510622,
    "valor_por_km_proyectado": 1958190541,
    "variacion_total": 1718071935,
    "variacion_pct": 63.5,
    "avance_fisico_pct": 0.0,
    "avance_financiero_pct": 0.0,
    "plazo_transcurrido_pct": 38.1,
    "plazo_dias": "123 de 323 días",
    "fecha_inicio": "01/06/2026",
    "fecha_terminacion": "20/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Tramo complementario interconectado con el corredor del Nordeste.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica Estimada",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + MGTC 28 cm + Subrasante estabilizada con cal 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base cementada MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-15",
    "code": "E-15",
    "name": "La Quiebra – Santa Ana",
    "circuito": "La Quiebra - Santa Ana",
    "subregion": "Oriente",
    "lote_id": 1,
    "lote_name": "Lote 1 – Subregión Oriente",
    "color": "#10B981",
    "longitud_contractual_km": 5.33,
    "longitud_probable_km": 3.24,
    "alcance_real_km": 3.24,
    "diferencia_km": 2.09,
    "cobertura_pct": 60.8,
    "valor_contractual": 6342396909,
    "valor_por_km_contractual": 1189943135,
    "valor_proyectado": 10437155581,
    "valor_por_km_proyectado": 1958190541,
    "variacion_total": 4094758672,
    "variacion_pct": 64.6,
    "avance_fisico_pct": 0.0,
    "avance_financiero_pct": 0.0,
    "plazo_transcurrido_pct": 38.1,
    "plazo_dias": "123 de 323 días",
    "fecha_inicio": "01/06/2026",
    "fecha_terminacion": "20/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor con geología de vertiente escarpada y arcillas limosas.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Oriente",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + MGTC 28 cm + Subrasante tratada 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base cementada MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante tratada", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-19",
    "code": "E-19",
    "name": "Sonsón – Aguadas (Puente San Rafael)",
    "circuito": "Sonsón - Aguadas (Puente San Rafael)",
    "subregion": "Oriente",
    "lote_id": 1,
    "lote_name": "Lote 1 – Subregión Oriente",
    "color": "#10B981",
    "longitud_contractual_km": 19.22,
    "longitud_probable_km": 10.43,
    "alcance_real_km": 10.43,
    "diferencia_km": 8.79,
    "cobertura_pct": 54.3,
    "valor_contractual": 20422716723,
    "valor_por_km_contractual": 1062576312,
    "valor_proyectado": 37636422190,
    "valor_por_km_proyectado": 1958190541,
    "variacion_total": 17213705467,
    "variacion_pct": 84.3,
    "avance_fisico_pct": 0.0,
    "avance_financiero_pct": 0.0,
    "plazo_transcurrido_pct": 38.1,
    "plazo_dias": "123 de 323 días",
    "fecha_inicio": "01/06/2026",
    "fecha_terminacion": "20/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor estratégico límite departamental Antioquia - Caldas.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Oriente",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + MGTC 28 cm + Subrasante tratada con cal 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base cementada MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante tratada", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-29",
    "code": "E-29",
    "name": "Guarne – Yolombal",
    "circuito": "Guarne - Yolombal",
    "subregion": "Oriente",
    "lote_id": 1,
    "lote_name": "Lote 1 – Subregión Oriente",
    "color": "#10B981",
    "longitud_contractual_km": 5.00,
    "longitud_probable_km": 2.61,
    "alcance_real_km": 2.61,
    "diferencia_km": 2.39,
    "cobertura_pct": 52.2,
    "valor_contractual": 5110154505,
    "valor_por_km_contractual": 1022030901,
    "valor_proyectado": 9790952703,
    "valor_por_km_proyectado": 1958190541,
    "variacion_total": 4680798198,
    "variacion_pct": 91.6,
    "avance_fisico_pct": 0.0,
    "avance_financiero_pct": 0.0,
    "plazo_transcurrido_pct": 38.1,
    "plazo_dias": "123 de 323 días",
    "fecha_inicio": "01/06/2026",
    "fecha_terminacion": "20/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Vía suburbana en el altiplano de Rionegro - Guarne con alto tráfico liviano y comercial.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Oriente",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + Base MGTC 28 cm + Subrasante tratada 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base cementada MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante tratada", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  // --- LOTE 2: OCCIDENTE ---
  {
    "id": "E-28",
    "code": "E-28",
    "name": "Miserenga – Ebéjico",
    "circuito": "Ebejico - Miserenga",
    "subregion": "Occidente",
    "lote_id": 2,
    "lote_name": "Lote 2 – Subregión Occidente",
    "color": "#3B82F6",
    "longitud_contractual_km": 1.00,
    "longitud_probable_km": 0.81,
    "alcance_real_km": 0.81,
    "diferencia_km": 0.19,
    "cobertura_pct": 81.0,
    "valor_contractual": 970000000,
    "valor_por_km_contractual": 970000000,
    "valor_proyectado": 1198000000,
    "valor_por_km_proyectado": 1479012346,
    "variacion_total": 228000000,
    "variacion_pct": 23.5,
    "avance_fisico_pct": 4.50,
    "avance_financiero_pct": 4.93,
    "plazo_transcurrido_pct": 42.9,
    "plazo_dias": "138 de 322 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "02/04/2027",
    "fecha_corte": "25/09/2026",
    "transito_estructuracion": "320.000",
    "transito_diseno": "350.000",
    "geotecnia_notas": "Cambio de estructura de pavimento de TSD a MDC-19 por pendientes pronunciadas y tráfico pesado.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica (Licitación)",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + Base estabilizada 28 cm + Subrasante con cal 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base granular estabilizada", "tipo": "base", "material": "Base", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "cemento" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      },
      {
        "nombre": "Estructura Aprobada (MDC-19)",
        "tipo": "aprobada",
        "espesor_total_cm": 39.0,
        "descripcion": "MDC-19 (9 cm) + BGTC (30 cm) - Espesor total: 39 cm",
        "capas": [
          { "nombre": "Mezcla Densa en Caliente (MDC-19)", "tipo": "rodadura", "material": "MDC-19", "espesor_cm": 9.0, "espesor_display": "9 cm", "color": "#111827", "textura": "asfalto_pesado" },
          { "nombre": "Base Granular Tratada con Cemento (BGTC)", "tipo": "base", "material": "BGTC", "espesor_cm": 30.0, "espesor_display": "30 cm", "color": "#D97706", "textura": "cemento" }
        ]
      }
    ],
    "actividades_presupuesto": [
      { "actividad": "Construcción alcantarilla", "contractual_val": 110000000, "contractual_pct": 11.3, "proyectado_val": 135000000, "proyectado_pct": 11.3, "variacion_val": 25000000, "variacion_pct": 22.7, "tipo": "adicion" },
      { "actividad": "Construcción cuneta", "contractual_val": 180000000, "contractual_pct": 18.6, "proyectado_val": 210000000, "proyectado_pct": 17.5, "variacion_val": 30000000, "variacion_pct": 16.7, "tipo": "adicion" },
      { "actividad": "Estabilización y MDC", "contractual_val": 550000000, "contractual_pct": 56.7, "proyectado_val": 710000000, "proyectado_pct": 59.3, "variacion_val": 160000000, "variacion_pct": 29.1, "tipo": "adicion" },
      { "actividad": "Señalización", "contractual_val": 25000000, "contractual_pct": 2.6, "proyectado_val": 33000000, "proyectado_pct": 2.8, "variacion_val": 8000000, "variacion_pct": 32.0, "tipo": "adicion" }
    ],
    "actividades_ejecucion": [
      { "actividad": "Alcantarillas", "unidad": "und", "presupuestada": 4, "real": 4, "ejec_anterior": 1, "ejec_actual": 1, "delta_semana": 0, "pct": 25.0 },
      { "actividad": "Cunetas", "unidad": "ml", "presupuestada": 1000, "real": 1000, "ejec_anterior": 50, "ejec_actual": 50, "delta_semana": 0, "pct": 5.0 },
      { "actividad": "Estabilización", "unidad": "m²", "presupuestada": 5000, "real": 4050, "ejec_anterior": 200, "ejec_actual": 200, "delta_semana": 0, "pct": 4.9 }
    ],
    "avance_abscisas": {
      "abscisas": ["K0", "K0+500", "K0+810", "K1+000"],
      "longitud_m": 1000,
      "campo": { "topografia_pct": 100.0, "apiques_pct": 100.0 },
      "estructura": { "rodadura_pct": 0.0, "capa_granular_pct": 5.0, "subrasante_pct": 5.0 },
      "drenaje": { "cunetas_pct": 5.0, "filtros_pct": 0.0, "alcantarillas_pct": 25.0 },
      "tramos": [
        { "km_inicio": 0, "km_fin": 1.0, "tipo": "Topografía y replanteo", "estado": "ejecutado", "color": "#10B981" },
        { "km_inicio": 0, "km_fin": 0.05, "tipo": "Fresado y conformación", "estado": "ejecutado", "color": "#3B82F6" }
      ]
    }
  },

  {
    "id": "E-14",
    "code": "E-14",
    "name": "El Botón – Paso Ancho – Frontino",
    "circuito": "Frontino - Nutibara",
    "subregion": "Occidente",
    "lote_id": 2,
    "lote_name": "Lote 2 – Subregión Occidente",
    "color": "#3B82F6",
    "longitud_contractual_km": 25.00,
    "longitud_probable_km": 14.87,
    "alcance_real_km": 14.87,
    "diferencia_km": 10.13,
    "cobertura_pct": 59.5,
    "valor_contractual": 24850000000,
    "valor_por_km_contractual": 994000000,
    "valor_proyectado": 41764705882,
    "valor_por_km_proyectado": 1670588235,
    "variacion_total": 16914705882,
    "variacion_pct": 68.1,
    "avance_fisico_pct": 16.50,
    "avance_financiero_pct": 18.25,
    "plazo_transcurrido_pct": 42.9,
    "plazo_dias": "138 de 322 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "02/04/2027",
    "fecha_corte": "25/09/2026",
    "transito_estructuracion": "310.000",
    "transito_diseno": "325.000",
    "geotecnia_notas": "Estructura aprobada contempla MGTC de 25 cm sobre subrasante estabilizada con cal de 20 cm, espesor total 45 cm.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + Subbase 13 cm + Subrasante estabilizada con cal 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base granular estabilizada", "tipo": "base", "material": "Base", "espesor_cm": 28.0, "espesor_display": "28 cm", "color": "#D97706", "textura": "cemento" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      },
      {
        "nombre": "Estructura Aprobada (MGTC)",
        "tipo": "aprobada",
        "espesor_total_cm": 45.0,
        "descripcion": "TSD + Estabilización con cemento (MGTC 25 cm) + Subrasante con cal 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Estabilización con cemento (MGTC)", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ],
    "actividades_presupuesto": [
      { "actividad": "Construcción alcantarilla", "contractual_val": 2450000000, "contractual_pct": 9.9, "proyectado_val": 3850000000, "proyectado_pct": 9.2, "variacion_val": 1400000000, "variacion_pct": 57.1, "tipo": "adicion" },
      { "actividad": "Construcción cuneta", "contractual_val": 4500000000, "contractual_pct": 18.1, "proyectado_val": 6200000000, "proyectado_pct": 14.8, "variacion_val": 1700000000, "variacion_pct": 37.8, "tipo": "adicion" },
      { "actividad": "Estabilización MGTC", "contractual_val": 13500000000, "contractual_pct": 54.3, "proyectado_val": 24500000000, "proyectado_pct": 58.7, "variacion_val": 11000000000, "variacion_pct": 81.5, "tipo": "adicion" },
      { "actividad": "Filtros y Drenaje", "contractual_val": 3800000000, "contractual_pct": 15.3, "proyectado_val": 6100000000, "proyectado_pct": 14.6, "variacion_val": 2300000000, "variacion_pct": 60.5, "tipo": "adicion" }
    ],
    "actividades_ejecucion": [
      { "actividad": "Alcantarillas", "unidad": "und", "presupuestada": 60, "real": 72, "ejec_anterior": 18, "ejec_actual": 20, "delta_semana": 2, "pct": 27.8 },
      { "actividad": "Cunetas", "unidad": "ml", "presupuestada": 25000, "real": 25000, "ejec_anterior": 3500, "ejec_actual": 4200, "delta_semana": 700, "pct": 16.8 },
      { "actividad": "Estabilización", "unidad": "m²", "presupuestada": 125000, "real": 85000, "ejec_anterior": 14000, "ejec_actual": 16500, "delta_semana": 2500, "pct": 19.4 }
    ],
    "avance_abscisas": {
      "abscisas": ["K0", "K3", "K6", "K9", "K12", "K15", "K18", "K21", "K25"],
      "longitud_m": 25000,
      "campo": { "topografia_pct": 85.0, "apiques_pct": 95.0 },
      "estructura": { "rodadura_pct": 5.0, "capa_granular_pct": 19.4, "subrasante_pct": 22.0 },
      "drenaje": { "cunetas_pct": 16.8, "filtros_pct": 18.0, "alcantarillas_pct": 27.8 },
      "tramos": [
        { "km_inicio": 0, "km_fin": 4.2, "tipo": "Base estabilizada y cunetas", "estado": "ejecutado", "color": "#10B981" },
        { "km_inicio": 4.2, "km_fin": 8.5, "tipo": "Subrasante con cal", "estado": "ejecutado", "color": "#F59E0B" }
      ]
    }
  },

  {
    "id": "E-12",
    "code": "E-12",
    "name": "Ebéjico – Heliconia – Medellín",
    "circuito": "Ebéjico - Heliconia - Medellin",
    "subregion": "Occidente",
    "lote_id": 2,
    "lote_name": "Lote 2 – Subregión Occidente",
    "color": "#3B82F6",
    "longitud_contractual_km": 28.76,
    "longitud_probable_km": 17.95,
    "alcance_real_km": 17.95,
    "diferencia_km": 10.81,
    "cobertura_pct": 62.4,
    "valor_contractual": 28320000000,
    "valor_por_km_contractual": 984700974,
    "valor_proyectado": 44135000000,
    "valor_por_km_proyectado": 1534596662,
    "variacion_total": 15815000000,
    "variacion_pct": 55.8,
    "avance_fisico_pct": 13.50,
    "avance_financiero_pct": 14.74,
    "plazo_transcurrido_pct": 42.9,
    "plazo_dias": "138 de 322 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "02/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor montañoso con topografía quebrada que conecta con el Valle de Aburrá.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (Occidente)",
        "tipo": "aprobada",
        "espesor_total_cm": 45.0,
        "descripcion": "TSD + MGTC (25 cm) + Subrasante tratada con cal (20 cm)",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-13",
    "code": "E-13",
    "name": "Sopetrán – Horizontes – Belmira",
    "circuito": "Sopetrán - Horizontes - Belmira",
    "subregion": "Occidente",
    "lote_id": 2,
    "lote_name": "Lote 2 – Subregión Occidente",
    "color": "#3B82F6",
    "longitud_contractual_km": 35.19,
    "longitud_probable_km": 25.30,
    "alcance_real_km": 25.30,
    "diferencia_km": 9.89,
    "cobertura_pct": 71.9,
    "valor_contractual": 35185000000,
    "valor_por_km_contractual": 999857914,
    "valor_proyectado": 53868000000,
    "valor_por_km_proyectado": 1530775789,
    "variacion_total": 18683000000,
    "variacion_pct": 53.1,
    "avance_fisico_pct": 12.00,
    "avance_financiero_pct": 14.00,
    "plazo_transcurrido_pct": 42.9,
    "plazo_dias": "138 de 322 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "02/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Paso de cordillera con fuerte gradiente altitudinal entre Sopetrán (valle cálido del Cauca) y Belmira (páramo).",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (Optimizado 33 cm máx)",
        "tipo": "aprobada",
        "espesor_total_cm": 33.0,
        "descripcion": "TSD + MGTC estabilizado 33 cm máx",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base estabilizada", "tipo": "base", "material": "MGTC", "espesor_cm": 33.0, "espesor_display": "33 cm", "color": "#D97706", "textura": "mgtc" }
        ]
      }
    ]
  },

  // --- LOTE 3: URABÁ ---
  {
    "id": "E-25",
    "code": "E-25",
    "name": "San Pedro de Urabá – Necoclí",
    "circuito": "San Pedro de Urabá - Necoclí",
    "subregion": "Urabá",
    "lote_id": 3,
    "lote_name": "Lote 3 – Subregión Urabá",
    "color": "#06B6D4",
    "longitud_contractual_km": 58.65,
    "longitud_probable_km": 39.99,
    "alcance_real_km": 39.99,
    "diferencia_km": 18.66,
    "cobertura_pct": 68.2,
    "valor_contractual": 63654400000,
    "valor_por_km_contractual": 1085326513,
    "valor_proyectado": 93334897360,
    "valor_por_km_proyectado": 1591387849,
    "variacion_total": 29680497360,
    "variacion_pct": 46.6,
    "avance_fisico_pct": 5.80,
    "avance_financiero_pct": 6.65,
    "plazo_transcurrido_pct": 44.0,
    "plazo_dias": "142 de 323 días",
    "fecha_inicio": "10/05/2026",
    "fecha_terminacion": "29/03/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Suelos arcillosos expansivos de la llanura de Urabá requirieron refuerzo de estructura aprobada a 60 cm.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (Reforzada Urabá)",
        "tipo": "aprobada",
        "espesor_total_cm": 60.0,
        "descripcion": "TSD + MGTC 35 cm + Subrasante con cal 25 cm (Total 60 cm)",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base cementada", "tipo": "base", "material": "MGTC", "espesor_cm": 35.0, "espesor_display": "35 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-24",
    "code": "E-24",
    "name": "Mutatá – Pavarandó",
    "circuito": "Mutata - Pavarando",
    "subregion": "Urabá",
    "lote_id": 3,
    "lote_name": "Lote 3 – Subregión Urabá",
    "color": "#06B6D4",
    "longitud_contractual_km": 10.00,
    "longitud_probable_km": 10.00,
    "alcance_real_km": 10.00,
    "diferencia_km": 0.00,
    "cobertura_pct": 100.0,
    "valor_contractual": 10210000000,
    "valor_por_km_contractual": 1021000000,
    "valor_proyectado": 10257000000,
    "valor_por_km_proyectado": 1025700000,
    "variacion_total": 47000000,
    "variacion_pct": 0.5,
    "avance_fisico_pct": 38.00,
    "avance_financiero_pct": 39.53,
    "plazo_transcurrido_pct": 44.0,
    "plazo_dias": "142 de 323 días",
    "fecha_inicio": "10/05/2026",
    "fecha_terminacion": "29/03/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor con ejecución sobresaliente y alcance completo asegurado al 100%.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (50 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 50.0,
        "descripcion": "TSD + MGTC 25 cm + Subrasante tratada 25 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-27",
    "code": "E-27",
    "name": "El Tres – San Pedro de Urabá",
    "circuito": "San Pedro - El Tres - Turbo",
    "subregion": "Urabá",
    "lote_id": 3,
    "lote_name": "Lote 3 – Subregión Urabá",
    "color": "#06B6D4",
    "longitud_contractual_km": 22.00,
    "longitud_probable_km": 15.00,
    "alcance_real_km": 15.00,
    "diferencia_km": 7.00,
    "cobertura_pct": 68.2,
    "valor_contractual": 19705595596,
    "valor_por_km_contractual": 895708891,
    "valor_proyectado": 28901540209,
    "valor_por_km_proyectado": 1313706373,
    "variacion_total": 9195944613,
    "variacion_pct": 46.7,
    "avance_fisico_pct": 4.80,
    "avance_financiero_pct": 5.04,
    "plazo_transcurrido_pct": 44.0,
    "plazo_dias": "142 de 323 días",
    "fecha_inicio": "10/05/2026",
    "fecha_terminacion": "29/03/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura teórica de 47 cm con subbase de 17 cm.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica",
        "tipo": "teorica",
        "espesor_total_cm": 47.0,
        "descripcion": "TSD + MGTC 20 cm + Subbase 17 cm + Subrasante 10 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subbase", "tipo": "subbase", "material": "Granular", "espesor_cm": 17.0, "espesor_display": "17 cm", "color": "#78350F", "textura": "grava" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 10.0, "espesor_display": "10 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-26",
    "code": "E-26",
    "name": "Arboletes – San Pedro de Urabá",
    "circuito": "San Pedro de Urabá - Arboletes",
    "subregion": "Urabá",
    "lote_id": 3,
    "lote_name": "Lote 3 – Subregión Urabá",
    "color": "#06B6D4",
    "longitud_contractual_km": 30.00,
    "longitud_probable_km": 21.60,
    "alcance_real_km": 21.60,
    "diferencia_km": 8.40,
    "cobertura_pct": 72.0,
    "valor_contractual": 37566174247,
    "valor_por_km_contractual": 1252205808,
    "valor_proyectado": 52163722218,
    "valor_por_km_proyectado": 1738790741,
    "variacion_total": 14597547971,
    "variacion_pct": 38.9,
    "avance_fisico_pct": 0.02,
    "avance_financiero_pct": 0.02,
    "plazo_transcurrido_pct": 44.0,
    "plazo_dias": "142 de 323 días",
    "fecha_inicio": "10/05/2026",
    "fecha_terminacion": "29/03/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor que conecta con el litoral Caribe en Arboletes.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + MGTC 20 cm + Subbase 15 cm + Subrasante cal 13 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base", "tipo": "base", "material": "MGTC", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subbase", "tipo": "subbase", "material": "Granular", "espesor_cm": 15.0, "espesor_display": "15 cm", "color": "#78350F", "textura": "grava" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 13.0, "espesor_display": "13 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  // --- LOTE 4: MAGDALENA MEDIO ---
  {
    "id": "E-6",
    "code": "E-6",
    "name": "Remedios – La Y de la Virgen – Puerto Berrío",
    "circuito": "Remedios - La Y De La Virgen - Puerto Berrío",
    "subregion": "Magdalena Medio",
    "lote_id": 4,
    "lote_name": "Lote 4 – Subregión Magdalena Medio",
    "color": "#F59E0B",
    "longitud_contractual_km": 25.00,
    "longitud_probable_km": 15.47,
    "alcance_real_km": 25.00,
    "diferencia_km": 0.00,
    "cobertura_pct": 61.9,
    "valor_contractual": 24350762146,
    "valor_por_km_contractual": 974030486,
    "valor_proyectado": 39350762146,
    "valor_por_km_proyectado": 1574030486,
    "variacion_total": 15000000000,
    "variacion_pct": 61.6,
    "avance_fisico_pct": 3.50,
    "avance_financiero_pct": 3.97,
    "plazo_transcurrido_pct": 42.9,
    "plazo_dias": "138 de 322 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "02/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura aprobada optimiza a 40 cm de MGTC puro para altas cargas de la troncal del Magdalena.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (40 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 40.0,
        "descripcion": "TSD + MGTC 40 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base estabilizada", "tipo": "base", "material": "MGTC", "espesor_cm": 40.0, "espesor_display": "40 cm", "color": "#D97706", "textura": "mgtc" }
        ]
      }
    ]
  },

  {
    "id": "E-2",
    "code": "E-2",
    "name": "La Ye – Yondó",
    "circuito": "La Ye - Yondó",
    "subregion": "Magdalena Medio",
    "lote_id": 4,
    "lote_name": "Lote 4 – Subregión Magdalena Medio",
    "color": "#F59E0B",
    "longitud_contractual_km": 30.00,
    "longitud_probable_km": 17.29,
    "alcance_real_km": 17.29,
    "diferencia_km": 12.71,
    "cobertura_pct": 57.6,
    "valor_contractual": 27220900460,
    "valor_por_km_contractual": 907363349,
    "valor_proyectado": 47220914575,
    "valor_por_km_proyectado": 1574030486,
    "variacion_total": 20000014115,
    "variacion_pct": 73.5,
    "avance_fisico_pct": 1.20,
    "avance_financiero_pct": 1.50,
    "plazo_transcurrido_pct": 42.9,
    "plazo_dias": "138 de 322 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "02/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor petrolero con alto flujo de tractomulas y maquinaria pesada.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Magdalena Medio",
        "tipo": "teorica",
        "espesor_total_cm": 45.0,
        "descripcion": "TSD + MGTC 25 cm + Subrasante mejorada 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante tratada", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  // --- LOTE 5: SUROESTE ---
  {
    "id": "E-21",
    "code": "E-21",
    "name": "Salgar – La Cámara – La Quiebra",
    "circuito": "Salgar - La Quiebra - Concordia",
    "subregion": "Suroeste",
    "lote_id": 5,
    "lote_name": "Lote 5 – Subregión Suroeste",
    "color": "#8B5CF6",
    "longitud_contractual_km": 15.93,
    "longitud_probable_km": 11.42,
    "alcance_real_km": 11.42,
    "diferencia_km": 4.51,
    "cobertura_pct": 71.7,
    "valor_contractual": 15355866287,
    "valor_por_km_contractual": 963958963,
    "valor_proyectado": 21422206991,
    "valor_por_km_proyectado": 1344771311,
    "variacion_total": 6066340704,
    "variacion_pct": 39.5,
    "avance_fisico_pct": 18.20,
    "avance_financiero_pct": 20.10,
    "plazo_transcurrido_pct": 65.5,
    "plazo_dias": "211 de 322 días",
    "fecha_inicio": "01/03/2026",
    "fecha_terminacion": "18/01/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor cafetero de alta pendiente y fallas geológicas activas.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + BGTC 20 cm + Subbase 18 cm + Subrasante con cal 10 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "BGTC", "tipo": "base", "material": "BGTC", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#D97706", "textura": "cemento" },
          { "nombre": "Subbase granular", "tipo": "subbase", "material": "Granular", "espesor_cm": 18.0, "espesor_display": "18 cm", "color": "#78350F", "textura": "grava" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 10.0, "espesor_display": "10 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-22",
    "code": "E-22",
    "name": "Valparaíso – Támesis",
    "circuito": "Valparaíso - Támesis",
    "subregion": "Suroeste",
    "lote_id": 5,
    "lote_name": "Lote 5 – Subregión Suroeste",
    "color": "#8B5CF6",
    "longitud_contractual_km": 22.51,
    "longitud_probable_km": 14.90,
    "alcance_real_km": 14.90,
    "diferencia_km": 7.61,
    "cobertura_pct": 66.2,
    "valor_contractual": 22410613443,
    "valor_por_km_contractual": 995584782,
    "valor_proyectado": 33846463073,
    "valor_por_km_proyectado": 1503618973,
    "variacion_total": 11435849630,
    "variacion_pct": 51.0,
    "avance_fisico_pct": 22.10,
    "avance_financiero_pct": 24.30,
    "plazo_transcurrido_pct": 65.5,
    "plazo_dias": "211 de 322 días",
    "fecha_inicio": "01/03/2026",
    "fecha_terminacion": "18/01/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura aprobada optimizada a 42 cm sobre subbase seleccionada.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (42 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 42.0,
        "descripcion": "TSD + BGTC 24 cm + Subbase 18 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "BGTC base", "tipo": "base", "material": "BGTC", "espesor_cm": 24.0, "espesor_display": "24 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subbase", "tipo": "subbase", "material": "Granular", "espesor_cm": 18.0, "espesor_display": "18 cm", "color": "#78350F", "textura": "grava" }
        ]
      }
    ]
  },

  {
    "id": "E-23",
    "code": "E-23",
    "name": "Pueblorrico – San José – Ye a la Bodega – La Bodega (Andes)",
    "circuito": "Andes - San José - Pueblo Rico",
    "subregion": "Suroeste",
    "lote_id": 5,
    "lote_name": "Lote 5 – Subregión Suroeste",
    "color": "#8B5CF6",
    "longitud_contractual_km": 22.39,
    "longitud_probable_km": 13.28,
    "alcance_real_km": 13.28,
    "diferencia_km": 9.11,
    "cobertura_pct": 59.3,
    "valor_contractual": 21523152051,
    "valor_por_km_contractual": 961284147,
    "valor_proyectado": 36283877531,
    "valor_por_km_proyectado": 1620539416,
    "variacion_total": 14760725480,
    "variacion_pct": 68.6,
    "avance_fisico_pct": 15.40,
    "avance_financiero_pct": 17.16,
    "plazo_transcurrido_pct": 69.8,
    "plazo_dias": "225 de 322 días",
    "fecha_inicio": "18/02/2026",
    "fecha_terminacion": "06/01/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura aprobada optimizada a 34 cm sobre subbase compactada.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (34 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 34.0,
        "descripcion": "TSD + BGTC 18 cm + Subbase 16 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "BGTC", "tipo": "base", "material": "BGTC", "espesor_cm": 18.0, "espesor_display": "18 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subbase", "tipo": "subbase", "material": "Granular", "espesor_cm": 16.0, "espesor_display": "16 cm", "color": "#78350F", "textura": "grava" }
        ]
      }
    ]
  },

  {
    "id": "E-20",
    "code": "E-20",
    "name": "Titiribí – Armenia",
    "circuito": "Titiribi - Armenia",
    "subregion": "Suroeste",
    "lote_id": 5,
    "lote_name": "Lote 5 – Subregión Suroeste",
    "color": "#8B5CF6",
    "longitud_contractual_km": 5.00,
    "longitud_probable_km": 3.72,
    "alcance_real_km": 3.72,
    "diferencia_km": 1.28,
    "cobertura_pct": 74.5,
    "valor_contractual": 5604544419,
    "valor_por_km_contractual": 1120908884,
    "valor_proyectado": 7525279270,
    "valor_por_km_proyectado": 1505055854,
    "variacion_total": 1920734851,
    "variacion_pct": 34.3,
    "avance_fisico_pct": 25.00,
    "avance_financiero_pct": 27.50,
    "plazo_transcurrido_pct": 65.5,
    "plazo_dias": "211 de 322 días",
    "fecha_inicio": "01/03/2026",
    "fecha_terminacion": "18/01/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Conexión carbonífera y agrícola del Suroeste cercano.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Suroeste",
        "tipo": "teorica",
        "espesor_total_cm": 42.0,
        "descripcion": "TSD + BGTC 22 cm + Subbase 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "BGTC", "tipo": "base", "material": "BGTC", "espesor_cm": 22.0, "espesor_display": "22 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subbase", "tipo": "subbase", "material": "Granular", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#78350F", "textura": "grava" }
        ]
      }
    ]
  },

  // --- LOTE 6: NORDESTE ---
  {
    "id": "E-3",
    "code": "E-3",
    "name": "Caramanta – Cristales – San Roque",
    "circuito": "Caramanta - Cristales - San Roque",
    "subregion": "Nordeste",
    "lote_id": 6,
    "lote_name": "Lote 6 – Subregión Nordeste",
    "color": "#EC4899",
    "longitud_contractual_km": 20.64,
    "longitud_probable_km": 11.81,
    "alcance_real_km": 11.81,
    "diferencia_km": 8.83,
    "cobertura_pct": 57.2,
    "valor_contractual": 20089310229,
    "valor_por_km_contractual": 973319294,
    "valor_proyectado": 35101892203,
    "valor_por_km_proyectado": 1700673072,
    "variacion_total": 15012581974,
    "variacion_pct": 74.7,
    "avance_fisico_pct": 0.00,
    "avance_financiero_pct": 0.00,
    "plazo_transcurrido_pct": 59.5,
    "plazo_dias": "192 de 323 días",
    "fecha_inicio": "20/03/2026",
    "fecha_terminacion": "06/02/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura aprobada reforzada a 60 cm para mitigar arcillas expansivas del sector.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (Reforzada 60 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 60.0,
        "descripcion": "TSD + MGTC 35 cm + Subrasante tratada 25 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base", "tipo": "base", "material": "MGTC", "espesor_cm": 35.0, "espesor_display": "35 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante", "tipo": "subrasante", "material": "Cal", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-4-Nordeste",
    "code": "E-4",
    "name": "San Rafael – San Roque – Santo Domingo – Alejandría (Nordeste)",
    "circuito": "San Rafael - San Roque - Santo Domingo - Alejandría",
    "subregion": "Nordeste",
    "lote_id": 6,
    "lote_name": "Lote 6 – Subregión Nordeste",
    "color": "#EC4899",
    "longitud_contractual_km": 23.46,
    "longitud_probable_km": 13.13,
    "alcance_real_km": 13.13,
    "diferencia_km": 10.33,
    "cobertura_pct": 56.0,
    "valor_contractual": 22800240399,
    "valor_por_km_contractual": 971877255,
    "valor_proyectado": 40742264763,
    "valor_por_km_proyectado": 1736669427,
    "variacion_total": 17942024364,
    "variacion_pct": 78.7,
    "avance_fisico_pct": 0.00,
    "avance_financiero_pct": 0.00,
    "plazo_transcurrido_pct": 59.5,
    "plazo_dias": "192 de 323 días",
    "fecha_inicio": "20/03/2026",
    "fecha_terminacion": "06/02/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor regional que conecta las cuencas de los ríos Nus y San Rafael.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + MGTC 20 cm + Subbase 14 cm + Subrasante con cal 14 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subbase", "tipo": "subbase", "material": "Granular", "espesor_cm": 14.0, "espesor_display": "14 cm", "color": "#78350F", "textura": "grava" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 14.0, "espesor_display": "14 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-5",
    "code": "E-5",
    "name": "Amalfi – Portachuelos – Santa Isabel",
    "circuito": "Amalfi - Portachuelos - Santa Isabel",
    "subregion": "Nordeste",
    "lote_id": 6,
    "lote_name": "Lote 6 – Subregión Nordeste",
    "color": "#EC4899",
    "longitud_contractual_km": 10.00,
    "longitud_probable_km": 5.80,
    "alcance_real_km": 5.80,
    "diferencia_km": 4.20,
    "cobertura_pct": 58.0,
    "valor_contractual": 9579896193,
    "valor_por_km_contractual": 957989619,
    "valor_proyectado": 16516443629,
    "valor_por_km_proyectado": 1651644363,
    "variacion_total": 6936547436,
    "variacion_pct": 72.4,
    "avance_fisico_pct": 0.00,
    "avance_financiero_pct": 0.00,
    "plazo_transcurrido_pct": 59.5,
    "plazo_dias": "192 de 323 días",
    "fecha_inicio": "20/03/2026",
    "fecha_terminacion": "06/02/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor minero y ganadero del Nordeste antioqueño.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Teórica",
        "tipo": "teorica",
        "espesor_total_cm": 48.0,
        "descripcion": "TSD + MGTC 20 cm + Subbase 14 cm + Subrasante con cal 14 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base", "tipo": "base", "material": "MGTC", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subbase", "tipo": "subbase", "material": "Granular", "espesor_cm": 14.0, "espesor_display": "14 cm", "color": "#78350F", "textura": "grava" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 14.0, "espesor_display": "14 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  // --- LOTE 7: BAJO CAUCA ---
  {
    "id": "E-1",
    "code": "E-1",
    "name": "Cáceres – El Tigre – Alto de Tamaná – La Chilona",
    "circuito": "Cáceres - La Chilona",
    "subregion": "Bajo Cauca",
    "lote_id": 7,
    "lote_name": "Lote 7 – Subregión Bajo Cauca",
    "color": "#14B8A6",
    "longitud_contractual_km": 25.00,
    "longitud_probable_km": 17.87,
    "alcance_real_km": 17.87,
    "diferencia_km": 7.13,
    "cobertura_pct": 71.5,
    "valor_contractual": 24388547552,
    "valor_por_km_contractual": 975541902,
    "valor_proyectado": 34126406645,
    "valor_por_km_proyectado": 1365056266,
    "variacion_total": 9737859093,
    "variacion_pct": 39.9,
    "avance_fisico_pct": 15.20,
    "avance_financiero_pct": 17.16,
    "plazo_transcurrido_pct": 69.8,
    "plazo_dias": "225 de 322 días",
    "fecha_inicio": "18/02/2026",
    "fecha_terminacion": "06/01/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura aprobada contempla MGTC sobre afirmado existente de 36 cm para la cuenca aluvial del Cauca.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (36 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 36.0,
        "descripcion": "TSD + MGTC 20 cm + Afirmado aluvial existente 16 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base estabilizada", "tipo": "base", "material": "MGTC", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Afirmado de soporte", "tipo": "subbase", "material": "Afirmado", "espesor_cm": 16.0, "espesor_display": "16 cm", "color": "#78350F", "textura": "grava" }
        ]
      }
    ]
  },

  // --- LOTE 8: NORTE ---
  {
    "id": "E-10",
    "code": "E-10",
    "name": "Santa Rosa – Carolina del Príncipe",
    "circuito": "Santa Rosa - Carolina del Príncipe",
    "subregion": "Norte",
    "lote_id": 8,
    "lote_name": "Lote 8 – Subregión Norte",
    "color": "#6366F1",
    "longitud_contractual_km": 33.67,
    "longitud_probable_km": 23.82,
    "alcance_real_km": 23.82,
    "diferencia_km": 9.85,
    "cobertura_pct": 70.7,
    "valor_contractual": 32607964751,
    "valor_por_km_contractual": 968457522,
    "valor_proyectado": 46089040662,
    "valor_por_km_proyectado": 1368845877,
    "variacion_total": 13481075911,
    "variacion_pct": 41.3,
    "avance_fisico_pct": 10.40,
    "avance_financiero_pct": 11.25,
    "plazo_transcurrido_pct": 42.7,
    "plazo_dias": "138 de 323 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "03/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura aprobada de 49 cm en zonas lecheras y turísticas del Norte.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (49 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 49.0,
        "descripcion": "TSD + Base MGTC 25 cm + Subrasante tratada con cal 24 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base cementada MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 24.0, "espesor_display": "24 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-11",
    "code": "E-11",
    "name": "Entrerríos – Labores – San José de la Montaña",
    "circuito": "Entrerríos - Labores - San José de la Montana",
    "subregion": "Norte",
    "lote_id": 8,
    "lote_name": "Lote 8 – Subregión Norte",
    "color": "#6366F1",
    "longitud_contractual_km": 39.95,
    "longitud_probable_km": 25.76,
    "alcance_real_km": 25.70,
    "diferencia_km": 14.25,
    "cobertura_pct": 64.5,
    "valor_contractual": 36281519666,
    "valor_por_km_contractual": 908173208,
    "valor_proyectado": 56270619599,
    "valor_por_km_proyectado": 1408526148,
    "variacion_total": 19989099933,
    "variacion_pct": 55.1,
    "avance_fisico_pct": 9.80,
    "avance_financiero_pct": 10.80,
    "plazo_transcurrido_pct": 42.7,
    "plazo_dias": "138 de 323 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "03/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Estructura aprobada de 43 cm con base MGTC de 23 cm y subrasante tratada con cal de 20 cm.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Aprobada (43 cm)",
        "tipo": "aprobada",
        "espesor_total_cm": 43.0,
        "descripcion": "TSD + Base MGTC 23 cm + Subrasante con cal 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "Base cementada MGTC", "tipo": "base", "material": "MGTC", "espesor_cm": 23.0, "espesor_display": "23 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-7",
    "code": "E-7",
    "name": "El Guayabo – El Salto – Partidas a Guadalupe",
    "circuito": "El Guayabo - El Salto - Partidas a Guadalupe",
    "subregion": "Norte",
    "lote_id": 8,
    "lote_name": "Lote 8 – Subregión Norte",
    "color": "#6366F1",
    "longitud_contractual_km": 10.61,
    "longitud_probable_km": 7.52,
    "alcance_real_km": 7.52,
    "diferencia_km": 3.09,
    "cobertura_pct": 70.9,
    "valor_contractual": 10454365274,
    "valor_por_km_contractual": 985331317,
    "valor_proyectado": 14751915178,
    "valor_por_km_proyectado": 1390378433,
    "variacion_total": 4297549904,
    "variacion_pct": 41.1,
    "avance_fisico_pct": 8.50,
    "avance_financiero_pct": 9.20,
    "plazo_transcurrido_pct": 42.7,
    "plazo_dias": "138 de 323 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "03/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Corredor hidroeléctrico y ganadero en el Norte de Antioquia.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Norte",
        "tipo": "teorica",
        "espesor_total_cm": 45.0,
        "descripcion": "TSD + Base MGTC 25 cm + Subrasante tratada 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-8",
    "code": "E-8",
    "name": "Carolina del Príncipe – Angostura",
    "circuito": "Carolina del Príncipe - Angostura",
    "subregion": "Norte",
    "lote_id": 8,
    "lote_name": "Lote 8 – Subregión Norte",
    "color": "#6366F1",
    "longitud_contractual_km": 13.62,
    "longitud_probable_km": 9.72,
    "alcance_real_km": 9.72,
    "diferencia_km": 3.90,
    "cobertura_pct": 71.3,
    "valor_contractual": 13507950916,
    "valor_por_km_contractual": 991773195,
    "valor_proyectado": 18936954262,
    "valor_por_km_proyectado": 1390378433,
    "variacion_total": 5429003346,
    "variacion_pct": 40.2,
    "avance_fisico_pct": 6.20,
    "avance_financiero_pct": 7.00,
    "plazo_transcurrido_pct": 42.7,
    "plazo_dias": "138 de 323 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "03/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Sector de alta pluviosidad con subrasantes limosas tratadas con cal.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Norte",
        "tipo": "teorica",
        "espesor_total_cm": 45.0,
        "descripcion": "TSD + Base MGTC 25 cm + Subrasante tratada 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  },

  {
    "id": "E-9",
    "code": "E-9",
    "name": "Alto del Cardal – Toledo",
    "circuito": "Alto del Cardal - Toledo",
    "subregion": "Norte",
    "lote_id": 8,
    "lote_name": "Lote 8 – Subregión Norte",
    "color": "#6366F1",
    "longitud_contractual_km": 15.00,
    "longitud_probable_km": 10.69,
    "alcance_real_km": 10.69,
    "diferencia_km": 4.31,
    "cobertura_pct": 71.2,
    "valor_contractual": 14858442789,
    "valor_por_km_contractual": 990562853,
    "valor_proyectado": 20855676500,
    "valor_por_km_proyectado": 1390378433,
    "variacion_total": 5997233711,
    "variacion_pct": 40.4,
    "avance_fisico_pct": 5.00,
    "avance_financiero_pct": 5.80,
    "plazo_transcurrido_pct": 42.7,
    "plazo_dias": "138 de 323 días",
    "fecha_inicio": "15/05/2026",
    "fecha_terminacion": "03/04/2027",
    "fecha_corte": "25/09/2026",
    "geotecnia_notas": "Acceso a la subcuenca del río San Andrés y Toledo.",
    "estructuras_pavimento": [
      {
        "nombre": "Estructura Estándar Norte",
        "tipo": "teorica",
        "espesor_total_cm": 45.0,
        "descripcion": "TSD + Base MGTC 25 cm + Subrasante tratada 20 cm",
        "capas": [
          { "nombre": "TSD", "tipo": "rodadura", "material": "TSD", "espesor_cm": 0.0, "espesor_display": "TSD", "color": "#1F2937", "textura": "asfalto" },
          { "nombre": "MGTC base", "tipo": "base", "material": "MGTC", "espesor_cm": 25.0, "espesor_display": "25 cm", "color": "#D97706", "textura": "mgtc" },
          { "nombre": "Subrasante con cal", "tipo": "subrasante", "material": "Cal", "espesor_cm": 20.0, "espesor_display": "20 cm", "color": "#92400E", "textura": "cal" }
        ]
      }
    ]
  }
];
'@

$all29Json | Set-Content -Encoding UTF8 "data/estabilizacion_corredores.js"
Write-Host "Created data/estabilizacion_corredores.js"
