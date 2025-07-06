const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(filePath)) {
  console.error("❌ index.html não encontrado. Já fez o 'expo export'?");
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');

// Corrige caminhos absolutos para relativos
content = content.replace(/(src|href)="\/(.*?)"/g, '$1="./$2"');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ Caminhos corrigidos em index.html');
