from .models import PersonalResults


def updated_score(request):
    saved_data = request.session.get('saved_data', {})
    match = PersonalResults.objects.get(id=saved_data['match_id'])
    match_data = []
    print("context match = ", match)
    match_data.append({
        'match': match
    })
    context = {'match_data': match_data}
    return context
