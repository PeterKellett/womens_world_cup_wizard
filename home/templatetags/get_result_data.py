from django.template.defaulttags import register


@register.filter
def get_home_team(dictionary, key):
    print("get_item filter")
    print("dict = ", dictionary)
    print("key = ", key)
    object = dictionary.get(match_number=key)
    print("object = ", object)
    return object.home_team


@register.filter
def get_home_team_score(dictionary, key):
    print("get_item filter")
    print("dict = ", dictionary)
    print("key = ", key)
    object = dictionary.get(match_number=key)
    print("object = ", object)
    return object.home_team_score


@register.filter
def get_away_team(dictionary, key):
    print("get_item filter")
    print("dict = ", dictionary)
    print("key = ", key)
    object = dictionary.get(match_number=key)
    print("object = ", object)
    return object.away_team


@register.filter
def get_away_team_score(dictionary, key):
    print("get_item filter")
    print("dict = ", dictionary)
    print("key = ", key)
    object = dictionary.get(match_number=key)
    print("object = ", object)
    return object.away_team_score
