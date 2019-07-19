import React from "react";
import Square from "./Square";
import { Knight, EmptySlot, Rook, Bishop, Queen, King, Pawn } from "../pieces/Pieces.js";
import { getPossibleMoves, getRock, getPawnEatingMoves, movePiece, changePawnToQueen, handleRock, animatePiece } from "../helpers/helpers"

import { store } from "../reduxStore/Store";

const initialBoard = [
	[ new Rook( "white" ), new Knight( "white" ), new Bishop( "white" ), new King( "white" ), new Queen( "white" ), new Bishop( "white" ), new Knight( "white" ), new Rook( "white" ) ],
	[ new Pawn( "white" ), new EmptySlot( "white" ), new Pawn( "white" ), new EmptySlot( "white" ), new EmptySlot( "white" ), new Pawn( "white" ), new EmptySlot( "white" ), new Pawn( "white" ) ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new Queen( "white" ), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new Pawn( "black" ), new Pawn( "black" ), new EmptySlot( "black" ), new Pawn( "black" ), new EmptySlot( "black" ), new Pawn( "white" ), new EmptySlot( "black" ), new Pawn( "black" ) ],
	[ new Rook( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new King( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new Rook( "black" ) ],
].map( ( line, row ) => line.map( ( piece, col ) => {
	piece.coord = { col, row }
	return piece;
} ) )

class Board extends React.Component {

	state = {
		board: initialBoard,
		currentPlayer: "black",
		selectedCoord: {},
		StartingCoord: {},
		LoM: { possibleMoves: [], possibleEat: [], possibleRock: [], possibleChess: false },
		lostPieces: {
			white: [],
			black: []
		}
	}

	handleClick = ( piece, e ) => {
		let boardCopy = this.state.board.map( line => [ ...line ] );
		const stateCopy = { ...this.state, board: boardCopy };
		let { board, currentPlayer, selectedCoord, lostPieces } = { ...stateCopy };
		const hasSelectedPieceToMove = piece.color === currentPlayer && ( piece.coord.col !== selectedCoord.col || piece.coord.row !== selectedCoord.row )
		const validMove = ( piece.coord.col !== selectedCoord.col || piece.coord.row !== selectedCoord.row ) && ( piece.color === currentPlayer || e.target.classList.contains( "possibleMove" ) || e.target.classList.contains( "possibleEat" ) || e.target.classList.contains( "possibleRock" ) );

		if ( hasSelectedPieceToMove ) {
			const StartingCoord = { y: e.target.getBoundingClientRect().top, x: e.target.getBoundingClientRect().left };
			this.setState( {
				StartingCoord: StartingCoord
			} )

			let LoM = getPossibleMoves( board, stateCopy.currentPlayer, piece )

			if ( piece.name === "King" && piece.firstMove ) {
				LoM = { ...LoM, ...getRock( { ...stateCopy }, piece ) }
			}

			if ( piece.name === "Pawn" ) {
				LoM = { ...LoM, ...getPawnEatingMoves( board, currentPlayer, stateCopy.firstMoveWeakness, piece ) }
			}

			this.setState( {
				LoM,
				selectedCoord: piece.coord
			} )
			return
		}

		else if ( !validMove ) {
			this.setState( {
				selectedCoord: {},
				LoM: { possibleMoves: [], possibleEat: [], possibleRock: [] },
				StartingCoord: {},
			} )
		}

		else if ( validMove ) {
			const EndingCoord = { y: e.target.getBoundingClientRect().top, x: e.target.getBoundingClientRect().left };
			const nextPlayer = currentPlayer === "black" ? "white" : "black";
			const playedPiece = board[ selectedCoord.row ][ selectedCoord.col ]
			const { col, row } = piece.coord;
			const ateFromBehind = stateCopy.firstMoveWeakness && playedPiece.name === "Pawn" && col === stateCopy.firstMoveWeakness.col && row === stateCopy.firstMoveWeakness.row;
			const ateSomething = board[ piece.coord.row ][ piece.coord.col ].name;
			const direction = playedPiece.direction;
			const pawnDoubleMove = playedPiece.name === "Pawn" && ( row === 3 || row === 4 );
			const didRock = e.target.classList.contains( "possibleRock" );
			let firstMoveWeakness = null;

			animatePiece( stateCopy.StartingCoord, EndingCoord, e.target.firstChild )

			if ( ateSomething ) {

				if ( currentPlayer === "black" ) {
					store.dispatch( {
						type: "ADD_WHITE",
						payload: { ...board[ row ][ col ] }
					} );
				}
				else if ( currentPlayer === "white" ) {
					store.dispatch( {
						type: "ADD_BLACK",
						payload: { ...board[ row ][ col ] }
					} );
				}
				lostPieces[ nextPlayer ] = [ ...lostPieces[ nextPlayer ], { ...board[ row ][ col ] } ]
			}

			board = movePiece( board, selectedCoord, piece.coord );

			if ( didRock ) {
				board = handleRock( board, piece.coord )
			}

			if ( ateFromBehind ) {
				lostPieces[ nextPlayer ] = [ ...lostPieces[ nextPlayer ], { ...board[ row - direction ][ col ] } ]
				board[ row - direction ][ col ] = Object.assign( {}, new EmptySlot(), { coord: { row: row - direction, col } } )
			}

			if ( playedPiece.firstMove ) {
				board[ piece.coord.row ][ piece.coord.col ].handleFirstMove()

				if ( pawnDoubleMove ) {
					board[ row - direction ][ col ] = Object.assign( board[ row - direction ][ col ], { firstMoveWeakness: true } )
					firstMoveWeakness = { col, row: row - direction }
				}
			}
			if ( board[ piece.coord.row ][ piece.coord.col ].name === "Pawn" && ( piece.coord.row === 0 || piece.coord.row === 7 ) )
				board = changePawnToQueen( board, piece.coord, currentPlayer )

			this.setState( {
				board: board,
				selectedCoord: {},
				LoM: { possibleMoves: [], possibleEat: [], possibleRock: [] },
				currentPlayer: nextPlayer,
				firstMoveWeakness,
				StartingCoord: {},
			} )
		}
	}

	getClassName = ( col, row ) => {
		let boardCopy = this.state.board.map( line => [ ...line ] );
		const { selectedCoord, LoM, currentPlayer } = { ...this.state };
		let className = " ";

		if ( boardCopy[ row ][ col ].color ) {
			className += ( boardCopy[ row ][ col ].color + "Piece " )
		}
		if ( boardCopy[ row ][ col ].color === currentPlayer ) {
			className += "playing "
		}
		if ( selectedCoord.col === col && selectedCoord.row === row ) {
			return className += "isSelected ";
		}
		if ( "forbiddenMoves" in LoM ) {
			for ( let i = 0; i < LoM.forbiddenMoves.length; i++ ) {
				if ( LoM.forbiddenMoves[ i ].col === col && LoM.forbiddenMoves[ i ].row === row ) {
					return className += "forbiddenMove ";
				}
			}
		}
		if ( "possibleMoves" in LoM ) {
			for ( let i = 0; i < LoM.possibleMoves.length; i++ ) {
				if ( LoM.possibleMoves[ i ].col === col && LoM.possibleMoves[ i ].row === row ) {
					return className += "possibleMove ";
				}
			}
		}
		if ( "possibleEat" in LoM ) {
			for ( let i = 0; i < LoM.possibleEat.length; i++ ) {
				if ( LoM.possibleEat[ i ].col === col && LoM.possibleEat[ i ].row === row ) {
					return className += "possibleEat ";
				}
			}
		}
		if ( "possibleRock" in LoM ) {
			for ( let i = 0; i < LoM.possibleRock.length; i++ ) {
				if ( LoM.possibleRock[ i ].col === col && LoM.possibleRock[ i ].row === row ) {
					return className += "possibleRock ";
				}
			}
		}
		return className;
	}

	render () {
		return (
			<div className={ "Board " + this.state.selectedCoord } >
				{
					this.state.board.map( ( line, row ) => line.map( ( piece, col ) => {
						const className = this.getClassName( col, row )
						return (
							<Square
								key={ row * row + col * col }
								number={ col + row }
								piece={ piece }
								handleClick={ this.handleClick }
								className={ className }
							/>
						)
					} ) )
				}
			</div>
		)
	}
}

export default Board;
