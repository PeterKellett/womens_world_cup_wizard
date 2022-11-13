from .models import PersonalResults, Wizard
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.conf import settings


def updated_score(request):
    saved_data = request.session.get('saved_data', {})
    # match_id = 1
    # saved_data = {}
    print("saved_data = ", saved_data)
    match_data = []
    if 'match_id' in list(saved_data):
        print("YES match data")
        match = get_object_or_404(PersonalResults, pk=saved_data['match_id'])
        match_data = []
        print("context match = ", match)
        match_data.append({
            'match': match
        })
    request.session['saved_data'] = {}
    context = {'match_data': match_data}
    return context


def global_vars(request):
    user = request.user
    print("user_points = ", user)
    if user.is_authenticated:
        wizard_points = Wizard.objects.all().filter(user=user.id).aggregate(Sum('points'))
        personal_results_points = PersonalResults.objects.all().filter(user=user.id).aggregate(Sum('points'))
        points = personal_results_points.get('points__sum') + wizard_points.get('points__sum')
        print("user_points = ", points)
    else:
        points = 0
    context = {
        'points': points,
        'heroku_version': settings.HEROKU_VERSION
    }
    return context
