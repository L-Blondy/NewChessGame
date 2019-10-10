import React from "react";
import { connect } from "react-redux";
import { store } from "../reduxStore/Store";

function StatusPanel ( { currentPlayer, move } ) {

	const handleUndo = () => {
		if ( move )
			store.dispatch( {
				type: "TOGGLE_UNDO"
			} )
	}

	return (
		<>
			<div>{ currentPlayer + " plays \nMove : " + move }</div>
			<button className="undo" onClick={ handleUndo }>UNDO</button>
		</>
	)
}

const mapPropsToState = ( state, ownProps ) => ( {
	...ownProps,
	currentPlayer: state.currentPlayer,
	move: state.move
} )

export default connect( mapPropsToState )( StatusPanel );