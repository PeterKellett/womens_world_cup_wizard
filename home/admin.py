from django.contrib import admin
from .models import Teams, Matches, PersonalResults, Wizard, GroupPositions,\
    DefaultMatches, DefaultGroupPositions, Venues


# Register your models here.
class TeamsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'abbreviated_name',
        'group',
        'crest_url',
        'crest_image',
        'is_eliminated',
        'is_eliminated_group',
        'is_eliminated_L16',
        'is_eliminated_qf',
        'is_eliminated_sf',
        'is_eliminated_final',
        'is_in_final',
    )
    ordering = ('id',)


class VenuesAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'city',
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
        'winning_team',
        'venue',
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
        'venue',
    )
    ordering = ('date',)


class DefaultMatchesAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'match_number',
        'group',
        'date',
        'home_team',
        'home_team_score',
        'away_team',
        'away_team_score',
        'winning_team',
        'venue',
    )
    ordering = ('date',)


class WizardAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'match_number',
        'group',
        'home_team',
        'away_team',
        'winning_team',
        'points',
    )
    ordering = ('id',)


class DefaultGroupPositionsAdmin(admin.ModelAdmin):
    list_display = (
        'team',
        'position',
    )
    ordering = ('id',)


class GroupPositionsAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'team',
        'position',
    )
    ordering = ('id',)


admin.site.register(Wizard, WizardAdmin)
admin.site.register(Teams, TeamsAdmin)
admin.site.register(Matches, MatchesAdmin)
admin.site.register(PersonalResults, PersonalResultsAdmin)
admin.site.register(GroupPositions, GroupPositionsAdmin)
admin.site.register(DefaultMatches, DefaultMatchesAdmin)
admin.site.register(DefaultGroupPositions, DefaultGroupPositionsAdmin)
admin.site.register(Venues, VenuesAdmin)
