import http.client
from datetime import date

from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from . import utils

conn = http.client.HTTPSConnection("v3.football.api-sports.io")

headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': "af192284169d2fd193e7c25641eedfac"
}


@api_view(['GET'])
def fixtures(request):
    URL = utils.create_request_url("/fixtures", request.GET)
    print(URL)
    print(request.GET)

    conn.request("GET", URL, headers=headers)

    res = conn.getresponse()
    data = res.read()
    res.read()
    data = json.loads(data)

    response = data['response']
    contests = utils.group_fixtures_by_contestant(response)

    return Response(contests)
    # return Response([])


@api_view(['GET'])
def get_contests(request):
    contests = utils.get_stored_contests()
    return Response(contests)


@api_view(['GET'])
def get_contest(request):
    contest_id = request.GET['id']
    country = request.GET['country']
    print(contest_id, country)

    contests = utils.get_stored_contests()
    country_contests = list(filter(lambda x: x['name'] == country, contests))
    contest = list(filter(lambda x: int(x['league']['id']) == int(contest_id), country_contests[0]['contests']))[0]

    return Response(contest)
