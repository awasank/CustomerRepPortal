import {
    FETCH_RESERVATIONS
} from "../actions/types"

const initialState = {
    reservations: []
}

export default function (state = initialState, action) {
    switch(action.type){
        case FETCH_RESERVATIONS:
            console.log(action.payload)
            return {
                ...state,
                reservations: action.payload
            }
        default: 
            return state;
    }
}