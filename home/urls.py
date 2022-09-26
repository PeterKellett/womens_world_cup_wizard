from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('onboarding_landing/', views.onboarding_landing, name='onboarding_landing'),
    path('onboarding_1/', views.onboarding_1, name='onboarding_1'),
    path('onboarding_2/', views.onboarding_2, name='onboarding_2'),
    path('onboarding_2a/', views.onboarding_2a, name='onboarding_2a'),
    path('get_teams', views.get_teams, name='get_teams'),
    path('onboarding_3/', views.onboarding_3, name='onboarding_3'),
    path('golden_route/', views.golden_route, name='golden_route'),
    path('get_matches', views.get_matches, name='get_matches'),
    path('game/', views.game, name='game'),
    path('save_result/<match_id>', views.save_result, name='save_result'),
    path('tables/', views.tables, name='tables'),
]
