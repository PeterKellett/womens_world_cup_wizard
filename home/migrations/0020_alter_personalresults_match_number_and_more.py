# Generated by Django 4.0.6 on 2022-10-27 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0019_wizard_group'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personalresults',
            name='match_number',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='wizard',
            name='match_number',
            field=models.IntegerField(),
        ),
    ]