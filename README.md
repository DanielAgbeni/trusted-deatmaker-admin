# TrustedDealMaker

A comprehensive escrow and marketplace platform that facilitates secure transactions between buyers and sellers through a trusted intermediary system.

## Overview

TrustedDealMaker bridges the gap between buyers and sellers by providing a secure transaction ecosystem. The platform acts as an escrow service, holding funds until transaction completion, ensuring both parties fulfill their obligations safely.

## Key Features

### 🔒 Secure Escrow System
- **Payment Protection**: Buyer funds are held in escrow until delivery confirmation
- **Milestone Payments**: Flexible payment system allowing staged payments for larger projects
- **Dispute Resolution**: Built-in dispute management system for transaction conflicts

### 👥 Multi-Role Dashboard
- **User Dashboard**: Transaction management, wallet operations, and profile settings
- **Marketplace Dashboard**: Vendor tools for managing offers and transactions
- **Admin Dashboard**: Platform administration and user management

### 💰 Comprehensive Wallet Management
- **Deposits & Withdrawals**: Secure money transfer operations
- **Bank Card Integration**: Multiple payment method support
- **KYC Verification**: Identity verification for enhanced security
- **Transaction History**: Complete transaction tracking and analytics

### 🛒 Marketplace Features
- **Request System**: Users create requests, vendors respond with offers
- **Product Catalog**: Browse and search available products/services
- **Real-time Chat**: Communication between buyers and sellers
- **Flexible Pricing**: Budget-based pricing negotiations

## How It Works

1. **Agreement**: Buyer and seller agree on price, delivery terms, and conditions
2. **Escrow Payment**: Buyer releases agreed amount to escrow account
3. **Product Delivery**: Seller ships product and notifies the platform
4. **Confirmation**: Buyer receives and confirms product satisfaction
5. **Payment Release**: Platform releases payment to seller

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **DaisyUI** - Component library

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Heroicons** - Additional icons
- **Sonner** - Toast notifications

### Form Management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Formik** - Alternative form solution

### Data Visualization
- **Recharts** - Chart and analytics components
- **Tanstack Table** - Advanced table functionality

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dealmakers
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public-pages)/          # Public website pages
│   │   ├── (home)/              # Landing page
│   │   ├── about/               # About page
│   │   ├── explore/             # Product exploration
│   │   └── beta/                # Beta features
│   └── dashboard/               # Dashboard application
│       ├── us/                  # User dashboard
│       ├── mp/                  # Marketplace dashboard
│       └── ad/                  # Admin dashboard
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   ├── dashboard/               # Dashboard-specific components
│   └── website/                 # Website-specific components
├── hooks/                       # Custom React hooks
└── utils/                       # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Dashboard Capabilities
- **Transaction Overview**: Real-time transaction monitoring and analytics
- **Wallet Operations**: Comprehensive financial management
- **User Management**: Profile, security settings, and KYC verification
- **Dispute Management**: Handle transaction conflicts and resolutions
- **Commission Tracking**: Monitor earnings and fees

### Security Features
- **KYC Verification**: Identity verification for trusted transactions
- **Secure Payment Processing**: PCI-compliant payment handling
- **Fraud Prevention**: Advanced security measures and monitoring
- **Data Protection**: Secure handling of sensitive user information

### Marketplace Integration
- **Social Login**: Multiple authentication providers
- **Currency Management**: Multi-currency support
- **Policy Management**: Configurable terms and conditions
- **SEO Optimization**: Search engine optimization features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.
