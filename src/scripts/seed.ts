// Load .env.local
require('dotenv').config({ path: './.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing environment variables. Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  // List of roles defined during setup
  const roles = ['servicer','agency','agent']
  
  console.log('Creating database schema if it doesn\'t exist...');
  try {
    // Create tables if they don't exist
    await supabase.rpc('sql', {
      sql: `
        -- Create roles table
        create table if not exists public.roles (
          id serial primary key,
          name text unique not null
        );
        
        -- Create profiles table with foreign key to auth.users
        create table if not exists public.profiles (
          id uuid primary key references auth.users(id) on delete cascade,
          role text
        );
        
        -- Create trigger to add new users to profiles table
        create or replace function public.handle_new_user() 
        returns trigger as 8036
        begin
          insert into public.profiles (id)
          values (new.id);
          return new;
        end;
        8036 language plpgsql security definer;
        
        -- Drop trigger if exists
        drop trigger if exists on_auth_user_created on auth.users;
        
        -- Create trigger for new user signup
        create trigger on_auth_user_created
          after insert on auth.users
          for each row execute procedure public.handle_new_user();
      `
    });
    
    console.log('Database schema created successfully');
    
    // Insert roles
    console.log('Adding roles to database...');
    for (const role of roles) {
      await supabase.from('roles').upsert({ name: role }, { onConflict: 'name' });
      console.log(`- Added role: ${role}`);
    }
    
    console.log('✅ Database setup complete!');
    console.log(`Created roles: ${roles.join(', ')}`);
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
