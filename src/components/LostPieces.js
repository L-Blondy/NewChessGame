import React from "react";
import { connect } from "react-redux";
import { getImage } from "../helpers/helpers"


function LostPieces ( props ) {
	const color = Object.keys( props )[ 0 ]

	return (
		<div className="lostPieces">
			{ props[ color ].map( ( piece, index ) => {
				return <img src={ getImage( piece ) } alt="" key={ index + piece } />
			} ) }
		</div>
	)
}

const mapStateToProps_WhiteLostPieces = ( { white }, ownProps ) => ( { white: [ ...white ], ...ownProps } );
export const WhiteLostPieces = connect( mapStateToProps_WhiteLostPieces )( LostPieces )

const mapStateToProps_BlackLostPieces = ( { black }, ownProps ) => ( { black: [ ...black ], ...ownProps } );
export const BlackLostPieces = connect( mapStateToProps_BlackLostPieces )( LostPieces ) 
