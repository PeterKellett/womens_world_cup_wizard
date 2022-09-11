from django.shortcuts import render
from django.views import generic
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from .forms import RegisterForm
# Create your views here.


class UserRegisterView(generic.CreateView):
    form_class = RegisterForm
    template_name = 'users/registration.html'
    success_url = reverse_lazy('home')
