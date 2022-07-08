from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Teams(models.Model):
    class Meta:
        verbose_name_plural = 'Teams'
    name = models.CharField(max_length=254)
    crest = models.URLField(max_length=1024,
                            blank=True)

    def __str__(self):
        return self.name


class Matches(models.Model):
    # Overwrite the default django pluralisation \
    #  which adds an 's' to the model name
    class Meta:
        verbose_name_plural = 'Matches'
    match_number = models.CharField(null=False,
                                    blank=False,
                                    max_length=254)
    date = models.DateTimeField(auto_now=False, auto_now_add=False)
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

    def __str__(self):
        return self.match_number


class PersonalResults(models.Model):
    class Meta:
        verbose_name_plural = 'PersonalResults'
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             null=False,
                             blank=False)
    match_number = match_number = models.CharField(null=False,
                                                   blank=False,
                                                   max_length=254)
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

    def __str__(self):
        return self.match_number


class Test(models.Model):
    name = models.CharField(max_length=254)
