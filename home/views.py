from django.shortcuts import render, redirect, reverse
# from django.core.exceptions import ObjectDoesNotExist
from .models import Matches, PersonalResults, Teams, Wizard, GroupPositions, \
    DefaultMatches, DefaultGroupPositions
from django.contrib.auth.models import User
# from .forms import WizardForm
from django.forms import modelformset_factory
# import json, requests
from django.contrib import messages
# from itertools import chain
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from operator import itemgetter
# from collections import OrderedDict
from django.utils import timezone
from datetime import datetime
import random


# Create your views here.
def index(request):
    print("/home")
    matches = Matches.objects.all()
    for match in matches:
        print(match)
    return render(request, 'home/index.html')


def about(request):
    return render(request, 'home/about.html')


def leaderboard(request):
    myself = request.user.id
    users = User.objects.all().exclude(is_active=False)
    data = []
    for user in users:
        personal_data = {}
        wizard_points = Wizard.objects.all().filter(user=user.id) \
            .aggregate(Sum('points'))
        personal_results_points = PersonalResults.objects.all() \
            .filter(user=user.id).aggregate(Sum('points'))
        personal_data["user"] = user.id
        personal_data["username"] = user.first_name + ' ' + user.last_name
        personal_data["wizard_points"] = wizard_points.get('points__sum')
        personal_data["personal_results_points"] = personal_results_points \
            .get('points__sum')
        personal_data["total_points"] = personal_results_points \
            .get('points__sum') + wizard_points.get('points__sum')
        data.append(personal_data)
        print(data)
    sorted_data = sorted(data, key=itemgetter('total_points'), reverse=True)
    context = {'data': sorted_data,
               'myself': myself}
    return render(request, 'home/leaderboard.html', context)


def userscores(request, user):
    user = User.objects.get(id=user)
    username = (user.first_name + ' ' + user.last_name)
    now = datetime.now()
    # scores = PersonalResults.objects.all().filter(user=user) \
    #     .exclude(date__gte=now).order_by('match_number')
    scores = PersonalResults.objects.all().filter(user=user) \
        .order_by('match_number')
    context = {
        'username': username,
        'scores': scores
    }
    template = 'home/userscores.html'
    return render(request, template, context)


# @login_required
def game(request):
    """ A view to return the game page """
    print("/game")
    user = request.user
    print(user)
    redirect_url = request.POST.get('redirect_url')
    saved_matches = []
    # if not saved_matches:
    #     print("YES saved_matches")
    #     saved_matches = []
    # saved_matches = PersonalResults.objects.all().filter(user=user)[:5]
    if not user.is_authenticated:
        SilverGoalFormSet = modelformset_factory(DefaultMatches,
                                                 fields=('id',
                                                         'match_number',
                                                         'group',
                                                         'home_team',
                                                         'home_team_score',
                                                         'away_team',
                                                         'away_team_score',),
                                                 extra=0)
        silver_goal_data = DefaultMatches.objects.all()
        silver_goal_formset = SilverGoalFormSet(queryset=silver_goal_data)
        if request.method == 'POST':
            print("POSTED ANON")
            formset = SilverGoalFormSet(request.POST)
            if formset.is_valid():
                print("IS VALID")
                if formset.has_changed():
                    for form in formset:
                        if form.cleaned_data['home_team_score'] is not None and form.cleaned_data['away_team_score'] is not None:
                            print("formChanged = ", form.cleaned_data['home_team_score'])
                            saved_matches.append(form.cleaned_data)
                    # messages.success(request, f'Matches saved ({len(saved_matches)})')
                print("saved_matches = ", saved_matches)
                results = []
                for item in saved_matches:
                    # print("item = ", item['home_team'].crest_url)
                    result = {
                        'match_number': item['match_number'],
                        'home_team': {'name': item['home_team'].name,
                                      'crest_url': item['home_team'].crest_url},
                        'home_team_score': item['home_team_score'],
                        'away_team': {'name': item['away_team'].name,
                                      'crest_url': item['away_team'].crest_url},
                        'away_team_score': item['away_team_score']
                    }
                    results.append(result)
                request.session['saved_matches'] = results
                request.session["redirect_url"] = redirect_url
                return redirect(reverse('account_signup'))
            else:
                print("NOT VALID")
                for index, error in enumerate(form.errors):
                    print(index, error)

    else:
        SilverGoalFormSet = modelformset_factory(PersonalResults,
                                                 fields=('id',
                                                         'match_number',
                                                         'group',
                                                         'home_team',
                                                         'home_team_score',
                                                         'away_team',
                                                         'away_team_score',),
                                                 extra=0)
        silver_goal_data = PersonalResults.objects.all().filter(user=user.id) \
            .order_by('match_number')
        silver_goal_formset = SilverGoalFormSet(queryset=silver_goal_data)
        if request.method == 'POST':
            print("POSTED", user)
            # saved_data = request.session.get('saved_data', {})
            formset = SilverGoalFormSet(request.POST, initial=silver_goal_data)
            if formset.is_valid():
                print("IS VALID")
                if formset.has_changed():
                    for form in formset:
                        if form.has_changed() and form.cleaned_data['home_team_score'] is not None and form.cleaned_data['away_team_score'] is not None:
                            print("formChanged = ", form.cleaned_data)
                            saved_matches.append(form.cleaned_data)
                    messages.success(request, f'Matches saved ({len(saved_matches)})')
                formset.save()
            else:
                print("NOT VALID")
                for index, error in enumerate(formset.errors):
                    print(index, error)
    # total_points = personal_results.aggregate(Sum('points'))
    matches = Matches.objects.all()
    template = 'home/game.html'
    # context = {'SilverGoalFormSet': SilverGoalFormSet,
    #            'matches': matches,
    #            'total_points': total_points}
    context = {'SilverGoalFormSet': silver_goal_formset,
               'matches': matches,
               'saved_matches': saved_matches}
    return render(request, template, context)


