# Real Estate Transaction System - Design Document

## 1. Problem Analysis & Solution Overview
The objective was to build a secure, trackable, and automated real estate transaction management system. The core of the problem lies in the transition of a property from "Agreement" to "Completed", where upon completion, the financial breakdown (commission) must be strictly distributed between the agency and the involved agents.

The solution leverages **NestJS** for a scalable, modular backend and **Nuxt 3** with **Pinia** + **Tailwind CSS v4** for a reactive, premium frontend interface.

## 2. Architecture & Module Organization (Backend)
The backend is structured into domain-driven modules:
- `AuthModule`: Handles JWT-based authentication and user sessions.
- `UsersModule`: Manages user records and roles (`AGENCY`, `AGENT`).
- `ListingsModule`: Manages property listings.
- `TransactionsModule`: The core engine of the system, managing the lifecycle of a sale.

### Architectural Decisions:
- **Guard and Decorators**: An `AccessTokenGuard` prevents unauthorized access globally where needed.
- **Service Layer Pattern**: Controllers strictly handle HTTP requests while business rules (e.g., Commission calculations and Stage Transition checks) reside fully within the `TransactionsService`.

## 3. Data Modeling (MongoDB Atlas)
Mongoose was used to define strict schemas.
- **User Schema**: Distinguishes between `AGENCY` and `AGENT`. Agents reference their parent Agency using a standard MongoDB ObjectId reference.
- **Listing Schema**: Contains property details (title, price, location) and a reference to the `listingAgent`.
- **Transaction Schema**: The nexus of the data models.
  - References `Listing`, `listingAgent`, and `sellingAgent`.
  - Enforces the `stage` lifecycle (`agreement` -> `earnest_money` -> `title_deed` -> `completed`).
  - Contains an embedded `commission` document that is only populated when the stage reaches `completed`. This decision avoids complex relational queries and captures the financial snapshot permanently at the time of completion.

## 4. Core Business Logic Implementation
As required, the transaction logic ensures strict transition rules.
- **Stage Transitions**: A hardcoded `STAGE_ORDER` array ensures users cannot skip stages or go backward (e.g., `TITLE_DEED` to `AGREEMENT` throws a `BadRequestException`).
- **Financial Breakdown (Commission)**: 
  Calculated dynamically exactly at the moment the transaction hits the `completed` stage. 
  - Agency always receives 50% (`totalServiceFee * 0.5`).
  - If `listingAgent` === `sellingAgent`, they receive the remaining 50%.
  - If they differ, the remaining 50% is split equally (25% each).

## 5. Frontend Architecture & State Management (Nuxt 3)
- **Nuxt 3**: The application leverages Nuxt 3 to provide rapid routing, layout persistence, and modern Vue 3 composition API capabilities.
- **Pinia Stores**: 
  - `auth.ts`: Manages user tokens in `localStorage` securely.
  - `transactions.ts`: A centralized store to manage the state of the active transactions, preventing prop-drilling and handling API states centrally.
- **Composable (`useApi`)**: A custom `$fetch` wrapper that automatically intercepts requests to attach the `Authorization` Bearer token.
- **UI/UX (Tailwind v4)**: A premium "navy blue / light surface" aesthetic was strictly followed. Custom components like `StageTracker.vue` (for visual step visualization) and `CommissionCard.vue` (for financial breakdown visualization) were built from scratch to ensure reusability.
