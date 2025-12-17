# Web Dev 2 Group Project — Setup Guide


This project is a **Villa Rental Management System** built with Next.js 15, TypeScript, Prisma (SQLite), and includes both a public booking interface and an admin management panel.

<div align="center">

![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>


## Screenshots

<img src="public/screenshots/Screenshot 2025-11-28 221925.png" alt="Hero Page" width="800"/>
<img src="public/screenshots/Screenshot 2025-11-28 221937.png" alt="Villa Tour" width="800"/>
<img src="public/screenshots/Screenshot 2025-11-28 221947.png" alt="Villa Portal" width="800"/>
<img src="public/screenshots/Screenshot 2025-11-28 221954.png" alt="Bulletin Board" width="800"/>
<img src="public/screenshots/Screenshot 2025-11-28 222002.png" alt="Villa Showcase" width="800"/>
<img src="public/screenshots/Screenshot 2025-11-28 222009.png" alt="Location Page" width="800"/>


## Architecture Overview

```
src/
├── app/
│   ├── api/                    # API Routes (Next.js App Router)
│   │   ├── VillaBooking/       # Booking management endpoints
│   │   │   ├── route.ts        # GET/POST bookings
│   │   │   └── [id]/route.ts   # PUT/DELETE individual bookings
│   │   ├── admin/              # Admin-specific endpoints
│   │   │   └── villas/         # Villa management
│   │   │       ├── route.ts    # GET/POST villas
│   │   │       └── [id]/route.ts # PUT/DELETE individual villas
│   │   └── availability/       # Calendar/availability management
│   │       ├── route.ts        # Availability CRUD
│   │       └── bulk/route.ts   # Bulk availability operations
│   ├── admin/                  # Admin panel pages
│   │   └── page.tsx           # Main admin dashboard
│   └── page.tsx               # Public homepage
├── components/
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── sonner.tsx         # Toast notifications
│   │   └── ...
│   ├── AdminPanel.tsx         # Main admin interface
│   ├── BookingManager.tsx     # Booking management component
│   └── VillaManager.tsx       # Villa CRUD component
├── lib/
│   └── prisma.ts             # Prisma client configuration
└── prisma/
    ├── schema.prisma         # Database schema
    ├── migrations/           # Database migrations
    └── dev.db               # SQLite database file
```

## Prerequisites

- **Node.js 18+** (recommend 20+)
- **npm** (comes with Node)

Verify installation:
```bash
node -v
npm -v
```

## 1) Install Dependencies

```bash
npm install
```

### Key Dependencies Added:

- **UI Components**: `@radix-ui/react-*` (select, tabs, etc.)
- **Toast Notifications**: `sonner`
- **Theme Support**: `next-themes` (optional)
- **Icons**: `lucide-react`
- **Database**: `@prisma/client`, `prisma`

## 2) Configure Environment

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="mysql://root@localhost:3306/casa_filomena"

ADMIN_USERNAME="admin@casa"
ADMIN_PASSWORD="password"
NEXTAUTH_SECRET="zZefb+zgLV0Ex6KcRJZg37slUVpfg2+8DNk0Q2gulPQ="
NEXTAUTH_URL="http://localhost:3000"

# Email/SMTP Configuration (for booking confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM="Villa Bookings <bookings@yourdomain.com>"
```

### Gmail App Password Setup:
1. Enable 2-Step Verification on your Google Account
2. Go to **App Passwords** (Security → App passwords)
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password and set as `SMTP_PASS`

## 3) Set Up the Database (Prisma)

### Generate Prisma Client:
```bash
npx prisma generate
```

### Apply Database Schema:
```bash
npx prisma migrate dev
```

### (Optional) Seed Database:
```bash
npx prisma db seed
```

### (Optional) Open Prisma Studio:
```bash
npx prisma studio
```

## 4) Run the Application

### Development Mode:
```bash
npm run dev
```

Visit:
- **Public Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### Production Build:
```bash
npm run build
npm start
```

## Database Schema

The application uses the following main models:

### Villa
```prisma
model Villa {
  id          Int    @id @default(autoincrement())
  name        String
  description String
  image       String
  bedrooms    Int
  bathrooms   Int
  guests      Int
  amenities   String  # JSON string of amenities array
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### VillaBooking
```prisma
model VillaBooking {
  id         Int      @id @default(autoincrement())
  villaId    Int
  guestName  String
  guestEmail String
  guestPhone String
  checkIn    DateTime
  checkOut   DateTime
  guests     Int
  totalPrice Float
  status     BookingStatus @default(PENDING)
  notes      String?
  createdAt  DateTime @default(now())
}
```

### BookingDate (Availability Management)
```prisma
model BookingDate {
  id        Int      @id @default(autoincrement())
  villaId   Int
  date      DateTime
  available Boolean  @default(true)
  price     Int
  isBlocked Boolean  @default(false)
  reason    String?
  
  @@unique([villaId, date], name: "villaId_date")
}
```

## API Endpoints

### Public Endpoints
- `GET /api/villas` - Get all villas
- `POST /api/VillaBooking` - Create new booking (sends confirmation email)
- `GET /api/VillaBooking` - Get all bookings
- `PATCH /api/VillaBooking/[id]` - Update booking status (sends status email)
- `GET /api/availability` - Get availability calendar
- `GET /api/availability/[villaId]` - Get villa-specific availability
- `GET /api/posts` - Get bulletin board posts

### Admin Endpoints
- `GET/POST /api/admin/villas` - Villa management
- `PUT/DELETE /api/admin/villas/[id]` - Individual villa operations
- `PATCH /api/VillaBooking/[id]` - Update booking status
- `PATCH /api/availability` - Update availability
- `PATCH /api/availability/bulk` - Bulk availability updates

## Features

### Public Features
- **Villa Browsing**: Showcase all luxury villas with amenities
- **Hero Booking Widget**: Quick search with villa, date, and guest selection
- **Smart Booking Redirect**: Hero widget redirects to villas page with pre-filled dates and villa selection
- **Availability Calendar**: Date-picker with blocked/available date tracking
- **Booking System**: Multi-step booking form with guest information
- **Email Confirmations**: Automated booking confirmations and status updates
- **QR Codes for Payment**: Payment QR codes on confirmed bookings
- **Responsive Design**: Mobile-first, works on all devices
- **Bulletin Board**: Latest updates and announcements with auto-scrolling marquee

### Admin Features
- **Villa Management**: Add, edit, delete villas with images and amenities
- **Booking Management**: View, filter, and update booking statuses
- **Delete Confirmation**: Dialog confirmation for safe data deletion
- **Availability Management**: Calendar-based availability control
- **Pricing Management**: Dynamic pricing per date
- **Bulk Operations**: Block/unblock multiple dates
- **Status Management**: Confirm/cancel bookings with automatic email notifications

## Common Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start              # Run production server

# Database
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Apply migrations
npx prisma studio     # Visual DB browser
npx prisma db push    # Push schema changes
npx prisma db seed    # Seed database

# Email Testing
npm run mail:ethereal  # Generate Ethereal test account credentials
npm run mail:test      # Send test email with current SMTP config

# Utilities
npm run lint          # Run ESLint
npm run type-check    # TypeScript checking
```

## Email Functionality

### How It Works
- **On Booking Create** (`POST /api/VillaBooking`): Sends confirmation email with booking reference and details
- **On Status Update** (`PATCH /api/VillaBooking/[id]`): Sends status update email (PENDING → CONFIRMED → CANCELLED)
- **Booking Reference**: Format `VLB25000001` (VLB + year + booking ID)
- **Confirmed Bookings**: Include payment QR code that guests can scan

### Email Templates
Located in `src/lib/emailTemplates.ts`:
- `bookingEmailTemplate()` - Unified template for all booking statuses
- Customizable per status: PENDING, CONFIRMED, CANCELLED
- Includes booking details, dates, guest count, and total price
- QR code embedded for CONFIRMED bookings

### Testing Email Configuration
```bash
# 1. Generate test account (optional, uses Ethereal)
npm run mail:ethereal

# 2. Copy printed credentials to .env

# 3. Restart dev server
npm run dev

# 4. Send test email
npm run mail:test

# 5. Open Ethereal preview URL from console output
```

### Production Email Setup
For production, configure real SMTP credentials:
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false  # or true for port 465
SMTP_USER=your-username
SMTP_PASS=your-password
MAIL_FROM="Villa Bookings <no-reply@yourdomain.com>"
```

## Development Workflow

### Adding New Features

1. **Database Changes**:
   ```bash
   # Modify prisma/schema.prisma
   npx prisma migrate dev --name your-migration-name
   npx prisma generate
   ```

2. **API Routes**: Create in `src/app/api/`
3. **Components**: Add to `src/components/`
4. **Pages**: Add to `src/app/`

### Booking Widget Redirect Flow

The hero booking widget implements a smart redirect:

1. User fills villa, dates, guests in hero widget
2. Click "Search" button
3. Redirect to `/villas?villa=2&checkIn=2025-12-20&checkOut=2025-12-23&guests=2&nights=3`
4. VillaShowcase reads query params
5. VillaCard matches selected villa
6. BookingForm auto-opens with pre-filled dates
7. User only needs to enter guest details

### Common Issues & Solutions

#### 1. API Route 404 Errors
- Ensure route files are in correct `src/app/api/` directory
- Check that file is named `route.ts` (not `index.ts`)
- Verify export functions are named correctly (`GET`, `POST`, etc.)

#### 2. Database Connection Issues
```bash
npx prisma db push  # Force sync schema
npx prisma generate # Regenerate client
```

#### 3. TypeScript Errors
```bash
npm run type-check  # Check for type errors
npx prisma generate # Ensure Prisma types are updated
```

#### 4. Missing UI Components
```bash
# Install missing Radix UI components
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install sonner  # For toast notifications
```

## Project Structure Best Practices

- **API Routes**: Follow RESTful conventions
- **Components**: Use TypeScript interfaces
- **Database**: Use Prisma migrations for schema changes
- **Error Handling**: Implement proper try/catch blocks
- **Type Safety**: Define interfaces for all data structures

## Testing

### Manual Testing Routes
```bash
# Test API endpoints directly
curl http://localhost:3000/api/villas
curl http://localhost:3000/api/admin/villas
```

### Database Testing
```bash
npx prisma studio  # Visual inspection
```

## Deployment Considerations

1. **Environment Variables**: Set up production `.env`
2. **Database**: Migrate to PostgreSQL/MySQL for production
3. **Build**: Test production build locally first
4. **API Routes**: Ensure all endpoints work in production

## Troubleshooting

### Reset Database
```bash
rm prisma/dev.db           # Delete SQLite file
npx prisma migrate reset   # Reset and reapply migrations
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Update Dependencies
```bash
npm update
npx prisma generate
```

---

**Note**: This is a development setup guide. For production deployment, additional configuration for database, environment variables, and hosting platform will be required.
