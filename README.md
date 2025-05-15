# kabexaapp - Supabase Auth Template

A Next.js application with Supabase authentication and role-based access control.

## Features

- 🔐 Authentication with Supabase Auth
- 👮‍♂️ Role-based access control
- 🛡️ Protected routes with middleware
- 🎨 Styled with Tailwind CSS
- 🚀 Type-safe database interactions

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=https://avmqyezjhzhrnzdtgivi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bXF5ZXpqaHpocm56ZHRnaXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTQ1ODQsImV4cCI6MjA2MjM5MDU4NH0.fieF26ccj16vGjpn-lGg53vIQFl3I0sY6-wSX54-ZRI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bXF5ZXpqaHpocm56ZHRnaXZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgxNDU4NCwiZXhwIjoyMDYyMzkwNTg0fQ.mZRE4N7qIZVUNC1Cw3ZZdvS4L2q-GbIQB6wzZt7VrDE
SUPABASE_DB_URL=postgresql://postgres.avmqyezjhzhrnzdtgivi:5Xddfp6JKrsE13oF@aws-0-us-east-2.pooler.supabase.com:6543/postgres
```

## User Roles

Available roles: servicer,agency,agent

## Managing User Roles

To assign roles to users after they sign up:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run a query like this to update a user's role:
   ```sql
   UPDATE profiles
   SET role = 'your-role-name'
   WHERE id = 'user-uuid';
   ```

## Deployment

1. Push your repository to GitHub
2. Import the project in Vercel or Netlify
3. Set the same environment variables
4. Deploy!
