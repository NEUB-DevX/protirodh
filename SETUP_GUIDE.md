# Protirodh - Quick Setup Guide

## Overview
Protirodh is a vaccination management system MVP with three main portals:
- **Citizen Portal**: Registration, appointments, and vaccine cards
- **Center Portal**: Manage appointments and vaccine inventory
- **Authority Portal**: Analytics and monitoring dashboard

## File Structure
```
/app
  /page.tsx                 - Landing page with 3 role cards
  /citizen
    /page.tsx              - Citizen dashboard
    /register/page.tsx     - Registration form
    /appointment/page.tsx  - Appointment booking
    /vaccine-card/page.tsx - Digital vaccine card
  /center
    /page.tsx              - Center management dashboard
  /authority
    /page.tsx              - Authority analytics

/components
  /ui.tsx                  - Reusable UI components

/lib
  /types.ts                - TypeScript interfaces
  /mockData.ts             - Sample data
```

## Running the App

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

3. Open http://localhost:3000

## Navigation Flow

### Homepage → 3 Portals

1. **Citizen Portal** (Blue)
   - Register → Registration Form
   - Book Appointment → Appointment Booking
   - View Vaccine Card → Digital Card

2. **Center Portal** (Green)
   - View today's appointments
   - Manage vaccine stock
   - Track staff

3. **Authority Portal** (Purple)
   - Dashboard with statistics
   - Coverage by division
   - Supply chain tracking
   - Wastage reports

## Key Features Implemented

✅ Responsive design
✅ TypeScript types
✅ Mock data
✅ 3 stakeholder portals
✅ Digital vaccine card
✅ Stock management
✅ Analytics dashboard
✅ Clean, minimal UI

## Technologies
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- React Icons
- pnpm

## Mock Data
- 2 Citizens with vaccination history
- 3 Vaccination Centers
- 3 Appointments
- Vaccine stock data
- Wastage reports
- Supply chain records

## Next Steps for Production
1. Backend API (Node.js/Express or Next.js API routes)
2. Database (PostgreSQL/MongoDB)
3. Authentication (NextAuth.js)
4. QR Code generation (qrcode library)
5. SMS/Email notifications (Twilio/SendGrid)
6. Real-time updates (WebSockets/Pusher)
7. File uploads (for vaccine cards)
8. PDF generation (jsPDF)
