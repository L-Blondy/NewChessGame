import { createStore } from "redux";

function reducer ( state = { white: [], black: [] }, action ) {
	switch ( action.type ) {
		case "ADD_WHITE": {
			return { ...state, white: [ ...state.white, action.payload ] }
		};
		case "ADD_BLACK":
			return { ...state, black: [ ...state.black, action.payload ] }
		default:
			return state;
	}
}

export let store = createStore( reducer );

store.subscribe( () => console.log( store.getState() ) )