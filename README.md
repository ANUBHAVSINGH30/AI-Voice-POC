# AI Voice Assistant POC

A proof-of-concept AI voice assistant built with Next.js, Retell AI, and PostgreSQL. Features a voice-enabled receptionist that can handle calls and a dashboard to view call history.

## Features

- **Voice Conversations**: Real-time AI voice calls powered by Retell AI
- **Call Dashboard**: View call history with caller details, purpose, and timestamps
- **PostgreSQL Database**: Persistent storage for call records using Prisma ORM
- **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.3.5 |
| React | 19.2.8 |
| Prisma | 6.19.3 |
| PostgreSQL | via Neon |
| Retell AI | 6.0.1 (SDK), 3.0.1 (Client) |
| Tailwind CSS | 4.3.3 |
| TypeScript | 5.x |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── calls/route.ts          # GET - Fetch all calls
│   │   └── retell/
│   │       ├── web-call/route.ts   # POST - Create Retell web call
│   │       └── save-call/route.ts  # POST - Save call details to DB
│   ├── dashboard/page.tsx          # Call history dashboard
│   ├── page.tsx                    # Home page with voice assistant
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── RetellVoice.tsx             # Voice call UI component
├── lib/
│   └── prisma.ts                   # Prisma client singleton
└── generated/prisma/               # Generated Prisma client
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon, Supabase, or local)
- Retell AI account with an agent configured

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-voice-poc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the voice assistant.
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view call history.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Retell AI Configuration
RETELL_API_KEY="your-retell-api-key"
RETELL_AGENT_ID="your-retell-agent-id"
```

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `RETELL_API_KEY` | Retell AI API key from dashboard | Yes |
| `RETELL_AGENT_ID` | ID of your Retell AI agent | Yes |

### Database Setup

The project uses Prisma with PostgreSQL. The schema defines a `Call` model:

```prisma
model Call {
  id           String    @id @default(uuid())
  name         String
  purpose      String
  callbackTime DateTime?
  createdAt    DateTime  @default(now())
}
```

Run migrations:
```bash
npx prisma migrate dev --name init
```

## Usage

### Starting a Voice Call

1. Navigate to the home page (`/`)
2. Click **"Start Call"** to initiate a voice conversation with the AI receptionist
3. Speak naturally - the AI will respond in real-time
4. Click **"End Call"** to terminate the session

### Viewing Call History

Navigate to `/dashboard` to see:
- Total call count
- Recent calls table with:
  - Caller name
  - Call purpose
  - Scheduled callback time (IST)
  - Call timestamp (IST)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/retell/web-call` | Creates a Retell web call and returns access token |
| `POST` | `/api/retell/save-call` | Saves call details (name, purpose) to database |
| `GET` | `/api/calls` | Fetches all calls ordered by creation date (desc) |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Generate Prisma client and build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
# Build
docker build -t ai-voice-poc .

# Run
docker run -p 3000:3000 --env-file .env ai-voice-poc
```

## Configuration

### Retell AI Agent Setup

1. Create an agent at [Retell AI Dashboard](https://dashboard.retellai.com)
2. Configure the agent's prompt, voice, and behavior
3. Copy the Agent ID and API Key to your `.env`

### Tailwind CSS

Uses Tailwind CSS v4 with PostCSS. Configuration in `postcss.config.mjs` and `next.config.ts`.

## License

MIT License - feel free to use this for your own projects.