# @ensure_csrf_cookie
# @login_required
def golden_route(request):
    user = request.user
    redirect_url = request.POST.get('redirect_url')
    if not user.is_authenticated:
        DefaultWizardFormSet = modelformset_factory(DefaultMatches,
                                                    fields=('match_number',
                                                            'group',
                                                            'home_team',
                                                            'away_team',
                                                            'winning_team',),
                                                    extra=0)
        DefaultGroupPositionsFormSet = \
            modelformset_factory(DefaultGroupPositions,
                                 fields=('position',),
                                 extra=0)
        wizard_data = DefaultMatches.objects.all()
        group_positions = DefaultGroupPositions.objects.all() \
            .exclude(team__name='TBD').order_by('position')
        wizard_formset = DefaultWizardFormSet(queryset=wizard_data,
                                              prefix="wizard")
        group_positions_formset = \
            DefaultGroupPositionsFormSet(queryset=group_positions,
                                         prefix="positions")
        if request.method == 'POST':
            print("POSTED")
            saved_group_positions = request.session \
                .get('saved_group_positions', {})
            wizard_formset = DefaultWizardFormSet(request.POST,
                                                prefix="wizard")
            group_positions_formset = \
                DefaultGroupPositionsFormSet(request.POST, prefix="positions")
            if wizard_formset.is_valid() and group_positions_formset.is_valid():
                print(type(wizard_formset.cleaned_data))
                saved_wizard = wizard_formset.cleaned_data
                saved_group_positions = group_positions_formset.cleaned_data
                matches = []
                for item in saved_wizard:
                    if item['winning_team'] is None:
                        winning_team = None
                    else:
                        winning_team = item['winning_team'].id
                    # print("item = ", item['winning_team'])
                    match = {
                        'match_number': item['match_number'],
                        'group': item['group'],
                        'home_team': item['home_team'].id,
                        'away_team': item['away_team'].id,
                        'winning_team': winning_team
                    }
                    matches.append(match)
                group_positions = []
                for item in saved_group_positions:
                    print("item = ", item['id'].id)
                    group_position = {
                        'position': item['position'],
                        'team': item['id'].id
                    }
                    group_positions.append(group_position)
                # print("matches = ", matches)
                print("group_positions = ", group_positions)
                request.session["saved_wizard"] = matches
                request.session['saved_group_positions'] = group_positions
                request.session["redirect_url"] = redirect_url
                # messages.success(request, 'Wizard saved')
                return redirect(reverse('account_signup'))
            else:
                print("NOT VALID")
                for index, error in enumerate(wizard_formset.errors):
                    print(index, error)
    else:
        WizardFormSet = modelformset_factory(Wizard,
                                             fields=('home_team',
                                                     'away_team',
                                                     'winning_team',),
                                             extra=0)
        GroupPositionsFormSet = modelformset_factory(GroupPositions,
                                                     fields=('position',),
                                                     extra=0)
        wizard_data = Wizard.objects.all().filter(user=user)
        group_positions = GroupPositions.objects.all().filter(user=user) \
            .exclude(team__name='TBD').order_by('position')
        wizard_formset = WizardFormSet(queryset=wizard_data, prefix="wizard")
        group_positions_formset = \
            GroupPositionsFormSet(queryset=group_positions, prefix="positions")
        if request.method == 'POST':
            wizard_formset = WizardFormSet(request.POST, prefix="wizard")
            group_positions_formset = GroupPositionsFormSet(request.POST,
                                                            prefix="positions")
            if wizard_formset.is_valid() and group_positions_formset.is_valid():
                wizard_formset.save()
                group_positions_formset.save()
                messages.success(request, 'Wizard saved')
            else:
                errors = group_positions_formset.errors
                messages.error(request, errors)
            wizard_data = Wizard.objects.all().filter(user=user)
            wizard_formset = WizardFormSet(queryset=wizard_data,
                                           prefix="wizard")
            group_positions = GroupPositions.objects.all().filter(user=user)
            group_positions_formset = \
                GroupPositionsFormSet(queryset=group_positions,
                                      prefix="positions")
            return redirect(redirect_url)
    template = 'home/golden_route.html'
    context = {
        'WizardFormset': wizard_formset,
        'GroupPositionsFormset': group_positions_formset
    }
    return render(request, template, context)


