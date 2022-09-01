# Generated by Django 4.0.6 on 2022-09-01 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0011_alter_matches_match_number'),
    ]

    operations = [
        migrations.RenameField(
            model_name='teams',
            old_name='crest',
            new_name='crest_url',
        ),
        migrations.AddField(
            model_name='teams',
            name='abbreviated_name',
            field=models.CharField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='teams',
            name='crest_image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]