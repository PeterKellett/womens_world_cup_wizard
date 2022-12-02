from django.shortcuts import render, redirect, reverse
from django.core.exceptions import ObjectDoesNotExist
from .models import Matches, PersonalResults, Teams, Wizard, GroupPositions
from django.contrib.auth.models import User
from .forms import WizardForm
from django.forms import modelformset_factory
import json
from django.contrib import messages
from itertools import chain
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Count, Min, Sum
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from operator import itemgetter, getitem
from collections import OrderedDict
from datetime import datetime


# Create your views here.
def index(request):
    return render(request, 'home/index.html')


def about(request):
    return render(request, 'home/about.html')


def onboarding_landing(request):
    return render(request, 'home/onboarding_landing.html')


def leaderboard(request):
    myself = request.user.id
    users = User.objects.all()
    print("myself =", myself)
    data = []
    for user in users:
        personal_data = {}
        wizard_points = Wizard.objects.all().filter(user=user.id).aggregate(Sum('points'))
        personal_results_points = PersonalResults.objects.all().filter(user=user.id).aggregate(Sum('points'))
        print("wizard_points =", wizard_points.get('points__sum'))
        print("personal_results_points =", type(personal_results_points))
        personal_data["user"] = user.id
        personal_data["username"] = user.first_name + ' ' + user.last_name
        personal_data["wizard_points"] = wizard_points.get('points__sum')
        personal_data["personal_results_points"] = personal_results_points.get('points__sum')
        personal_data["total_points"] = personal_results_points.get('points__sum') + wizard_points.get('points__sum')
        print("personal_data =", personal_data)
        data.append(personal_data)
    # print("data = ", data)
    sorted_data = sorted(data, key=itemgetter('total_points'), reverse=True)
    # print("sorted_data = ", sorted_data)
    context = {'data': sorted_data,
               'myself': myself}
    return render(request, 'home/leaderboard.html', context)


def userscores(request, user):
    print("user = ", user)
    user = User.objects.get(id=user)
    username = (user.first_name + ' ' + user.last_name)
    now = datetime.now()
    print("now = ", now)
    scores = PersonalResults.objects.all().filter(user=user).exclude(date__gte=now).order_by('match_number')
    context = {
        'username': username,
        'scores': scores
    }
    template = 'home/userscores.html'
    return render(request, template, context)


@csrf_exempt
def get_teams(request):
    """view to current teams"""
    print("GET_TEAMS")
    teams = Teams.objects.all().values().exclude(name='TBD')
    for team in teams:
        print("team = ", team)
    return JsonResponse({"teams": list(teams)}, safe=False)


# @ensure_csrf_cookie
@login_required
def golden_route(request):
    user = request.user
    redirect_url = request.POST.get('redirect_url')
    WizardFormSet = modelformset_factory(Wizard,
                                         fields=('home_team',
                                                 'away_team',
                                                 'winning_team',),
                                         extra=0)
    GroupPositionsFormSet = modelformset_factory(GroupPositions,
                                                 fields=('position',),
                                                 extra=0)
    print("user = ", type(user))
    if not user.is_authenticated:
        return redirect(reverse('account_signup'))
    # data = {
    #     'form-TOTAL_FORMS': '64',
    #     'form-INITIAL_FORMS': '64',
    # }
    wizard_data = Wizard.objects.all().filter(user=user)
    group_positions = GroupPositions.objects.all().filter(user=user).exclude(team__name='TBD').order_by('position')
    if request.method == 'POST':
        print("POSTED")
        wizard_formset = WizardFormSet(request.POST, prefix="wizard")
        # print("wizard_formset = ", wizard_formset)
        group_positions_formset = GroupPositionsFormSet(request.POST, prefix="positions")
        # print("group_positions_formset = ", group_positions_formset)
        if wizard_formset.is_valid() and group_positions_formset.is_valid():
            print("VALID", group_positions_formset.cleaned_data)
            wizard_formset.save()
            group_positions_formset.save()
            messages.success(request, 'Wizard saved')
        else:
            errors = group_positions_formset.errors
            # print("NOT VALID", form)
            print('errors = ', errors)
            messages.error(request, errors)
        wizard_data = Wizard.objects.all().filter(user=user)
        wizard_formset = WizardFormSet(queryset=wizard_data, prefix="wizard")
        group_positions = GroupPositions.objects.all().filter(user=user)
        group_positions_formset = GroupPositionsFormSet(queryset=group_positions, prefix="positions")
        return redirect(redirect_url)
    else:
        wizard_formset = WizardFormSet(queryset=wizard_data, prefix="wizard")
        group_positions_formset = GroupPositionsFormSet(queryset=group_positions, prefix="positions")
    template = 'home/golden_route.html'
    # print("group_positions_formset = ", group_positions_formset)
    context = {
        'WizardFormset': wizard_formset,
        'GroupPositionsFormset': group_positions_formset
    }
    return render(request, template, context)


