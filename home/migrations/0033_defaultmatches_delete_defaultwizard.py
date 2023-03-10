# Generated by Django 4.0.6 on 2023-01-09 18:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0032_defaultwizard_winning_team'),
    ]

    operations = [
        migrations.CreateModel(
            name='DefaultMatches',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('match_number', models.IntegerField()),
                ('group', models.CharField(blank=True, max_length=154, null=True)),
                ('date', models.DateTimeField()),
                ('home_team_score', models.IntegerField(blank=True, null=True)),
                ('away_team_score', models.IntegerField(blank=True, null=True)),
                ('away_team', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='home.teams')),
                ('home_team', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='home.teams')),
                ('winning_team', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='home.teams')),
            ],
            options={
                'verbose_name_plural': 'DefaultMatches',
            },
        ),
        migrations.DeleteModel(
            name='DefaultWizard',
        ),
    ]
