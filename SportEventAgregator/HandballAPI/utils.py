import http.client
import json
from datetime import datetime

headers = {
    'x-rapidapi-host': "v1.handball.api-sports.io",
    'x-rapidapi-key': "af192284169d2fd193e7c25641eedfac"
}


def format_evolution_score(games):
    games[0]['evolutionScore'] = {
        'teams': {
            'home': games[0]['teams']['home'],
            'away': games[0]['teams']['away'],
        },
        'evolution': [
            {
                'short_name': "F",
                'long_name': "Final Score",
                'values': {
                    'home': games[0]['scores']['home'],
                    'away': games[0]['scores']['away'],
                },
                'bold': True
            },
            {
                'short_name': "H1",
                'long_name': "1st HALF",
                'values': {
                    'home': games[0]['periods']['first']['home'],
                    'away': games[0]['periods']['first']['away'],
                }
            },
            {
                'short_name': "H2",
                'long_name': "2nd HALF",
                'values': {
                    'home': games[0]['periods']['second']['home'],
                    'away': games[0]['periods']['second']['away'],
                }
            },
        ],
    }

    games[0]['goals'] = {
        'away': games[0]['goals']['away'],
        'home': games[0]['goals']['home'],
    }

    return games


def restructure_game_fields(game):
    game['fixture'] = {
        'id': game['id'],
        'date': game['date'],
        'status': game['status'],
        'timestamp': game['timestamp'],
        'timezone': game['timezone'],
    }

    game["goals"] = game["scores"]

    game["league"]["country"] = game["country"]["name"]


def restructure_games_fields(games):
    for game in games:
        restructure_game_fields(game)


def group_fixtures_by_contestant(fixtures):
    leagues = set(map(lambda x: x['league']['id'], fixtures))

    restructure_games_fields(fixtures)

    gamesGroups = [[game for game in fixtures if game['league']['id'] == league] for league in leagues]
    contests = []

    for gamesGroup in gamesGroups:
        contests.append({
            'id': gamesGroup[0]['league']['id'],
            'name': gamesGroup[0]['league']['name'],
            'country': gamesGroup[0]['country']['name'],
            'logo': gamesGroup[0]['league']['logo'],
            'flag': gamesGroup[0]['country']['flag'],
            'season': gamesGroup[0]['league']['season'],
            'games': gamesGroup
        })

    return contests


def group_fixtures_by_status_and_round(fixtures):
    current_date = datetime.utcnow().date()
    contest = group_fixtures_by_contestant(fixtures)[0]

    before_today = contest.copy()
    before_today['games'] = []
    today = contest.copy()
    today['games'] = []
    after_today = contest.copy()
    after_today['games'] = []

    for game in contest['games']:
        game_date = datetime.strptime(game["fixture"]["date"][:10], "%Y-%m-%d").date()

        if game_date < current_date:
            before_today['games'].append(game)
        elif game_date > current_date:
            after_today['games'].append(game)
        else:
            today['games'].append(game)

    before_today["games"].sort(reverse=True, key=lambda x: x["fixture"]["timestamp"])
    today["games"].sort(key=lambda x: x["fixture"]["timestamp"])
    after_today["games"].sort(key=lambda x: x["fixture"]["timestamp"])
    league = contest
    league["games"] = None

    result = {
        "before_today": before_today,
        "today": today,
        "after_today": after_today,
        "league": league
    }

    return result


def get_formatted_standings(standings):
    if len(standings) == 0:
        return standings

    for competition_standings in standings:
        for team_standing in competition_standings:
            team_standing['rank'] = team_standing['position']
            team_standing['all'] = {
                "played": team_standing['games']['played'],
                "win": team_standing['games']['win']['total'],
                "draw": team_standing['games']['draw']['total'],
                "lose": team_standing['games']['lose']['total'],
                "goals": {
                    "for": team_standing['goals']['for'],
                    "against": team_standing['goals']['against']
                }
            }

    return [{
        'league': {
            'id': standings[0][0]['league']['id'],
            'name': standings[0][0]['league']['name'],
            'country': standings[0][0]['country']['name'],
            'logo': standings[0][0]['league']['logo'],
            'flag': standings[0][0]['country']['flag'],
            'season': standings[0][0]['league']['season'],
            'standings': standings
        }
    }]


def create_request_url(url, params):
    if len(params) == 0:
        return url

    url += '?'
    for key in params:
        url += "&" + key + "=" + params[key]

    return url


def read_json_file(filename):
    with open(filename, 'r') as openfile:
        json_object = json.load(openfile)

    return json_object


def write_json_file(filename, data):
    with open(filename, "w") as outfile:
        json.dump(data, outfile)


def group_contests(contests):
    for contest in contests:
        contest["league"] = {
            "id": contest['id'],
            "name": contest['name'],
            "type": contest['type'],
            "logo": contest['logo'],
        }

        contest["seasons"] = list(filter(lambda x: x["current"], contest["seasons"]))

        for season in contest['seasons']:
            season['year'] = season['season']

    contests = list(filter(lambda x: len(x["seasons"]) > 0, contests))

    country_names = sorted(set(map(lambda x: x['country']['name'], contests)))
    countries = [
        {
            'name': country_name,
            'contests': [contest for contest in contests if contest['country']['name'] == country_name]
        }
        for country_name in country_names
    ]

    return countries


def store_contests(contests):
    contests = group_contests(contests)
    write_json_file("HandballAPI/data/handball_contests.json", contests)


def get_stored_contests():
    return read_json_file('HandballAPI/data/handball_contests.json')


def get_info_from_extern_api(url):
    conn = http.client.HTTPSConnection("v1.handball.api-sports.io")
    conn.request("GET", url, headers=headers)

    res = conn.getresponse()
    data = res.read()
    data = json.loads(data)

    conn.close()

    return data['response']


def get_data(url, filename, live=True, store=True):
    if live:
        data = get_info_from_extern_api(url)

        if store:
            write_json_file(filename, data)

        return data

    return read_json_file(filename)