def userswizards(request, user):
    print("user = ", user)
    user = User.objects.get(id=user)
    username = (user.first_name + ' ' + user.last_name)
    groupPositions = GroupPositions.objects.all().filter(user=user.id).order_by('position')
    wizard = Wizard.objects.all().filter(user=user.id).order_by('match_number')
    last_16_points = wizard.filter(group="Round of 16").aggregate(Sum('points'))
    quarter_final_points = wizard.filter(group="Quarter Final").aggregate(Sum('points'))
    semi_final_points = wizard.filter(group="Semi Final").aggregate(Sum('points'))
    final_points = wizard.filter(group="Final").aggregate(Sum('points'))
    print("last_16_points = ", last_16_points)
    print("quarter_final_points = ", quarter_final_points)
    print("semi_final_points = ", semi_final_points)
    print("final_points = ", final_points)
    context = {
        'username': username,
        'groupPositions': groupPositions,
        'wizard': wizard,
        'last_16_points': last_16_points,
        'quarter_final_points': quarter_final_points,
        'semi_final_points': semi_final_points,
        'final_points': final_points}
    template = 'home/userswizards.html'
    return render(request, template, context)


@csrf_exempt
def get_wizard_data(request):
    """view to current flock"""
    print("get_matches")
    user = request.user
    print("user = ", user)
    # teams = Teams.objects.all().values()
    teams = GroupPositions.objects.all().filter(user=user.id).values(
        'team',
        'team__name',
        'team__crest_url',
        'team__group',
        'position',
        'team__is_eliminated',
    )
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
    saved_wizard.order_by('match_number')
    matches = Matches.objects.all().values(
        'group',
        'match_number',
        'home_team',
        'home_team_score',
        'home_team__name',
        'home_team__abbreviated_name',
        'home_team__crest_url',
        'home_team__is_eliminated',
        'away_team',
        'away_team_score',
        'away_team__name',
        'away_team__abbreviated_name',
        'away_team__crest_url',
        'away_team__is_eliminated',
        'winning_team__name',
        'winning_team__id',
    )
    matches.order_by('match_number')
    return JsonResponse({"matches": list(matches),
                         'teams': list(teams),
                        #  'teamsXtra': list(teamsXtra),
                         'saved_wizard': list(saved_wizard)},
                        safe=False)


@login_required
def game(request):
    """ A view to return the game page """
    user = request.user
    print("user = ", user.id)
    personal_results = PersonalResults.objects.all().filter(user=user.id).order_by('match_number')
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
    group_A = []
    group_B = []
    group_C = []
    group_D = []
    group_E = []
    group_F = []
    group_G = []
    group_H = []
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
            team_results_home = Matches.objects.all().filter(home_team=team).filter(match_number__lte=49)
            team_results_away = Matches.objects.all().filter(away_team=team).filter(match_number__lte=49)
            # matches_played = team_results_home.count() + team_results_away.count()
            print("matches_played = ", matches_played)
            print("team_results_home = ", team_results_home)
            print("team_results_away = ", team_results_away)
            for result in team_results_home:
                if result.home_team_score is not None:
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
                    matches_played += 1
            for result in team_results_away:
                if result.away_team_score is not None:
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
                    matches_played += 1
            goal_diff = goals_for - goals_against
            if item == "A":
                group_A.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_A_sorted = sorted(group_A, key=itemgetter('points', 'goal_diff'), reverse=True)
            if item == "B":
                group_B.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_B_sorted = sorted(group_B, key=itemgetter('points', 'goal_diff'), reverse=True)
            if item == "C":
                group_C.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_C_sorted = sorted(group_C, key=itemgetter('points', 'goal_diff'), reverse=True)
            if item == "D":
                group_D.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_D_sorted = sorted(group_D, key=itemgetter('points', 'goal_diff'), reverse=True)
            if item == "E":
                group_E.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_E_sorted = sorted(group_E, key=itemgetter('points', 'goal_diff'), reverse=True)
            if item == "F":
                group_F.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_F_sorted = sorted(group_F, key=itemgetter('points', 'goal_diff'), reverse=True)
            if item == "G":
                group_G.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_G_sorted = sorted(group_G, key=itemgetter('points', 'goal_diff'), reverse=True)
            if item == "H":
                group_H.append({
                    'team_name': team.name,
                    'played': matches_played,
                    'won': matches_won,
                    'draw': matches_drawn,
                    'lost': matches_lost,
                    'goals_for': goals_for,
                    'goals_against': goals_against,
                    'goal_diff': goal_diff,
                    'points': points
                })
                group_H_sorted = sorted(group_H, key=itemgetter('points', 'goal_diff'), reverse=True)
    print("group_A = ", group_A_sorted)
    context = {'group_A': group_A_sorted,
               'group_B': group_B_sorted,
               'group_C': group_C_sorted,
               'group_D': group_D_sorted,
               'group_E': group_E_sorted,
               'group_F': group_F_sorted,
               'group_G': group_G_sorted,
               'group_H': group_H_sorted}
    return render(request, template, context)
