from django.urls import path

from .views import SupabaseStatusView, starter_template

urlpatterns = [
    path('', starter_template, name='supabase-home'),
    path('status/', SupabaseStatusView.as_view(), name='supabase-status'),
]

