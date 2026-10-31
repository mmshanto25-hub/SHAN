# Supabase setup

## 1. Apply the database migration

In the Supabase dashboard, open **SQL Editor**, create a query, paste the contents of [`migrations/20261024000100_portfolio_cms.sql`](./migrations/20261024000100_portfolio_cms.sql), and run it. Then run the chat migration [`migrations/20261031000100_visitor_admin_chat.sql`](./migrations/20261031000100_visitor_admin_chat.sql) to create the private visitor/admin chat tables and RPCs. Apply both migrations in timestamp order.

The first migration creates the portfolio tables, row-level security policies, the public asset bucket, and an admin allowlist. The chat migration adds visitor conversations with token-protected access; only allowlisted admins can list conversations and reply. Public visitors can read only their own thread and submit contact messages.

## 2. Create the admin account

In **Authentication → Settings**, turn off public sign-ups. Then open **Authentication → Users** and create an admin user with the email and password you will use to sign in.

In **SQL Editor**, add that exact account to the allowlist (replace the email):

```sql
insert into public.portfolio_admins (user_id)
select id
from auth.users
where email = 'you@example.com'
on conflict (user_id) do nothing;
```

The allowlist is required even if the user can sign in. Do not enable public sign-ups; only add trusted administrators.

### Troubleshooting sign-in

If the login form reports **Invalid login credentials**, Supabase Auth did not find a valid email/password pair in the project configured by `VITE_SUPABASE_URL`. In that project's **Authentication → Users**, confirm the account exists and is active; use that account's exact email and reset its password there if necessary. The admin email and password are Supabase Auth credentials, not `.env` variables.

If sign-in succeeds but the account is not authorized, run the allowlist SQL above for the same account. After changing `.env`, restart the Vite dev server.

If the browser console reports `PGRST205` and says it cannot find `public.portfolio_settings`, the portfolio migration has not been applied to this Supabase project (or its schema cache has not refreshed). Run the complete SQL file from step 1 in the SQL Editor; adding an admin to the allowlist alone does not create the portfolio tables. If the tables already exist, refresh the schema cache in the SQL Editor with:

```sql
notify pgrst, 'reload schema';
```

## 3. Configure local development

Copy `.env.example` to `.env` and fill these values from **Project Settings → API**:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

The anon/publishable key is intended for browser use; row-level security protects the data. Never use or expose the `service_role` key. Restart the Vite dev server after changing `.env`.

## 4. Configure Vercel

In the Vercel project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Environment Variables** for the environments you deploy. Redeploy once so the Vite build receives them.

## 5. Import and manage content

Open `/admin`, sign in with the allowlisted account, and choose **Import existing portfolio content** once. This copies the current portfolio into Supabase. After that, edits, uploads, visibility changes, inbox management, and visitor chat replies save to Supabase and do not require a frontend redeploy. Visitors can start a chat from the floating message button on the public portfolio; replies appear in **Admin → Visitor chat**.

Changing application code still requires a Vercel deployment. Database content changes are available to public visitors on refresh; live updates are enabled for portfolio and chat tables when the Supabase project supports the `supabase_realtime` publication. Chat screens poll as a fallback.
