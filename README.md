# Smart Contract Project

A production-ready ERC-20 token smart contract project built with Hardhat 2.22, TypeScript, and OpenZeppelin Contracts 5.x. This project implements a mintable token with proportional dividend distribution functionality.

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Technologies & Libraries](#technologies--libraries)
- [Why TypeScript?](#why-typescript)
- [Contract Features](#contract-features)
- [Security](#security)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

This project implements a mintable ERC-20 token contract that allows users to:
- **Mint tokens** by depositing ETH (1:1 ratio)
- **Burn tokens** to receive ETH back
- **Receive dividends** distributed proportionally based on token holdings
- **Track holders** automatically through transfers and minting/burning operations

The contract follows industry best practices and security standards, leveraging OpenZeppelin's battle-tested contracts and implementing comprehensive test coverage.

## Requirements

- [Node.js](https://nodejs.org/) **v22.0.0 or higher**
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Hardhat](https://hardhat.org/) (included as dependency)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Smart-Contract
```

2. The project uses `.nvmrc` for Node.js version management. If you use `nvm`:

```bash
nvm use
```

3. Install dependencies:

```bash
npm install
# or
pnpm install
```

## Project Structure

```
Smart-Contract/
├── contracts/              # Solidity smart contracts
│   ├── Token.sol          # Main token contract
│   ├── IMintableToken.sol # Minting interface
│   └── IDividends.sol     # Dividends interface
├── test/                  # TypeScript test suite
│   └── Token.test.ts      # Comprehensive test coverage
├── scripts/               # Deployment scripts
│   └── deploy.ts          # Deployment script
├── docs/                  # Documentation
│   └── images/           # Project images
├── hardhat.config.ts      # Hardhat configuration
├── tsconfig.json          # TypeScript configuration
├── .nvmrc                 # Node.js version specification
└── package.json           # Dependencies and scripts
```

## Technologies & Libraries

### Core Framework

#### **Hardhat 2.22.0**
Hardhat is a development environment for Ethereum software. It provides:
- **Compilation**: Compiles Solidity contracts with optimizations
- **Testing**: Built-in testing framework with network forking
- **Deployment**: Scripts for deploying contracts to various networks
- **Debugging**: Stack traces and error messages for failed transactions
- **Plugin Ecosystem**: Extensible through plugins

**Why Hardhat 2.22?** This version provides stability and compatibility with the latest Solidity features while maintaining a mature plugin ecosystem.

#### **Solidity 0.8.24**
The latest stable version of Solidity with:
- Built-in overflow/underflow protection
- Custom errors for gas optimization
- Improved optimizer
- Enhanced security features

### TypeScript & Development Tools

#### **TypeScript 5.7**
TypeScript provides static type checking for JavaScript. See [Why TypeScript?](#why-typescript) section for detailed explanation.

#### **TypeChain 8.3.2**
Automatically generates TypeScript type definitions from Solidity contracts:
- **Type Safety**: Full type safety when interacting with contracts
- **IntelliSense**: Auto-completion in IDEs
- **Refactoring**: Safe refactoring with type checking
- **Documentation**: Types serve as inline documentation

**Packages:**
- `@typechain/hardhat`: Hardhat plugin for TypeChain
- `@typechain/ethers-v6`: Ethers.js v6 type bindings

#### **ts-node 10.9.2**
Enables direct execution of TypeScript files without compilation:
- Run TypeScript scripts directly
- Faster development iteration
- No separate compilation step needed

### Blockchain Interaction

#### **Ethers.js v6.13.0**
A complete Ethereum library for interacting with the blockchain:
- **Provider Abstraction**: Works with any Ethereum node
- **Type Safety**: Full TypeScript support
- **BigInt Support**: Native BigInt for large numbers
- **Event Handling**: Efficient event filtering and listening
- **Transaction Management**: Signing, sending, and monitoring transactions

**Why Ethers.js v6?**
- Modern API design
- Better TypeScript support
- Improved performance
- Active maintenance and updates

#### **@nomicfoundation/hardhat-ethers 3.1.2**
Hardhat plugin that integrates Ethers.js:
- Seamless integration with Hardhat
- Type-safe contract interactions
- Network abstraction

### Testing Framework

#### **Mocha 10.x**
A feature-rich JavaScript test framework:
- Flexible test structure
- Async/await support
- Multiple reporters
- Timeout configuration

#### **Chai 4.4.1**
A BDD/TDD assertion library:
- Readable assertions
- Multiple assertion styles
- Plugin ecosystem

#### **@nomicfoundation/hardhat-chai-matchers 2.1.0**
Hardhat-specific Chai matchers for smart contract testing:
- `reverted` / `revertedWith`: Test for transaction reverts
- `emit`: Test for event emissions
- `changeBalance`: Test for balance changes
- `changeTokenBalance`: Test for token balance changes

#### **@nomicfoundation/hardhat-network-helpers 1.1.2**
Utilities for manipulating Hardhat Network:
- `loadFixture`: Efficient test fixtures
- `time`: Time manipulation for testing
- `mine`: Mine blocks programmatically
- `impersonateAccount`: Impersonate accounts for testing

### Security & Quality

#### **OpenZeppelin Contracts 5.1.0**
Industry-standard secure smart contract library:
- **Audited Code**: Community-audited contracts
- **Security Best Practices**: Implements security patterns
- **Gas Optimized**: Efficient implementations
- **Upgradeable**: Support for upgradeable contracts
- **Standards Compliant**: ERC-20, ERC-721, ERC-1155, etc.

**Components Used:**
- `ERC20`: Standard token implementation
- `ReentrancyGuard`: Protection against reentrancy attacks
- `Address`: Safe address operations and ETH transfers

#### **Solhint 5.1.3**
Solidity linter for code quality:
- Style checking
- Security vulnerability detection
- Best practice enforcement
- Gas optimization suggestions

#### **solidity-coverage 0.8.11**
Code coverage tool for Solidity:
- Measures test coverage
- Generates coverage reports
- Identifies untested code paths

#### **hardhat-gas-reporter 1.0.10**
Gas usage reporting for tests:
- Tracks gas consumption
- Identifies gas-inefficient operations
- Helps optimize contract code

### Build Tools

#### **rimraf 6.0.1**
Cross-platform `rm -rf` for Node.js:
- Clean build artifacts
- Works on all platforms
- Fast and reliable

## Why TypeScript?

TypeScript is used throughout this project for several critical reasons:

### 1. **Type Safety**
TypeScript provides compile-time type checking, catching errors before runtime:
- **Contract Interaction Safety**: Type-safe contract method calls prevent incorrect function signatures
- **Parameter Validation**: Ensures correct types are passed to contract functions
- **Return Type Checking**: Validates that return values match expected types

### 2. **Developer Experience**
- **IntelliSense**: Auto-completion for contract methods, parameters, and return types
- **Refactoring**: Safe refactoring with IDE support
- **Documentation**: Types serve as inline documentation
- **Error Prevention**: Catches common mistakes during development

### 3. **Integration with TypeChain**
TypeChain generates TypeScript types from Solidity contracts:
- **Automatic Type Generation**: Types are generated from contract ABIs
- **Synchronization**: Types stay in sync with contract changes
- **Type-Safe Testing**: Test code benefits from full type checking

### 4. **Maintainability**
- **Self-Documenting Code**: Types make code intent clear
- **Easier Onboarding**: New developers understand code faster
- **Reduced Bugs**: Type checking prevents many common errors
- **Better IDE Support**: Enhanced tooling and debugging

### 5. **Production Readiness**
- **Confidence**: Type checking increases confidence in code correctness
- **Scalability**: Easier to maintain as project grows
- **Team Collaboration**: Types facilitate better team communication

### Example: Type Safety in Action

```typescript
// Without TypeScript (JavaScript)
const token = await TokenFactory.deploy();
await token.mint({ value: "100" }); // Error: string instead of BigInt

// With TypeScript
const token: Token = await TokenFactory.deploy();
await token.mint({ value: parseEther("100") }); // ✅ Type-safe, IDE autocomplete
```

## Contract Features

### Core Functionality

1. **Minting**: Users can mint tokens by sending ETH to the contract (1 ETH = 1 Token)
2. **Burning**: Users can burn their entire token balance and receive equivalent ETH
3. **Dividends**: Proportional dividend distribution based on token holdings
4. **Holder Tracking**: Automatic tracking of all token holders

### Security Features

- ✅ **ReentrancyGuard**: Protection against reentrancy attacks in `burn()` and `withdrawDividend()`
- ✅ **Zero Address Validation**: Prevents transfers to `address(0)`
- ✅ **Safe ETH Transfers**: Uses OpenZeppelin's `Address.sendValue()` for secure transfers
- ✅ **Checks-Effects-Interactions Pattern**: CEI pattern implemented in all critical functions
- ✅ **Events**: Event emission for all important operations
- ✅ **Custom Errors**: Gas-optimized error handling

## Security

This project uses **OpenZeppelin Contracts**, a library of secure, community-audited smart contracts. Security measures implemented include:

- **Reentrancy Protection**: `ReentrancyGuard` modifier on critical functions
- **Zero Address Validation**: All external functions validate addresses
- **Safe ETH Transfers**: OpenZeppelin's `Address.sendValue()` prevents common pitfalls
- **Checks-Effects-Interactions**: CEI pattern prevents state inconsistencies

**Important**: Always use OpenZeppelin code as installed, without copying from online sources or modifying it yourself.

## Development

### Available Scripts

- `npm run clean` - Clean generated files (artifacts, cache, typechain-types)
- `npm run compile` - Compile Solidity contracts
- `npm test` - Run all tests
- `npm run test:coverage` - Generate code coverage report
- `npm run deploy` - Deploy contracts to localhost network
- `npm run node` - Start local Hardhat node for development
- `npm run lint` - Run Solidity linter (solhint)

### Compile Contracts

```bash
npm run compile
```

Compiled contracts are generated in `artifacts/` and TypeScript types in `typechain-types/`.

### Linting

Run the Solidity linter:

```bash
npm run lint
```

## Testing

### Run Tests

```bash
npm test
```

The project includes **30 comprehensive tests** covering:
- Deployment and default values
- Token minting
- Token burning
- Direct and indirect transfers (approve/transferFrom)
- Dividend system (distribution, compounding, withdrawals)
- Security validations (zero addresses, balances, indices)

### Test Results

All tests pass successfully:

![Test Results](docs/images/test-results.png)

**Test Summary:**
- ✅ **30 tests passing** in ~542ms
- ✅ Deployment: 2 tests
- ✅ Minting: 5 tests
- ✅ Burning: 5 tests
- ✅ Transfers: 4 tests
- ✅ Dividends: 12 tests
- ✅ Security: 3 tests

### Test Architecture

Tests use:
- **Fixtures**: `loadFixture` for efficient, isolated test setup
- **Type Safety**: Full TypeScript types from TypeChain
- **Hardhat Network Helpers**: Utilities for test manipulation
- **Chai Matchers**: Hardhat-specific assertions for contract testing

## Deployment

### Local Deployment

1. Start a local Hardhat node:

```bash
npm run node
```

2. In another terminal, deploy the contract:

```bash
npm run deploy
```

The script will display the deployed contract address and initial details.

### Network Configuration

The project is configured with the following networks:

- **hardhat**: Local development network (chainId: 5777)
- **localhost**: Localhost network (chainId: 5777)

To add more networks, edit `hardhat.config.ts`.

## Architecture

### Contract Inheritance

The main `Token` contract inherits from:

- `ERC20` (OpenZeppelin): Standard ERC-20 token functionality
- `ReentrancyGuard` (OpenZeppelin): Reentrancy attack protection
- `IMintableToken`: Minting interface
- `IDividends`: Dividends interface

### Main Functions

- `mint()`: Mint tokens by sending ETH (payable function)
- `burn(address dest)`: Burn all caller's tokens and send ETH to `dest`
- `recordDividend()`: Record a dividend and distribute proportionally
- `withdrawDividend(address dest)`: Withdraw accumulated dividend
- `getWithdrawableDividend(address)`: Query available dividend
- `getNumTokenHolders()`: Get total number of holders
- `getTokenHolder(uint256 index)`: Get holder by index

### Internal Functions

- `_addHolder(address)`: Add holder to tracking list
- `_removeHolder(address)`: Remove holder from tracking list
- `_updateHolders(address from, address to)`: Update holders after transfer
- `_removeFromArray(address)`: Remove address from holders array

## Best Practices

This project implements industry best practices:

1. **OpenZeppelin Contracts**: Using audited, secure contracts
2. **TypeScript**: Static typing throughout the project
3. **Comprehensive Testing**: Full coverage of functionality and edge cases
4. **Fixtures**: Efficient, isolated test setup with `loadFixture`
5. **Events**: Event emission for all critical operations
6. **Gas Optimization**: Custom errors instead of strings for reverts
7. **Documentation**: Natspec comments on important functions
8. **Security Patterns**: CEI pattern, reentrancy protection, zero address checks

## Troubleshooting

### Node.js Version Issues

If you encounter Node.js version errors:

```bash
# Use nvm to switch to correct version
nvm use

# Or install Node.js 22 manually
```

### Tests Not Running

Ensure all dependencies are installed:

```bash
npm install
```

### Compilation Errors

Clean and recompile:

```bash
npm run clean
npm run compile
```

### TypeScript Errors

Regenerate TypeChain types:

```bash
npm run clean
npm run compile
```

## License

MIT

## Contributing

Contributions are welcome! Please ensure:

1. Run all tests before committing
2. Maintain high test coverage
3. Follow security best practices
4. Document significant changes
5. Use TypeScript types correctly
6. Follow the existing code style
