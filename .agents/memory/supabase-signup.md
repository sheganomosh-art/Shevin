---
name: Supabase signup issues
description: What caused "Database error saving new user" and how it was fixed
---

Two blockers hit during Supabase auth setup:

1. **Database trigger** — a `handle_new_user` trigger on `auth.users` tried to insert into a `profiles` table. When the table/trigger was misconfigured, the entire auth transaction rolled back. Fix: DROP all triggers on auth.users. The app uses `user_metadata` for profile data, not a separate table.

2. **Email confirmation** — Supabase sends a confirmation email on signup. With confirmation ON, signUp() succeeds but user isn't logged in, so middleware redirects to login. Fix: Authentication → Providers → Email → disable "Confirm email".

3. **Rate limits** — repeated signups with the same email hit Supabase rate limits ("email rate limit exceeded", "can only request after N seconds"). Fix: use Supabase dashboard → Authentication → Users → Add user → "Auto confirm user" to bypass.

**Why:** All three issues stack — trigger causes DB error, email confirm causes redirect confusion, rate limits block retesting.

**How to apply:** For new Supabase projects, drop any auto-created triggers and disable email confirmation before testing auth flow.
