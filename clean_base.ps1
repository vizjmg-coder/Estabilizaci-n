[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$script = @'
// Master Corridor Database with live Google Sheet data for E-18 & E-17
'@

# Read current base and corridors files
$baseContent = [System.IO.File]::ReadAllText("$PSScriptRoot/data/estabilizacion_base.js", [System.Text.Encoding]::UTF8)
$corrContent = [System.IO.File]::ReadAllText("$PSScriptRoot/data/estabilizacion_corredores.js", [System.Text.Encoding]::UTF8)

# Fix mojibake in base content if present
$baseContent = $baseContent.Replace('Programa de EstabilizaciÃ³n de VÃ­as en el Departamento de Antioquia', 'Programa de Estabilización de Vías en el Departamento de Antioquia')
$baseContent = $baseContent.Replace('SecretarÃ­a de Infraestructura FÃ­sica', 'Secretaría de Infraestructura Física')
$baseContent = $baseContent.Replace('GobernaciÃ³n de Antioquia', 'Gobernación de Antioquia')
$baseContent = $baseContent.Replace('Informe Departamental de VariaciÃ³n de Alcances y Estado de EjecuciÃ³n por Corredor', 'Informe Departamental de Variación de Alcances y Estado de Ejecución por Corredor')
$baseContent = $baseContent.Replace('RepÃºblica de Colombia', 'República de Colombia')
$baseContent = $baseContent.Replace('Lote 1 â€“ SubregiÃ³n Oriente', 'Lote 1 – Subregión Oriente')
$baseContent = $baseContent.Replace('Lote 2 â€“ SubregiÃ³n Occidente', 'Lote 2 – Subregión Occidente')
$baseContent = $baseContent.Replace('Lote 3 â€“ SubregiÃ³n UrabÃ¡', 'Lote 3 – Subregión Urabá')
$baseContent = $baseContent.Replace('Lote 4 â€“ SubregiÃ³n Magdalena Medio', 'Lote 4 – Subregión Magdalena Medio')
$baseContent = $baseContent.Replace('Lote 5 â€“ SubregiÃ³n Suroeste', 'Lote 5 – Subregión Suroeste')
$baseContent = $baseContent.Replace('Lote 6 â€“ SubregiÃ³n Nordeste', 'Lote 6 – Subregión Nordeste')
$baseContent = $baseContent.Replace('Lote 7 â€“ SubregiÃ³n Norte y Bajo Cauca', 'Lote 7 – Subregión Norte y Bajo Cauca')
$baseContent = $baseContent.Replace('Lote 8 â€“ SubregiÃ³n Valle de AburrÃ¡', 'Lote 8 – Subregión Valle de Aburrá')
$baseContent = $baseContent.Replace('Santa BÃ¡rbara', 'Santa Bárbara')
$baseContent = $baseContent.Replace('El PeÃ±ol', 'El Peñol')
$baseContent = $baseContent.Replace('SonsÃ³n', 'Sonsón')
$baseContent = $baseContent.Replace('AlejandrÃ­a', 'Alejandría')
$baseContent = $baseContent.Replace('UrabÃ¡', 'Urabá')
$baseContent = $baseContent.Replace('Valle de AburrÃ¡', 'Valle de Aburrá')
$baseContent = $baseContent.Replace('dÃ­as', 'días')

[System.IO.File]::WriteAllText("$PSScriptRoot/data/estabilizacion_base.js", $baseContent, [System.Text.Encoding]::UTF8)
Write-Host "Cleaned data/estabilizacion_base.js"
