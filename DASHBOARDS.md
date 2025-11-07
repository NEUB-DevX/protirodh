# Protirodh - Multi-Level Dashboard System

This document describes the three different dashboard levels in the Protirodh vaccination management system.

## Dashboard Levels

### 1. Hub Dashboard (`/hub`)
**Admin-level central management portal**

#### Features:
- **Vaccine Management**: Add, edit, and delete vaccine information including:
  - Vaccine name and manufacturer
  - Number of doses required
  - Storage temperature requirements
  - Efficacy rates

- **Center Management**: Add, edit, and delete vaccination centers with:
  - Center name and address
  - Division and location
  - Daily capacity
  - Staff count
  - Active/inactive status

- **Stock & Supply Chain**: 
  - View stock requests from centers
  - Approve/reject stock requests
  - Manage supply distribution
  - Track wastage across all centers

- **Movement Tracking**: 
  - Monitor vaccine movement between hub and centers
  - Track delivery status (in-transit, delivered)
  - Log quantities and dates

- **Analytics & Insights**:
  - Coverage by division/region
  - Demographics breakdown by age group
  - AI-powered insights from ML model
  - Data visualization for:
    - Total vaccinated
    - Stock levels
    - Wastage rates
    - Population coverage

#### Access: Central admin/hub managers

---

### 2. Center Dashboard (`/center`)
**Center authority management portal**

#### Features:
- **Schedule Management**:
  - Add/edit/delete date slots for upcoming vaccination days
  - Manage time slots under each date
  - Set capacity for each slot
  - Track bookings and occupancy rates
  - Close/activate specific dates

- **Staff Management**:
  - Add/edit/remove staff members
  - Assign staff to vaccination duties
  - Track staff performance:
    - Appointments assigned
    - Appointments completed
    - Pending appointments
  - Monitor staff activity status

- **Stock Management**:
  - View current stock levels by vaccine
  - Track used, remaining, and wasted doses
  - Request new stock from hub
  - Monitor wastage percentages
  - Storage temperature tracking

- **Preservation Guidelines**:
  - View detailed preservation instructions for each vaccine:
    - Storage temperature requirements
    - Thawed stability duration
    - Room temperature limits
    - Handling instructions
  - Important safety warnings

#### Access: Center administrators/managers

---

### 3. Staff Dashboard (`/staff`)
**Vaccinator/staff portal**

#### Features:
- **Appointment List**:
  - View all assigned appointments for the day
  - See patient information:
    - Name, NID, contact
    - Vaccine and dose number
    - Appointment time

- **Search & Filter**:
  - Search by patient name, NID, or contact
  - Filter by status: All/Pending/Completed/No-Show
  - Sort by time or patient name

- **Vaccination Management**:
  - Mark appointments as completed after vaccination
  - Mark appointments as no-show if patient doesn't arrive
  - View appointment statistics:
    - Total assigned
    - Completed
    - Pending
    - No-shows

#### Access: Vaccination staff/nurses/doctors

---

## User Roles & Permissions

| Feature | Hub Admin | Center Admin | Staff |
|---------|-----------|--------------|-------|
| Manage vaccines | ✅ | ❌ | ❌ |
| Manage centers | ✅ | ❌ | ❌ |
| Approve stock requests | ✅ | ❌ | ❌ |
| View movement tracking | ✅ | ❌ | ❌ |
| View analytics | ✅ | ❌ | ❌ |
| Manage date/time slots | ❌ | ✅ | ❌ |
| Manage staff | ❌ | ✅ | ❌ |
| Request stock | ❌ | ✅ | ❌ |
| View preservation guidelines | ❌ | ✅ | ✅ |
| View appointments | ❌ | ✅ | ✅ |
| Mark vaccination complete | ❌ | ❌ | ✅ |

---

## Navigation

- **Hub Dashboard**: `http://localhost:3000/hub`
- **Center Dashboard**: `http://localhost:3000/center`
- **Staff Dashboard**: `http://localhost:3000/staff`
- **User Portal** (citizens): `http://localhost:3000/portal`

---

## Mock Data

All dashboards currently use mock data for demonstration. To integrate with real backend:

1. Replace mock data arrays with API calls
2. Implement authentication for each dashboard level
3. Connect CRUD operations to backend endpoints
4. Integrate ML model API for analytics insights

---

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: React Icons
- **State Management**: React hooks (useState)

---

## Future Enhancements

- Real-time notifications for staff
- QR code scanning for patient verification
- Automated stock reordering
- Mobile apps for staff
- SMS/Email notifications for patients
- Advanced analytics dashboard with charts
- Export reports (PDF, Excel)
- Multi-language support
