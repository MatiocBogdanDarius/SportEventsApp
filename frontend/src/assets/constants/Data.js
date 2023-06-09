import {
    faBaseballBall,
    faBasketballBall,
    faSoccerBall
} from "@fortawesome/free-solid-svg-icons";
import handballIcon from 'assets/images/handball.svg';

export const GAME_STATUS_FILTERS_VALUES = {
    ALL: {
        name: 'ALL',
        value: undefined
    },
    LIVE: {
        name: 'LIVE',
        value: "1H-HT-2H-ET-BT-P-SUSP-INT-LIVE"
    },
    FINISHED: {
        name: 'FINISHED',
        value: "FT-AET-PEN-PST-CANC-ABD-AWD-WO"
    },
    SCHEDULED: {
        name: 'SCHEDULED',
        value: "TBD-NS"
    },
}

export const SPORTS = {
    FOOTBALL: {id: 1, name: "FOOTBALL", icon: faSoccerBall},
    HANDBALL: {id: 2, name: "HANDBALL", icon: handballIcon},
    BASKETBALL: {id: 3, name: "BASKETBALL", icon: faBasketballBall},
    BASEBALL: {id: 4, name: "BASEBALL", icon: faBaseballBall}
}

export const WISHLIST_ITEM_TYPE = {
    CONTEST: "CONTEST",
    GAME: "EVENT",
    TEAM: "TEAM",
    PLAYER: "PLAYER"
}

const EMPTY_WISHLIST_FOR_SOURCE = {
    CONTEST: [],
    EVENT: [],
    TEAM: [],
    PLAYER: [],
}

export const  EMPTY_WISHLIST = {
    1: {...EMPTY_WISHLIST_FOR_SOURCE},
    2: {...EMPTY_WISHLIST_FOR_SOURCE},
    3: {...EMPTY_WISHLIST_FOR_SOURCE},
    4: {...EMPTY_WISHLIST_FOR_SOURCE}
}

export const GAME_STATUS = {
    ALL: 'ALL',
    LIVE: 'LIVE',
    FINISHED: 'FINISHED',
    SCHEDULED: 'SCHEDULED',
}

export const CONTEST_MENU = {
    SUMMARY: 'SUMMARY',
    RESULTS: 'RESULTS',
    FIXTURES: 'FIXTURES',
    STANDINGS: 'STANDINGS',
}

export const TEAM_MENU = {
    'FOOTBALL' : {
        SUMMARY: 'SUMMARY',
        RESULTS: 'RESULTS',
        FIXTURES: 'FIXTURES',
        STANDINGS: 'STANDINGS',
        TRANSFERS: 'TRANSFERS',
        SQUAD: 'SQUAD',
    },
    'HANDBALL': {
        SUMMARY: 'SUMMARY',
        RESULTS: 'RESULTS',
        FIXTURES: 'FIXTURES',
        STANDINGS: 'STANDINGS',
    },
    'BASKETBALL': {
        SUMMARY: 'SUMMARY',
        RESULTS: 'RESULTS',
        FIXTURES: 'FIXTURES',
        STANDINGS: 'STANDINGS',
    },
    'BASEBALL': {
        SUMMARY: 'SUMMARY',
        RESULTS: 'RESULTS',
        FIXTURES: 'FIXTURES',
        STANDINGS: 'STANDINGS',
    },
}

export const GAME_MENU_OPTIONS = {
    EVENTS: 'EVENTS',
    STATISTICS: 'STATISTICS',
    LINEUPS: 'LINEUPS',
    PLAYERS: 'PLAYERS',
    SCORE_EVOLUTION: 'SCORE EVOLUTION',
}

export const GAME_MENU = {
    FOOTBALL: {
        EVENTS: GAME_MENU_OPTIONS.EVENTS,
        STATISTICS: GAME_MENU_OPTIONS.STATISTICS,
        LINEUPS: GAME_MENU_OPTIONS.LINEUPS,
        PLAYERS: GAME_MENU_OPTIONS.PLAYERS,
    },
    HANDBALL: {
        SCORE_EVOLUTION: GAME_MENU_OPTIONS.SCORE_EVOLUTION,
    },
    BASEBALL: {
        SCORE_EVOLUTION: GAME_MENU_OPTIONS.SCORE_EVOLUTION,
    },
    BASKETBALL: {
        SCORE_EVOLUTION: GAME_MENU_OPTIONS.SCORE_EVOLUTION,
    }
}

export const NO_IMAGE = 'https://media.api-sports.io/handball/teams/2.png';


export const TIME_UNIT = {
    MINUTE: {singular: "min", plural: "mins", milliseconds: 60_000, max_value: 360},
    HOUR: {singular: "hour", plural: "hours", milliseconds: 3_600_000, max_value: 99},
    DAY: {singular: "day", plural: "days", milliseconds: 86_400_000, max_value: 365},
    WEEK: {singular: "week", plural: "weeks", milliseconds: 604_800_000, max_value: 52},
}

export const STANDARD_ALARMS = [
    {id: 1, name: "At time of event", numberOfUnits: 0, unit: "MINUTE", selected: false},
    {id: 2, name: "30 mins before", numberOfUnits: 30, unit:"MINUTE", selected: false},
    {id: 3, name: "1 hour before", numberOfUnits: 1, unit: "HOUR", selected: true},
    {id: 4, name: "1 day before", numberOfUnits: 2, unit: "DAY", selected: false},
]

export const NOTIFICATION_STATUS = {
    UNSENT: 0,
    UNREAD: 1,
    READ: 2,
}
