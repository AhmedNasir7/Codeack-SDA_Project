# Django + Supabase starter

This backend template is ready to plug into Supabase using their official Python client.

## Quick start

1. Create a virtual environment (optional but recommended):
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Copy the environment template and fill in the values from your Supabase project:
   ```powershell
   Copy-Item env.example .env
   ```
4. Run database migrations and start the dev server:
   ```powershell
   python manage.py migrate
   python manage.py runserver
   ```
5. Visit:
   - `http://127.0.0.1:8000/api/supabase/` to see the starter HTML template
   - `http://127.0.0.1:8000/api/supabase/status/?table=profiles&limit=1` to verify Supabase connectivity

## Supabase helpers

- `supabase_app.services.get_supabase_client()` lazily configures the client and caches it.
- `supabase_app.services.fetch_table_preview()` gives you a small dataset sample, ideal for smoke tests.
- Add your own domain logic inside `supabase_app` or create new apps as your project grows.

## Testing

The template ships with basic unit tests to validate the Supabase helpers:

```powershell
python manage.py test
```