def post_register(request):
    print("post_register")
    user = request.user
    saved_wizard = request.session.get("saved_wizard")
    saved_group_positions = request.session.get('saved_group_positions', {})
    sg_saved_matches = request.session.get('saved_matches')
    redirect_url = request.session.get("redirect_url", {})
    print("saved_wizard = ", saved_wizard)
    if saved_wizard is not None:
        gg_user_matches = Wizard.objects.all().filter(user=user)
        for match in gg_user_matches:
            new_match = next((x for x in saved_wizard if x["match_number"] == match.match_number), None)
            print("new_match = ", new_match['home_team'])
            home_team = Teams.objects.get(pk=new_match['home_team'])
            away_team = Teams.objects.get(pk=new_match['away_team'])
            if new_match['winning_team'] is not None:
                winning_team = Teams.objects.get(pk=new_match['winning_team'])
                match.winning_team = winning_team
            match.home_team = home_team
            match.away_team = away_team
            match.save()
        user_group_positions = GroupPositions.objects.all().filter(user=user).exclude(team__name='TBD')
        for team in user_group_positions:
            team_position = next((x for x in saved_group_positions if x['team'] == team.team.id), None)
            print("team_position = ", team_position)
            team.position = team_position['position']
            team.save()
        messages.success(request, 'Wizard saved')
        return redirect(redirect_url)
    if sg_saved_matches is not None:
        personal_results = PersonalResults.objects.all().filter(user=user)
        print("sg_saved_matches = ", sg_saved_matches)
        # saved_data = request.session.get('saved_data', {})
        match_data = []
        for match in personal_results:
            new_result = next((x for x in sg_saved_matches if x["match_number"] == match.match_number), None)
            # print("new_result = ", new_result)
            # print("match = ", match.home_team)
            if new_result is not None:
                match.home_team_score = new_result['home_team_score']
                match.away_team_score = new_result['away_team_score']
                print("match = ", match)
                match.save()
                # match_data.append(match)
        request.session['saved_matches'] = {}
        messages.success(request, 'Silver Goal results saved')
        return redirect(redirect_url)
    else:
        return render(request, 'home/index.html')


@csrf_exempt
def get_teams(request):
    """view to current teams"""
    print("get_teams")
    user = request.user
    teams = Teams.objects.all().values()
    if user.is_authenticated:
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
        return JsonResponse({"teams": list(teams),
                            'saved_wizard': list(saved_wizard)},
                            safe=False)
    else:
        return JsonResponse({"teams": list(teams)}, safe=False)


def userswizards(request, user):
    user = User.objects.get(id=user)
    username = (user.first_name + ' ' + user.last_name)
    groupPositions = GroupPositions.objects.all().filter(user=user.id) \
        .order_by('position')
    wizard = Wizard.objects.all().filter(user=user.id).order_by('match_number')
    last_16_points = wizard.filter(group="Round of 16") \
        .aggregate(Sum('points'))
    quarter_final_points = wizard.filter(group="Quarter Final") \
        .aggregate(Sum('points'))
    semi_final_points = wizard.filter(group="Semi Final") \
        .aggregate(Sum('points'))
    third_place_playoff_points = wizard.filter(group="Third Place Play Off") \
        .aggregate(Sum('points'))
    final_points = wizard.filter(group="Final").aggregate(Sum('points'))
    context = {
        'username': username,
        'groupPositions': groupPositions,
        'wizard': wizard,
        'last_16_points': last_16_points,
        'quarter_final_points': quarter_final_points,
        'semi_final_points': semi_final_points,
        'third_place_playoff_points': third_place_playoff_points,
        'final_points': final_points}
    template = 'home/userswizards.html'
    return render(request, template, context)


