import React from "react";
import { connect } from "react-redux";


function BlackLostPieces ( props ) {

	console.log( props )

	return (
		<div>LOST PIECES</div>
	)
}

const mapStateToProps = ( state, ownProps ) => ( { ...state, ...ownProps } );

export default connect( mapStateToProps )( BlackLostPieces )