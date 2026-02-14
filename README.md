# Innofolio

A web application for teams and individuals to create, track, and collaborate on innovation ideas through their development lifecycle.

## Features

- User authentication with username support
- Personal accounts or team-based collaboration
- Dashboard with idea cards
- Create, edit, and delete ideas
- Stage gate tracking (Idea → In Development → Launched → Sidelined)
- Collaboration features (add team members to ideas)
- Filter and search ideas
- Team-based and personal idea management

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js with Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt for password hashing

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
createdb innovation_tool
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and update DATABASE_URL and JWT_SECRET

# Run database migrations
npm run prisma:migrate

# Start the server
npm run dev
```

The backend will run on http://localhost:3000

### 3. Frontend Setup

```bash
cd client
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Navigate to http://localhost:5173
2. Sign up with your email, username, and password
3. Optionally add a team name to create a team account (or leave blank for personal account)
4. Create your first idea from the dashboard
5. Click on idea cards to view details, edit, or delete
6. Use filters to find specific ideas
7. Add collaborators to work together on ideas (team accounts only)

## Project Structure

```
innovation-tool/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
└── .kiro/specs/           # Project specifications
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Ideas
- `GET /api/ideas` - Get all ideas (with filters)
- `GET /api/ideas/:id` - Get single idea
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `PATCH /api/ideas/:id/sideline` - Sideline/restore idea
- `POST /api/ideas/:id/collaborators` - Add collaborator
- `DELETE /api/ideas/:id/collaborators/:userId` - Remove collaborator

### Teams
- `GET /api/teams/:id` - Get team details
- `GET /api/teams/:id/members` - Get team members

## Development

### Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Build for Production

```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build
npm start
```

## Future Enhancements

- Stage Gate customization per team
- Comments on ideas
- Voting/rating system
- File attachments
- Activity history
- Email notifications
- Export functionality
- Analytics dashboard
# Innofolio
