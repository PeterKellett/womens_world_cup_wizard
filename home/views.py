from django.shortcuts import render, redirect, reverse
from .models import Matches, PersonalResults, Teams
import json
from django.contrib import messages
from itertools import chain


# Create your views here.
def index(request):
    user = request.user
    if user:
        personal_results = PersonalResults.objects.all().filter(user=user.id)
        matches = Matches.objects.all()
        template = 'home/game.html'
        context = {'personal_results': personal_results,
                   'matches': matches}
        return render(request, template, context)
    return render(request, 'home/index.html')


def game(request):
    """ A view to return the index page """
    user = request.user
    print("user = ", user.id)
    if request.POST:
        print("POSTED")
        form_data = request.POST
        match_id = form_data["id"]
        match = PersonalResults.objects.get(id=match_id)
        if match:
            match.home_team_score = form_data["home_team_score"]
            match.away_team_score = form_data["away_team_score"]
            match.save()
            saved_data = request.session.get('updated_score', {})
            saved_data = {}
            saved_data['match_id'] = match_id
            # saved_data['home_team'] = form_data["home_team"]
            # saved_data['home_team_score'] = form_data["home_team_score"]
            # saved_data['away_team'] = form_data["away_team"]
            # saved_data['away_team_score'] = form_data["away_team_score"]
            request.session['saved_data'] = saved_data
            print(request.session['saved_data'])
            messages.success(request, f'Match {match.match_number} saved')
        else:
            messages.error(request, 'Your score was not added successfully. Please try again')
    else:
        print("NOT POSTED")
    # m = open("./static/json/matches.json", "r")
    # t = open("./static/json/teams.json", "r")
    # matches = m.read()
    # teams = json.loads(t.read())
    # print("matches", matches)
    # print(type(teams))
    personal_results = PersonalResults.objects.all().filter(user=user.id)
    print("personal_results = ", personal_results)
    if not personal_results:
        print("NONE")
        initial_data = Matches.objects.all()
        for match in initial_data:
            personal_result = PersonalResults(
                user=user,
                match_number=match.match_number,
                group=match.group,
                date=match.date,
                home_team=match.home_team,
                away_team=match.away_team,
                )
            personal_result.save()
    else:
        print("YES")
    personal_results = PersonalResults.objects.all().filter(user=user.id)
    matches = Matches.objects.all()
    template = 'home/game.html'
    context = {'personal_results': personal_results,
               'matches': matches}
    return render(request, template, context)
