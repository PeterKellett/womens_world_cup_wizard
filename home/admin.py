from django.contrib import admin
from .models import Teams, Matches, PersonalResults, Wizard


# Register your models here.
class TeamsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'abbreviated_name',
        'group',
        'crest_url',
        'crest_image'
    )
    ordering = ('id',)


class MatchesAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'match_number',
        'group',
        'date',
        'home_team',
        'home_team_score',
        'away_team',
        'away_team_score',
    )
    ordering = ('date',)


class PersonalResultsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'match_number',
        'group',
        'date',
        'home_team',
        'home_team_score',
        'away_team',
        'away_team_score',
        'points',
    )


class WizardAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'match_number',
        'group',
        'home_team',
        'away_team',
        'winning_team',
    )


admin.site.register(Wizard, WizardAdmin)
admin.site.register(Teams, TeamsAdmin)
admin.site.register(Matches, MatchesAdmin)
admin.site.register(PersonalResults, PersonalResultsAdmin)
