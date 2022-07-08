from django.contrib import admin
from .models import Teams, Matches, PersonalResults


# Register your models here.
class TeamsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'crest'
    )
    ordering = ('id',)


class MatchesAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'match_number',
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
        'home_team',
        'home_team_score',
        'away_team',
        'away_team_score',
    )


admin.site.register(Teams, TeamsAdmin)
admin.site.register(Matches, MatchesAdmin)
admin.site.register(PersonalResults, PersonalResultsAdmin)
