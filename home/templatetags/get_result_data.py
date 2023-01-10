from django.template.defaulttags import register


@register.filter
def get_home_team(dictionary, key):
    object = dictionary.get(match_number=key)
    return object.home_team


@register.filter
def get_home_team_score(dictionary, key):
    object = dictionary.get(match_number=key)
    if object.home_team_score is None:
        return ''
    else:
        return object.home_team_score


@register.filter
def get_away_team(dictionary, key):
    object = dictionary.get(match_number=key)
    return object.away_team


@register.filter
def get_away_team_score(dictionary, key):
    object = dictionary.get(match_number=key)
    if object.home_team_score is None:
        return ''
    else:
        return object.away_team_score
