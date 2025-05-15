# Usage Guide

## Setup and Configuration

1. Make sure your `.env.local` file contains the correct Supabase credentials.
2. Run `npm install` to install dependencies.
3. Run `npm run seed` to set up your database schema and roles.
4. Start the development server with `npm run dev`.
5. Visit `/login` to sign in.

## Authentication Flow

1. Users sign up/sign in at `/login`
2. New users automatically get an entry in the `profiles` table (via database trigger)
3. Admins assign appropriate roles to users
4. Users with correct roles can access the `/dashboard`
5. Users without the correct role see the "Unauthorized" page

## Troubleshooting

### Database Issues

- **Connection errors**: Verify your Supabase URL and credentials
- **Missing tables**: Run `npm run seed` to create tables
- **Permission denied**: Check that your service role key has proper permissions
- **Trigger not working**: Check Supabase logs for SQL errors

### Authentication Issues

- **Can't sign in**: Check your Supabase project settings:
  - Make sure Email Auth is enabled in Authentication > Providers
  - Verify your site URL is in the allowed URLs
- **Always redirected to login**: Check browser console for auth errors

### Role Issues

- **Unauthorized access**: Verify the user has a role assigned in the `profiles` table
- **Role not recognized**: Make sure the role is in the allowed list in `middleware.ts`

### Deployment Issues

- Check that all environment variables are set correctly
- Ensure your Supabase project allows requests from your deployed URL

## Security Best Practices

- Never expose your service role key in client-side code
- Always use middleware to check user roles for protected routes
- Set up email verification in your Supabase authentication settings
- Regularly rotate your Supabase keys (and update your env vars)
