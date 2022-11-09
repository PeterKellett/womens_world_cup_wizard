from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Matches, PersonalResults, Wizard, Teams, GroupPositions
from django.contrib.auth.models import User


@receiver(post_save, sender=Matches)
def update_on_save(sender, instance, created, **kwargs):
    # print("match_number = ", instance.match_number)
    """
    Update all the Users points and when each Match instance is updated
    """
    # Get All Users saved personal_wizard for the match model instance that has just been changed
    personal_wizards = Wizard.objects.all().filter(match_number=instance.match_number)
    print("personal_wizards = ", personal_wizards)
    for personal_wizard in personal_wizards:
        points = 0
        if None not in (personal_wizard.winning_team, instance.winning_team):
            print("NOT NONE")
            if personal_wizard.winning_team == instance.winning_team:
                points += 1
            # Need another 'if' here to check if team is in the last 16 in another position
            # Need another 'if' here to check if team is in the quarter final in another position
            # Need another 'if' here to check if team is in the semi final in another position
            # Need another 'if' here to check if team is in the final in another position
            # Need another 'if' here to check if team via golden route (This may not be the place for this tho)
        else:
            print("YES THERE IS A NONE")
            pass
        personal_wizard.points = points
        personal_wizard.save()
    # Get All Users saved personal_result for the match model instance that has just been changed  
    personal_results = PersonalResults.objects.all().filter(match_number=instance.match_number)
    print("personal_results = ", personal_results)
    # Loop through each of the Users personal_result
    for personal_result in personal_results:
        # Update the PersonalResults teams in knockout stage
        personal_result.home_team = instance.home_team
        personal_result.away_team = instance.away_team
        # Update the points for each user
        points = 0
        if None not in (instance.home_team_score, instance.away_team_score, personal_result.home_team_score, personal_result.away_team_score):
            print("NOT NONE")
            if personal_result.home_team_score == instance.home_team_score:
                points += 1
            if personal_result.away_team_score == instance.away_team_score:
                points += 1
            if instance.home_team_score > instance.away_team_score and personal_result.home_team_score > personal_result.away_team_score:
                points += 1
            if instance.away_team_score > instance.home_team_score and personal_result.away_team_score > personal_result.home_team_score:
                points += 1
            if instance.home_team_score == instance.away_team_score and personal_result.home_team_score == personal_result.away_team_score:
                points += 1
        else:
            print("YES THERE IS A NONE")
            pass
        personal_result.points = points
        personal_result.save()


@receiver(post_save, sender=User)
def create_wizard_matches(sender, instance, created, **kwargs):
    """
    Create a full set of fixtures for a Users PersonalResults and Wizard
    when a new User is created
    """
    if created:
        matches = Matches.objects.all()
        for match in matches:
            # print("match = ", match)
            wizard = Wizard(
                user=instance,
                match_number=match.match_number,
                group=match.group,
                home_team=match.home_team,
                away_team=match.away_team,
                )
            wizard.save()
            personal_result = PersonalResults(
                user=instance,
                match_number=match.match_number,
                group=match.group,
                date=match.date,
                home_team=match.home_team,
                away_team=match.away_team,
                )
            personal_result.save()
        teams = Teams.objects.all()
        for team in teams:
            print("teams = ", teams)
            group_position = GroupPositions(
                user=instance,
                team=team,
            )
            group_position.save()
