# Protirodh - Vaccination Management System

A comprehensive digital vaccination management system for Bangladesh that automates the end-to-end vaccination process from citizen registration to vaccine supply tracking.

## 🎯 Overview

Protirodh addresses critical challenges in the vaccination process:
- Manual data entry leading to record mismatches
- Difficulty maintaining accurate vaccine stock levels
- Long queues and inefficient scheduling
- Limited visibility of vaccine wastage and distribution

## ✨ Features

### 🧑‍💼 Citizen Portal
- **Registration**: Register with NID or Birth Certificate
- **Appointment Booking**: Schedule vaccinations at preferred centers
- **Digital Vaccine Card**: Access and download digital vaccination certificates
- **QR Code Verification**: Secure verification system

### 🏥 Vaccination Center Management
- **Appointment Dashboard**: View and manage daily appointments
- **Vaccine Inventory**: Real-time stock tracking with alerts
- **Staff Management**: Track staff members and their roles
- **Wastage Reporting**: Monitor and report vaccine wastage

### 📊 Authority Dashboard
- **Analytics & Insights**: Comprehensive vaccination coverage statistics
- **Supply Chain Tracking**: Monitor vaccine distribution across centers
- **Wastage Analysis**: Track and analyze wastage patterns
- **Coverage Visualization**: Regional vaccination coverage metrics
- **Stock Alerts**: Real-time alerts for low stock centers

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: React Icons
- **Package Manager**: pnpm

## 📁 Project Structure

```
protirodh/
├── app/
│   ├── page.tsx                    # Landing page with role selection
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── citizen/
│   │   ├── page.tsx               # Citizen dashboard
│   │   ├── register/page.tsx      # Registration form
│   │   ├── appointment/page.tsx   # Appointment booking
│   │   └── vaccine-card/page.tsx  # Digital vaccine card
│   ├── center/
│   │   └── page.tsx               # Center management dashboard
│   └── authority/
│       └── page.tsx               # Authority analytics dashboard
├── components/
│   └── ui.tsx                     # Reusable UI components
├── lib/
│   ├── types.ts                   # TypeScript type definitions
│   └── mockData.ts                # Mock data for MVP
└── public/                        # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd protirodh
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## 📱 Key Components

### UI Components (`components/ui.tsx`)
- **Card**: Container component with hover effects
- **Button**: Multi-variant button with sizes
- **Badge**: Status indicators
- **StatCard**: Dashboard statistics display
- **Table**: Data table with headers and rows
- **Input**: Form input fields
- **Select**: Dropdown selection fields

### Data Types (`lib/types.ts`)
- Citizen
- VaccinationRecord
- Appointment
- VaccinationCenter
- VaccineStock
- SupplyChainRecord
- DashboardStats
- WastageReport
- AnalyticsData

## 🎨 Design Principles

- **Minimal UI**: Clean, simple, and intuitive interface
- **Responsive**: Mobile-first design approach
- **Accessible**: Color-coded status indicators
- **Type-Safe**: Full TypeScript implementation
- **Component-Based**: Reusable, modular components

## 📊 Data Model

### Supported Vaccine Types
- Pfizer-BioNTech
- Moderna
- AstraZeneca
- Sinopharm
- Sinovac

### Appointment Status
- Scheduled
- Completed
- Cancelled
- Missed

### Supply Chain Status
- In-Transit
- Delivered
- Delayed

## 🔮 Future Enhancements

### Planned Features
- [ ] QR code generation and scanning
- [ ] SMS/Email notifications
- [ ] OCR for vaccine card digitization
- [ ] AI chatbot for citizen support
- [ ] Predictive analytics for demand forecasting
- [ ] Anomaly detection for stock reports
- [ ] Multi-language support (Bengali & English)
- [ ] Mobile app development
- [ ] Integration with national health database

### AI/Automation Opportunities
- Chatbot for answering FAQs
- OCR for automatic data entry from paper cards
- Demand forecasting using historical data
- Wastage prediction and prevention
- Automated report generation

## 👥 Target Users

1. **Citizens**: 8.9K+ registered users
2. **Vaccination Centers**: 3 operational centers
3. **Health Authorities**: Central monitoring and oversight

## 📈 Current Statistics (MVP Demo Data)

- Total Vaccinations: 12,500
- Citizens Registered: 8,900
- Vaccination Rate: 78.5%
- Active Centers: 3
- Total Stock: 6,000+ doses

## 🤝 Contributing

This is an MVP (Minimum Viable Product) demonstration. For production deployment:
1. Implement backend API
2. Set up database (PostgreSQL/MongoDB)
3. Add authentication & authorization
4. Implement real-time notifications
5. Add QR code functionality
6. Set up monitoring and logging

## 📄 License

This project is part of a hackathon/competition submission.

## 📞 Support

For issues or questions, please contact the development team.

---

**Protirodh** - Simplifying Vaccination Management in Bangladesh 🇧🇩
