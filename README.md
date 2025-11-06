# Web Dev 2 Group Project — Setup Guide

This project is a **Villa Rental Management System** built with Next.js 15, TypeScript, Prisma (SQLite), and includes both a public booking interface and an admin management panel.

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
DATABASE_URL="file:./dev.db"

# Optional: Add other environment variables
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

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
- `POST /api/VillaBooking` - Create new booking
- `GET /api/availability` - Get availability calendar

### Admin Endpoints
- `GET/POST /api/admin/villas` - Villa management
- `PUT/DELETE /api/admin/villas/[id]` - Individual villa operations
- `PATCH /api/VillaBooking/[id]` - Update booking status
- `PATCH /api/availability` - Update availability
- `PATCH /api/availability/bulk` - Bulk availability updates

## Features

### Public Features
- Villa browsing and details
- Availability calendar
- Booking system
- Responsive design

### Admin Features
- **Villa Management**: Add, edit, delete villas
- **Booking Management**: View and manage all bookings
- **Availability Management**: Calendar-based availability control
- **Pricing Management**: Dynamic pricing per date
- **Bulk Operations**: Block/unblock multiple dates
- **Status Management**: Confirm/cancel bookings

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

# Utilities
npm run lint          # Run ESLint
npm run type-check    # TypeScript checking
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
