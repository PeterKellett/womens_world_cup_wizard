from django.shortcuts import render, redirect, reverse
from django.core.exceptions import ObjectDoesNotExist
from .models import Matches, PersonalResults, Teams, Wizard
from django.contrib.auth.models import User
from .forms import WizardForm
from django.forms import modelformset_factory
import json
from django.contrib import messages
from itertools import chain
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Count, Min, Sum
from django.http import  JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from operator import itemgetter


# Create your views here.
def index(request):
    return render(request, 'home/index.html')


def about(request):
    return render(request, 'home/about.html')


def onboarding_landing(request):
    return render(request, 'home/onboarding_landing.html')


def leaderboard(request):
    users = User.objects.all()
    # print("USERS =", users)
    data = []
    for user in users:
        personal_data = {}
        wizard_points = Wizard.objects.all().filter(user=user.id).aggregate(Sum('points'))
        personal_results_points = PersonalResults.objects.all().filter(user=user.id).aggregate(Sum('points'))
        print("wizard_points =", wizard_points.get('points__sum'))
        print("personal_results_points =", type(personal_results_points))
        personal_data["username"] = user.first_name + ' ' + user.last_name
        personal_data["wizard_points"] = wizard_points.get('points__sum')
        personal_data["personal_results_points"] = personal_results_points.get('points__sum')
        personal_data["total_points"] = personal_results_points.get('points__sum') + wizard_points.get('points__sum')
        print("personal_data =", personal_data)
        data.append(personal_data)
    # print("data = ", data)
    sorted_data = sorted(data, key=itemgetter('total_points'), reverse=True)
    # print("sorted_data = ", sorted_data)
    context = {'data': sorted_data}
    return render(request, 'home/leaderboard.html', context)


@csrf_exempt
def get_teams(request):
    """view to current teams"""
    print("GET_TEAMS")
    teams = Teams.objects.all().values().exclude(name='TBD')
    for team in teams:
        print("team = ", team)
    return JsonResponse({"teams": list(teams)}, safe=False)


# @ensure_csrf_cookie
def golden_route(request):
    user = request.user
    WizardFormSet = modelformset_factory(Wizard, fields=('home_team', 'away_team', 'winning_team',), extra=0)
    # data = {
    #     'form-TOTAL_FORMS': '64',
    #     'form-INITIAL_FORMS': '64',
    # }
    wizard_data = Wizard.objects.all().filter(user=user)
    redirect_url = request.POST.get('redirect_url')
    print("redirect_url = ", redirect_url)
    if request.method == 'POST':
        print("POSTED")
        formset = WizardFormSet(request.POST)
        if formset.is_valid():
            # print("VALID", formset.cleaned_data)
            formset.save()
            messages.success(request, 'Wizard saved')
        else:
            errors = formset.errors
            # print("NOT VALID", form)
            print('errors = ', errors)
            messages.error(request, 'Wizard did not save!')
        wizard_data = Wizard.objects.all().filter(user=user)
        formset = WizardFormSet(queryset=wizard_data)
        return redirect(redirect_url)
    else:
        formset = WizardFormSet(queryset=wizard_data)
    template = 'home/golden_route.html'
    context = {
        'formset': formset
    }
    return render(request, template, context)


@csrf_exempt
def get_wizard_data(request):
    """view to current flock"""
    print("get_matches")
    user = request.user
    print("user = ", user)
    teams = Teams.objects.all().values()
    saved_wizard = Wizard.objects.all().filter(user=user.id).values(
        'group',
        'match_number',
        'home_team',
        'home_team__name',
        'home_team__abbreviated_name',
        'home_team__crest_url',
        'away_team',
        'away_team__name',
        'away_team__abbreviated_name',
        'away_team__crest_url',
        'winning_team',
    )
    matches = Matches.objects.all().values(
        'group',
        'match_number',
        'home_team',
        'home_team_score',
        'home_team__name',
        'home_team__abbreviated_name',
        'home_team__crest_url',
        'away_team',
        'away_team_score',
        'away_team__name',
        'away_team__abbreviated_name',
        'away_team__crest_url',
        'winning_team__name',
        'winning_team__id',
    )
    return JsonResponse({"matches": list(matches),
                         'teams': list(teams),
                         'saved_wizard': list(saved_wizard)},
                        safe=False)


@login_required
def game(request):
    """ A view to return the game page """
    user = request.user
    print("user = ", user.id)
    personal_results = PersonalResults.objects.all().filter(user=user.id)
    total_points = personal_results.aggregate(Sum('points'))
    print("total_points = ", total_points)
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
    context = {'group_A': group_A,
               'group_B': group_B,
               'group_C': group_C,
               'group_D': group_D,
               'group_E': group_E,
               'group_F': group_F,
               'group_G': group_G,
               'group_H': group_H}
    return render(request, template, context)
