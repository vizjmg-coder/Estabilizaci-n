# Centro de Control Territorial — Red Vial Secundaria
## Gobernación de Antioquia • República de Colombia

Aplicación web interactiva, moderna e institucional para el seguimiento, monitoreo y visualización territorial de la intervención de **634,43 km de la Red Vial Secundaria de Antioquia**, distribuidos en **29 circuitos viales** a lo largo de las **9 subregiones del departamento**.

---

## 🏛️ Identidad y Propósito

Diseñada con la identidad visual oficial de la **Gobernación de Antioquia** (`#095642` Verde Antioquia, acentos dorados `#D4AF37` y superficies limpias), esta plataforma actúa como un **Centro de Monitoreo Territorial** para la toma de decisiones estratégicas, rendición de cuentas e información ciudadana.

---

## 🚀 Características Principales

1. **Geovisor Territorial Interactivo (Leaflet + GeoJSON)**:
   - Capa de **125 Municipios** de Antioquia con delimitaciones territoriales, coropletas por subregión y cálculo de corredores conectados.
   - Capa de **Red Vial Secundaria** con trazados oficiales.
   - Capa destacada de **Intervenciones Priorizadas (634 km)** con resaltado dinámico, hover con brillo y click para inspección.
   - Conmutador de vistas: *General*, *Subregional*, *Red Vial*, *Intervenciones*.
   - Control de capas activables en tiempo real.

2. **Panel de Indicadores Clave (KPIs Dinámicos)**:
   - **KM de Intervención**: Recalculado dinámicamente según filtros (Total: 634,43 km).
   - **Circuitos Viales**: Cantidad de corredores activos (Total: 29).
   - **Subregiones**: Subregiones involucradas (8 de 9).
   - **Municipios Conectados**: Cantidad de municipios con intervención directa (64 municipios).
   - **Cobertura Territorial**: Porcentaje de municipios cubiertos (51,2%).

3. **Analítica Visual Territorial**:
   - **Gráfico de Barras Horizontales**: Kilómetros por subregión ordenados de mayor a menor con filtrado bidireccional interactivo al hacer clic.
   - **Gráfico Donut de Distribución Territorial**: Participación porcentual por territorio.
   - **Ranking Top Corredores**: Los 8 principales circuitos por longitud con enlace directo de localización en el mapa.
   - **Gauge Circular de Alcance Territorial**: Cobertura municipal en tiempo real.

4. **Interacción y Filtrado Territorial**:
   - Barra de píldoras rápidas por subregión (*Urabá, Norte, Oriente, Occidente, Suroeste, Magdalena Medio, Nordeste, Bajo Cauca*).
   - Filtros desplegables encadenados (*Subregión*, *Municipio*, *Circuito*).
   - Buscador predictivo global en tiempo real.
   - Botón de restablecimiento de vista y filtros (*Limpiar*).

5. **Listado Maestro y Panel Lateral (Drawer)**:
   - Tabla interactiva con paginación, ordenamiento y etiquetas contextuales de corredores inter-subregionales.
   - Panel lateral deslizable (*Slide-Over Drawer*) con desglose kilométrico por subregión, etiquetas de municipios y botón de enfoque cartográfico.
   - Modal de detalle por municipio con listado de corredores asociados.

6. **Herramientas de Gestión Pública**:
   - **Modo Presentación**: Vista optimizada para salas de crisis y juntas de gobierno.
   - **Exportación a CSV**: Descarga inmediata de los datos filtrados en formato estándar.

---

## 📂 Estructura del Proyecto

```
├── index.html                    # Estructura principal y layout 16:9
├── README.md                     # Documentación general
├── css/
│   ├── main.css                  # Sistema de diseño, tokens institucionales y layout
│   ├── map.css                   # Estilos cartográficos, popups y controles
│   └── components.css           # Estilos de KPIs, gráficos, tablas y drawer
├── js/
│   ├── config.js                 # Constantes geográficas y paleta de subregiones
│   ├── dataProcessor.js          # Ingesta, normalización y cálculo dinámico de métricas
│   ├── mapController.js          # Control de capas GeoJSON, simbología y zooms
│   ├── chartController.js        # Renderizado de gráficos y rankings
│   ├── uiController.js           # Gestión de KPIs, tablas, drawer, modal y toasts
│   ├── exportController.js       # Exportación CSV y captura de pantalla
│   └── app.js                    # Orquestador principal de eventos
├── Data/
│   ├── C_Estabilizacion_633km_subregion_tabla.xlsx  # Fuente Excel original
│   ├── Municipios.geojson                           # Geometría de municipios original
│   ├── Secundaria.geojson                           # Geometría de vías original
│   ├── data_normalized.json                         # Dataset normalizado
│   ├── Municipios_opt.geojson                       # GeoJSON de municipios optimizado
│   └── Secundaria_opt.geojson                       # GeoJSON de vías optimizado
```

---

## 💻 Instrucciones para Ejecutar Localmente

Para abrir el dashboard en cualquier navegador moderno:

```powershell
# En la carpeta raíz del proyecto, iniciar un servidor HTTP local:
python -m http.server 8080
```

Abrir en el navegador:
`http://localhost:8080`
