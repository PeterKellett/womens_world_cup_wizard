from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('about/', views.about, name='about'),
    path('get_teams', views.get_teams, name='get_teams'),
    path('golden_goal/', views.golden_goal, name='golden_goal'),
    path('get_wizard_data', views.get_wizard_data, name='get_wizard_data'),
    path('game/', views.game, name='game'),
    path('save_result/<match_id>', views.save_result, name='save_result'),
    path('tables/', views.tables, name='tables'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('userscores/<int:user>', views.userscores, name='userscores'),
    path('userswizards/<int:user>', views.userswizards, name='userswizards'),
    path('post_register', views.post_register, name='post_register'),
    path('randomise_matches', views.randomise_matches, name='randomise_matches'),
    path('randomise_golden_goal', views.randomise_golden_goal, name='randomise_golden_goal'),
    path('randomise_silver_goal', views.randomise_silver_goal, name='randomise_silver_goal'),
]
