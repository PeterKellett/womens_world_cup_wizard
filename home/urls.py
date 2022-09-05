from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('game/', views.game, name='game'),
    path('save_result/<match_id>', views.save_result, name='save_result'),
]
