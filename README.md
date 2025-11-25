# Smart Contract Project

Proyecto de Smart Contracts desarrollado con Hardhat 2.22, TypeScript y OpenZeppelin Contracts 5.x. Implementa un token ERC20 mintable con funcionalidad de dividendos distribuidos proporcionalmente entre los holders.

## Requisitos

- [Node.js](https://nodejs.org/) **v22.0.0 o superior**
- [npm](https://www.npmjs.com/) o [pnpm](https://pnpm.io/)
- [Hardhat](https://hardhat.org/) (incluido como dependencia)

## Instalación

1. Clonar el repositorio:

```bash
git clone <repository-url>
cd Smart-Contract
```

2. El proyecto usa `.nvmrc` para gestionar la versión de Node.js. Si usas `nvm`:

```bash
nvm use
```

3. Instalar las dependencias:

```bash
npm install
# o
pnpm install
```

## Estructura del Proyecto

```
Smart-Contract/
├── contracts/              # Contratos Solidity
│   ├── Token.sol          # Contrato principal del token
│   ├── IMintableToken.sol # Interfaz para minting
│   └── IDividends.sol     # Interfaz para dividendos
├── test/                  # Tests en TypeScript
│   └── Token.test.ts      # Suite completa de tests
├── scripts/               # Scripts de deployment
│   └── deploy.ts          # Script de despliegue
├── hardhat.config.ts      # Configuración de Hardhat
├── tsconfig.json          # Configuración de TypeScript
├── .nvmrc                 # Versión de Node.js requerida
└── package.json           # Dependencias y scripts
```

## Scripts Disponibles

- `npm run clean` - Limpia archivos generados (artifacts, cache, typechain-types)
- `npm run compile` - Compila los contratos Solidity
- `npm test` - Ejecuta todos los tests
- `npm run test:coverage` - Genera reporte de cobertura de código
- `npm run deploy` - Despliega los contratos a la red localhost
- `npm run node` - Inicia un nodo Hardhat local para desarrollo
- `npm run lint` - Ejecuta el linter de Solidity (solhint)

## Tecnologías Utilizadas

- **Hardhat 2.22.0**: Entorno de desarrollo para Ethereum
- **TypeScript 5.7**: Tipado estático para mayor seguridad
- **OpenZeppelin Contracts 5.1.0**: Biblioteca de contratos seguros y auditados
- **Solidity 0.8.24**: Versión estable de Solidity con optimizador habilitado
- **Ethers.js v6**: Biblioteca para interactuar con la blockchain
- **Chai & Mocha**: Framework de testing
- **TypeChain**: Generación automática de tipos TypeScript desde contratos

## Características del Contrato Token

### Funcionalidades Principales

1. **Minting**: Los usuarios pueden mintear tokens enviando ETH al contrato
2. **Burning**: Los usuarios pueden quemar sus tokens y recibir ETH de vuelta
3. **Dividendos**: Sistema de distribución de dividendos proporcional al balance de tokens
4. **Tracking de Holders**: Mantiene una lista actualizada de todos los holders

### Seguridad Implementada

- ✅ **ReentrancyGuard**: Protección contra ataques de reentrancy en `burn()` y `withdrawDividend()`
- ✅ **Validación de direcciones cero**: Previene transferencias a `address(0)`
- ✅ **Safe ETH transfers**: Usa `Address.sendValue()` de OpenZeppelin para transferencias seguras
- ✅ **Checks-Effects-Interactions**: Patrón CEI implementado en todas las funciones críticas
- ✅ **Eventos**: Emisión de eventos para todas las operaciones importantes
- ✅ **Custom Errors**: Uso de errores personalizados para optimización de gas

## Desarrollo

### Compilar Contratos

```bash
npm run compile
```

Los contratos compilados se generan en `artifacts/` y los tipos TypeScript en `typechain-types/`.

### Ejecutar Tests

```bash
npm test
```

El proyecto incluye **30 tests** que cubren:
- Deployment y valores por defecto
- Minting de tokens
- Burning de tokens
- Transferencias directas e indirectas (approve/transferFrom)
- Sistema de dividendos (distribución, compuestos, retiros)
- Validaciones de seguridad (direcciones cero, balances, índices)

#### Resultados de los Tests

Todos los tests pasan exitosamente:

![Resultados de Tests](docs/images/test-results.png)

**Resumen de Tests:**
- ✅ **30 tests pasando** en ~542ms
- ✅ Deployment: 2 tests
- ✅ Minting: 5 tests
- ✅ Burning: 5 tests
- ✅ Transfers: 4 tests
- ✅ Dividends: 12 tests
- ✅ Security: 3 tests

### Desplegar Contratos

1. Iniciar un nodo Hardhat local:

```bash
npm run node
```

2. En otra terminal, desplegar el contrato:

```bash
npm run deploy
```

El script mostrará la dirección del contrato desplegado y sus detalles iniciales.

### Linting

Ejecutar el linter de Solidity:

```bash
npm run lint
```

## Arquitectura del Contrato

### Token.sol

El contrato principal hereda de:
- `ERC20` (OpenZeppelin): Funcionalidad estándar ERC20
- `ReentrancyGuard` (OpenZeppelin): Protección contra reentrancy
- `IMintableToken`: Interfaz para minting
- `IDividends`: Interfaz para dividendos

### Funciones Principales

- `mint()`: Mintea tokens enviando ETH (payable)
- `burn(address dest)`: Quema todos los tokens del caller y envía ETH a `dest`
- `recordDividend()`: Registra un dividendo y lo distribuye proporcionalmente
- `withdrawDividend(address dest)`: Retira el dividendo acumulado del caller
- `getWithdrawableDividend(address)`: Consulta el dividendo disponible
- `getNumTokenHolders()`: Obtiene el número total de holders
- `getTokenHolder(uint256 index)`: Obtiene un holder por índice

## Mejores Prácticas Implementadas

1. **Uso de OpenZeppelin**: Contratos auditados y seguros
2. **TypeScript**: Tipado estático en todo el proyecto
3. **Tests Comprehensivos**: Cobertura completa de funcionalidades y edge cases
4. **Fixtures**: Uso de `loadFixture` para tests eficientes y aislados
5. **Eventos**: Emisión de eventos para todas las operaciones críticas
6. **Gas Optimization**: Custom errors en lugar de strings para revert
7. **Documentación**: Comentarios Natspec en funciones importantes

## Seguridad

Este proyecto utiliza **OpenZeppelin Contracts**, una biblioteca de contratos seguros y auditados por la comunidad. Las mejoras de seguridad implementadas incluyen:

- Protección contra reentrancy attacks
- Validación de direcciones cero
- Transferencias seguras de ETH
- Patrón Checks-Effects-Interactions

**Importante**: Siempre use el código de OpenZeppelin tal cual está instalado, sin copiar y pegar desde fuentes en línea ni modificarlo usted mismo.

## Configuración de Redes

El proyecto está configurado con las siguientes redes:

- **hardhat**: Red local de desarrollo (chainId: 5777)
- **localhost**: Red localhost (chainId: 5777)

Para agregar más redes, edita `hardhat.config.ts`.

## Troubleshooting

### Problema: Node.js version incorrecta

Si encuentras errores relacionados con la versión de Node.js:

```bash
# Usar nvm para cambiar a la versión correcta
nvm use

# O instalar Node.js 22 manualmente
```

### Problema: Tests no ejecutan

Asegúrate de tener todas las dependencias instaladas:

```bash
npm install
```

### Problema: Errores de compilación

Limpia el proyecto y recompila:

```bash
npm run clean
npm run compile
```

## Licencia

MIT

## Contribuciones

Las contribuciones son bienvenidas. Por favor, asegúrate de:

1. Ejecutar todos los tests antes de hacer commit
2. Mantener la cobertura de tests alta
3. Seguir las mejores prácticas de seguridad
4. Documentar cambios importantes
