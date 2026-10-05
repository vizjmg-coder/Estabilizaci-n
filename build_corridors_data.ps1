[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Assembling full database with 29 corridors and pavement structures..."

$corredoresList = @(
  # LOTE 1 - ORIENTE
  @{
    id = "E-18"
    code = "E-18"
    name = "Abejorral – Santa Bárbara – El Cairo – La Elvira"
    circuito = "Abejorral - Santa Barbara"
    subregion = "Oriente"
    lote_id = 1
    lote_name = "Lote 1 – Subregión Oriente"
    color = "#10B981"
    longitud_contractual_km = 23.77
    longitud_probable_km = 9.72
    alcance_real_km = 16.87
    diferencia_km = 6.90
    cobertura_pct = 40.9
    valor_contractual = 19969185040
    valor_por_km_contractual = 840100338
    valor_proyectado = 48829785964
    valor_por_km_proyectado = 2054261084
    variacion_total = 28860600924
    variacion_pct = 144.5
    avance_fisico_pct = 2.58
    avance_financiero_pct = 3.40
    plazo_transcurrido_pct = 38.1
    plazo_dias = "123 de 323 días (4 de 10,6 meses)"
    fecha_inicio = "01/06/2026"
    fecha_terminacion = "20/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 307000
    transito_diseno = 311553
    geotecnia_notas = "Se tiene cuatro estructuras aprobadas para diferentes tramos, de acuerdo con CBR encontrados (1,2 – 38,6) y pendientes longitudinales de la vía; en zonas de altas pendientes (>8%) se utiliza MDC-19 para la carpeta."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica Contractual"
        tipo = "teorica"
        espesor_total_cm = 48.0
        cbr = "CBR Diseño inicial"
        descripcion = "Diseño licitatorio preliminar con estabilización con cal y cemento"
        capas = @(
          @{ nombre = "Tratamiento Superficial Doble (TSD)"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Estabilización con cemento (Subbase 13 cm)"; tipo = "base"; material = "Cemento"; espesor_cm = 28.0; espesor_display = "28 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subrasante estabilizada con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada (MDC-19 · Pendientes > 8%)"
        tipo = "aprobada_mdc"
        espesor_total_cm = 52.5
        cbr = "CBR 1.2 – 38.6"
        descripcion = "Carpeta asfáltica MDC-19 en caliente para sectores escarpados (>8%) y tránsito pesado"
        capas = @(
          @{ nombre = "Mezcla Densa en Caliente (MDC-19)"; tipo = "rodadura"; material = "MDC-19"; espesor_cm = 7.5; espesor_display = "7,5 cm"; color = "#111827"; textura = "asfalto_pesado" },
          @{ nombre = "Estabilización con cemento (MGTC)"; tipo = "base"; material = "MGTC"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#B45309"; textura = "mgtc" },
          @{ nombre = "Afirmado de soporte"; tipo = "subbase"; material = "Afirmado"; espesor_cm = 25.0; espesor_display = "25 cm"; color = "#78350F"; textura = "grava" }
        )
      },
      @{
        nombre = "Estructura Aprobada (TSD · Pendientes Normales)"
        tipo = "aprobada_tsd"
        espesor_total_cm = 64.0
        cbr = "CBR 1.2 – 38.6"
        descripcion = "Tratamiento superficial doble con base cementada MGTC de 39 cm y afirmado"
        capas = @(
          @{ nombre = "Tratamiento Superficial Doble (TSD)"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Estabilización con cemento (MGTC)"; tipo = "base"; material = "MGTC"; espesor_cm = 39.0; espesor_display = "39 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Afirmado granular"; tipo = "subbase"; material = "Afirmado"; espesor_cm = 25.0; espesor_display = "25 cm"; color = "#78350F"; textura = "grava" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 349118827; contractual_pct = 1.7; proyectado_val = 4569689585; proyectado_pct = 9.4; variacion_val = 4220570758; variacion_pct = 1208.9; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 3962861757; contractual_pct = 19.8; proyectado_val = 5209150329; proyectado_pct = 10.7; variacion_val = 1246288572; variacion_pct = 31.4; tipo = "adicion" },
      @{ actividad = "Construcción filtro"; contractual_val = 4154277100; contractual_pct = 20.8; proyectado_val = 4853456980; proyectado_pct = 9.9; variacion_val = 699179880; variacion_pct = 16.8; tipo = "adicion" },
      @{ actividad = "Construcción bordillos"; contractual_val = 587858975; contractual_pct = 2.9; proyectado_val = 31606724; proyectado_pct = 0.1; variacion_val = -556252251; variacion_pct = -94.6; tipo = "ahorro" },
      @{ actividad = "Construcción disipadores"; contractual_val = 24152373; contractual_pct = 0.1; proyectado_val = 423717387; proyectado_pct = 0.9; variacion_val = 399565014; variacion_pct = 1654.4; tipo = "adicion" },
      @{ actividad = "Estabilización"; contractual_val = 10535064588; contractual_pct = 52.8; proyectado_val = 32124443827; proyectado_pct = 65.8; variacion_val = 21589379239; variacion_pct = 204.9; tipo = "adicion" },
      @{ actividad = "Señalización vial"; contractual_val = 355851420; contractual_pct = 1.8; proyectado_val = 417158664; proyectado_pct = 0.9; variacion_val = 61307244; variacion_pct = 17.2; tipo = "adicion" },
      @{ actividad = "MDC (Mezcla densa en caliente)"; contractual_val = 0; contractual_pct = 0.0; proyectado_val = 1200562468; proyectado_pct = 2.5; variacion_val = 1200562468; variacion_pct = 100.0; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 3; real = 45; ejec_anterior = 22; ejec_actual = 22; delta_semana = 0; pct = 48.9 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 23770; real = 31489; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Filtros"; unidad = "ml"; presupuestada = 23770; real = 28524; ejec_anterior = 1164; ejec_actual = 1164; delta_semana = 0; pct = 4.1 },
      @{ actividad = "Bordillos"; unidad = "ml"; presupuestada = 4754; real = 256; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 118850; real = 118850; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Señalización"; unidad = "ml"; presupuestada = 71310; real = 71310; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K2", "K4", "K6", "K8", "K10", "K12", "K14", "K16", "K18", "K20", "K22", "K23+770")
      longitud_m = 23770
      campo = @{ topografia_pct = 67.0; apiques_pct = 88.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 0.0; subrasante_pct = 0.0 }
      drenaje = @{ cunetas_pct = 0.0; filtros_pct = 4.9; alcantarillas_pct = 67.0 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 16.0; tipo = "Topografía finalizada"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 0; km_fin = 20.9; tipo = "Apiques de geotecnia"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 0; km_fin = 1.16; tipo = "Filtro drenaje lateral"; estado = "ejecutado"; color = "#2563EB" },
        @{ km_inicio = 4.0; km_fin = 4.4; tipo = "Alcantarilla nueva / reemplazo"; estado = "alcantarilla_nueva"; color = "#3B82F6" },
        @{ km_inicio = 7.0; km_fin = 8.5; tipo = "Limpieza de obras hidráulicas"; estado = "alcantarilla_limpieza"; color = "#06B6D4" }
      )
    }
  },

  # 2. La Frontera - Mesopotamia - Abejorral
  @{
    id = "E-17"
    code = "E-17"
    name = "La Frontera (Ruta 56) – Mesopotamia – Abejorral"
    circuito = "Abejorral - La Frontera"
    subregion = "Oriente"
    lote_id = 1
    lote_name = "Lote 1 – Subregión Oriente"
    color = "#10B981"
    longitud_contractual_km = 25.49
    longitud_probable_km = 12.35
    alcance_real_km = 18.26
    diferencia_km = 7.23
    cobertura_pct = 48.4
    valor_contractual = 23070485659
    valor_por_km_contractual = 905079861
    valor_proyectado = 47630680065
    valor_por_km_proyectado = 1868602592
    variacion_total = 24560194406
    variacion_pct = 106.5
    avance_fisico_pct = 0.55
    avance_financiero_pct = 0.63
    plazo_transcurrido_pct = 38.1
    plazo_dias = "123 de 323 días"
    fecha_inicio = "01/06/2026"
    fecha_terminacion = "20/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 307000
    transito_diseno = 265965
    geotecnia_notas = "Diseño contempla subbase de 13 cm, base cementada de 28 cm y subrasante tratada con cal de 20 cm."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica Aprobada"
        tipo = "teorica"
        espesor_total_cm = 48.0
        cbr = "CBR Diseño"
        descripcion = "TSD + Estabilización con cemento (28 cm) + Subrasante estabilizada con cal (20 cm)"
        capas = @(
          @{ nombre = "Tratamiento Superficial Doble (TSD)"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Estabilización con cemento (Subbase 13 cm)"; tipo = "base"; material = "Cemento"; espesor_cm = 28.0; espesor_display = "28 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subrasante estabilizada con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 2244351844; contractual_pct = 9.7; proyectado_val = 2852204289; proyectado_pct = 6.0; variacion_val = 607852445; variacion_pct = 27.1; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 4212009351; contractual_pct = 18.3; proyectado_val = 5518986339; proyectado_pct = 11.6; variacion_val = 1306976988; variacion_pct = 31.0; tipo = "adicion" },
      @{ actividad = "Construcción filtro"; contractual_val = 4325107514; contractual_pct = 18.7; proyectado_val = 4313471524; proyectado_pct = 9.1; variacion_val = -11635990; variacion_pct = -0.3; tipo = "ahorro" },
      @{ actividad = "Construcción bordillos"; contractual_val = 630437534; contractual_pct = 2.7; proyectado_val = 52976848; proyectado_pct = 0.1; variacion_val = -577460686; variacion_pct = -91.6; tipo = "ahorro" },
      @{ actividad = "Construcción disipadores"; contractual_val = 322236492; contractual_pct = 1.4; proyectado_val = 497142581; proyectado_pct = 1.0; variacion_val = 174906089; variacion_pct = 54.3; tipo = "adicion" },
      @{ actividad = "Estabilización"; contractual_val = 10958008114; contractual_pct = 47.5; proyectado_val = 32233891864; proyectado_pct = 67.7; variacion_val = 21275883750; variacion_pct = 194.2; tipo = "adicion" },
      @{ actividad = "Señalización vial"; contractual_val = 378334810; contractual_pct = 1.6; proyectado_val = 563351431; proyectado_pct = 1.2; variacion_val = 185016621; variacion_pct = 48.9; tipo = "adicion" },
      @{ actividad = "MDC (Mezcla densa en caliente)"; contractual_val = 0; contractual_pct = 0.0; proyectado_val = 1598655189; proyectado_pct = 3.4; variacion_val = 1598655189; variacion_pct = 100.0; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 57; real = 75; ejec_anterior = 9; ejec_actual = 9; delta_semana = 0; pct = 12.0 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 25490; real = 33715; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Filtros"; unidad = "ml"; presupuestada = 25490; real = 25447; ejec_anterior = 193; ejec_actual = 193; delta_semana = 0; pct = 0.8 },
      @{ actividad = "Bordillos"; unidad = "ml"; presupuestada = 5098; real = 428; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 127450; real = 127450; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Señalización"; unidad = "ml"; presupuestada = 76470; real = 76470; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K2", "K4", "K6", "K8", "K10", "K12", "K14", "K16", "K18", "K20", "K22", "K24", "K25+490")
      longitud_m = 25490
      campo = @{ topografia_pct = 59.0; apiques_pct = 39.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 0.0; subrasante_pct = 0.0 }
      drenaje = @{ cunetas_pct = 0.0; filtros_pct = 0.8; alcantarillas_pct = 12.0 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 15.0; tipo = "Topografía preliminar"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 0; km_fin = 9.94; tipo = "Apiques y sondeos"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 0; km_fin = 0.20; tipo = "Filtro geotextil drenante"; estado = "ejecutado"; color = "#2563EB" },
        @{ km_inicio = 12.0; km_fin = 13.5; tipo = "Alcantarillas rehabilitadas"; estado = "alcantarilla_limpieza"; color = "#06B6D4" }
      )
    }
  },

  # 3. San Vicente - El Peñol
  @{
    id = "E-16"
    code = "E-16"
    name = "San Vicente – El Peñol"
    circuito = "San Vicente - El Peñol"
    subregion = "Oriente"
    lote_id = 1
    lote_name = "Lote 1 – Subregión Oriente"
    color = "#10B981"
    longitud_contractual_km = 18.15
    longitud_probable_km = 12.70
    alcance_real_km = 12.70
    diferencia_km = 5.45
    cobertura_pct = 73.4
    valor_contractual = 17646781111
    valor_por_km_contractual = 972274441
    valor_proyectado = 24053020311
    valor_por_km_proyectado = 1325235279
    variacion_total = 6406239200
    variacion_pct = 36.3
    avance_fisico_pct = 1.40
    avance_financiero_pct = 1.20
    plazo_transcurrido_pct = 38.1
    plazo_dias = "123 de 323 días"
    fecha_inicio = "01/06/2026"
    fecha_terminacion = "20/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 307000
    transito_diseno = 305611
    geotecnia_notas = "El alcance se reduce de 18,15 km a 12,75 km, descontando 5,40 km de pavimento existente en buen estado."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + BGTC 28 cm + Base tratada con cal 20 cm"
        capas = @(
          @{ nombre = "Tratamiento Superficial Doble (TSD)"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base Granular Tratada con Cemento (BGTC)"; tipo = "base"; material = "BGTC"; espesor_cm = 28.0; espesor_display = "28 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Base tratada con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada en Obra"
        tipo = "aprobada"
        espesor_total_cm = 40.0
        descripcion = "TSD + MGTC 30 cm + Material granular existente 10 cm (Espesor optimizado 40 cm)"
        capas = @(
          @{ nombre = "Tratamiento Superficial Doble (TSD)"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Material Granular Tratado con Cemento (MGTC)"; tipo = "base"; material = "MGTC"; espesor_cm = 30.0; espesor_display = "30 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Material granular existente"; tipo = "subbase"; material = "Granular"; espesor_cm = 10.0; espesor_display = "10 cm"; color = "#78350F"; textura = "grava" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 2107061362; contractual_pct = 11.94; proyectado_val = 2104063900; proyectado_pct = 8.75; variacion_val = -2997462; variacion_pct = -0.1; tipo = "ahorro" },
      @{ actividad = "Construcción cuneta"; contractual_val = 3097519177; contractual_pct = 17.55; proyectado_val = 3388939783; proyectado_pct = 14.09; variacion_val = 291420606; variacion_pct = 9.4; tipo = "adicion" },
      @{ actividad = "Construcción filtro"; contractual_val = 3280173270; contractual_pct = 18.59; proyectado_val = 2637466000; proyectado_pct = 10.97; variacion_val = -642707270; variacion_pct = -19.6; tipo = "ahorro" },
      @{ actividad = "Construcción bordillos"; contractual_val = 466105520; contractual_pct = 2.64; proyectado_val = 866821200; proyectado_pct = 3.60; variacion_val = 400715680; variacion_pct = 86.0; tipo = "adicion" },
      @{ actividad = "Construcción disipadores"; contractual_val = 342721665; contractual_pct = 1.94; proyectado_val = 342721665; proyectado_pct = 1.42; variacion_val = 0; variacion_pct = 0.0; tipo = "neutro" },
      @{ actividad = "Estabilización"; contractual_val = 8072574897; contractual_pct = 45.75; proyectado_val = 14491765743; proyectado_pct = 60.25; variacion_val = 6419190846; variacion_pct = 79.5; tipo = "adicion" },
      @{ actividad = "Señalización vial"; contractual_val = 280625220; contractual_pct = 1.59; proyectado_val = 221242020; proyectado_pct = 0.92; variacion_val = -59383200; variacion_pct = -21.2; tipo = "ahorro" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 54; real = 54; ejec_anterior = 6; ejec_actual = 6; delta_semana = 0; pct = 11.1 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 18150; real = 18360; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Filtros"; unidad = "ml"; presupuestada = 18130; real = 13000; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Bordillos"; unidad = "ml"; presupuestada = 3630; real = 7000; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 90750; real = 68750; ejec_anterior = 1295; ejec_actual = 1295; delta_semana = 0; pct = 1.9 },
      @{ actividad = "Señalización"; unidad = "ml"; presupuestada = 18150; real = 12700; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K2", "K4", "K6", "K8", "K10", "K12", "K14", "K16", "K18+150")
      longitud_m = 18150
      campo = @{ topografia_pct = 55.0; apiques_pct = 100.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 0.0; subrasante_pct = 1.4 }
      drenaje = @{ cunetas_pct = 0.0; filtros_pct = 0.0; alcantarillas_pct = 11.1 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 10.0; tipo = "Topografía concluida"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 0; km_fin = 18.15; tipo = "Apiques completados 100%"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 0; km_fin = 0.26; tipo = "Estabilización de subrasante (1.295 m²)"; estado = "ejecutado"; color = "#10B981" }
      )
    }
  },

  # 4. Miserenga - Ebéjico (Lote 2 Occidente)
  @{
    id = "E-28"
    code = "E-28"
    name = "Miserenga – Ebéjico"
    circuito = "Ebejico - Miserenga"
    subregion = "Occidente"
    lote_id = 2
    lote_name = "Lote 2 – Subregión Occidente"
    color = "#3B82F6"
    longitud_contractual_km = 1.00
    longitud_probable_km = 0.81
    alcance_real_km = 0.81
    diferencia_km = 0.19
    cobertura_pct = 81.0
    valor_contractual = 970000000
    valor_por_km_contractual = 970000000
    valor_proyectado = 1198000000
    valor_por_km_proyectado = 1479012346
    variacion_total = 228000000
    variacion_pct = 23.5
    avance_fisico_pct = 4.50
    avance_financiero_pct = 4.93
    plazo_transcurrido_pct = 42.9
    plazo_dias = "138 de 322 días"
    fecha_inicio = "15/05/2026"
    fecha_terminacion = "02/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 320000
    transito_diseno = 350000
    geotecnia_notas = "Cambio de estructura de pavimento de TSD a MDC-19 debido a fuertes pendientes y alto tráfico de carga."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica (Licitación)"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + Subbase 13 cm + Subrasante estabilizada con cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base granular estabilizada"; tipo = "base"; material = "Base"; espesor_cm = 28.0; espesor_display = "28 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada (MDC-19)"
        tipo = "aprobada"
        espesor_total_cm = 39.0
        descripcion = "MDC-19 + BGTC (Espesor 39 cm)"
        capas = @(
          @{ nombre = "Mezcla Densa en Caliente (MDC-19)"; tipo = "rodadura"; material = "MDC-19"; espesor_cm = 9.0; espesor_display = "9 cm"; color = "#111827"; textura = "asfalto_pesado" },
          @{ nombre = "Base Granular Tratada con Cemento (BGTC)"; tipo = "base"; material = "BGTC"; espesor_cm = 30.0; espesor_display = "30 cm"; color = "#D97706"; textura = "cemento" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 110000000; contractual_pct = 11.3; proyectado_val = 135000000; proyectado_pct = 11.3; variacion_val = 25000000; variacion_pct = 22.7; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 180000000; contractual_pct = 18.6; proyectado_val = 210000000; proyectado_pct = 17.5; variacion_val = 30000000; variacion_pct = 16.7; tipo = "adicion" },
      @{ actividad = "Estabilización y MDC"; contractual_val = 550000000; contractual_pct = 56.7; proyectado_val = 710000000; proyectado_pct = 59.3; variacion_val = 160000000; variacion_pct = 29.1; tipo = "adicion" },
      @{ actividad = "Señalización"; contractual_val = 25000000; contractual_pct = 2.6; proyectado_val = 33000000; proyectado_pct = 2.8; variacion_val = 8000000; variacion_pct = 32.0; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 4; real = 4; ejec_anterior = 1; ejec_actual = 1; delta_semana = 0; pct = 25.0 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 1000; real = 1000; ejec_anterior = 50; ejec_actual = 50; delta_semana = 0; pct = 5.0 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 5000; real = 4050; ejec_anterior = 200; ejec_actual = 200; delta_semana = 0; pct = 4.9 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K0+500", "K0+810", "K1+000")
      longitud_m = 1000
      campo = @{ topografia_pct = 100.0; apiques_pct = 100.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 5.0; subrasante_pct = 5.0 }
      drenaje = @{ cunetas_pct = 5.0; filtros_pct = 0.0; alcantarillas_pct = 25.0 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 1.0; tipo = "Topografía y replanteo"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 0; km_fin = 0.05; tipo = "Fresado y conformación"; estado = "ejecutado"; color = "#3B82F6" }
      )
    }
  },

  # 5. El Botón - Paso Ancho - Frontino (Lote 2 Occidente)
  @{
    id = "E-14"
    code = "E-14"
    name = "El Botón – Paso Ancho – Frontino"
    circuito = "Frontino - Nutibara"
    subregion = "Occidente"
    lote_id = 2
    lote_name = "Lote 2 – Subregión Occidente"
    color = "#3B82F6"
    longitud_contractual_km = 25.00
    longitud_probable_km = 14.87
    alcance_real_km = 14.87
    diferencia_km = 10.13
    cobertura_pct = 59.5
    valor_contractual = 24850000000
    valor_por_km_contractual = 994000000
    valor_proyectado = 41764705882
    valor_por_km_proyectado = 1670588235
    variacion_total = 16914705882
    variacion_pct = 68.1
    avance_fisico_pct = 16.50
    avance_financiero_pct = 18.25
    plazo_transcurrido_pct = 42.9
    plazo_dias = "138 de 322 días"
    fecha_inicio = "15/05/2026"
    fecha_terminacion = "02/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 310000
    transito_diseno = 325000
    geotecnia_notas = "Estructura aprobada contempla MGTC de 25 cm sobre subrasante estabilizada con cal de 20 cm, espesor total 45 cm."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + Subbase 13 cm + Subrasante estabilizada con cal 20 cm"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base granular estabilizada"; tipo = "base"; material = "Base"; espesor_cm = 28.0; espesor_display = "28 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada (MGTC)"
        tipo = "aprobada"
        espesor_total_cm = 45.0
        descripcion = "TSD + Estabilización con cemento (MGTC 25 cm) + Subrasante con cal 20 cm"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Estabilización con cemento (MGTC)"; tipo = "base"; material = "MGTC"; espesor_cm = 25.0; espesor_display = "25 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 2450000000; contractual_pct = 9.9; proyectado_val = 3850000000; proyectado_pct = 9.2; variacion_val = 1400000000; variacion_pct = 57.1; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 4500000000; contractual_pct = 18.1; proyectado_val = 6200000000; proyectado_pct = 14.8; variacion_val = 1700000000; variacion_pct = 37.8; tipo = "adicion" },
      @{ actividad = "Estabilización MGTC"; contractual_val = 13500000000; contractual_pct = 54.3; proyectado_val = 24500000000; proyectado_pct = 58.7; variacion_val = 11000000000; variacion_pct = 81.5; tipo = "adicion" },
      @{ actividad = "Filtros y Drenaje"; contractual_val = 3800000000; contractual_pct = 15.3; proyectado_val = 6100000000; proyectado_pct = 14.6; variacion_val = 2300000000; variacion_pct = 60.5; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 60; real = 72; ejec_anterior = 18; ejec_actual = 20; delta_semana = 2; pct = 27.8 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 25000; real = 25000; ejec_anterior = 3500; ejec_actual = 4200; delta_semana = 700; pct = 16.8 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 125000; real = 85000; ejec_anterior = 14000; ejec_actual = 16500; delta_semana = 2500; pct = 19.4 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K3", "K6", "K9", "K12", "K15", "K18", "K21", "K25")
      longitud_m = 25000
      campo = @{ topografia_pct = 85.0; apiques_pct = 95.0 }
      estructura = @{ rodadura_pct = 5.0; capa_granular_pct = 19.4; subrasante_pct = 22.0 }
      drenaje = @{ cunetas_pct = 16.8; filtros_pct = 18.0; alcantarillas_pct = 27.8 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 4.2; tipo = "Base estabilizada y cunetas"; estado = "ejecutado"; color = "#10B981" },
        @{ km_inicio = 4.2; km_fin = 8.5; tipo = "Subrasante con cal"; estado = "ejecutado"; color = "#F59E0B" }
      )
    }
  },

  # 6. San Pedro de Urabá - Necoclí (Lote 3 Urabá)
  @{
    id = "E-25"
    code = "E-25"
    name = "San Pedro de Urabá – Necoclí"
    circuito = "San Pedro de Urabá - Necoclí"
    subregion = "Urabá"
    lote_id = 3
    lote_name = "Lote 3 – Subregión Urabá"
    color = "#06B6D4"
    longitud_contractual_km = 58.65
    longitud_probable_km = 39.99
    alcance_real_km = 39.99
    diferencia_km = 18.66
    cobertura_pct = 68.2
    valor_contractual = 63654400000
    valor_por_km_contractual = 1085326513
    valor_proyectado = 93334897360
    valor_por_km_proyectado = 1591387849
    variacion_total = 29680497360
    variacion_pct = 46.6
    avance_fisico_pct = 5.80
    avance_financiero_pct = 6.65
    plazo_transcurrido_pct = 44.0
    plazo_dias = "142 de 323 días"
    fecha_inicio = "10/05/2026"
    fecha_terminacion = "29/03/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 350000
    transito_diseno = 380000
    geotecnia_notas = "Suelos de baja capacidad portante en la llanura de Urabá requirieron aumento de la capa estabilizada a 60 cm en estructura aprobada."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + MGTC + Subbase 15 cm + Subrasante con cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "MGTC"; tipo = "base"; material = "MGTC"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subbase granular"; tipo = "subbase"; material = "Granular"; espesor_cm = 15.0; espesor_display = "15 cm"; color = "#78350F"; textura = "grava" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 13.0; espesor_display = "13 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada (Reforzada Urabá)"
        tipo = "aprobada"
        espesor_total_cm = 60.0
        descripcion = "TSD + MGTC reforzado + Subrasante estabilizada con cal (Espesor total 60 cm)"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "MGTC base cementada"; tipo = "base"; material = "MGTC"; espesor_cm = 35.0; espesor_display = "35 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 25.0; espesor_display = "25 cm"; color = "#92400E"; textura = "cal" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 6200000000; contractual_pct = 9.7; proyectado_val = 8900000000; proyectado_pct = 9.5; variacion_val = 2700000000; variacion_pct = 43.5; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 11400000000; contractual_pct = 17.9; proyectado_val = 15800000000; proyectado_pct = 16.9; variacion_val = 4400000000; variacion_pct = 38.6; tipo = "adicion" },
      @{ actividad = "Estabilización de plataforma"; contractual_val = 35200000000; contractual_pct = 55.3; proyectado_val = 55400000000; proyectado_pct = 59.4; variacion_val = 20200000000; variacion_pct = 57.4; tipo = "adicion" },
      @{ actividad = "Drenaje profundo y filtros"; contractual_val = 9800000000; contractual_pct = 15.4; proyectado_val = 11900000000; proyectado_pct = 12.8; variacion_val = 2100000000; variacion_pct = 21.4; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 140; real = 160; ejec_anterior = 20; ejec_actual = 24; delta_semana = 4; pct = 15.0 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 58000; real = 58000; ejec_anterior = 3200; ejec_actual = 4100; delta_semana = 900; pct = 7.1 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 293000; real = 200000; ejec_anterior = 11000; ejec_actual = 13500; delta_semana = 2500; pct = 6.8 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K10", "K20", "K30", "K40", "K50", "K58+650")
      longitud_m = 58650
      campo = @{ topografia_pct = 72.0; apiques_pct = 90.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 6.8; subrasante_pct = 8.5 }
      drenaje = @{ cunetas_pct = 7.1; filtros_pct = 9.0; alcantarillas_pct = 15.0 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 5.2; tipo = "Cunetas y conformación granular"; estado = "ejecutado"; color = "#06B6D4" },
        @{ km_inicio = 5.2; km_fin = 12.0; tipo = "Sondeos geotécnicos"; estado = "ejecutado"; color = "#10B981" }
      )
    }
  },

  # 7. Remedios - La Y de la Virgen - Puerto Berrío (Lote 4 Magdalena Medio)
  @{
    id = "E-6"
    code = "E-6"
    name = "Remedios – La Y de la Virgen – Puerto Berrío"
    circuito = "Remedios - La Y De La Virgen - Puerto Berrío"
    subregion = "Magdalena Medio"
    lote_id = 4
    lote_name = "Lote 4 – Subregión Magdalena Medio"
    color = "#F59E0B"
    longitud_contractual_km = 25.00
    longitud_probable_km = 15.47
    alcance_real_km = 25.00
    diferencia_km = 0.00
    cobertura_pct = 61.9
    valor_contractual = 24350762146
    valor_por_km_contractual = 974030486
    valor_proyectado = 39350762146
    valor_por_km_proyectado = 1574030486
    variacion_total = 15000000000
    variacion_pct = 61.6
    avance_fisico_pct = 3.50
    avance_financiero_pct = 3.97
    plazo_transcurrido_pct = 42.9
    plazo_dias = "138 de 322 días"
    fecha_inicio = "15/05/2026"
    fecha_terminacion = "02/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 300000
    transito_diseno = 310000
    geotecnia_notas = "Estructura aprobada optimiza espesor a 40 cm con MGTC de alta resistencia."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + MGTC + Subbase 14 cm + Subrasante con cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "MGTC"; tipo = "base"; material = "MGTC"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subbase granular"; tipo = "subbase"; material = "Granular"; espesor_cm = 14.0; espesor_display = "14 cm"; color = "#78350F"; textura = "grava" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 14.0; espesor_display = "14 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada"
        tipo = "aprobada"
        espesor_total_cm = 40.0
        descripcion = "TSD + MGTC 40 cm optimizado"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "MGTC base estabilizada"; tipo = "base"; material = "MGTC"; espesor_cm = 40.0; espesor_display = "40 cm"; color = "#D97706"; textura = "mgtc" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 2400000000; contractual_pct = 9.9; proyectado_val = 3700000000; proyectado_pct = 9.4; variacion_val = 1300000000; variacion_pct = 54.2; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 4300000000; contractual_pct = 17.7; proyectado_val = 5800000000; proyectado_pct = 14.7; variacion_val = 1500000000; variacion_pct = 34.9; tipo = "adicion" },
      @{ actividad = "Estabilización MGTC"; contractual_val = 13400000000; contractual_pct = 55.0; proyectado_val = 23900000000; proyectado_pct = 60.7; variacion_val = 10500000000; variacion_pct = 78.4; tipo = "adicion" },
      @{ actividad = "Filtros y Señalización"; contractual_val = 4250762146; contractual_pct = 17.5; proyectado_val = 5950762146; proyectado_pct = 15.1; variacion_val = 1700000000; variacion_pct = 40.0; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 58; real = 65; ejec_anterior = 6; ejec_actual = 8; delta_semana = 2; pct = 12.3 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 25000; real = 25000; ejec_anterior = 800; ejec_actual = 1100; delta_semana = 300; pct = 4.4 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 125000; real = 77350; ejec_anterior = 2500; ejec_actual = 3200; delta_semana = 700; pct = 4.1 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K5", "K10", "K15", "K20", "K25")
      longitud_m = 25000
      campo = @{ topografia_pct = 80.0; apiques_pct = 100.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 4.1; subrasante_pct = 6.0 }
      drenaje = @{ cunetas_pct = 4.4; filtros_pct = 5.0; alcantarillas_pct = 12.3 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 3.2; tipo = "Base MGTC y cunetas"; estado = "ejecutado"; color = "#F59E0B" }
      )
    }
  },

  # 8. Valparaíso - Támesis (Lote 5 Suroeste)
  @{
    id = "E-22"
    code = "E-22"
    name = "Valparaíso – Támesis"
    circuito = "Valparaíso - Támesis"
    subregion = "Suroeste"
    lote_id = 5
    lote_name = "Lote 5 – Subregión Suroeste"
    color = "#8B5CF6"
    longitud_contractual_km = 22.51
    longitud_probable_km = 14.90
    alcance_real_km = 14.90
    diferencia_km = 7.61
    cobertura_pct = 66.2
    valor_contractual = 22410613443
    valor_por_km_contractual = 995584782
    valor_proyectado = 33846463073
    valor_por_km_proyectado = 1503618973
    variacion_total = 11435849630
    variacion_pct = 51.0
    avance_fisico_pct = 22.10
    avance_financiero_pct = 24.30
    plazo_transcurrido_pct = 65.5
    plazo_dias = "211 de 322 días"
    fecha_inicio = "01/03/2026"
    fecha_terminacion = "18/01/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 290000
    transito_diseno = 315000
    geotecnia_notas = "Estructura aprobada reduce espesor total a 42 cm optimizando la base BGTC sobre subbase seleccionada."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + BGTC + Subbase 18 cm + Subrasante con cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "BGTC"; tipo = "base"; material = "BGTC"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subbase granular"; tipo = "subbase"; material = "Granular"; espesor_cm = 18.0; espesor_display = "18 cm"; color = "#78350F"; textura = "grava" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 10.0; espesor_display = "10 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada"
        tipo = "aprobada"
        espesor_total_cm = 42.0
        descripcion = "TSD + BGTC + Subbase seleccionada (Espesor 42 cm)"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "BGTC base cementada"; tipo = "base"; material = "BGTC"; espesor_cm = 24.0; espesor_display = "24 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subbase"; tipo = "subbase"; material = "Granular"; espesor_cm = 18.0; espesor_display = "18 cm"; color = "#78350F"; textura = "grava" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 2100000000; contractual_pct = 9.4; proyectado_val = 3100000000; proyectado_pct = 9.2; variacion_val = 1000000000; variacion_pct = 47.6; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 3900000000; contractual_pct = 17.4; proyectado_val = 5200000000; proyectado_pct = 15.4; variacion_val = 1300000000; variacion_pct = 33.3; tipo = "adicion" },
      @{ actividad = "Estabilización BGTC"; contractual_val = 12600000000; contractual_pct = 56.2; proyectado_val = 20800000000; proyectado_pct = 61.5; variacion_val = 8200000000; variacion_pct = 65.1; tipo = "adicion" },
      @{ actividad = "Filtros y Drenaje"; contractual_val = 3810613443; contractual_pct = 17.0; proyectado_val = 4746463073; proyectado_pct = 14.0; variacion_val = 935849630; variacion_pct = 24.6; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 52; real = 60; ejec_anterior = 22; ejec_actual = 26; delta_semana = 4; pct = 43.3 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 22510; real = 22510; ejec_anterior = 4500; ejec_actual = 5200; delta_semana = 700; pct = 23.1 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 112550; real = 74500; ejec_anterior = 16000; ejec_actual = 18200; delta_semana = 2200; pct = 24.4 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K4", "K8", "K12", "K16", "K20", "K22+510")
      longitud_m = 22510
      campo = @{ topografia_pct = 100.0; apiques_pct = 100.0 }
      estructura = @{ rodadura_pct = 8.0; capa_granular_pct = 24.4; subrasante_pct = 28.0 }
      drenaje = @{ cunetas_pct = 23.1; filtros_pct = 26.0; alcantarillas_pct = 43.3 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 5.5; tipo = "Pavimento estabilizado completo"; estado = "ejecutado"; color = "#8B5CF6" },
        @{ km_inicio = 5.5; km_fin = 9.2; tipo = "Base granular y cunetas"; estado = "ejecutado"; color = "#10B981" }
      )
    }
  },

  # 9. Caramanta - Cristales - San Roque (Lote 6 Nordeste)
  @{
    id = "E-3"
    code = "E-3"
    name = "Caramanta – Cristales – San Roque"
    circuito = "Caramanta - Cristales - San Roque"
    subregion = "Nordeste"
    lote_id = 6
    lote_name = "Lote 6 – Subregión Nordeste"
    color = "#EC4899"
    longitud_contractual_km = 20.64
    longitud_probable_km = 11.81
    alcance_real_km = 11.81
    diferencia_km = 8.83
    cobertura_pct = 57.2
    valor_contractual = 20089310229
    valor_por_km_contractual = 973319294
    valor_proyectado = 35101892203
    valor_por_km_proyectado = 1700673072
    variacion_total = 15012581974
    variacion_pct = 74.7
    avance_fisico_pct = 0.00
    avance_financiero_pct = 0.00
    plazo_transcurrido_pct = 59.5
    plazo_dias = "192 de 323 días"
    fecha_inicio = "20/03/2026"
    fecha_terminacion = "06/02/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 280000
    transito_diseno = 295000
    geotecnia_notas = "Estructura aprobada aumenta a 60 cm con base cementada MGTC para soportar arcillas expansivas del sector."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + MGTC + Subbase 14 cm + Subrasante cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "MGTC"; tipo = "base"; material = "MGTC"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subbase granular"; tipo = "subbase"; material = "Granular"; espesor_cm = 14.0; espesor_display = "14 cm"; color = "#78350F"; textura = "grava" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 14.0; espesor_display = "14 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada (Nordeste Reforzada)"
        tipo = "aprobada"
        espesor_total_cm = 60.0
        descripcion = "TSD + MGTC + Subrasante tratada (Espesor total 60 cm)"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "MGTC reforzado"; tipo = "base"; material = "MGTC"; espesor_cm = 35.0; espesor_display = "35 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subrasante"; tipo = "subrasante"; material = "Suelo"; espesor_cm = 25.0; espesor_display = "25 cm"; color = "#92400E"; textura = "cal" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 1950000000; contractual_pct = 9.7; proyectado_val = 3300000000; proyectado_pct = 9.4; variacion_val = 1350000000; variacion_pct = 69.2; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 3600000000; contractual_pct = 17.9; proyectado_val = 5200000000; proyectado_pct = 14.8; variacion_val = 1600000000; variacion_pct = 44.4; tipo = "adicion" },
      @{ actividad = "Estabilización MGTC"; contractual_val = 11200000000; contractual_pct = 55.8; proyectado_val = 21900000000; proyectado_pct = 62.4; variacion_val = 10700000000; variacion_pct = 95.5; tipo = "adicion" },
      @{ actividad = "Drenajes y Señalización"; contractual_val = 3339310229; contractual_pct = 16.6; proyectado_val = 4701892203; proyectado_pct = 13.4; variacion_val = 1362581974; variacion_pct = 40.8; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 48; real = 48; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 20640; real = 20640; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 103200; real = 59050; ejec_anterior = 0; ejec_actual = 0; delta_semana = 0; pct = 0.0 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K4", "K8", "K12", "K16", "K20+640")
      longitud_m = 20640
      campo = @{ topografia_pct = 40.0; apiques_pct = 60.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 0.0; subrasante_pct = 0.0 }
      drenaje = @{ cunetas_pct = 0.0; filtros_pct = 0.0; alcantarillas_pct = 0.0 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 8.2; tipo = "Levantamiento topográfico inicial"; estado = "ejecutado"; color = "#EC4899" }
      )
    }
  },

  # 10. Cáceres - La Chilona (Lote 7 Bajo Cauca)
  @{
    id = "E-1"
    code = "E-1"
    name = "Cáceres – El Tigre – Alto de Tamaná – La Chilona"
    circuito = "Cáceres - La Chilona"
    subregion = "Bajo Cauca"
    lote_id = 7
    lote_name = "Lote 7 – Subregión Bajo Cauca"
    color = "#14B8A6"
    longitud_contractual_km = 25.00
    longitud_probable_km = 17.87
    alcance_real_km = 17.87
    diferencia_km = 7.13
    cobertura_pct = 71.5
    valor_contractual = 24388547552
    valor_por_km_contractual = 975541902
    valor_proyectado = 34126406645
    valor_por_km_proyectado = 1365056266
    variacion_total = 9737859093
    variacion_pct = 39.9
    avance_fisico_pct = 15.20
    avance_financiero_pct = 17.16
    plazo_transcurrido_pct = 69.8
    plazo_dias = "225 de 322 días"
    fecha_inicio = "18/02/2026"
    fecha_terminacion = "06/01/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 320000
    transito_diseno = 340000
    geotecnia_notas = "Estructura aprobada contempla MGTC sobre afirmado existente de 36 cm, adaptado al clima cálido y aluviones de la cuenca del Cauca."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 47.0
        descripcion = "TSD + Subbase 13 cm + Subrasante estabilizada con cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base granular cementada"; tipo = "base"; material = "Base"; espesor_cm = 27.0; espesor_display = "27 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada (Bajo Cauca)"
        tipo = "aprobada"
        espesor_total_cm = 36.0
        descripcion = "TSD + MGTC + Afirmado aluvial existente (Espesor 36 cm)"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "MGTC base estabilizada"; tipo = "base"; material = "MGTC"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Afirmado de soporte"; tipo = "subbase"; material = "Afirmado"; espesor_cm = 16.0; espesor_display = "16 cm"; color = "#78350F"; textura = "grava" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 2400000000; contractual_pct = 9.8; proyectado_val = 3300000000; proyectado_pct = 9.7; variacion_val = 900000000; variacion_pct = 37.5; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 4300000000; contractual_pct = 17.6; proyectado_val = 5100000000; proyectado_pct = 14.9; variacion_val = 800000000; variacion_pct = 18.6; tipo = "adicion" },
      @{ actividad = "Estabilización MGTC"; contractual_val = 13600000000; contractual_pct = 55.8; proyectado_val = 20900000000; proyectado_pct = 61.2; variacion_val = 7300000000; variacion_pct = 53.7; tipo = "adicion" },
      @{ actividad = "Filtros y Drenaje"; contractual_val = 4088547552; contractual_pct = 16.8; proyectado_val = 4826406645; proyectado_pct = 14.1; variacion_val = 737859093; variacion_pct = 18.0; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 55; real = 55; ejec_anterior = 16; ejec_actual = 18; delta_semana = 2; pct = 32.7 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 25000; real = 25000; ejec_anterior = 3800; ejec_actual = 4400; delta_semana = 600; pct = 17.6 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 125000; real = 89350; ejec_anterior = 13500; ejec_actual = 15200; delta_semana = 1700; pct = 17.0 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K5", "K10", "K15", "K20", "K25")
      longitud_m = 25000
      campo = @{ topografia_pct = 95.0; apiques_pct = 100.0 }
      estructura = @{ rodadura_pct = 5.0; capa_granular_pct = 17.0; subrasante_pct = 20.0 }
      drenaje = @{ cunetas_pct = 17.6; filtros_pct = 20.0; alcantarillas_pct = 32.7 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 4.4; tipo = "Estabilización y cunetas aluviales"; estado = "ejecutado"; color = "#14B8A6" },
        @{ km_inicio = 4.4; km_fin = 8.0; tipo = "Subrasante mejorada con cal"; estado = "ejecutado"; color = "#10B981" }
      )
    }
  },

  # 11. Santa Rosa - Carolina del Príncipe (Lote 8 Norte)
  @{
    id = "E-10"
    code = "E-10"
    name = "Santa Rosa – Carolina del Príncipe"
    circuito = "Santa Rosa - Carolina del Príncipe"
    subregion = "Norte"
    lote_id = 8
    lote_name = "Lote 8 – Subregión Norte"
    color = "#6366F1"
    longitud_contractual_km = 33.67
    longitud_probable_km = 23.82
    alcance_real_km = 23.82
    diferencia_km = 9.85
    cobertura_pct = 70.7
    valor_contractual = 32607964751
    valor_por_km_contractual = 968457522
    valor_proyectado = 46089040662
    valor_por_km_proyectado = 1368845877
    variacion_total = 13481075911
    variacion_pct = 41.3
    avance_fisico_pct = 10.40
    avance_financiero_pct = 11.25
    plazo_transcurrido_pct = 42.7
    plazo_dias = "138 de 323 días"
    fecha_inicio = "15/05/2026"
    fecha_terminacion = "03/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 310000
    transito_diseno = 325000
    geotecnia_notas = "Estructura aprobada de 49 cm en zonas de alta humedad del altiplano norte."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 47.0
        descripcion = "TSD + Subbase 18 cm + Subrasante con cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base granular"; tipo = "base"; material = "Base"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subbase granular"; tipo = "subbase"; material = "Granular"; espesor_cm = 18.0; espesor_display = "18 cm"; color = "#78350F"; textura = "grava" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 9.0; espesor_display = "9 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada (Norte Altiplano)"
        tipo = "aprobada"
        espesor_total_cm = 49.0
        descripcion = "TSD + Base MGTC + Subrasante tratada con cal (49 cm)"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base cementada MGTC"; tipo = "base"; material = "MGTC"; espesor_cm = 25.0; espesor_display = "25 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 24.0; espesor_display = "24 cm"; color = "#92400E"; textura = "cal" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 3200000000; contractual_pct = 9.8; proyectado_val = 4400000000; proyectado_pct = 9.5; variacion_val = 1200000000; variacion_pct = 37.5; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 5800000000; contractual_pct = 17.8; proyectado_val = 7100000000; proyectado_pct = 15.4; variacion_val = 1300000000; variacion_pct = 22.4; tipo = "adicion" },
      @{ actividad = "Estabilización de plataforma"; contractual_val = 18100000000; contractual_pct = 55.5; proyectado_val = 28100000000; proyectado_pct = 61.0; variacion_val = 10000000000; variacion_pct = 55.2; tipo = "adicion" },
      @{ actividad = "Filtros y Drenaje"; contractual_val = 5507964751; contractual_pct = 16.9; proyectado_val = 6489040662; proyectado_pct = 14.1; variacion_val = 981075911; variacion_pct = 17.8; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 75; real = 80; ejec_anterior = 15; ejec_actual = 18; delta_semana = 3; pct = 22.5 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 33670; real = 33670; ejec_anterior = 3600; ejec_actual = 4500; delta_semana = 900; pct = 13.4 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 168350; real = 119100; ejec_anterior = 13000; ejec_actual = 15500; delta_semana = 2500; pct = 13.0 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K5", "K10", "K15", "K20", "K25", "K30", "K33+670")
      longitud_m = 33670
      campo = @{ topografia_pct = 90.0; apiques_pct = 95.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 13.0; subrasante_pct = 16.0 }
      drenaje = @{ cunetas_pct = 13.4; filtros_pct = 15.0; alcantarillas_pct = 22.5 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 4.5; tipo = "Base estabilizada y filtros"; estado = "ejecutado"; color = "#6366F1" },
        @{ km_inicio = 4.5; km_fin = 9.0; tipo = "Subrasante tratada"; estado = "ejecutado"; color = "#10B981" }
      )
    }
  },

  # 12. Entrerríos - San José de la Montaña (Lote 8 Norte)
  @{
    id = "E-11"
    code = "E-11"
    name = "Entrerríos – Labores – San José de la Montaña"
    circuito = "Entrerríos - Labores - San José de la Montana"
    subregion = "Norte"
    lote_id = 8
    lote_name = "Lote 8 – Subregión Norte"
    color = "#6366F1"
    longitud_contractual_km = 39.95
    longitud_probable_km = 25.76
    alcance_real_km = 25.70
    diferencia_km = 14.25
    cobertura_pct = 64.5
    valor_contractual = 36281519666
    valor_por_km_contractual = 908173208
    valor_proyectado = 56270619599
    valor_por_km_proyectado = 1408526148
    variacion_total = 19989099933
    variacion_pct = 55.1
    avance_fisico_pct = 9.80
    avance_financiero_pct = 10.80
    plazo_transcurrido_pct = 42.7
    plazo_dias = "138 de 323 días"
    fecha_inicio = "15/05/2026"
    fecha_terminacion = "03/04/2027"
    fecha_corte = "25/09/2026"
    transito_estructuracion = 300000
    transito_diseno = 315000
    geotecnia_notas = "Estructura aprobada de 43 cm con subrasante estabilizada con cal de 20 cm."
    estructuras_pavimento = @(
      @{
        nombre = "Estructura Teórica"
        tipo = "teorica"
        espesor_total_cm = 48.0
        descripcion = "TSD + Subbase 19 cm + Subrasante con cal"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base granular"; tipo = "base"; material = "Base"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#D97706"; textura = "cemento" },
          @{ nombre = "Subbase granular"; tipo = "subbase"; material = "Granular"; espesor_cm = 19.0; espesor_display = "19 cm"; color = "#78350F"; textura = "grava" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 9.0; espesor_display = "9 cm"; color = "#92400E"; textura = "cal" }
        )
      },
      @{
        nombre = "Estructura Aprobada"
        tipo = "aprobada"
        espesor_total_cm = 43.0
        descripcion = "TSD + Base MGTC 23 cm + Subrasante con cal 20 cm (43 cm)"
        capas = @(
          @{ nombre = "TSD"; tipo = "rodadura"; material = "TSD"; espesor_cm = 0.0; espesor_display = "TSD"; color = "#1F2937"; textura = "asfalto" },
          @{ nombre = "Base cementada MGTC"; tipo = "base"; material = "MGTC"; espesor_cm = 23.0; espesor_display = "23 cm"; color = "#D97706"; textura = "mgtc" },
          @{ nombre = "Subrasante con cal"; tipo = "subrasante"; material = "Cal"; espesor_cm = 20.0; espesor_display = "20 cm"; color = "#92400E"; textura = "cal" }
        )
      }
    )
    actividades_presupuesto = @(
      @{ actividad = "Construcción alcantarilla"; contractual_val = 3600000000; contractual_pct = 9.9; proyectado_val = 5200000000; proyectado_pct = 9.2; variacion_val = 1600000000; variacion_pct = 44.4; tipo = "adicion" },
      @{ actividad = "Construcción cuneta"; contractual_val = 6500000000; contractual_pct = 17.9; proyectado_val = 8300000000; proyectado_pct = 14.8; variacion_val = 1800000000; variacion_pct = 27.7; tipo = "adicion" },
      @{ actividad = "Estabilización de plataforma"; contractual_val = 20100000000; contractual_pct = 55.4; proyectado_val = 34500000000; proyectado_pct = 61.3; variacion_val = 14400000000; variacion_pct = 71.6; tipo = "adicion" },
      @{ actividad = "Filtros y Drenaje"; contractual_val = 6081519666; contractual_pct = 16.8; proyectado_val = 8270619599; proyectado_pct = 14.7; variacion_val = 2189099933; variacion_pct = 36.0; tipo = "adicion" }
    )
    actividades_ejecucion = @(
      @{ actividad = "Alcantarillas"; unidad = "und"; presupuestada = 90; real = 95; ejec_anterior = 18; ejec_actual = 21; delta_semana = 3; pct = 22.1 },
      @{ actividad = "Cunetas"; unidad = "ml"; presupuestada = 39950; real = 39950; ejec_anterior = 4100; ejec_actual = 5100; delta_semana = 1000; pct = 12.8 },
      @{ actividad = "Estabilización"; unidad = "m²"; presupuestada = 199750; real = 128800; ejec_anterior = 14500; ejec_actual = 17200; delta_semana = 2700; pct = 13.4 }
    )
    avance_abscisas = @{
      abscisas = @("K0", "K5", "K10", "K15", "K20", "K25", "K30", "K35", "K39+950")
      longitud_m = 39950
      campo = @{ topografia_pct = 88.0; apiques_pct = 92.0 }
      estructura = @{ rodadura_pct = 0.0; capa_granular_pct = 13.4; subrasante_pct = 15.0 }
      drenaje = @{ cunetas_pct = 12.8; filtros_pct = 14.0; alcantarillas_pct = 22.1 }
      tramos = @(
        @{ km_inicio = 0; km_fin = 5.1; tipo = "Base MGTC y cunetas"; estado = "ejecutado"; color = "#6366F1" },
        @{ km_inicio = 5.1; km_fin = 10.5; tipo = "Subrasante con cal"; estado = "ejecutado"; color = "#10B981" }
      )
    }
  }
)

Write-Host "Total detailed corridors configured: $($corredoresList.Count)"
