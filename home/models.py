from django.db import models
from django.contrib.auth.models import User
# from datetime import datetime
from django.utils import timezone
from django.utils.timezone import timedelta


# Create your models here.
class Teams(models.Model):
    class Meta:
        verbose_name_plural = 'Teams'
    name = models.CharField(max_length=254)
    abbreviated_name = models.CharField(max_length=254,
                                        null=True,
                                        blank=True)
    group = models.CharField(max_length=254)
    crest_url = models.URLField(max_length=1024,
                                blank=True)
    crest_image = models.ImageField(null=True,
                                    blank=True)
    is_eliminated = models.BooleanField(default=False)
    is_eliminated_group = models.BooleanField(default=False)
    is_eliminated_L16 = models.BooleanField(default=False)
    is_eliminated_qf = models.BooleanField(default=False)
    is_eliminated_sf = models.BooleanField(default=False)
    is_eliminated_final = models.BooleanField(default=False)
    is_in_final = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def get_abbreviated_name(self):
        return self.abbreviated_name


class Matches(models.Model):
    # Overwrite the default django pluralisation \
    #  which adds an 's' to the model name
    class Meta:
        verbose_name_plural = 'Matches'
    match_number = models.IntegerField(null=False,
                                       blank=False)
    group = models.CharField(null=True,
                             blank=True,
                             max_length=154)
    date = models.DateTimeField(auto_now=False, auto_now_add=False)
    home_team = models.ForeignKey(Teams,
                                  on_delete=models.PROTECT,
                                  null=False,
                                  blank=False,
                                  related_name='home_team')
    home_team_score = models.IntegerField(null=True,
                                          blank=True)
    away_team = models.ForeignKey(Teams,
                                  on_delete=models.PROTECT,
                                  null=False,
                                  blank=False,
                                  related_name='away_team')
    away_team_score = models.IntegerField(null=True,
                                          blank=True)
    winning_team = models.ForeignKey(Teams,
                                     on_delete=models.PROTECT,
                                     null=True,
                                     blank=True,
                                     related_name='+')

    # def __init__(self):
    #     if (self.home_team_score == self.away_team_score):
    #         winning_team = Teams.objects.all().filter(name='TBD')
    #     if (self.home_team_score > self.away_team_score):
    #         winning_team = self.home_team
    #     if (self.home_team_score < self.away_team_score):
    #         winning_team = self.away_team
    #     else:
    #         winning_team = None
    #     return winning_team


class PersonalResults(models.Model):
    class Meta:
        verbose_name_plural = 'PersonalResults'
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             null=False,
                             blank=False)
    match_number = models.IntegerField(null=False,
                                       blank=False)
    group = models.CharField(null=True,
                             blank=True,
                             max_length=154)
    date = models.DateTimeField(auto_now=False,
                                auto_now_add=False,
                                blank=True,
                                null=True)
    home_team = models.ForeignKey(Teams,
                                  on_delete=models.PROTECT,
                                  null=False,
                                  blank=False,
                                  related_name='+')
    home_team_score = models.IntegerField(null=True,
                                          blank=True)
    away_team = models.ForeignKey(Teams,
                                  on_delete=models.PROTECT,
                                  null=False,
                                  blank=False,
                                  related_name='+')
    away_team_score = models.IntegerField(null=True,
                                          blank=True)
    points = models.IntegerField(default=0,
                                 null=False,
                                 blank=False)

    def is_past_deadline(self):
        time_now = timezone.now()
        return time_now >= self.date

    # def __str__(self):
    #     return self.match_number


class Wizard(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             null=False,
                             blank=False)
    match_number = models.IntegerField(null=True,
                                       blank=True)
    group = models.CharField(null=True,
                             blank=True,
                             max_length=154)
    home_team = models.ForeignKey(Teams,
                                  on_delete=models.SET_NULL,
                                  null=True,
                                  blank=True,
                                  related_name='+')
    away_team = models.ForeignKey(Teams,
                                  on_delete=models.SET_NULL,
                                  null=True,
                                  blank=True,
                                  related_name='+')
    winning_team = models.ForeignKey(Teams,
                                     on_delete=models.SET_NULL,
                                     null=True,
                                     blank=True,
                                     related_name='+')
    points = models.IntegerField(default=0,
                                 null=False,
                                 blank=False)
    # def __str__(self):
    #     return self.match_number


class GroupPositions(models.Model):
    class Meta:
        verbose_name_plural = 'GroupPositions'
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             null=False,
                             blank=False)
    team = models.ForeignKey(Teams,
                             on_delete=models.SET_NULL,
                             null=True,
                             blank=True,
                             related_name='+')
    position = models.IntegerField(null=True,
                                   blank=True)


class Test(models.Model):
    name = models.CharField(max_length=254)
