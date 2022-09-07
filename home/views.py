from django.shortcuts import render, redirect, reverse
from .models import Matches, PersonalResults, Teams
import json
from django.contrib import messages
from itertools import chain
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Count, Min, Sum


# Create your views here.
def index(request):
    return render(request, 'home/index.html')


@login_required
def game(request):
    """ A view to return the index page """
    user = request.user
    print("user = ", user.id)
    # m = open("./static/json/matches.json", "r")
    # t = open("./static/json/teams.json", "r")
    # matches = m.read()
    # teams = json.loads(t.read())
    # print("matches", matches)
    # print(type(teams))
    personal_results = PersonalResults.objects.all().filter(user=user.id)
    total_points = personal_results.aggregate(Sum('points'))
    # total_points = personal_results.points.sum()
    print("total_points = ", total_points)
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
    personal_results = PersonalResults.objects.all().filter(user=user.id)
    matches = Matches.objects.all()
    template = 'home/game.html'
    context = {'personal_results': personal_results,
               'matches': matches,
               'total_points': total_points}
    return render(request, template, context)


@login_required
def save_result(request, match_id):
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
        saved_data['home_team'] = form_data["home_team"]
        saved_data['home_team_score'] = form_data["home_team_score"]
        saved_data['away_team'] = form_data["away_team"]
        saved_data['away_team_score'] = form_data["away_team_score"]
        request.session['saved_data'] = saved_data
        print("request.session['saved_data'] = ", request.session['saved_data'])
        messages.success(request, f'Match {match.match_number} saved')
    else:
        messages.error(request, 'Your score was not saved successfully. Please try again')
    # print(request.session['saved_data'])
    redirect_url = request.POST.get('redirect_url')
    return redirect(redirect_url)


def tables(request):
    template = 'home/tables.html'
    user = request.user
    print("user = ", user.id)
    # teams = Teams.objects.all().exclude(name="TBD")
    group_list = ["A", "B", "C", "D", "E", "F", "G", "H"]
    group_A = {}
    group_B = {}
    group_C = {}
    group_D = {}
    group_E = {}
    group_F = {}
    group_G = {}
    group_H = {}
    # group_A_results = PersonalResults.objects.all().filter(user=user.id).filter(group="A")
    # print("Group A = ", group_A_results)
    for item in group_list:
        teams = Teams.objects.all().filter(group=item)
        for team in teams:
            matches_played = 0
            matches_won = 0
            matches_drawn = 0
            matches_lost = 0
            goals_for = 0
            goals_against = 0
            goal_diff = 0
            points = 0
            team_results_home = PersonalResults.objects.all().filter(user=user.id).filter(home_team=team).filter(match_number__lte=49)
            team_results_away = PersonalResults.objects.all().filter(user=user.id).filter(away_team=team).filter(match_number__lte=49)
            matches_played = team_results_home.count() + team_results_away.count()
            print("matches_played = ", matches_played)
            print("team_results_home = ", team_results_home)
            print("team_results_away = ", team_results_away)
            for result in team_results_home:
                goals_for += result.home_team_score
                goals_against += result.away_team_score
                if result.home_team_score > result.away_team_score:
                    points += 3
                    matches_won += 1
                elif result.home_team_score == result.away_team_score:
                    points += 1
                    matches_drawn += 1
                else:
                    matches_lost += 1
            for result in team_results_away:
                goals_for += result.away_team_score
                goals_against += result.home_team_score
                if result.home_team_score < result.away_team_score:
                    points += 3
                    matches_won += 1
                elif result.home_team_score == result.away_team_score:
                    points += 1
                    matches_drawn += 1
                else:
                    matches_lost += 1
            goal_diff = goals_for - goals_against
            if item == "A":
                group_A[team.name] = points
                sort_group = sorted(group_A.items(), key=lambda x: x[1], reverse=True)
                group_A = dict(sort_group)
            if item == "B":
                group_B[team.name] = points
                sort_group = sorted(group_B.items(), key=lambda x: x[1], reverse=True)
                group_B = dict(sort_group)
            if item == "C":
                group_C[team.name] = points
                sort_group = sorted(group_C.items(), key=lambda x: x[1], reverse=True)
                group_C = dict(sort_group)
            if item == "D":
                group_D[team.name] = points
                sort_group = sorted(group_D.items(), key=lambda x: x[1], reverse=True)
                group_D = dict(sort_group)
            if item == "E":
                group_E[team.name] = points
                sort_group = sorted(group_E.items(), key=lambda x: x[1], reverse=True)
                group_E = dict(sort_group)
            if item == "F":
                group_F[team.name] = points
                sort_group = sorted(group_F.items(), key=lambda x: x[1], reverse=True)
                group_F = dict(sort_group)
            if item == "G":
                group_G[team.name] = points
                sort_group = sorted(group_G.items(), key=lambda x: x[1], reverse=True)
                group_G = dict(sort_group)
            if item == "H":
                group_H[team.name] = points
                sort_group = sorted(group_H.items(), key=lambda x: x[1], reverse=True)
                group_H = dict(sort_group)
    print("group_A = ", group_A)
    print("group_B = ", group_B)
    print("group_C = ", group_C)
    print("group_D = ", group_D)
    print("group_E = ", group_E)
    print("group_F = ", group_F)
    print("group_G = ", group_G)
    print("group_H = ", group_H)
    context = {'group_A': group_A,
               'group_B': group_B,
               'group_C': group_C,
               'group_D': group_D,
               'group_E': group_E,
               'group_F': group_F,
               'group_G': group_G,
               'group_H': group_H}
    return render(request, template, context)
