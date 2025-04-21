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
