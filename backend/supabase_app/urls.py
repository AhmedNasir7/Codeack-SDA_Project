from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    SignupView,
    SupabaseStatusView,
    starter_template,
)

urlpatterns = [
    path('', starter_template, name='supabase-home'),
    path('status/', SupabaseStatusView.as_view(), name='supabase-status'),
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
]

