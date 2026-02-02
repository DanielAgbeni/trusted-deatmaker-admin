# TDM Project - Developer Handover Document

## Project Overview

The Dealmakers (TDM) is an escrow transaction management application that facilitates secure transactions between buyers and sellers through marketplace integrations. The platform includes three main dashboards with comprehensive transaction, dispute, and configuration management capabilities.

## Current State

The frontend UI has been implemented with the following dashboards:

- **Admin Dashboard (AD)** - System administration and oversight - `src/app/dashboard/ad/`
- **Marketplace Dashboard (MP)** - Marketplace partner management - `src/app/dashboard/mp/`
- **User Dashboard (US)** - End-user transaction management - `src/app/dashboard/us/`
- **Public Website** - Public-facing pages

**API Integration Status:** None of the APIs are currently integrated. All dashboards are using mock/static data.

**Important Context:** The tasks outlined below were identified during a client review meeting conducted **after** the API specification documents were created. Most changes affect the **Admin Dashboard**, though some apply across all dashboards.

**Implementation Approach:** The most important task is **API Integration**. As you integrate APIs module by module, you will encounter modules that need enhancements. This document serves as context for those enhancements—implement them as you work through each module during API integration. Navigation link fixes can also be addressed progressively as you work through each module.

---

## Outstanding Tasks

### 1. API Integration - All Dashboards

**Scope:** Admin Dashboard, Marketplace Dashboard, User Dashboard

All backend APIs need to be integrated across the three dashboards. API specification documents are available in the `api-spec/` directory:

- `api-specification-ad-dashboard.md` - Admin Dashboard APIs
- `api-specification-mp-dashboard.md` - Marketplace Dashboard APIs
- `api-specification-user-dashboard.md` - User Dashboard APIs
- `public_api_endpoints.md` - Public API endpoints

**Action Required:** Replace all mock data with actual API calls following the specifications provided.

---

### 2. Fix All Broken Navigation Links - All Dashboards

**Scope:** Admin Dashboard, Marketplace Dashboard, User Dashboard

**Issue:** Throughout all dashboards, there are broken navigation links that need to be fixed. These include:

- Links in data tables that should navigate to detail pages
- Action buttons that should navigate to related entities
- Context menu items that should navigate to specific views
- Statistics cards that should navigate to filtered views

**Action Required:**

- Audit all navigation links across the three dashboards
- Ensure all links point to valid routes and pass correct parameters (IDs, filters, etc.)
- Test navigation flows between related entities (user → transactions, transaction → disputes, etc.)

---

### 3. User Page - Statistics Card Filtering - Admin Dashboard

**Scope:** Admin Dashboard - Users Module

**Location:** `src/app/dashboard/ad/users/[id]/page.tsx` and `user-stats.tsx`

**Requirement:** When clicking on any statistics card (Transactions, Deposits, Withdrawals), the user should be redirected to a filtered view showing only data relevant to that specific user.

**Implementation Details:**

- **Deposits card** → Navigate to deposits page filtered for this user
  - Further filterable by status: Pending, Successful, Rejected, Initiated
- **Withdrawals card** → Navigate to withdrawals page filtered for this user
  - Further filterable by status: Pending, Successful, Rejected, Initiated
- **Transactions card** → Navigate to transactions page filtered for this user
- **Balance card** → Static display only (no filtering needed)

**Example Flow:**

1. On user detail page, click "Deposits" card → Navigate to `/dashboard/ad/deposits?userId={id}`
2. On filtered deposits page, show status breakdown cards (Pending, Successful, etc.)
3. Clicking a status card further filters: `/dashboard/ad/deposits?userId={id}&status=pending`

---

### 4. Escrow Transaction Enhancements - Admin Dashboard

**Scope:** Admin Dashboard - Escrow Transactions Module

**Location:** Escrow transaction details pages

#### 4.1 Marketplace Status Indicator

**Requirement:** Add a visual status indicator for marketplace active/inactive status using color coding.

**Implementation:**

- Active marketplace → Use green or similar color
- Inactive marketplace → Use gray color
- Can be a badge, dot indicator, or colored text

#### 4.1 Dispute Status and Navigation

**Requirement:** Add "Dispute" as a possible transaction status for escrow transactions.

**Implementation:**

- If transaction status is "In Dispute" or "Dispute", add a clickable link/button
- Clicking should navigate to the dispute details page for that specific transaction
- Route: `/dashboard/ad/disputes/{disputeId}` (fetch disputeId based on transactionId)

---

### 5. Disputes Management Enhancements - Admin Dashboard

**Scope:** Admin Dashboard - Disputes Module

**Location:** `src/app/dashboard/ad/disputes/[disputeId]/page.tsx`

#### 5.1 Dispute Evidence Panel

**Requirement:** Add an evidence/history panel to the dispute details page showing:

- Complete chat/communication history between buyer and seller
- Timestamps for each message/action
- Any notes added by arbitrators (if escalated)
- Admin notes from backend team
- Resolution snapshots (uneditable once finalized)
- Auto-escalation events

**Visual Reference:** Similar to escrow.com's dispute interface with chronological chat-style display.

**Key Points:**

- All communication should be timestamped
- When resolution is agreed upon, snapshot it as uneditable
- Show complete audit trail for legal protection
- Format as chat-like interface for easy reading
- Consider using a timeline or message-thread component

