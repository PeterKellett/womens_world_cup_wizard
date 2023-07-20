from .models import PersonalResults, Wizard, Matches
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.conf import settings
from datetime import datetime, timezone


def updated_score(request):
    print("updated_score contexts")
    user = request.user
    saved_matches = request.session.get('saved_matches', {})
    print("saved_matches = ", saved_matches)
    match_data = []
    # if 'match_id' in list(saved_data):
    #     match = get_object_or_404(PersonalResults, pk=saved_data['match_id'])
    #     match_data = []
    #     match_data.append({
    #         'match': match
    #     })
    # if user.is_authenticated:
    #     request.session['saved_matches'] = {}
    context = {'saved_matches': saved_matches}
    return context


def global_vars(request):
    user = request.user
    if user.is_authenticated:
        wizard_points = Wizard.objects.all().filter(user=user.id).aggregate(Sum('points'))
        personal_results_points = PersonalResults.objects.all().filter(user=user.id).aggregate(Sum('points'))
        points = personal_results_points.get('points__sum') + wizard_points.get('points__sum')
    else:
        points = 0
    thurs_matches = Matches.objects.all().filter(date__lte=datetime(2023, 7, 21, tzinfo=timezone.utc)).order_by('date')
    fri_matches = Matches.objects.all().filter(date__lte=datetime(2023, 7, 22, tzinfo=timezone.utc)).filter(date__gte=datetime(2023, 7, 21, tzinfo=timezone.utc)).order_by('date')
    # print(datetime(2023, 7, 20, tzinfo=timezone.utc))
    next_match = Matches.objects.all().order_by('date')[:5]
    context = {
        'thurs_matches': thurs_matches,
        'fri_matches': fri_matches,
        'next_match': next_match,
        'points': points,
        'heroku_version': settings.HEROKU_VERSION
    }
    return context
