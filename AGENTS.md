# TipPost Project Memory

## 1. Project Overview

TipPost is a decentralized social media platform that allows users to tip each other using cryptocurrency. It consists of a Solidity smart contract backend and a Vite-powered React frontend.

## 2. Directory Structure & Guide

- `contracts/`: Smart contract development environment.
  - `contracts/`: Solidity source files (e.g., TipPost.sol).
  - `test/`: Hardhat tests using Ethers.js.
  - `scripts/`: Deployment and interaction scripts.
- `frontend/`: Web interface for the dApp.
  - `src/`: React source code (components, hooks, context).
  - `public/`: Static assets.

## 3. Core Tech Stack

- **Blockchain**: Solidity 0.8.20, Hardhat, Ethers.js v6.
- **Frontend**: Vite, React 19, TypeScript, Vanilla CSS.
- **Tools**: dotenv for environment management.

## 4. Engineering Rules & Mandates

- **Memory**: Strictly maintain `AGENTS.md` at < 200 lines. Update it if there are any changes in the project.
- **TypeScript**: Use strict mode; avoid `any` at all costs.
- **Security**: Never commit `.env` files; use `.env.example` as a template.
- **Best Practices**: Use functional components and hooks for React; keep smart contracts gas-efficient.

## 5. Common Development Commands

### Contracts

- `cd contracts && npx hardhat compile`: Compile contracts.
- `cd contracts && npx hardhat test`: Run tests.
- `cd contracts && npx hardhat node`: Start local Hardhat network.

### Frontend

- `cd frontend && npm install`: Install dependencies.
- `cd frontend && npm run dev`: Start development server.
