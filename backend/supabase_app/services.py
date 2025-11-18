"""
Utility helpers for working with Supabase inside the Django app.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Any, Dict, Tuple

from django.core.exceptions import ImproperlyConfigured
from supabase import Client, create_client


class SupabaseConfigError(ImproperlyConfigured):
    """Raised when the Supabase client cannot be configured properly."""


def _get_supabase_credentials() -> Tuple[str, str]:
    """
    Return the Supabase URL and API key taken from environment variables.

    At least one of SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY must be set.
    """

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if not url:
        raise SupabaseConfigError(
            "Missing SUPABASE_URL. Set it in your environment or .env file."
        )

    if not key:
        raise SupabaseConfigError(
            "Missing Supabase API key. Provide SUPABASE_SERVICE_ROLE_KEY or "
            "SUPABASE_ANON_KEY."
        )

    return url, key


@lru_cache
def get_supabase_client(schema: str | None = None) -> Client:
    """
    Lazily instantiate and cache the Supabase client.

    The optional ``schema`` parameter lets you work with non-default schemas.
    """

    url, key = _get_supabase_credentials()
    client = create_client(url, key)

    if schema:
        client.postgrest.schema = schema

    return client


def fetch_table_preview(
    table_name: str, *, limit: int = 1, schema: str | None = None
) -> Dict[str, Any]:
    """
    Return a lightweight preview of the requested Supabase table.

    This helper is safe to call from views and can be expanded later to add
    filters or pagination.
    """

    limit = max(1, min(limit, 100))
    client = get_supabase_client(schema)
    response = (
        client.table(table_name)
        .select("*")
        .limit(limit)
        .execute()
    )
    return {
        "count": len(response.data or []),
        "rows": response.data,
    }


def reset_supabase_client_cache() -> None:
    """
    Clear the cached Supabase client instance.

    Handy for tests or when credentials change at runtime (e.g. rotating keys).
    """

    get_supabase_client.cache_clear()

