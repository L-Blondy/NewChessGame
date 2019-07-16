import React from "react";
import Board from "./Board";
import { Knight, EmptySlot, Rook, Bishop, Queen, King, Pawn } from "../pieces/Pieces.js";

const initialBoard = [
	[ new Rook( "white" ), new Knight( "white" ), new Bishop( "white" ), new King( "white" ), new Queen( "white" ), new Bishop( "white" ), new Knight( "white" ), new Rook( "white" ) ],
	[ new Pawn( "white" ), new Pawn( "white" ), new Pawn( "white" ), new Pawn( "white" ), new Pawn( "white" ), new Pawn( "white" ), new Pawn( "white" ), new Pawn( "white" ) ],
	[ ...Array( 8 ).fill( new EmptySlot() ) ],
	[ ...Array( 8 ).fill( new EmptySlot() ) ],
	[ ...Array( 8 ).fill( new EmptySlot() ) ],
	[ ...Array( 8 ).fill( new EmptySlot() ) ],
	[ new Pawn( "black" ), new Pawn( "black" ), new Pawn( "black" ), new Pawn( "black" ), new Pawn( "black" ), new Pawn( "black" ), new Pawn( "black" ), new Pawn( "black" ) ],
	[ new Rook( "black" ), new Knight( "black" ), new Bishop( "black" ), new King( "black" ), new Queen( "black" ), new Bishop( "black" ), new Knight( "black" ), new Rook( "black" ) ],
].map( ( line, row ) => line.map( ( piece, col ) => {
	piece.coord = { col, row }
	return piece;
} ) )

class Game extends React.Component {

	state = {
		board: initialBoard,
		currentPlayer: "black",
		selectedCoord: { col: 3, row: 6 }
	}

	handleClick = ( piece ) => {
		console.log( piece.coord )
		this.setState( {
			selectedCoord: piece.coord
		} )
	}
	render () {
		return (
			<div className="Game">
				<Board
					board={ this.state.board }
					handleClick={ this.handleClick }
					selectedCoord={ this.state.selectedCoord }
				/>
			</div>
		)
	}
}

export default Game;