**Note:** This may require WebSocket or polling for real-time updates. Confirm with backend team.

---

### 6. Marketplace Details Display - Admin Dashboard

**Scope:** Admin Dashboard - Marketplace Module

**Location:** Marketplace full details page

**Required Fields to Display:**

- Marketplace Name
- Is Verified (Yes/No indicator or badge)
- Representative Name
- Representative Phone Number
- Representative Email
- Representative Contact Details (additional contact info)

**Note:** Ensure these fields are included in the API response and displayed prominently in the marketplace details view.

---

### 7. Transaction Flow - Bids vs Offers - Admin Dashboard

**Scope:** Admin Dashboard - System Configuration Module

**Location:** System Configuration → Transaction Flow (tabs: Bids, Orders, Milestones, etc.)

**Current State:** There is a "Bids" table/tab in the Transaction Flow section.

**Terminology:**

- **Bid** = Request coming FROM the buyer (buyer wants to purchase something)
- **Offer** = Request coming FROM the seller (seller is offering to sell/provide service)

**Requirement:** Rename the "Bids" tab to "Bids/Offers" and add a column to distinguish between bids and offers.

**Implementation:**

- Change tab label from "Bids" to "Bids/Offers"
- Add a "Type" column in the table that displays either "Bid" or "Offer"
- This clarifies who initiated the transaction (buyer vs seller)

**Context:**

- In an auction, the audience makes "bids"
- When a buyer requests a service, they are "bidding" for that service
- When a seller proposes to sell, they are making an "offer"

**Note:** This change will be implemented when you arrive at the System Configuration module during API integration. Detail pages for bids/offers may not exist yet and will be designed when needed.

---

### 8. Transaction Flow - Detail Pages for All Tabs - Admin Dashboard

**Scope:** Admin Dashboard - System Configuration Module

**Location:** System Configuration → Transaction Flow (tabs: Bids/Offers, Orders, Milestones, etc.)

**Current State:** Transaction Flow displays tables in tabs (Bids, Orders, Milestones) but has no detail pages or detail actions.

**Requirement:** Add a "Details" action/link to each table row that navigates to a dedicated detail page for that item.

**Implementation Details:**

#### For Orders Tab:

- Add "View Details" action to each order row
- Navigate to order detail page showing comprehensive information about that order
- Display if the order is a single item or part of a milestone

#### For Milestones Tab:

- Add "View Details" action to each milestone row
- Navigate to milestone detail page showing milestone-specific information
- Milestones are attached to orders—show relationship and related order details

#### For Bids/Offers Tab:

- Add "View Details" action to each bid/offer row
- Navigate to bid/offer detail page showing additional details

**Note:** These detail pages **do not exist yet**. The designer will create these pages. This enhancement will be implemented when you work on the System Configuration module during API integration. Focus on API integration first; when you reach this module, the designs should be ready.

---

## API Specifications Reference

All API endpoints and data structures are documented in the following files:

1. **[api-specification-ad-dashboard.md](api-spec/api-specification-ad-dashboard.md)** - Admin Dashboard
2. **[api-specification-mp-dashboard.md](api-spec/api-specification-mp-dashboard.md)** - Marketplace Dashboard
3. **[api-specification-user-dashboard.md](api-spec/api-specification-user-dashboard.md)** - User Dashboard
4. **[public_api_endpoints.md](api-spec/public_api_endpoints.md)** - Public APIs

Please review these documents for exact endpoint URLs, request/response formats, authentication requirements, and error handling.

---

## Technical Stack & Setup

**Framework:** Next.js 15 (TypeScript)

**Project Structure:**

- `src/app/dashboard/ad/` - Admin Dashboard pages
- `src/app/dashboard/mp/` - Marketplace Dashboard pages
- `src/app/dashboard/us/` - User Dashboard pages

**Key Commands:**

- Development: Check `package.json` for dev script (likely `npm run dev` or `yarn dev`)
- Build: Check `package.json` for build script (likely `npm run build`)
- Dependencies: `npm install` or `yarn install`

**Recent Context:**

- Next.js 15 build errors were recently resolved (commit: 0278922)
- Currency settings aligned with API specification (commit: 0ba9a77)
- System timers refactored with improved duration model (commit: 68bcd23)

---

## Notes & Recommendations

### Priority Order (Suggested)

1. **API Integration** - Most critical task; integrate module by module
2. **Fix Broken Navigation Links** - Address progressively as you work through modules
3. **Module-Specific Enhancements** - Implement as you reach each module during API integration:
   - User Statistics Filtering (Users Module)
   - Escrow Transaction Enhancements (Escrow Transactions Module)
   - Disputes Management Enhancements (Disputes Module)
   - Marketplace Details Display (Marketplace Module)
   - Transaction Flow Changes (System Configuration Module - Bids/Offers, Detail Pages)

## Contact & Handover

All UI components and page structures are in place. The primary work remaining is API integration with module-specific enhancements implemented progressively as you work through each module.

**Recommended Workflow:**
1. Start API integration module by module
2. When you reach a module that has enhancements listed in this document, implement those enhancements
3. Fix broken navigation links as you encounter them in each module
4. Some enhancements require new design pages that don't exist yet—these will be provided by the designer when you reach those modules

The codebase is ready for backend connection. Focus on the Admin Dashboard first, as most changes apply there.

**Good luck with the development!**
