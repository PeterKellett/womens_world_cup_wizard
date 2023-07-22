from .models import PersonalResults, Wizard, Matches
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.conf import settings
from datetime import datetime, timezone, timedelta


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
    today = datetime.now(timezone.utc)
    tomorrow = today + timedelta(days=1)
    day_after_tomorrow = today + timedelta(days=2)
    todays_matches = Matches.objects.all().filter(date__gte=today.date()).exclude(date__gte=tomorrow.date()).order_by('date')
    tomorrows_matches = Matches.objects.all().filter(date__gte=tomorrow.date()).exclude(date__gte=day_after_tomorrow.date()).order_by('date')
    next_match = Matches.objects.all().order_by('date')[:5]
    context = {
        'todays_matches': todays_matches,
        'tomorrows_matches': tomorrows_matches,
        'next_match': next_match,
        'points': points,
        'heroku_version': settings.HEROKU_VERSION
    }
    return context
