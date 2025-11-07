# Protirodh - Updated Architecture

## 🎯 New User Flow

### 1. Landing Page (`/`)
- Modern marketing page
- No dashboard links visible
- Clear CTA: Login or Sign Up
- Features showcase
- No direct access to portals without authentication

### 2. Authentication Flow
- **Sign Up** (`/signup`)
  - Full name, email, phone
  - ID type (NID/Birth Certificate/Passport) and number
  - Password creation
  - Terms acceptance
  - → Redirects to Onboarding

- **Login** (`/login`)
  - Email/password
  - Remember me option
  - Forgot password link
  - → Redirects to Portal (or Onboarding if incomplete)

### 3. Mandatory Onboarding (`/onboarding`)
- **Step 1: Personal Information**
  - Date of birth
  - Gender selection
  - Emergency contact

- **Step 2: Address Information**
  - Full address
  - Division selection
  - District

- **Step 3: Medical Information** (Optional)
  - Medical conditions
  - Known allergies
  - Health disclaimer

- Must complete all steps before accessing portal
- Cannot skip - enforced via localStorage check

### 4. User Portal (`/portal`)
**Main Dashboard:**
- Welcome message with user name
- Quick action cards:
  - Apply for Vaccine
  - View History
  - My Certificate
- Application status section showing:
  - Active applications
  - Pending/Confirmed/Completed status
  - Application details (vaccine, date, time, center)
  - Action buttons (View Details, Cancel)

**Apply for Vaccine** (`/portal/apply`)
- **Step 1:** Choose vaccine (Pfizer, Moderna, AstraZeneca)
- **Step 2:** Select dose number (1, 2, Booster)
- **Step 3:** Select vaccination center and preferred date
- **Step 4:** Choose from available time slots
  - Shows real-time slot availability
  - Cannot select full slots
  - Application summary before confirmation

**View History** (`/portal/history`)
- Complete vaccination history
- Past applications
- Completed vaccinations with dates
- Certificate access

**My Certificate** (`/portal/certificate`)
- Digital vaccination certificate
- QR code for verification
- Download/share options
- Vaccination record details

### 5. Admin Dashboards (Protected)
**Center Dashboard** (`/dashboard/center`)
- Today's appointments
- Vaccine inventory management
- Stock alerts
- Staff management
- Wastage tracking

**Authority Dashboard** (`/dashboard/authority`)
- Analytics and statistics
- Coverage by division
- Supply chain tracking
- Wastage reports
- Multi-center overview

## 🔐 Key Changes from Original

### Authentication Required
- ❌ **OLD:** Anyone could access all portals
- ✅ **NEW:** Must login/signup to access any portal

### Onboarding Mandatory
- ❌ **OLD:** Direct access after signup
- ✅ **NEW:** Must complete 3-step onboarding before portal access

### User Experience
- ❌ **OLD:** "Book appointment" with scheduling
- ✅ **NEW:** "Apply for vaccine" with available slot selection

### Time Selection
- ❌ **OLD:** User picks any date/time
- ✅ **NEW:** User selects from available time slots only

### Dashboard Access
- ❌ **OLD:** Direct links on homepage
- ✅ **NEW:** Admin-only routes under `/dashboard`

### Navigation
- ❌ **OLD:** Role selection cards on homepage
- ✅ **NEW:** Clean landing page → Auth → Portal

## 📱 New Page Structure

```
/                           # Landing page (public)
/login                      # Login page (public)
/signup                     # Signup page (public)
/onboarding                 # Mandatory onboarding (authenticated)
/portal                     # User dashboard (authenticated)
  /apply                    # Apply for vaccine (authenticated)
  /history                  # Vaccination history (authenticated)
  /certificate              # Digital certificate (authenticated)
/dashboard                  # Admin area (admin only)
  /center                   # Center management
  /authority                # Authority analytics
```

## 🎨 Design Improvements

### Modern UI Elements
- Rounded-2xl cards with subtle shadows
- Gradient backgrounds (bg-linear-to-br)
- Better color palette:
  - Blue: Primary actions
  - Green: Success/completed
  - Yellow: Pending/warnings
  - Purple: Additional features
  - Red: Alerts/cancellations

### Better UX
- Step-by-step wizards with progress indicators
- Status badges with icons
- Real-time availability indicators
- Summary views before confirmation
- Clear back navigation
- Loading states and feedback

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt
- Touch-friendly buttons
- Readable text sizes
- Proper spacing

## 💾 Data Flow (LocalStorage Mock)

```javascript
// Authentication
isAuthenticated: "true" | null
userEmail: string
userName: string

// Onboarding
needsOnboarding: "true" | "false"
onboardingCompleted: "true"

// User Data (would be in database in production)
userProfile: JSON object
applications: JSON array
certificates: JSON array
```

## 🔒 Security Notes

**Current (MVP):**
- localStorage for state management
- No real authentication
- No backend validation
- Client-side only

**Production Requirements:**
- JWT tokens or session management
- Backend API with authentication
- Database for user data
- Route protection middleware
- API rate limiting
- HTTPS only
- CSRF protection
- Input sanitization

## 🚀 User Journey Example

1. **Visit Homepage** → See modern landing with features
2. **Click "Sign Up"** → Fill registration form
3. **Submit** → Account created, redirected to onboarding
4. **Complete Step 1** → Personal info
5. **Complete Step 2** → Address
6. **Complete Step 3** → Medical info (optional)
7. **Finish Onboarding** → Redirected to portal
8. **Portal Dashboard** → See welcome message and options
9. **Click "Apply for Vaccine"** → Start application
10. **Step 1** → Select Pfizer
11. **Step 2** → Select Dose 1
12. **Step 3** → Select center and date
13. **Step 4** → Choose available time slot
14. **Review Summary** → Confirm
15. **Back to Portal** → See application in pending status
16. **View Status** → Track application progress
17. **After Vaccination** → Access digital certificate

## 📊 Application States

- **Pending**: Applied, waiting for confirmation
- **Confirmed**: Approved, scheduled
- **Completed**: Vaccination done
- **Cancelled**: User or system cancelled

## 🎯 Success Metrics

- Reduced friction in signup/onboarding
- Clear application flow with 4 simple steps
- Real-time slot availability prevents conflicts
- Better user engagement with modern UI
- Easier to track application status
- Clearer separation between user and admin functions
