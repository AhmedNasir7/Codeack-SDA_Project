from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from .services import SupabaseConfigError, fetch_table_preview, get_supabase_client


class SupabaseStatusView(View):
    """
    Minimal endpoint you can hit to confirm your Supabase credentials work.

    Optional query params:
        - table: Supabase table to preview (defaults to none)
        - limit: Number of rows to fetch (defaults to 1, max 100)
        - schema: Custom schema if you're not using `public`
    """

    def get(self, request):
        payload: dict = {
            "supabase_configured": False,
            "table": request.GET.get("table"),
            "limit": request.GET.get("limit"),
            "schema": request.GET.get("schema"),
        }

        try:
            get_supabase_client(schema=payload["schema"])
            payload["supabase_configured"] = True

            if payload["table"]:
                limit = request.GET.get("limit") or "1"
                try:
                    limit_int = int(limit)
                except ValueError:
                    limit_int = 1

                payload["preview"] = fetch_table_preview(
                    payload["table"],
                    limit=limit_int,
                    schema=payload["schema"],
                )

        except SupabaseConfigError as exc:
            payload["error"] = str(exc)
        except Exception as exc:  # pragma: no cover - defensive guard
            payload["error"] = f"Supabase request failed: {exc}"

        return JsonResponse(payload)


def starter_template(request):
    """Render the base HTML template so the frontend can be previewed quickly."""

    return render(request, "index.html")
