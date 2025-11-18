import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

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


@method_decorator(csrf_exempt, name="dispatch")
class SignupView(View):
    """Simple JSON-based signup endpoint the frontend can call."""

    def post(self, request):
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)

        username = (payload.get("username") or "").strip()
        email = (payload.get("email") or "").strip().lower()
        password = payload.get("password") or ""

        if not username or not password:
            return JsonResponse(
                {"error": "Both username and password are required."},
                status=400,
            )

        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"error": "Username is already taken."},
                status=400,
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        login(request, user)

        return JsonResponse(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "message": "Signup successful.",
            },
            status=201,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(View):
    """Basic username/password login endpoint."""

    def post(self, request):
        try:
            payload = json.loads(request.body or "{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)

        username = (payload.get("username") or "").strip()
        password = payload.get("password") or ""

        if not username or not password:
            return JsonResponse(
                {"error": "Both username and password are required."},
                status=400,
            )

        user = authenticate(request, username=username, password=password)

        if not user:
            return JsonResponse(
                {"error": "Invalid credentials."},
                status=401,
            )

        login(request, user)

        return JsonResponse(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "message": "Login successful.",
            }
        )


@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(View):
    """Invalidate the current session."""

    def post(self, request):
        logout(request)
        return JsonResponse({"message": "Logged out."})
