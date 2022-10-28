from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Matches, PersonalResults, Wizard
from django.contrib.auth.models import User


@receiver(post_save, sender=Matches)
def update_on_save(sender, instance, created, **kwargs):
    """
    Update order total on lineitem update/create.
    """
    print("sender = ", sender)
    print("instance = ", instance)
    print("created = ", created)
    print("match_number = ", instance.match_number)
    personal_results = PersonalResults.objects.all().filter(match_number=instance.match_number)
    print("personal_results = ", personal_results)
    # Update the PersonalResults teams in knockout stage
    for personal_result in personal_results:
        personal_result.home_team = instance.home_team
        personal_result.away_team = instance.away_team
        # Update the points for each user
        if None not in (instance.home_team_score, instance.away_team_score, personal_result.home_team_score, personal_result.away_team_score):
            print("NOT NONE")
            if personal_result.home_team_score == instance.home_team_score:
                personal_result.points += 1
            if personal_result.away_team_score == instance.away_team_score:
                personal_result.points += 1
            if instance.home_team_score > instance.away_team_score and personal_result.home_team_score > personal_result.away_team_score:
                personal_result.points += 1
            if instance.away_team_score > instance.home_team_score and personal_result.away_team_score > personal_result.home_team_score:
                personal_result.points += 1
            if instance.home_team_score == instance.away_team_score and personal_result.home_team_score == personal_result.away_team_score:
                personal_result.points += 1
        else:
            print("YES THERE IS A NONE")
        personal_result.save()


@receiver(post_save, sender=User)
def create_wizard_matches(sender, instance, created, **kwargs):
    print("sender = ", sender)
    print("instance = ", instance)
    print("created = ", created)
    if created:
        matches = Matches.objects.all()
        for match in matches:
            print("match = ", match)
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
