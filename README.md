# Luxe

## Local Development setup:

copy .env.example to .env

update SUPABASE_AUTH_JWT_SECRET with random long string

run `supabase start`

navigate to Studio URL: http://127.0.0.1:54323

get `anon key` and `API URL` from supabase start log output

update apps/admin .env

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```
