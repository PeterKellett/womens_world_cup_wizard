from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Matches, PersonalResults
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
    if created:
        users = User.objects.all()
        print("Users = ", users)
        for user in users:
            personal_result = PersonalResults(
                user=user,
                match_number=instance.match_number,
                group=instance.group,
                date=instance.date,
                home_team=instance.home_team,
                away_team=instance.away_team,
                )
            personal_result.save()
    # Update the PersonalResults teams in knockout stage
    for match in personal_results:
        match.home_team = instance.home_team
        match.away_team = instance.away_team
        match.save()
        # Update the points for each user
        if instance.home_team_score is not None and instance.away_team_score is not None:
            print("CHANGED")
            if match.home_team_score == instance.home_team_score:
                match.points += 1
            if match.away_team_score == instance.away_team_score:
                match.points += 1
            if instance.home_team_score > instance.away_team_score and match.home_team_score > match.away_team_score:
                match.points += 1
            if instance.away_team_score > instance.home_team_score and match.away_team_score > match.home_team_score:
                match.points += 1
            if instance.home_team_score == instance.away_team_score and match.home_team_score == match.away_team_score:
                match.points += 1
            else:
                print("NO")
            match.save()
        else:
            print("NOT Changed")
