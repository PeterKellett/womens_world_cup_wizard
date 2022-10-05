from django.shortcuts import render, redirect, reverse
from .models import Matches, PersonalResults, Teams
import json
from django.contrib import messages
from itertools import chain
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Count, Min, Sum
from django.http import  JsonResponse
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def index(request):
    return render(request, 'home/index.html')


def onboarding_landing(request):
    return render(request, 'home/onboarding_landing.html')


def onboarding_1(request):
    return render(request, 'home/onboarding_1.html')


def onboarding_2(request):
    group_list = ["A", "B", "C", "D", "E", "F", "G", "H"]
    group_A = []
    group_B = []
    group_C = []
    group_D = []
    group_E = []
    group_F = []
    group_G = []
    group_H = []
    for item in group_list:
        teams = Teams.objects.all().filter(group=item)
        for team in teams:
            if item == "A":
                group_A.append(team)
            if item == "B":
                group_B.append(team)
            if item == "C":
                group_C.append(team)
            if item == "D":
                group_D.append(team)
            if item == "E":
                group_E.append(team)
            if item == "F":
                group_F.append(team)
            if item == "G":
                group_G.append(team)
            if item == "H":
                group_H.append(team)
    if request.POST:
        form = request.POST
        print("form = ", form)
    context = {"group_A": group_A,
               "group_B": group_B,
               "group_C": group_C,
               "group_D": group_D,
               "group_E": group_E,
               "group_F": group_F,
               "group_G": group_G,
               "group_H": group_H, }
    template = 'home/onboarding_2.html'
    return render(request, template, context)


def onboarding_2a(request):
    context = {}
    if request.POST:
        form = request.POST
        # for k, v in form.items():
        #     print("k, v = ", k, v)
        for count, item in enumerate(form.items()):
            if count % 4 == 1:
                if item[0][:1] == "A":
                    A_1 = Teams.objects.get(pk=item[1])
                    print("A_1 team = ", A_1)
                if item[0][:1] == "B":
                    B_1 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "C":
                    C_1 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "D":
                    D_1 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "E":
                    E_1 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "F":
                    F_1 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "G":
                    G_1 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "H":
                    H_1 = Teams.objects.get(pk=item[1])
            if count % 4 == 2:
                if item[0][:1] == "A":
                    A_2 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "B":
                    B_2 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "C":
                    C_2 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "D":
                    D_2 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "E":
                    E_2 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "F":
                    F_2 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "G":
                    G_2 = Teams.objects.get(pk=item[1])
                if item[0][:1] == "H":
                    H_2 = Teams.objects.get(pk=item[1])
        # print("team_A1 = ", team_A1)
        # context = {'A_1': A_1,
        #            'B_1': B_1,
        #            'C_1': C_1,
        #            'D_1': D_1,
        #            'E_1': E_1,
        #            'F_1': F_1,
        #            'G_1': G_1,
        #            'H_1': H_1,
        #            'A_2': A_2,
        #            'b_2': B_2,
        #            'C_2': C_2,
        #            'D_2': D_2,
        #            'E_2': E_2,
        #            'F_2': F_2,
        #            'G_2': G_2,
        #            'H_2': H_2}
    template = 'home/onboarding_2a.html'
    return render(request, template, context)


@csrf_exempt
def get_teams(request):
    """view to current flock"""
    print("GET_TEAMS")
    teams = Teams.objects.all().values().exclude(name='TBD')
    for team in teams:
        print("team = ", team)
    return JsonResponse({"teams": list(teams)}, safe=False)


def onboarding_3(request):
    return render(request, 'home/onboarding_3.html')


def golden_route(request):
    return render(request, 'home/golden_route.html')


@csrf_exempt
def get_matches(request):
    """view to current flock"""
    print("get_matches")
    teams = Teams.objects.all().values().exclude(name='TBD')
    matches = Matches.objects.all().values(
        'group',
        'match_number',
        'home_team',
        'home_team__abbreviated_name',
        'home_team__crest_url',
        'away_team',
        'away_team__abbreviated_name',
        'away_team__crest_url',
    )
    return JsonResponse({"matches": list(matches),
                         'teams': list(teams)}, safe=False)


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
