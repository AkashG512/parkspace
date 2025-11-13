# ParkShare v2.0 - Pricing Engine & Admin

A comprehensive two-sided marketplace for peer-to-peer parking with an admin-controlled pricing engine.

## 🚀 Features

### Pricing Engine
- **Admin-Controlled Pricing**: Platform sets all parking prices via configurable rules
- **Rule-Based Pricing**: Configure base rates by location, listing type, and features
- **Dynamic Adjustments**: Apply percentage or flat-rate adjustments (e.g., +10% for garage spots, +5% for EV charging)
- **Priority System**: Control which rules take precedence via priority levels

### Platform Settings
- **Provider Commission**: Configure global commission percentage (e.g., 15-20%)
- **Platform Booking Fee**: Set fixed booking fee for vehicle owners (e.g., $0.99)
- **Real-time Updates**: Changes apply immediately to all pricing calculations

## 🏗️ Architecture

### Tech Stack

**Backend (Node.js + Express + TypeScript)**
- Express.js REST API
- MongoDB + Mongoose ODM
- Zod for validation
- JWT authentication (ready for implementation)

**Frontend (React + shadcn/ui)**
- React 18 with TypeScript
- Vite for blazing-fast builds
- shadcn/ui components with Tailwind CSS
- React Query (TanStack Query) for server state
- React Router v6

**Design System**
- Dark mode first (high-contrast, editorial style)
- Inter font family
- Lucide icons
- Custom color palette optimized for accessibility

## 📁 Project Structure

```
parkshare/
├── apps/
│   ├── server/           # Backend API
│   │   └── src/
│   │       ├── config/   # Environment configuration
│   │       ├── database/ # MongoDB connection
│   │       ├── models/   # Mongoose schemas
│   │       ├── routes/   # API routes (admin & public)
│   │       ├── controllers/
│   │       ├── services/ # Business logic (pricing engine)
│   │       ├── validators/
│   │       └── middleware/
│   └── admin/            # Admin dashboard
│       └── src/
│           ├── components/ui/  # shadcn/ui components
│           ├── pages/          # Route pages
│           ├── services/       # API calls
│           ├── types/          # TypeScript types
│           └── lib/            # Utilities
└── packages/             # Shared packages (future)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**

Backend (apps/server/.env):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parkshare
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

3. **Start development servers**
```bash
# Start both server and admin dashboard
npm run dev

# Or start individually
npm run dev:server   # Backend on port 5000
npm run dev:admin    # Frontend on port 3000
```

## 📡 API Endpoints

### Admin - Pricing Management

**Platform Settings**
- `GET /api/admin/pricing/settings` - Get current platform settings
- `PUT /api/admin/pricing/settings` - Update platform settings

**Pricing Rules**
- `GET /api/admin/pricing/rules` - List all pricing rules
- `POST /api/admin/pricing/rules` - Create new pricing rule
- `PUT /api/admin/pricing/rules/:ruleId` - Update pricing rule
- `DELETE /api/admin/pricing/rules/:ruleId` - Delete pricing rule

### Public

**Price Calculation**
- `POST /api/pricing/quote` - Calculate price for a booking

## 🎨 Design System

### Colors (Dark Mode)
- **Background**: #111111 (deep charcoal)
- **Card**: #1A1A1A (lighter charcoal)
- **Foreground**: #FAFAFA (near white)
- **Accent**: #007AFF (vibrant blue)
- **Muted**: #888888 (grey)
- **Border**: #333333 (subtle grey)

### Typography
- **Font**: Inter
- **Headings**: font-semibold/bold with tracking-wide
- **Body**: font-regular

## 🗄️ Database Models

### PricingRule
- Rule name, scope, and description
- Base rate per hour
- Priority level (lower = higher priority)
- Active/inactive status
- Conditions (cities, postal codes, listing types, features)
- Adjustments (percentage or flat-rate)

### PlatformSettings
- Provider commission percentage
- Platform booking fee (in cents)
- Last updated by (user ID)

## 🔐 Security Considerations

- Input validation with Zod
- CORS configuration
- Helmet for security headers
- HTTP-only cookies for JWT (ready for auth implementation)
- Environment variable management

## 🚧 Future Enhancements

1. **User Authentication**: JWT-based auth with role-based access control
2. **Listings Management**: Full listing CRUD with approval workflow
3. **Bookings System**: Complete booking lifecycle with Stripe integration
4. **Real-time Updates**: Socket.IO for live map updates and notifications
5. **Analytics Dashboard**: Revenue tracking, user metrics, booking statistics
6. **Mobile Apps**: React Native apps for iOS and Android

## 📝 License

Private - All rights reserved
