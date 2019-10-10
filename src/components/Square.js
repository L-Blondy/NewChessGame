import React from "react";
import { getImage } from "../helpers/helpers"

function Square ( { number, className, piece, handleClick } ) {

	const SquareColor = ( number ) % 2 === 1 ? "Black" : "White";

	console.log( piece ) //getImage( piece ), 
	return (
		<div
			onClick={ handleClick.bind( null, piece ) }
			className={ `${ SquareColor }Square ${ className }` }
		>
			<img src={ getImage( piece ) } alt="" />
		</div >
	)
}

export default React.memo( Square );