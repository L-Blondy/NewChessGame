import React from "react";

function Square ( { number, pieceType, className, piece, handleClick } ) {

	const SquareColor = ( number ) % 2 === 1 ? "Black" : "White";
	const backgroundImg = piece.name ? require( `../img/${ pieceType }.png` ) : "";

	return (
		<div
			onClick={ handleClick.bind( null, piece ) }
			className={ `${ SquareColor }Square ${ className }` }
			style={ {
				backgroundImage: `url(${ backgroundImg })`,
				backgroundSize: "37px",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center"
			} }
		>
		</div >
	)
}

export default React.memo( Square );