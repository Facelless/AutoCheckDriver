#!/bin/bash

echo "Instalando dependências do Node.js..."
npm install -g cli-table3

# Garante que o Node.js encontre o pacote globalmente
export NODE_PATH=$(npm root -g)

echo "Configuração concluída!"
