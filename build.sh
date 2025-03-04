#!/bin/bash
set -e  # Se qualquer comando falhar, o script para

echo "🚀 Instalando dependências..."
npm install

echo "🧪 Rodando testes..."
npm test

echo "✅ Testes passaram! Deploy liberado."
