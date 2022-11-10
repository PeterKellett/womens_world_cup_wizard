from .models import PersonalResults
from django.shortcuts import get_object_or_404


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
