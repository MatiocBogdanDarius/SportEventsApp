import React, {useEffect, useState} from "react";
import ContestsListView from "./ContestsListView";
import {GAME_STATUS_FILTERS_VALUES} from "assets/constants/Data";
import {addDays} from "date-fns";
import * as SPORT_EVENT_AGGREGATOR_SERVICE from "services/api/sport_event_aggregator";
import {getFormattedDate} from "utils/formatDate";
import {useParams} from "react-router-dom";

export function ContestsListContainer(props) {
    const {sport} = useParams();
    const [contests, setContests] = useState([]);
    const [onLoading, setOnLoading] = useState(true);

    useEffect(() => getContests(), [])

    useEffect(() => {
        getContests();
    }, [sport, props.gameStatusFilterValue, props.selectedDate, props.selectedContest, props.selectedSeason])

    const getContests = () => {
        setOnLoading(true);

        if(props.fixtures){
            setContests(props.fixtures);
            setOnLoading(false);
            return
        }

        let filters = {
            status: GAME_STATUS_FILTERS_VALUES[props.gameStatusFilterValue]?.value,
            date: getFormattedDate(addDays((new Date()), props.selectedDate)),
            league: props.selectedContest,
            season: props.selectedSeason,
        }

        SPORT_EVENT_AGGREGATOR_SERVICE
            .getContestsMatches(sport, filters)
            .then(response => {
                setContests(response.data);
                setOnLoading(false);
                console.log("fixtures:", response.data)
            });
    }

    return (
        <ContestsListView
                contests={contests}
                onLoading={onLoading}
                setSelectedDate={props.setSelectedDate}
                favoriteButtonHandle={props.favoriteButtonHandle}
                checkIfItemIsFavorite={props.checkIfItemIsFavorite}
        />
    );
}
