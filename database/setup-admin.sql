-- Setup first admin user
-- Run this script in your Supabase SQL Editor after your first user has signed up

-- Replace 'your-email@example.com' with the email of the user you want to make admin
SELECT public.promote_to_admin('your-email@example.com') as success;

-- Verify the user was promoted
SELECT id, email, role
FROM auth.users
JOIN public.profiles ON auth.users.id = public.profiles.id
WHERE email = 'your-email@example.com';