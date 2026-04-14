# TipPost

Decentralized application for tipping posts, consisting of a Hardhat-based smart contract project and a Vite-React frontend.

## Project Structure

- `contracts/`: Hardhat-based smart contracts project.
- `frontend/`: Vite + React + TypeScript + ethers.js frontend.

## Tech Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript (Strict Mode)
- **Web3 Library**: Ethers.js v6
- **Styling**: Vanilla CSS (unless otherwise specified)

### Smart Contracts
- **Framework**: Hardhat
- **Language**: Solidity
- **Testing**: Mocha/Chai via Hardhat

## Log

### 2026-04-14
- Initialized repository and scaffolded projects.
- Fixed frontend build issues:
    - Installed missing React dependencies (`react`, `react-dom`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`).
    - Configured `tsconfig.json` for JSX (`"jsx": "react-jsx"`).
    - Created `vite.config.ts`.
    - Converted `main.ts` to `main.tsx` and updated bootstrap logic to mount to `#root`.
    - Cleaned up vanilla TS template boilerplate.
- Verified successful frontend build (`npm run build`).

## Technical Requirements & Best Practices
- Use ethers.js v6.
- Maintain TypeScript strict mode.
- Adhere to ESLint rules (no `any`).
- Follow established patterns for decentralized information storage and retrieval.
