from django.shortcuts import render
from .models import Matches, PersonalResults
import json


# Create your views here.
def index(request):
    """ A view to return the index page """
    user = request.user
    print("user = ", user.id)
    if request.POST:
        print("POSTED")
        form = request.POST
        print("form = ", form)
        try:
            print("TRY")
            match = PersonalResults.objects.all(match_number=form.match_number)
            print("match = ", match)
        except:
            print("EXCEPT")
    else:
        print("NOT POSTED")
    # m = open("./static/json/matches.json", "r")
    # t = open("./static/json/teams.json", "r")
    # matches = m.read()
    # teams = json.loads(t.read())
    # print("matches", matches)
    # print(type(teams))
    matches = Matches.objects.all()
    template = 'home/index.html'
    context = {'matches': matches}
    return render(request, template, context)
