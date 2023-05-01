import React, {useEffect, useRef, useState} from "react";
import TeamDetailsView from "./TeamDetailsView";
import {CONTEST_MENU, SPORTS, WISHLIST_ITEM_TYPE} from "assets/constants/Data";
import * as USER_ACCOUNT_SERVICE from "services/api/user_account_service";
import * as SPORT_EVENT_AGGREGATOR_SERVICE from "../../services/api/sport_event_aggregator";
import {CONTESTS} from "assets/constants/TemporarData";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {HOMEPAGE, TEAM_DETAILS} from "navigation/CONSTANTS";

const emptyWishlist = {
    CONTEST: [],
    EVENT: [],
    TEAM: [],
    PLAYER: [],
}

export function TeamDetailsContainer() {
    const {sport, countryName, teamName, teamId, season} = useParams();
    const [team, setTeam] = useState();
    const [country, setCountry] = useState();
    const [wishlist, setWishlist] = useState(emptyWishlist);
    const [isOpenAddFavoriteModal, setIsOpenAddFavoriteModal] = useState(false);
    const [addFavoriteModalContentType, setAddFavoriteModalContentType] = useState(WISHLIST_ITEM_TYPE.TEAM)
    const [onLoadingFixtures, setOnLoadingFixtures] = useState(true);
    const [contestFixtures, setContestFixtures] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [squad, setSquad] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState(CONTEST_MENU.SUMMARY);
    const topRef = useRef();

    useEffect(() => {
        topRef?.current?.scrollIntoView({behavior: "smooth"});
    }, [sport, countryName, teamName, teamId, season])

    useEffect(() => {
        getTeamFixtures();
        getWishlist();
    }, [])

    useEffect(() => {
        getCountryInfo();
    }, [countryName])

    useEffect(() => {
        country && setTeam({
            country: country,
            name: teamName,
            id: +teamId,
            season: +season
        })
    }, [sport, country, teamName, teamId, season])

    useEffect(() => {
        teamId && getTransfers(teamId);
    }, [teamId])

    useEffect(() => {
        contestFixtures && getSquad();
    }, [contestFixtures])

    const getCountryInfo = () => {
        SPORT_EVENT_AGGREGATOR_SERVICE
            .getCountryInfo(countryName)
            .then(response => {
                setCountry(response.data)
                console.log(response.data)
            })
    }

    const getTeamFixtures = () => {
        // setContestFixtures(CONTESTS);
        // setOnLoadingFixtures(false);

        setOnLoadingFixtures(true);
        let filters = {
            team: teamId,
            season: season,
        }

        SPORT_EVENT_AGGREGATOR_SERVICE
            .getTeamMatchesGroupByStatusAndRound(filters)
            .then(response => {
                setContestFixtures(response.data);
                setOnLoadingFixtures(false);
                console.log(response.data)
            });
    }

    const favoriteButtonHandle = (event, itemId, type) => {
        event.preventDefault()

        const isFavorite = checkIfItemIsFavorite(itemId, type)

        if (isFavorite){
            USER_ACCOUNT_SERVICE.removeItemFromWishlist(itemId, type);

            setWishlist(prevState => {
                const newWishList = {...prevState};
                newWishList[type] = newWishList[type].filter(item => item.itemId !== itemId)
                return newWishList;
            })
        } else {
            USER_ACCOUNT_SERVICE.addItemToWishlist(itemId, type);

            setWishlist(prevState => {
                const newWishList = {...prevState};
                newWishList[type] = [...newWishList[type], {itemId: itemId, itemType: type}]
                return newWishList;
            })

            setAddFavoriteModalContentType(type);
            // toggleAddFavoriteModal();
        }
    }

    const getWishlist = () => {
        USER_ACCOUNT_SERVICE.getUserWishlist()
            .then(response => setWishlist({...emptyWishlist, ...response.data}))
    }

    const getTransfers = () => {
        SPORT_EVENT_AGGREGATOR_SERVICE
            .getTransfers(teamId)
            .then(response => {
                setTransfers(response.data)
                console.log(response.data)
            })
    }

    const getSquad = () => {
        SPORT_EVENT_AGGREGATOR_SERVICE
            .getSquad(contestFixtures?.league?.id, season, teamId)
            .then(response => {
                setSquad(response.data)
                console.log("squad", response.data)
            })
    }

    const checkIfItemIsFavorite = (itemId, type) => {
        return wishlist[type].map(item => item.itemId).includes(itemId);
    }

    const toggleAddFavoriteModal = () => {
        setIsOpenAddFavoriteModal(prevState => !prevState);
    }

    const goBackButtonHandle = () => {
        const from = location.state?.from?.pathname;
        navigate(from ?? HOMEPAGE)
    }

    return (
        <TeamDetailsView
            selectedSport={SPORTS[sport]}
            team={team}
            wishList={wishlist}
            isOpenAddFavoriteModal={isOpenAddFavoriteModal}
            addFavoriteModalContentType={addFavoriteModalContentType}
            fixtures={contestFixtures}
            onLoadingFixtures={onLoadingFixtures}
            view={view}
            topRef={topRef}
            league={contestFixtures?.league?.id}
            season={season}
            transfers={transfers}
            squad={squad}
            favoriteButtonHandle={favoriteButtonHandle}
            checkIfItemIsFavorite={checkIfItemIsFavorite}
            toggleAddFavoriteModal={toggleAddFavoriteModal}
            goBackButtonHandle={goBackButtonHandle}
            changeView={setView}
        />
    );
}
