import { createStore } from "redux";

const initialState = {
	white: [],
	black: [],
	currentPlayer: "black",
	move: 0,
	undo: false
}

function reducer ( state = initialState, action ) {
	switch ( action.type ) {
		case "RELOAD_LOST_PIECES": {
			console.log( {
				...state,
				white: action.payload.white,
				black: action.payload.black
			} )
			return {
				...state,
				white: action.payload.white,
				black: action.payload.black
			}
		}
		case "ADD_WHITE":
			return { ...state, white: [ ...state.white, action.payload ] }
		case "ADD_BLACK":
			return { ...state, black: [ ...state.black, action.payload ] }
		case "SWITCH_PLAYER":
			return { ...state, currentPlayer: action.payload }
		case "ADD_MOVE":
			return { ...state, move: state.move + 1 }
		case "SUB_MOVE":
			return { ...state, move: state.move - 1 }
		case "TOGGLE_UNDO":
			return { ...state, undo: !state.undo }
		default:
			return state;
	}
}

export let store = createStore( reducer );
