from .models import PersonalResults, Wizard, Matches
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.conf import settings


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
        # points = personal_results_points.get('points__sum') + wizard_points.get('points__sum')
        points = 0
    else:
        points = 0
    next_match = Matches.objects.all().order_by('match_number')[:5]
    context = {
        'next_match': next_match,
        'points': points,
        'heroku_version': settings.HEROKU_VERSION
    }
    return context
