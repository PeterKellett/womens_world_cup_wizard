from django.template.defaulttags import register


@register.filter
def get_home_team(dictionary, key):
    print("get_home_team = ", get_home_team)
    # print("dict = ", dictionary)
    # print("key = ", key)
    object = dictionary.get(match_number=key)
    print("object = ", object)
    return object.home_team


@register.filter
def get_home_team_score(dictionary, key):
    print("get_home_team_score = ", get_home_team_score)
    object = dictionary.get(match_number=key)
    print("object = ", object.home_team_score)
    if object.home_team_score is None:
        return ''
    else:
        return object.home_team_score


@register.filter
def get_away_team(dictionary, key):
    print("get_away_team = ", get_away_team)
    object = dictionary.get(match_number=key)
    print("object = ", object)
    return object.away_team


@register.filter
def get_away_team_score(dictionary, key):
    print("get_away_team_score = ", get_away_team_score)
    object = dictionary.get(match_number=key)
    print("object = ", object)
    if object.home_team_score is None:
        return ''
    else:
        return object.away_team_score
