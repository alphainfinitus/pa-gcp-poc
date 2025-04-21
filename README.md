# Overview

This Proof of Concept (PoC) demonstrates a Next.js application that will be migrated from Vercel to Google Cloud Platform (GCP). The application provides a posts listing and viewing system with on-chain and off-chain data integration.

## Key Features

### Posts Listing and Viewing

#### Home Page (`src/app/(home)/page.tsx`)

- Displays a list of posts fetched from the API
- Each post shows a title and content with a link to view details
- Posts are fetched via `ClientFetchService.fetchPostsList()`

#### Post Detail Page (`src/app/(home)/post/[id]/page.tsx`)

- Displays individual post details
- Shows full JSON data of a single post
- Includes a back button to return to the home page

#### Intercepted Route Modal (`src/app/@modal/(.)post/[id]/page.tsx`)

- When navigating from the home page to a post details page, a modal is displayed instead of a full page transition
- The modal contains the post details with a close button
- Utilizes Next.js intercepted routes for enhanced UX

### Navigation Behavior

- Clicking a post on the home page opens a modal with post details (intercepted route)
- Directly navigating to a post URL (e.g., `/post/123`) opens the full post page
- This provides a seamless user experience with different viewing contexts

### Network Determination

#### API Network Selection (`src/utils/getNetworkFromHeaders.ts`)

- The network or chain-name is determined via the "x-network" header for API requests
- Networks supported include KUSAMA and POLKADOT as defined in `src/types.ts`

#### Frontend Network Selection

- For the front-end, the network is determined by the subdomain
- For example, `kusama.domain.com` would use the KUSAMA network
- Falls back to default network in development environments

### API Implementation

#### Posts API (`src/app/api/posts/route.ts`)

- Fetches posts with pagination support
- Combines on-chain data from `OnChainDbService` with off-chain data from `OffChainDbService`
- Uses the network determined from headers to fetch appropriate data

### Backend API Architecture

#### API Endpoints

- **List Posts (`GET /api/posts`)**: Retrieves a paginated list of posts with configurable page and limit parameters
- **Get Post Details (`GET /api/posts/[index]`)**: Retrieves detailed information about a specific post by its index

#### Data Sources Integration

The API integrates data from two primary sources:

1. **On-Chain Data Service (`OnChainDbService`)**

   - Connects to Subsquid GraphQL endpoints specific to each network (POLKADOT, KUSAMA)
   - Retrieves blockchain data using GraphQL queries
   - Fetches proposal information like status, proposer, creation date, and chain-specific metadata

2. **Off-Chain Data Service (`OffChainDbService`)**
   - Connects to Firebase Firestore database
   - Retrieves supplementary post content, comments, and other non-blockchain data
   - Provides richer content and user-generated information

#### Network Determination Logic

- Uses `getNetworkFromHeaders()` to determine which blockchain network to query:
  1. First checks the `x-network` header in the request
  2. If not found, attempts to determine network from the subdomain (e.g., kusama.domain.com)
  3. Falls back to the default network in development environments

#### Data Merging Process

The API performs a multi-step process to serve complete post data:

1. Fetches on-chain posts list from Subsquid with pagination
2. For each on-chain post, retrieves corresponding off-chain data from Firestore
3. Merges both data sources to create comprehensive post objects
4. Returns combined data with proper pagination metadata

#### Error Handling

- Uses a `withErrorHandling` wrapper for consistent error responses
- Validates request parameters using Zod schema validation
- Provides appropriate error messages and status codes for different failure scenarios

## Architecture

- Built with Next.js App Router
- Utilizes Next.js 13+ features including intercepted routes for modal handling
- Fetches data from backend services using a client service pattern

## Technical Implementation

- Server components for data fetching
- Modal UI for enhanced user experience
- Network-specific data retrieval based on request context
- Error handling and fallback mechanisms

---

This PoC successfully demonstrates the core functionality needed for the migration from Vercel to GCP while preserving all interactive features and network-specific behaviors.
