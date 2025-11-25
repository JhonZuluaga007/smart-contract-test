# Smart Contract Project

Proyecto de Smart Contracts desarrollado con Hardhat 3, TypeScript y OpenZeppelin Contracts 5.x.

## Requisitos

- [Node.js](https://nodejs.org/) **v22+**
- [pnpm](https://pnpm.io/) (recomendado) o npm/yarn
- [Hardhat](https://hardhat.org/) (incluido como dependencia)

## Instalación

1. Clonar el repositorio e instalar las dependencias:

```bash
pnpm install
# o
npm install
```

## Estructura del Proyecto

```
Smart-Contract/
├── contracts/          # Contratos Solidity
├── test/              # Tests en TypeScript
├── scripts/            # Scripts de deployment
├── ignition/           # Módulos de deployment con Hardhat Ignition
├── hardhat.config.ts   # Configuración de Hardhat
└── tsconfig.json       # Configuración de TypeScript
```

## Scripts Disponibles

- `pnpm compile` - Compila los contratos
- `pnpm test` - Ejecuta los tests
- `pnpm test:coverage` - Genera reporte de cobertura de código
- `pnpm deploy` - Despliega los contratos usando Hardhat Ignition
- `pnpm node` - Inicia un nodo Hardhat local
- `pnpm clean` - Limpia archivos generados

## Tecnologías Utilizadas

- **Hardhat 3**: Entorno de desarrollo para Ethereum
- **TypeScript**: Tipado estático para mayor seguridad
- **OpenZeppelin Contracts 5.x**: Biblioteca de contratos seguros y auditados
- **Solidity 0.8.24**: Última versión estable de Solidity
- **Viem**: Cliente Ethereum moderno y tipado

## Desarrollo

### Compilar Contratos

```bash
pnpm compile
```

### Ejecutar Tests

```bash
pnpm test
```

### Desplegar Contratos

```bash
# Iniciar nodo local
pnpm node

# En otra terminal, desplegar
pnpm deploy
```

## Seguridad

Este proyecto utiliza OpenZeppelin Contracts, una biblioteca de contratos seguros y auditados por la comunidad. Siempre use el código instalado tal cual está, sin copiar y pegar desde fuentes en línea ni modificarlo usted mismo.

## Licencia

MIT

