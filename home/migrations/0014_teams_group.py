# Generated by Django 4.0.6 on 2022-09-05 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0013_personalresults_points'),
    ]

    operations = [
        migrations.AddField(
            model_name='teams',
            name='group',
            field=models.CharField(default=1, max_length=254),
            preserve_default=False,
        ),
    ]
