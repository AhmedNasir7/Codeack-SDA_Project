import os
from unittest import mock

from django.test import SimpleTestCase

from . import services


class SupabaseServiceTests(SimpleTestCase):
    def setUp(self) -> None:
        services.reset_supabase_client_cache()

    def tearDown(self) -> None:
        services.reset_supabase_client_cache()

    def test_missing_env_variables_raise(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(services.SupabaseConfigError):
                services.get_supabase_client()

    @mock.patch("supabase_app.services.create_client")
    def test_supabase_client_is_created_once(self, mock_create_client):
        fake_client = mock.Mock()
        mock_create_client.return_value = fake_client

        with mock.patch.dict(
            os.environ,
            {
                "SUPABASE_URL": "https://example.supabase.co",
                "SUPABASE_ANON_KEY": "anon-key",
            },
            clear=True,
        ):
            first = services.get_supabase_client()
            second = services.get_supabase_client()

        self.assertIs(first, fake_client)
        self.assertIs(second, fake_client)
        mock_create_client.assert_called_once_with(
            "https://example.supabase.co", "anon-key"
        )

    @mock.patch("supabase_app.services.get_supabase_client")
    def test_fetch_table_preview_wraps_response(self, mock_get_client):
        table_mock = mock.Mock()
        table_mock.table.return_value.select.return_value.limit.return_value.execute.return_value.data = [
            {"id": 1}
        ]
        mock_get_client.return_value = table_mock

        data = services.fetch_table_preview("profiles", limit=5)

        self.assertEqual(data["count"], 1)
        self.assertEqual(data["rows"], [{"id": 1}])
        table_mock.table.assert_called_once_with("profiles")
