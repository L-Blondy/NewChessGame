import React from "react";
import Square from "./Square";

function Board ( { board, handleClick, selectedCoord } ) {

	const boardMap = board.map( ( line, row ) => line.map( ( piece, col ) => {
		return (
			<Square
				key={ row * row + col * col }
				pieceType={ `${ piece.color }${ piece.name }` }
				number={ col + row }
				piece={ piece }
				handleClick={ handleClick }
				className={ "" }
			/>
		)
	} ) )

	return (
		<div className={ "Board " + selectedCoord } >
			{ boardMap }
		</div>
	)
}

export default React.memo( Board );