@csrf_exempt
def get_wizard_data(request):
    """view to current flock"""
    print("get_wizard_data")
    user = request.user
    if not user.is_authenticated:
        teams = DefaultGroupPositions.objects.all().values(
            'team',
            'team__name',
            'team__crest_url',
            'team__group',
            'position',
        )
    else:
        print("ELSE TEAMS")
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
        'winning_team__crest_url',
    )
    matches.order_by('match_number')
    return JsonResponse({"matches": list(matches),
                         'teams': list(teams),
                         'saved_wizard': list(saved_wizard)},
                        safe=False)


@login_required
def save_result(request, match_id):
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
        messages.success(request, f'Match {match.match_number} saved')
    else:
        messages.error(request, 'Your score was not saved successfully. \
            Please try again')
    redirect_url = request.POST.get('redirect_url')
    return redirect(redirect_url)


def tables(request):
    template = 'home/tables.html'
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
            matches_played = 0
            matches_won = 0
            matches_drawn = 0
            matches_lost = 0
            goals_for = 0
            goals_against = 0
            goal_diff = 0
            points = 0
            team_results_home = Matches.objects.all().filter(home_team=team) \
                .filter(match_number__lte=48)
            team_results_away = Matches.objects.all().filter(away_team=team) \
                .filter(match_number__lte=48)
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
                    'crest_url': team.crest_url,
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
                group_A_sorted = sorted(group_A, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
            if item == "B":
                group_B.append({
                    'crest_url': team.crest_url,
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
                group_B_sorted = sorted(group_B, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
            if item == "C":
                group_C.append({
                    'crest_url': team.crest_url,
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
                group_C_sorted = sorted(group_C, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
            if item == "D":
                group_D.append({
                    'crest_url': team.crest_url,
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
                group_D_sorted = sorted(group_D, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
            if item == "E":
                group_E.append({
                    'crest_url': team.crest_url,
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
                group_E_sorted = sorted(group_E, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
            if item == "F":
                group_F.append({
                    'crest_url': team.crest_url,
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
                group_F_sorted = sorted(group_F, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
            if item == "G":
                group_G.append({
                    'crest_url': team.crest_url,
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
                group_G_sorted = sorted(group_G, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
            if item == "H":
                group_H.append({
                    'crest_url': team.crest_url,
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
                group_H_sorted = sorted(group_H, key=itemgetter('points',
                                                                'goal_diff'),
                                        reverse=True)
    context = {'group_A': group_A_sorted,
               'group_B': group_B_sorted,
               'group_C': group_C_sorted,
               'group_D': group_D_sorted,
               'group_E': group_E_sorted,
               'group_F': group_F_sorted,
               'group_G': group_G_sorted,
               'group_H': group_H_sorted}
    return render(request, template, context)


def randomise_silver_goal(request):
    print("randomise_silver_goal")
    user = request.user
    print("user = ", user)
    silver_goal_matches = PersonalResults.objects.all().filter(user=user).filter(match_number__lte=48)
    for match in silver_goal_matches:
        home_score = random.randrange(11)
        away_score = random.randrange(11)
        match.home_team_score = home_score
        match.away_team_score = away_score
        print("home_score = ", home_score)
        print("away_score = ", away_score)
        match.save()                       
    return (redirect('game'))


def randomise_golden_goal(request):
    print("randomise_golden_goal")
    user = request.user
    print("user = ", user)
    team_tbd = Teams.objects.all().filter(name='TBD')
    print("team_tbd = ", team_tbd[0].id)
    golden_goal_matches = Wizard.objects.all().filter(user=user)
    for match in golden_goal_matches:
        home_score = random.randrange(11)
        away_score = random.randrange(11)
        print("home_score = ", home_score)
        print("away_score = ", away_score)
        if home_score > away_score:
            match.winning_team = match.home_team
        if away_score > home_score:
            match.winning_team = match.away_team
        if home_score == away_score:
            match.winning_team = team_tbd[0]
        match.save()
    return (redirect('golden_route'))


def randomise_matches(request):
    print("randomise_matches")
    user = request.user
    print("user = ", user)
    team_tbd = Teams.objects.all().filter(name='TBD')
    matches = Matches.objects.all().filter(match_number__lte=48)
    for match in matches:
        home_score = random.randrange(11)
        away_score = random.randrange(11)
        print("home_score = ", home_score)
        print("away_score = ", away_score)
        match.home_team_score = home_score
        match.away_team_score = away_score
        if home_score > away_score:
            match.winning_team = match.home_team
        if away_score > home_score:
            match.winning_team = match.away_team
        if home_score == away_score:
            match.winning_team = team_tbd[0]
        match.save()
    return (redirect('leaderboard'))
