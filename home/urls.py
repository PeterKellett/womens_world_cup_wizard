from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('about/', views.about, name='about'),
    path('get_teams', views.get_teams, name='get_teams'),
    path('golden_route/', views.golden_route, name='golden_route'),
    path('get_wizard_data', views.get_wizard_data, name='get_wizard_data'),
    path('game/', views.game, name='game'),
    path('save_result/<match_id>', views.save_result, name='save_result'),
    path('tables/', views.tables, name='tables'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('userscores/<int:user>', views.userscores, name='userscores'),
    path('userswizards/<int:user>', views.userswizards, name='userswizards'),
]
