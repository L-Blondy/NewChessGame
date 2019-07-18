import React from "react";
import { connect } from "react-redux";
import { getImage } from "../helpers/helpers"


function LostPieces ( state ) {
	const color = Object.keys( state )[ 0 ]
	console.log( `${ color } lost pieces :`, state[ color ] )

	return (
		<div className="lostPieces">
			{ state[ color ].map( ( piece, index ) => {
				return <img src={ getImage( piece ) } alt="" key={ index + piece } />
			} ) }
		</div>
	)
}

const mapStateToProps_WhiteLostPieces = ( state, ownProps ) => ( { white: [ ...state.white ], ...ownProps } );
export const WhiteLostPieces = connect( mapStateToProps_WhiteLostPieces )( LostPieces )

const mapStateToProps_BlackLostPieces = ( state, ownProps ) => ( { black: [ ...state.black ], ...ownProps } );
export const BlackLostPieces = connect( mapStateToProps_BlackLostPieces )( LostPieces )
