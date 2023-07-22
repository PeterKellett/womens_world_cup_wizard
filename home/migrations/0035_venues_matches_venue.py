# Generated by Django 4.0.6 on 2023-07-22 20:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0034_alter_defaultmatches_match_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='Venues',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city', models.CharField(blank=True, max_length=254, null=True)),
            ],
            options={
                'verbose_name_plural': 'Venues',
            },
        ),
        migrations.AddField(
            model_name='matches',
            name='venue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='venue', to='home.venues'),
        ),
    ]
