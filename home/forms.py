from allauth.account.forms import SignupForm
from django import forms
from django.forms import ModelForm, formset_factory
from .models import Wizard


class CustomSignupForm(SignupForm):
    first_name = forms.CharField(max_length=30, label='First Name')
    last_name = forms.CharField(max_length=30, label='Last Name')

    def save(self, request):
        user = super(CustomSignupForm, self).save(request)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user


class WizardForm(forms.ModelForm):
    """Create a form for the Wizard page"""
    class Meta:
        model = Wizard
        fields = (
            'match_number',
            'group',
            'home_team',
            'away_team',
            'winning_team'
        )
