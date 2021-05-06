import {FETCH_RESERVATIONS} from "./types"
import helper from "../utils/helper"
export const fetchReservations = (token) => (dispatch) => {
    console.log("Fetching Reservations")
    helper.helper.fetchReservations(token)
    console.log(res)
    dispatch({
        type: FETCH_RESERVATIONS,
        payload: {message: "Hello"}
    })
}