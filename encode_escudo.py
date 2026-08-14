import base64

with open('assets/escudo.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

print('Base64 length:', len(b64))
with open('js/escudoData.js', 'w', encoding='utf-8') as f:
    f.write('export const ESCUDO_BASE64 = "data:image/jpeg;base64,' + b64 + '";\n')

print('js/escudoData.js generated successfully!')
